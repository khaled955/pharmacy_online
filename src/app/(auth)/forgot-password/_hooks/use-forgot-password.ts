// ─────────────────────────────────────────────────────────────────────────────
// FORGOT-PASSWORD HOOKS
// Three TanStack useMutation hooks — one per step of the forgot-password flow.
// Keep each hook small and single-purpose; the page composes them together.
// ─────────────────────────────────────────────────────────────────────────────

import { useMutation } from "@tanstack/react-query"
import {
  sendForgotPasswordOtpAction,
  verifyForgotPasswordOtpAction,
  resetPasswordAction,
} from "@/lib/auth/auth-service"
import { MUTATION_KEYS } from "@/lib/constants/auth"
import type {
  ForgotPasswordEmailInput,
  ForgotPasswordOtpInput,
  ForgotPasswordNewPasswordInput,
} from "@/lib/schemas/auth/forgot-password.schema"
import type {
  AuthResponse,
  SendOtpResponseData,
  VerifyOtpResponseData,
  ResetPasswordResponseData,
  ErrorResponse,
} from "@/lib/types/auth"

// ── Step 1: send OTP to the provided email ────────────────────────────────────
export function useSendForgotPasswordOtp() {
  return useMutation<
    AuthResponse<SendOtpResponseData>,
    ErrorResponse,
    ForgotPasswordEmailInput
  >({
    mutationKey: MUTATION_KEYS.SEND_OTP,
    mutationFn: (input) => sendForgotPasswordOtpAction(input),
  })
}

// ── Step 2: verify the OTP entered by the user ────────────────────────────────
// Receives both the email (held in component state) and the OTP input.
export function useVerifyForgotPasswordOtp() {
  return useMutation<
    AuthResponse<VerifyOtpResponseData>,
    ErrorResponse,
    { email: string; input: ForgotPasswordOtpInput }
  >({
    mutationKey: MUTATION_KEYS.VERIFY_OTP,
    mutationFn: ({ email, input }) =>
      verifyForgotPasswordOtpAction(email, input),
  })
}

// ── Step 3: update the password using the server-side cookie ──────────────────
export function useResetPassword() {
  return useMutation<
    AuthResponse<ResetPasswordResponseData>,
    ErrorResponse,
    ForgotPasswordNewPasswordInput
  >({
    mutationKey: MUTATION_KEYS.RESET_PASSWORD,
    mutationFn: (input) => resetPasswordAction(input),
  })
}
