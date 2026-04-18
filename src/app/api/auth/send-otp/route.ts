import { NextResponse } from "next/server";
import { sendOtpService } from "@/lib/auth/send-otp.service";
import { OTP_TYPES } from "@/lib/constants/auth";

export async function POST(request: Request) {
  const locale = request.headers.get("Accept-Language") || "en";

  try {
    const { email, type } = await request.json();

    const result = await sendOtpService(email, type ?? OTP_TYPES.REGISTER, locale);
    return NextResponse.json(result);
  } catch (err: unknown) {
    return NextResponse.json({
      status: false,
      message: err instanceof Error ? err.message : "Failed to send OTP",
      data: null,
    });
  }
}
