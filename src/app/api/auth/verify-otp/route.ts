// ─────────────────────────────────────────────────────────────────────────────
// POST /api/auth/verify-otp
// Validates the submitted OTP against the DB record (checks code, expiry, used).
// For the forgot_password flow, sets a short-lived httpOnly cookie that
// authorises the subsequent reset-password call.
// ─────────────────────────────────────────────────────────────────────────────

import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import {
  DB_TABLES,
  OTP_TYPES,
  AUTH_COOKIES,
  RESET_COOKIE_EXPIRY_MINUTES,
  type OtpType,
} from "@/lib/constants/auth"

// Service-role client — bypasses RLS for reading OTP records
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
)

export async function POST(request: Request) {
  const locale = request.headers.get("Accept-Language") || "en"

  try {
    const body = await request.json()
    const email: string | undefined = body.email
    const otp: string | undefined = body.otp
    const type: OtpType = body.type ?? OTP_TYPES.REGISTER

    // ── Guard: both fields are required ───────────────────────────────────
    if (!email || !otp) {
      return NextResponse.json({
        status: false,
        message:
          locale === "ar" ? "البيانات مطلوبة" : "Email and OTP are required",
        data: null,
      })
    }

    // ── Look up the matching, unused OTP record ────────────────────────────
    const { data: otpRecord, error } = await supabase
      .from(DB_TABLES.OTP_RECORDS)
      .select("*")
      .eq("email", email)
      .eq("otp", otp)
      .eq("used", false)
      .single()

    if (error || !otpRecord) {
      return NextResponse.json({
        status: false,
        message: locale === "ar" ? "رمز التحقق غير صحيح" : "Invalid OTP",
        data: null,
      })
    }

    // ── Guard: reject expired OTPs ────────────────────────────────────────
    if (new Date(otpRecord.expires_at) < new Date()) {
      return NextResponse.json({
        status: false,
        message: locale === "ar" ? "انتهت صلاحية الرمز" : "OTP has expired",
        data: null,
      })
    }

    // ── Mark OTP as used so it cannot be replayed ─────────────────────────
    await supabase
      .from(DB_TABLES.OTP_RECORDS)
      .update({ used: true })
      .eq("id", otpRecord.id)

    // ── Build success response ─────────────────────────────────────────────
    const response = NextResponse.json({
      status: true,
      message:
        locale === "ar" ? "تم التحقق بنجاح" : "Email verified successfully",
      data: { email },
    })

    // ── For forgot_password: set a short-lived httpOnly cookie ────────────
    // The reset-password route reads this cookie to confirm the user completed
    // OTP verification before allowing a password update.
    if (type === OTP_TYPES.FORGOT_PASSWORD) {
      response.cookies.set(AUTH_COOKIES.PW_RESET_VERIFIED, email, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: RESET_COOKIE_EXPIRY_MINUTES * 60,
        path: "/",
      })
    }

    return response
  } catch (err: unknown) {
    return NextResponse.json({
      status: false,
      message: err instanceof Error ? err.message : "Verification failed",
      data: null,
    })
  }
}
