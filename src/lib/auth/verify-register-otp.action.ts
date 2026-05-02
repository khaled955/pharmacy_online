import { AUTH_API, OTP_TYPES } from "@/lib/constants/auth.constant";
import type { AuthResponse, VerifyOtpResponseData } from "@/lib/types/auth";

//VERIFY OTP (register)
export async function verifyRegisterOtpAction(
  email: string,
  otp: string,
  pendingUser: {
    first_name: string;
    last_name: string;
    phone?: string | null;
    password: string;
    avatar_url: string | null;
  },
): Promise<AuthResponse<VerifyOtpResponseData>> {
  try {
    const res = await fetch(AUTH_API.VERIFY_OTP, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        otp,
        type: OTP_TYPES.REGISTER,
        first_name: pendingUser.first_name,
        last_name: pendingUser.last_name,
        phone: pendingUser.phone ?? null,
        password: pendingUser.password,
        avatar_url: pendingUser.avatar_url,
      }),
    });

    return res.json();
  } catch (err: unknown) {
    return {
      status: false,
      message: err instanceof Error ? err.message : "Verification failed",
      data: null,
    };
  }
}
