// ─────────────────────────────────────────────────────────────────────────────
// POST /api/auth/send-otp
// Generates a 5-digit OTP, persists it in password_reset_otps, and emails it.
// Accepts a `type` field to distinguish register vs forgot_password flows.
// In development the OTP is returned in the response body instead of emailed.
// ─────────────────────────────────────────────────────────────────────────────

import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import {
  DB_TABLES,
  OTP_CONFIG,
  OTP_TYPES,
  type OtpType,
} from "@/lib/constants/auth"

// Service-role client — bypasses RLS so we can insert OTP records freely
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
)

// Generates a cryptographically simple random numeric OTP of the configured length
function generateOtp(): string {
  const min = Math.pow(10, OTP_CONFIG.LENGTH - 1)
  const max = Math.pow(10, OTP_CONFIG.LENGTH) - 1
  return (Math.floor(Math.random() * (max - min + 1)) + min).toString()
}

export async function POST(request: Request) {
  const locale = request.headers.get("Accept-Language") || "en"

  try {
    const body = await request.json()
    const email: string | undefined = body.email
    const type: OtpType = body.type ?? OTP_TYPES.REGISTER

    // ── Guard: email is required ───────────────────────────────────────────
    if (!email) {
      return NextResponse.json({
        status: false,
        message: locale === "ar" ? "البريد الإلكتروني مطلوب" : "Email is required",
        data: null,
      })
    }

    // ── Guard: for forgot_password, verify the account exists ─────────────
    if (type === OTP_TYPES.FORGOT_PASSWORD) {
      const { data: profile } = await supabase
        .from(DB_TABLES.PROFILES)
        .select("id")
        .eq("id",
          // Sub-select: resolve email → auth user id via admin listUsers
          // We do this in a separate step below
          "placeholder",
        )
        .maybeSingle()

      // Resolve the Supabase auth user by email using admin API
      const { data: usersData } = await supabase.auth.admin.listUsers({
        page: 1,
        perPage: 1000,
      })

      const authUser = usersData?.users?.find((u) => u.email === email)

      if (!authUser) {
        return NextResponse.json({
          status: false,
          message:
            locale === "ar"
              ? "لا يوجد حساب مرتبط بهذا البريد الإلكتروني"
              : "No account found with this email",
          data: null,
        })
      }

      // Suppress the unused profile variable warning
      void profile
    }

    // ── Generate OTP and calculate expiry ──────────────────────────────────
    const otp = generateOtp()
    const expires_at = new Date(
      Date.now() + OTP_CONFIG.EXPIRY_MINUTES * 60 * 1000,
    ).toISOString()

    // Remove any pending (unused) OTPs for this email to avoid duplicates
    await supabase
      .from(DB_TABLES.OTP_RECORDS)
      .delete()
      .eq("email", email)
      .eq("used", false)

    // Persist the new OTP record
    const { error: insertError } = await supabase
      .from(DB_TABLES.OTP_RECORDS)
      .insert({ email, otp, expires_at, used: false })

    if (insertError) throw new Error(insertError.message)

    const isDev = process.env.NODE_ENV === "development"

    // ── Production: send email via Resend ──────────────────────────────────
    if (!isDev) {
      const { Resend } = await import("resend")
      const resend = new Resend(process.env.RESEND_API_KEY)

      const isPasswordReset = type === OTP_TYPES.FORGOT_PASSWORD

      const subject =
        locale === "ar"
          ? isPasswordReset
            ? "رمز إعادة تعيين كلمة المرور"
            : "رمز التحقق"
          : isPasswordReset
            ? "Reset your password"
            : "Verify your account"

      const heading =
        locale === "ar"
          ? isPasswordReset
            ? "إعادة تعيين كلمة المرور"
            : "مرحباً بك في صيدليتنا"
          : isPasswordReset
            ? "Reset your password"
            : "Welcome to our Pharmacy"

      const bodyText =
        locale === "ar"
          ? "رمز التحقق الخاص بك:"
          : "Your verification code:"

      const expiryText =
        locale === "ar"
          ? `صالح لمدة ${OTP_CONFIG.EXPIRY_MINUTES} دقائق`
          : `Expires in ${OTP_CONFIG.EXPIRY_MINUTES} minutes`

      const { error: emailError } = await resend.emails.send({
        from: `Pharmacy <noreply@${process.env.RESEND_DOMAIN}>`,
        to: email,
        subject,
        html: `
          <div style="font-family:Arial,sans-serif;max-width:400px;margin:0 auto;padding:24px;">
            <h2 style="color:#0d9488;">${heading}</h2>
            <p>${bodyText}</p>
            <div style="background:#f0fdfa;border:2px solid #0d9488;border-radius:12px;
                        padding:24px;text-align:center;margin:24px 0;">
              <span style="font-size:36px;font-weight:bold;letter-spacing:8px;color:#0d9488;">
                ${otp}
              </span>
            </div>
            <p style="color:#6b7280;font-size:14px;">${expiryText}</p>
          </div>
        `,
      })

      if (emailError) throw new Error(emailError.message)

      return NextResponse.json({
        status: true,
        message:
          locale === "ar" ? "تم إرسال رمز التحقق" : "OTP sent to your email",
        data: { email },
      })
    }

    // ── Development: return OTP in response (skip email sending) ──────────
    return NextResponse.json({
      status: true,
      message: "DEV MODE — OTP generated (not sent via email)",
      data: { email, otp },
    })
  } catch (err: unknown) {
    return NextResponse.json({
      status: false,
      message: err instanceof Error ? err.message : "Failed to send OTP",
      data: null,
    })
  }
}
