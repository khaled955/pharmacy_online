// ─────────────────────────────────────────────────────────────────────────────
// useRegister — TanStack mutation that creates a Supabase user + sends OTP
// ─────────────────────────────────────────────────────────────────────────────

import { useMutation } from "@tanstack/react-query"
import { registerAction } from "@/lib/auth/auth-service"
import { MUTATION_KEYS } from "@/lib/constants/auth"
import type { RegisterInput } from "@/lib/schemas/auth/register.schema"
import type { AuthResponse, RegisterResponseData, ErrorResponse } from "@/lib/types/auth"

export function useRegister() {
  return useMutation<AuthResponse<RegisterResponseData>, ErrorResponse, RegisterInput>({
    mutationKey: MUTATION_KEYS.REGISTER,
    mutationFn: (input) => registerAction(input),
  })
}
