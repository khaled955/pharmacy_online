import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import nodemailer from "nodemailer";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

function generateOTP(): string {
  return Math.floor(10000 + Math.random() * 90000).toString();
}

export async function POST(request: Request) {
  const locale = request.headers.get("Accept-Language") || "en";

  try {
    const { email, type } = await request.json();

    if (!email) {
      return NextResponse.json({
        status: false,
        message:
          locale === "ar" ? "البريد الإلكتروني مطلوب" : "Email is required",
        data: null,
      });
    }

    // For forgot-password OTPs, verify the account exists before sending.
    // The JS SDK's listUsers() only returns the first page and doesn't support
    // email filtering, so we call the GoTrue admin REST endpoint directly.
    if (type === "forgot_password") {
      const searchRes = await fetch(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/admin/users?filter=${encodeURIComponent(email)}&per_page=1`,
        {
          headers: {
            Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
            apikey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
          },
        },
      );

      if (!searchRes.ok) throw new Error("Failed to verify account");

      const { users } = await searchRes.json() as { users?: { email?: string }[] };
      const userExists = (users ?? []).some(
        (u) => u.email?.toLowerCase() === email.toLowerCase(),
      );

      if (!userExists) {
        return NextResponse.json({
          status: false,
          message:
            locale === "ar"
              ? "لا يوجد حساب مرتبط بهذا البريد الإلكتروني"
              : "No account found with this email address",
          data: null,
        });
      }
    }

    const otp = generateOTP();
    const expires_at = new Date(Date.now() + 10 * 60 * 1000).toISOString();

    // Delete old unused OTPs for this email
    await supabase
      .from("password_reset_otps")
      .delete()
      .eq("email", email)
      .eq("used", false);

    // Insert new OTP
    const { error: insertError } = await supabase
      .from("password_reset_otps")
      .insert({ email, otp, expires_at, used: false });

    if (insertError) throw new Error(insertError.message);

    // In development, skip email sending entirely and return the OTP directly.
    // Gmail SMTP from localhost is unreliable; the dev-OTP badge in the UI shows it instead.
    if (process.env.NODE_ENV !== "production") {
      return NextResponse.json({
        status: true,
        message:
          locale === "ar"
            ? "تم إنشاء رمز التحقق (وضع التطوير)"
            : "OTP generated (dev mode)",
        data: { email, otp },
      });
    }

    const gmailUser = process.env.GMAIL_USER?.trim();
    const gmailPass = process.env.GMAIL_APP_PASSWORD?.trim();

    if (!gmailUser || !gmailPass) {
      return NextResponse.json({
        status: false,
        message:
          locale === "ar"
            ? "إعدادات البريد الإلكتروني مفقودة"
            : "Email credentials not configured",
        data: null,
      });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: gmailUser,
        pass: gmailPass,
      },
    });

    const subject =
      locale === "ar" ? "رمز التحقق - الصيدلية" : "Your OTP Code - Pharmacy";

    const heading =
      locale === "ar" ? "مرحباً بك في صيدليتنا" : "Welcome to our Pharmacy";

    const bodyText =
      locale === "ar" ? "رمز التحقق الخاص بك:" : "Your verification code:";

    const expiryText =
      locale === "ar" ? "صالح لمدة 10 دقائق" : "Expires in 10 minutes";

    await transporter.sendMail({
      from: `Pharmacy <${gmailUser}>`,
      to: email,
      subject,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:400px;margin:0 auto;padding:24px;">
          <h2 style="color:#0d9488;">${heading}</h2>
          <p>${bodyText}</p>
          <div style="background:#f0fdfa;border:2px solid #0d9488;border-radius:12px;padding:24px;text-align:center;margin:24px 0;">
            <span style="font-size:36px;font-weight:bold;letter-spacing:8px;color:#0d9488;">
              ${otp}
            </span>
          </div>
          <p style="color:#6b7280;font-size:14px;">${expiryText}</p>
        </div>
      `,
    });

    return NextResponse.json({
      status: true,
      message:
        locale === "ar"
          ? "تم إرسال رمز التحقق إلى بريدك"
          : "OTP sent to your email",
      data: { email },
    });
  } catch (err: unknown) {
    return NextResponse.json({
      status: false,
      message: err instanceof Error ? err.message : "Failed to send OTP",
      data: null,
    });
  }
}
