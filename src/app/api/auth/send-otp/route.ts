import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Service role client — bypasses RLS
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
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({
        status: false,
        message:
          locale === "ar" ? "البريد الإلكتروني مطلوب" : "Email is required",
        data: null,
      });
    }

    const otp = generateOTP();
    const expires_at = new Date(Date.now() + 10 * 60 * 1000).toISOString();

    // Delete old unused OTPs
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

    const isDev = process.env.NODE_ENV === "development";

    if (!isDev) {
      // PRODUCTION: Send via Resend
      const { Resend } = await import("resend");
      const resend = new Resend(process.env.RESEND_API_KEY);

      const { error: emailError } = await resend.emails.send({
        from: `Pharmacy <noreply@${process.env.RESEND_DOMAIN}>`,
        to: email,
        subject: locale === "ar" ? "رمز التحقق" : "Verify your account",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 400px; margin: 0 auto; padding: 24px;">
            <h2 style="color: #0d9488;">
              ${locale === "ar" ? "مرحباً بك في صيدليتنا" : "Welcome to our Pharmacy"}
            </h2>
            <p>${locale === "ar" ? "رمز التحقق الخاص بك:" : "Your verification code:"}</p>
            <div style="background:#f0fdfa;border:2px solid #0d9488;border-radius:12px;padding:24px;text-align:center;margin:24px 0;">
              <span style="font-size:36px;font-weight:bold;letter-spacing:8px;color:#0d9488;">
                ${otp}
              </span>
            </div>
            <p style="color:#6b7280;font-size:14px;">
              ${locale === "ar" ? "صالح لمدة 10 دقائق" : "Expires in 10 minutes"}
            </p>
          </div>
        `,
      });

      if (emailError) throw new Error(emailError.message);

      return NextResponse.json({
        status: true,
        message:
          locale === "ar" ? "تم إرسال رمز التحقق" : "OTP sent to your email",
        data: { email },
        // NOTE: otp NOT returned in production
      });
    }

    // DEVELOPMENT: Return OTP in response
    return NextResponse.json({
      status: true,
      message: "DEV MODE — OTP generated (not sent via email)",
      data: {
        email,
        otp, // ← only visible in dev
      },
    });
  } catch (err: unknown) {
    return NextResponse.json({
      status: false,
      message: err instanceof Error ? err.message : "Failed to send OTP",
      data: null,
    });
  }
}
