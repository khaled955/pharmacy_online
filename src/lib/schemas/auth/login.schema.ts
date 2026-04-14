import { z } from "zod";

export const loginSchema = z.object({
  email: z.email({
    error: (iss) =>
      !Boolean(iss.input) ? "Email is required" : "Invalid email address",
  }),
  password: z.string().nonempty({ message: "Password is required" }),
});

export type LoginFields = z.infer<typeof loginSchema>;
