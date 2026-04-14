// ─────────────────────────────────────────────────────────────────────────────
// Register hooks — one per mutation in the two-step registration flow.
// ─────────────────────────────────────────────────────────────────────────────

import { useMutation } from "@tanstack/react-query"
import { registerAction } from "@/lib/auth/register.action"
import { verifyRegisterOtpAction } from "@/lib/auth/verify-register-otp.action"
import { sendOtpAction } from "@/lib/auth/send-otp.action"
import { MUTATION_KEYS, OTP_TYPES } from "@/lib/constants/auth"
import type { RegisterInput } from "@/lib/schemas/auth/register.schema"
import type {
  AuthResponse,
  RegisterResponseData,
  VerifyOtpResponseData,
  SendOtpResponseData,
  ErrorResponse,
} from "@/lib/types/auth"

type PendingUser = {
  first_name: string
  last_name: string
  phone?: string | null
  password: string
  avatar_url: string | null
}

// ── Step 1: submit registration form — uploads avatar + sends OTP ─────────────
export function useRegister() {
  return useMutation<AuthResponse<RegisterResponseData>, ErrorResponse, RegisterInput>({
    mutationKey: MUTATION_KEYS.REGISTER,
    mutationFn: (input) => registerAction(input),
  })
}

// ── Step 2a: verify the OTP — creates the Supabase user on success ────────────
export function useVerifyRegisterOtp() {
  return useMutation<
    AuthResponse<VerifyOtpResponseData>,
    Error,
    { email: string; otp: string; pending: PendingUser }
  >({
    mutationKey: MUTATION_KEYS.VERIFY_OTP,
    mutationFn: ({ email, otp, pending }) =>
      verifyRegisterOtpAction(email, otp, pending),
  })
}

// ── Step 2b: resend the OTP when user didn't receive it ───────────────────────
export function useResendRegisterOtp() {
  return useMutation<AuthResponse<SendOtpResponseData>, Error, string>({
    mutationKey: MUTATION_KEYS.RESEND_OTP,
    mutationFn: (email) => sendOtpAction({ email, type: OTP_TYPES.REGISTER }),
  })
}
