import { AUTH_API, OTP_TYPES } from "@/lib/constants/auth.constant";
import type { ForgotPasswordOtpInput } from "@/lib/schemas/auth/forgot-password.schema";
import type { AuthResponse, VerifyOtpResponseData } from "@/lib/types/auth";

// ── FORGOT PASSWORD — VERIFY OTP
export async function verifyForgotPasswordOtpAction(
  email: string,
  input: ForgotPasswordOtpInput,
): Promise<AuthResponse<VerifyOtpResponseData>> {
  try {
    const res = await fetch(AUTH_API.VERIFY_OTP, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        otp: input.otp,
        type: OTP_TYPES.FORGOT_PASSWORD,
      }),
    });

    return res.json();
  } catch (err: unknown) {
    return {
      status: false,
      message: err instanceof Error ? err.message : "Verification failed",
      data: null,
    };
  }
}
