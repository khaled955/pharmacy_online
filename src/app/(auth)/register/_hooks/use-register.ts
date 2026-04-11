import { RegisterInput } from '../../../../lib/schemas/auth/register.schema';
import { useMutation } from "@tanstack/react-query"
import { registerUser } from "@/lib/auth/auth-service"
import { AuthResponse, RegisterResponseData, ErrorResponse } from "@/lib/types/auth"

export function useRegister() {
  return useMutation<
    AuthResponse<RegisterResponseData>,
    ErrorResponse,
    RegisterInput
  >({
    mutationFn: (input: RegisterInput) =>
      registerUser({
        first_name: input.first_name,
        last_name: input.last_name,
        email: input.email,
        phone: input.phone,
        password: input.password,
        avatar: input.avatar ?? null
      })
  })
}