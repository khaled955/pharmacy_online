import { OTP_TYPES } from "@/lib/constants/auth"
import type { ForgotPasswordEmailInput } from "@/lib/schemas/auth/forgot-password.schema"
import type { AuthResponse, SendOtpResponseData } from "@/lib/types/auth"
import { sendOtpAction } from "./send-otp.action"

// ── FORGOT PASSWORD — SEND OTP ────────────────────────────────────────────────
// Verifies the email exists, then sends a password-reset OTP.
export async function sendForgotPasswordOtpAction(
  input: ForgotPasswordEmailInput,
): Promise<AuthResponse<SendOtpResponseData>> {
  return sendOtpAction({ email: input.email, type: OTP_TYPES.FORGOT_PASSWORD })
}
