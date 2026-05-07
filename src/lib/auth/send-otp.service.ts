import nodemailer from "nodemailer";
import type { AuthResponse, SendOtpResponseData } from "@/lib/types/auth";
import { OTP_TYPES } from "@/lib/constants/auth.constant";
import { supabaseAdmin } from "../supabase/admin";

function generateOTP(): string {
  return Math.floor(10000 + Math.random() * 90000).toString();
}

export async function sendOtpService(
  email: string,
  type: (typeof OTP_TYPES)[keyof typeof OTP_TYPES],
  locale: string = "en",
): Promise<AuthResponse<SendOtpResponseData>> {
  const normalizedEmail = email.trim().toLowerCase();

  if (!normalizedEmail) {
    return {
      status: false,
      message:
        locale === "ar" ? "البريد الإلكتروني مطلوب" : "Email is required",
      data: null,
    };
  }

  const supabase = supabaseAdmin;

  // For forgot-password OTPs, verify the account exists first from profiles.email
  if (type === OTP_TYPES.FORGOT_PASSWORD) {
    const { data: existingProfile, error: profileError } = await supabase
      .from("profiles")
      .select("id")
      .eq("email", normalizedEmail)
      .maybeSingle();

    if (profileError) {
      return {
        status: false,
        message: profileError.message,
        data: null,
      };
    }

    if (!existingProfile) {
      return {
        status: false,
        message:
          locale === "ar"
            ? "لا يوجد حساب مرتبط بهذا البريد الإلكتروني"
            : "No account found with this email address",
        data: null,
      };
    }
  }

  const otp = generateOTP();
  const expires_at = new Date(Date.now() + 10 * 60 * 1000).toISOString();

  // Delete old unused OTPs for this email
  await supabase
    .from("password_reset_otps")
    .delete()
    .eq("email", normalizedEmail)
    .eq("used", false);

  // Insert new OTP
  const { error: insertError } = await supabase
    .from("password_reset_otps")
    .insert({
      email: normalizedEmail,
      otp,
      expires_at,
      used: false,
    });

  if (insertError) {
    return {
      status: false,
      message: insertError.message,
      data: null,
    };
  }

  // In development, skip email sending and return the OTP directly.
  if (process.env.NODE_ENV !== "production") {
    return {
      status: true,
      message:
        locale === "ar"
          ? "تم إنشاء رمز التحقق (وضع التطوير)"
          : "OTP generated (dev mode)",
      data: {
        email: normalizedEmail,
        otp,
      },
    };
  }

  const gmailUser = process.env.GMAIL_USER?.trim();
  const gmailPass = process.env.GMAIL_APP_PASSWORD?.trim();

  if (!gmailUser || !gmailPass) {
    return {
      status: false,
      message:
        locale === "ar"
          ? "إعدادات البريد الإلكتروني مفقودة"
          : "Email credentials not configured",
      data: null,
    };
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

  try {
    await transporter.sendMail({
      from: `Pharmacy <${gmailUser}>`,
      to: normalizedEmail,
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
  } catch (mailError: unknown) {
    await supabase
      .from("password_reset_otps")
      .delete()
      .eq("email", normalizedEmail)
      .eq("otp", otp)
      .eq("used", false);

    return {
      status: false,
      message:
        mailError instanceof Error ? mailError.message : "Failed to send OTP",
      data: null,
    };
  }

  return {
    status: true,
    message:
      locale === "ar"
        ? "تم إرسال رمز التحقق إلى بريدك"
        : "OTP sent to your email",
    data: {
      email: normalizedEmail,
    },
  };
}
