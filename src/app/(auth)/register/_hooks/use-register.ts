import { useMutation } from "@tanstack/react-query";
import { registerAction } from "@/lib/auth/register.action";
import { verifyRegisterOtpAction } from "@/lib/auth/verify-register-otp.action";
import { sendOtpAction } from "@/lib/auth/send-otp.action";
import { OTP_TYPES } from "@/lib/constants/auth.constant";
import type {
  AuthResponse,
  VerifyOtpResponseData,
  SendOtpResponseData,
} from "@/lib/types/auth";
import { RegisterFormValues } from "@/lib/schemas/auth/register.schema";

type PendingUser = {
  first_name: string;
  last_name: string;
  phone?: string | null;
  password: string;
  avatar_url: string | null;
};

type RegisterVerifyOtp = {
  email: string;
  otp: string;
  pending: PendingUser;
};

// ── Step 1: submit registration form — uploads avatar + sends OTP
export function useRegister() {
  const {
    mutate: onRegister,
    error: regiseterError,
    isPending: regiseterIsPending,
    reset:registerReset,
  } = useMutation({
    mutationFn: (formFields: RegisterFormValues) => registerAction(formFields),
  });
  return { onRegister, regiseterError, regiseterIsPending,registerReset };
}

// ── Step 2a: verify the OTP — creates the Supabase user on success
export function useVerifyRegisterOtp() {
  return useMutation<
    AuthResponse<VerifyOtpResponseData>,
    Error,
    RegisterVerifyOtp
  >({
    mutationFn: ({ email, otp, pending }) =>
      verifyRegisterOtpAction(email, otp, pending),
  });
}

// ── Step 2b: resend the OTP when user didn't receive it
export function useResendRegisterOtp() {
  return useMutation<AuthResponse<SendOtpResponseData>, Error, string>({
    mutationFn: (email) => sendOtpAction({ email, type: OTP_TYPES.REGISTER }),
  });
}
