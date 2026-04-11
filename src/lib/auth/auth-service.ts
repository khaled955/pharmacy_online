import { createClient } from "../supabase/client";
import { AuthResponse, RegisterResponseData } from "../types/auth";

export async function registerUser(input: {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  password: string;
  avatar?: File | null;
}): Promise<AuthResponse<RegisterResponseData>> {
  const supabase = createClient();

  try {
    // Upload avatar if provided
    let avatar_url: string | null = null;
    if (input.avatar) {
      const fileExt = input.avatar.name.split(".").pop();
      const fileName = `avatars/${Date.now()}.${fileExt}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("product-images")
        .upload(fileName, input.avatar);
      if (uploadError) throw new Error(uploadError.message);
      const { data: urlData } = supabase.storage
        .from("product-images")
        .getPublicUrl(uploadData.path);
      avatar_url = urlData.publicUrl;
    }

    // Call server-side register API
    const registerRes = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        first_name: input.first_name,
        last_name: input.last_name,
        email: input.email,
        phone: input.phone,
        password: input.password,
        avatar_url,
      }),
    });

    const registerData = await registerRes.json();
    if (!registerData.status) throw new Error(registerData.message);

    // Send OTP
    const otpRes = await fetch("/api/auth/send-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: input.email }),
    });

    const otpData = await otpRes.json();
    if (!otpData.status) throw new Error(otpData.message);

    return {
      status: true,
      message: "OTP sent to your email",
      data: {
        user: registerData.data.user,
        otp: otpData.data?.otp ?? null,
      },
    };
  } catch (err: unknown) {
    return {
      status: false,
      message: err instanceof Error ? err.message : "Registration failed",
      data: null,
    };
  }
}
