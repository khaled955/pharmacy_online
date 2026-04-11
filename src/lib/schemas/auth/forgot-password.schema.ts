// ─────────────────────────────────────────────────────────────────────────────
// FORGOT-PASSWORD SCHEMAS
// One schema per step of the 3-step forgot-password flow.
// ─────────────────────────────────────────────────────────────────────────────

import { z } from "zod"
import { OTP_CONFIG, PASSWORD_CONFIG } from "@/lib/constants/auth"

// ── Step 1: Enter email ───────────────────────────────────────────────────────
export const forgotPasswordEmailSchema = z.object({
  email: z.string().email("Invalid email address"),
})

export type ForgotPasswordEmailInput = z.infer<typeof forgotPasswordEmailSchema>

// ── Step 2: Enter OTP ─────────────────────────────────────────────────────────
export const forgotPasswordOtpSchema = z.object({
  otp: z
    .string()
    .length(OTP_CONFIG.LENGTH, `Code must be exactly ${OTP_CONFIG.LENGTH} digits`)
    .regex(/^\d+$/, "Code must contain digits only"),
})

export type ForgotPasswordOtpInput = z.infer<typeof forgotPasswordOtpSchema>

// ── Step 3: Set new password ──────────────────────────────────────────────────
export const forgotPasswordNewPasswordSchema = z
  .object({
    password: z
      .string()
      .min(
        PASSWORD_CONFIG.MIN_LENGTH,
        `Password must be at least ${PASSWORD_CONFIG.MIN_LENGTH} characters`,
      ),
    confirm_password: z.string(),
  })
  .refine((d) => d.password === d.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  })

export type ForgotPasswordNewPasswordInput = z.infer<
  typeof forgotPasswordNewPasswordSchema
>
