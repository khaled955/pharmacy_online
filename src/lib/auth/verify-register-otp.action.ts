import { AUTH_API, OTP_TYPES } from "@/lib/constants/auth.constant";

type VerifyOtpRegisterValues = {
  email: string;
  otp: string;
  pendingUser: {
    first_name: string;
    last_name: string;
    phone?: string | null;
    password: string;
    avatar: File | null;
  };
};

// VERIFY OTP (register)
export async function verifyRegisterOtpAction({
  email,
  otp,
  pendingUser,
}: VerifyOtpRegisterValues) {
  try {
    const formData = new FormData();

    formData.append("email", email);
    formData.append("otp", otp);
    formData.append("type", OTP_TYPES.REGISTER);
    formData.append("first_name", pendingUser.first_name);
    formData.append("last_name", pendingUser.last_name);
    formData.append("phone", pendingUser.phone ?? "");
    formData.append("password", pendingUser.password);

    if (pendingUser.avatar) {
      formData.append("avatar", pendingUser.avatar);
    }

    const res = await fetch(AUTH_API.VERIFY_OTP, {
      method: "POST",
      body: formData,
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
