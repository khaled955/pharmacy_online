import { z } from "zod"

export const registerSchema = z.object({
  first_name: z
    .string()
    .min(2, "First name must be at least 2 characters")
    .regex(/^[a-zA-Zأ-ي]+$/, "No spaces or special characters"),
  last_name: z
    .string()
    .min(2, "Last name must be at least 2 characters")
    .regex(/^[a-zA-Zأ-ي]+$/, "No spaces or special characters"),
  email: z
    .string()
    .email("Invalid email address"),
  phone: z
    .string()
    .regex(/^(\+9665|05)[0-9]{8}$/, "Enter a valid Saudi phone number"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters"),
  confirm_password: z.string(),
  avatar: z.instanceof(File).optional().nullable()
}).refine(d => d.password === d.confirm_password, {
  message: "Passwords do not match",
  path: ["confirm_password"]
})

export type RegisterInput = z.infer<typeof registerSchema>