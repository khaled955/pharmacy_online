import { AUTH_API } from "@/lib/constants/auth"
import type { ForgotPasswordNewPasswordInput } from "@/lib/schemas/auth/forgot-password.schema"
import type { AuthResponse, ResetPasswordResponseData } from "@/lib/types/auth"

// ── FORGOT PASSWORD — RESET PASSWORD ─────────────────────────────────────────
// Uses the httpOnly cookie set in step 2 to authorise a password update
// via the Supabase admin API (server-side only).
export async function resetPasswordAction(
  input: ForgotPasswordNewPasswordInput,
): Promise<AuthResponse<ResetPasswordResponseData>> {
  try {
    const res = await fetch(AUTH_API.RESET_PASSWORD, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: input.password }),
    })

    return res.json()
  } catch (err: unknown) {
    return {
      status: false,
      message: err instanceof Error ? err.message : "Password reset failed",
      data: null,
    }
  }
}
