import { z } from "zod";

export function useLoginSchema() {
  return z.object({
    email: z.email({
      error: (iss) =>
        !Boolean(iss.input) ? "Email is required" : "Invalid email address",
    }),
    password: z.string().nonempty("Password is required"),
  });
}

export type LoginFields = z.infer<ReturnType<typeof useLoginSchema>>;
