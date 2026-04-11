// ─────────────────────────────────────────────────────────────────────────────
// useLogin — TanStack mutation that authenticates via Supabase signInWithPassword
// ─────────────────────────────────────────────────────────────────────────────

import { useMutation } from "@tanstack/react-query"
import { loginAction } from "@/lib/auth/auth-service"
import { MUTATION_KEYS } from "@/lib/constants/auth"
import type { LoginInput } from "@/lib/schemas/auth/login.schema"
import type { AuthResponse, LoginResponseData, ErrorResponse } from "@/lib/types/auth"

export function useLogin() {
  return useMutation<AuthResponse<LoginResponseData>, ErrorResponse, LoginInput>({
    mutationKey: MUTATION_KEYS.LOGIN,
    mutationFn: (input) => loginAction(input),
  })
}
