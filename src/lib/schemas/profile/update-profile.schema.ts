import { z } from "zod";
import { FIRST_LAST_NAME_PATTERN, SAUDI_PHONE_PATTERN } from "@/lib/constants/auth";

export const updateProfileSchema = z.object({
  first_name: z
    .string()
    .nonempty("First name is required")
    .min(2, "Must be at least 2 characters")
    .regex(FIRST_LAST_NAME_PATTERN, "No spaces or special characters"),
  last_name: z
    .string()
    .nonempty("Last name is required")
    .min(2, "Must be at least 2 characters")
    .regex(FIRST_LAST_NAME_PATTERN, "No spaces or special characters"),
  phone: z
    .string()
    .regex(SAUDI_PHONE_PATTERN, "Enter a valid Saudi phone number")
    .or(z.literal(""))
    .optional(),
});

export type UpdateProfileFields = z.infer<typeof updateProfileSchema>;
