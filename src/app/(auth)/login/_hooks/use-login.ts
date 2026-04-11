import { useMutation } from "@tanstack/react-query"
import { loginUser } from "@/lib/auth/auth-service"
import type { LoginInput } from "@/lib/schemas/auth/login.schema"
import type { AuthResponse, LoginResponseData, ErrorResponse } from "@/lib/types/auth"

export function useLogin() {
  return useMutation<
    AuthResponse<LoginResponseData>,
    ErrorResponse,
    LoginInput
  >({
    mutationFn: (input: LoginInput) => loginUser(input)
  })
}