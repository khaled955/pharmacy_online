import { z } from "zod";
import { OTP_CONFIG, OTP_PATTERN, PASSWORD_CONFIG } from "@/lib/constants/auth";

// ── Step 1: Enter email
export function useForgotPasswordEmailSchema() {
  return z.object({
    email: z.email({
      error: (issue) => (!issue ? "Invalid email address" : "Email is required"),
    }),
  });
}

export type ForgotPasswordEmailInput = z.infer<
  ReturnType<typeof useForgotPasswordEmailSchema>
>;

// ── Step 2: Enter OTP ─────────────────────────────────────────────────────────
export function useForgotPasswordOtpSchema() {
  return z.object({
    otp: z
      .string()
      .nonempty("Code is required")
      .length(
        OTP_CONFIG.LENGTH,
        `Code must be exactly ${OTP_CONFIG.LENGTH} digits`,
      )
      .regex(OTP_PATTERN, "Code must contain digits only"),
  });
}

export type ForgotPasswordOtpInput = z.infer<
  ReturnType<typeof useForgotPasswordOtpSchema>
>;

// ── Step 3: Set new password
export function useForgotPasswordNewPasswordSchema() {
  return z
    .object({
      password: z
        .string().nonempty("Password is required")
        .min(
          PASSWORD_CONFIG.MIN_LENGTH,
          `Password must be at least ${PASSWORD_CONFIG.MIN_LENGTH} characters`,
        ),
      confirm_password: z.string().nonempty("Please confirm your password"),
    })
    .refine((d) => d.password === d.confirm_password, {
      message: "Passwords do not match",
      path: ["confirm_password"],
    });
}

export type ForgotPasswordNewPasswordInput = z.infer<
  ReturnType<typeof useForgotPasswordNewPasswordSchema>
>;
