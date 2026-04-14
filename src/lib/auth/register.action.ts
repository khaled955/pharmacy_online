import { createClient } from "@/lib/supabase/client"
import { AUTH_API, OTP_TYPES } from "@/lib/constants/auth"
import type { RegisterInput } from "@/lib/schemas/auth/register.schema"
import type { AuthResponse, RegisterResponseData } from "@/lib/types/auth"
import { sendOtpAction } from "./send-otp.action"
import { toast } from "sonner"

// ── REGISTER ──────────────────────────────────────────────────────────────────
// Uploads avatar (if provided), checks email availability, then sends a
// verification OTP. The Supabase Auth user is NOT created here — it is created
// in /api/auth/verify-otp only after the user proves email ownership.
export async function registerAction(
  input: RegisterInput,
): Promise<AuthResponse<RegisterResponseData>> {
  const supabase = createClient()

  try {
    // Upload avatar to Supabase Storage when a file was selected
    let avatar_url: string | null = null
    if (input.avatar) {
      const fileExt = input.avatar.name.split(".").pop()
      const fileName = `avatars/${Date.now()}.${fileExt}`

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("product-images")
        .upload(fileName, input.avatar)

      if (uploadError) throw new Error(uploadError.message)

      const { data: urlData } = supabase.storage
        .from("product-images")
        .getPublicUrl(uploadData.path)

      avatar_url = urlData.publicUrl
    }

    // Check email availability (no user is created yet)
    const registerRes = await fetch(AUTH_API.REGISTER, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        first_name: input.first_name,
        last_name: input.last_name,
        email: input.email,
        password: input.password,
      }),
    })

    const registerData: AuthResponse<{ email: string }> =
      await registerRes.json()
    if (!registerData.status) throw new Error(registerData.message)

    // Send verification OTP to the user's email
    const otpData = await sendOtpAction({
      email: input.email,
      type: OTP_TYPES.REGISTER,
    })
    if (!otpData.status) throw new Error(otpData.message)

    toast.success("OTP sent to your email")

    return {
      status: true,
      message: "OTP sent to your email",
      data: {
        email: input.email,
        avatar_url,
        otp: otpData.data?.otp ?? null,
      },
    }
  } catch (err: unknown) {
    return {
      status: false,
      message: err instanceof Error ? err.message : "Registration failed",
      data: null,
    }
  }
}
