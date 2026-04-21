import { z } from "zod";
import { PASSWORD_CONFIG } from "@/lib/constants/auth";

export const changePasswordSchema = z
  .object({
    current_password: z.string().nonempty("Current password is required"),
    new_password: z
      .string()
      .nonempty("New password is required")
      .min(
        PASSWORD_CONFIG.MIN_LENGTH,
        `Password must be at least ${PASSWORD_CONFIG.MIN_LENGTH} characters`,
      ),
    confirm_password: z.string().nonempty("Please confirm your new password"),
  })
  .refine((d) => d.new_password === d.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  });

export type ChangePasswordFields = z.infer<typeof changePasswordSchema>;
