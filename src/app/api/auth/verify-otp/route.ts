import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const locale = request.headers.get("Accept-Language") || "en";

  try {
    const { email, otp } = await request.json();

    if (!email || !otp) {
      return NextResponse.json({
        status: false,
        message:
          locale === "ar" ? "البيانات مطلوبة" : "Email and OTP are required",
        data: null,
      });
    }

    const supabase = await createClient();

    // Find OTP record
    const { data: otpRecord, error } = await supabase
      .from("password_reset_otps")
      .select("*")
      .eq("email", email)
      .eq("otp", otp)
      .eq("used", false)
      .single();

    if (error || !otpRecord) {
      return NextResponse.json({
        status: false,
        message: locale === "ar" ? "رمز التحقق غير صحيح" : "Invalid OTP",
        data: null,
      });
    }

    // Check expiry
    if (new Date(otpRecord.expires_at) < new Date()) {
      return NextResponse.json({
        status: false,
        message: locale === "ar" ? "انتهت صلاحية الرمز" : "OTP has expired",
        data: null,
      });
    }

    // Mark OTP as used
    await supabase
      .from("password_reset_otps")
      .update({ used: true })
      .eq("id", otpRecord.id);

    return NextResponse.json({
      status: true,
      message:
        locale === "ar" ? "تم التحقق بنجاح" : "Email verified successfully",
      data: { email },
    });
  } catch (err: unknown) {
    return NextResponse.json({
      status: false,
      message: err instanceof Error ? err.message : "Verification failed",
      data: null,
    });
  }
}
