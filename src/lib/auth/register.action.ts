"use server";
import { OTP_TYPES } from "@/lib/constants/auth.constant";
import { sendOtpService } from "./send-otp.service";
import { RegisterFormValues } from "../schemas/auth/register.schema";
import { createClient as createServiceClient } from "@supabase/supabase-js";
import { createClientFromServer } from "../supabase/server";

export async function registerAction(
  input: RegisterFormValues,
) {
  const supabase = await createClientFromServer();

  try {
    // Upload avatar to Supabase Storage when a file was selected
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

    // Check email availability before sending OTP
    const serviceClient = createServiceClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    );
    const { data: existingUser } = await serviceClient
      .schema("auth")
      .from("users")
      .select("id")
      .eq("email", input.email)
      .maybeSingle();

    if (existingUser) {
      return {
        status: false,
        message: "Email already registered",
        data: null,
      };
    }

    // Send verification OTP to the user's email
    const otpData = await sendOtpService(input.email, OTP_TYPES.REGISTER);
    if (!otpData.status) throw new Error(otpData.message);

    return {
      status: true,
      message: "OTP sent to your email",
      data: {
        email: input.email,
        avatar_url,
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
