import {
  FIRST_LAST_NAME_PATTERN,
  SAUDI_PHONE_PATTERN,
} from "@/lib/constants/auth";
import { z } from "zod";

export default function useRegisterSchema() {
  return z
    .object({
      first_name: z
        .string()
        .nonempty("First name is required")
        .min(2, "First name must be at least 2 characters")
        .regex(FIRST_LAST_NAME_PATTERN, "No spaces or special characters"),
      last_name: z
        .string()
        .nonempty("Last name is required")
        .min(2, "Last name must be at least 2 characters")
        .regex(FIRST_LAST_NAME_PATTERN, "No spaces or special characters"),
      email: z.email({
        error: (issu) =>
          !Boolean(issu) ? "Invalid email address" : "Email is required",
      }),
      phone: z
        .string()
        .nonempty("Phone number is required")
        .regex(SAUDI_PHONE_PATTERN, "Enter a valid Saudi phone number"),
      password: z
        .string()
        .nonempty("Password is required")
        .min(8, "Password must be at least 8 characters"),
      confirm_password: z.string().nonempty("Please confirm your password"),
      avatar: z.instanceof(File).optional().nullable(),
    })
    .refine((d) => d.password === d.confirm_password, {
      message: "Passwords do not match",
      path: ["confirm_password"],
    });
}

export type RegisterFormValues = z.infer<ReturnType<typeof useRegisterSchema>>;
