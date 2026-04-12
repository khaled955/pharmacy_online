// ─────────────────────────────────────────────────────────────────────────────
// AUTH SERVICE
// All functions that call auth API endpoints.
// Naming convention: <verb>Action — makes it clear the function hits the network.
// ─────────────────────────────────────────────────────────────────────────────

import { createClient } from "@/lib/supabase/client"
import { AUTH_API, OTP_TYPES } from "@/lib/constants/auth"
import type { LoginInput } from "@/lib/schemas/auth/login.schema"
import type { RegisterInput } from "@/lib/schemas/auth/register.schema"
import type {
  ForgotPasswordEmailInput,
  ForgotPasswordOtpInput,
  ForgotPasswordNewPasswordInput,
} from "@/lib/schemas/auth/forgot-password.schema"
import type {
  AuthResponse,
  LoginResponseData,
  RegisterResponseData,
  SendOtpResponseData,
  VerifyOtpResponseData,
  ResetPasswordResponseData,
} from "@/lib/types/auth"

// ── LOGIN ─────────────────────────────────────────────────────────────────────
// Authenticates via Supabase signInWithPassword on the browser client,
// then fetches the user's profile row to return a full AuthUser shape.
export async function loginAction(
  input: LoginInput,
): Promise<AuthResponse<LoginResponseData>> {
  const supabase = createClient()

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: input.email,
      password: input.password,
    })

    if (error) throw new Error(error.message)
    if (!data.user || !data.session) throw new Error("Login failed")

    // Fetch extended profile stored in the public.profiles table
    const { data: profile } = await supabase
      .from("profiles")
      .select("first_name, last_name, phone, avatar_url, role")
      .eq("id", data.user.id)
      .single()

    return {
      status: true,
      message: "Login successful",
      data: {
        user: {
          id: data.user.id,
          email: data.user.email!,
          first_name: profile?.first_name ?? "",
          last_name: profile?.last_name ?? "",
          phone: profile?.phone ?? null,
          avatar_url: profile?.avatar_url ?? null,
          role: profile?.role ?? "customer",
        },
        access_token: data.session.access_token,
      },
    }
  } catch (err: unknown) {
    return {
      status: false,
      message: err instanceof Error ? err.message : "Login failed",
      data: null,
    }
  }
}

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

// ── SEND OTP ──────────────────────────────────────────────────────────────────
// Generates and emails a 5-digit OTP for either registration or password reset.
export async function sendOtpAction(input: {
  email: string
  type: (typeof OTP_TYPES)[keyof typeof OTP_TYPES]
}): Promise<AuthResponse<SendOtpResponseData>> {
  try {
    const res = await fetch(AUTH_API.SEND_OTP, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    })

    return res.json()
  } catch (err: unknown) {
    return {
      status: false,
      message: err instanceof Error ? err.message : "Failed to send OTP",
      data: null,
    }
  }
}

// ── VERIFY OTP (register) ─────────────────────────────────────────────────────
// Confirms the 5-digit code and triggers user + profile creation on the server.
// pendingUser contains the registration data collected before OTP was sent.
export async function verifyRegisterOtpAction(
  email: string,
  otp: string,
  pendingUser: {
    first_name: string
    last_name: string
    phone?: string | null
    password: string
    avatar_url: string | null
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
    })

    return res.json()
  } catch (err: unknown) {
    return {
      status: false,
      message: err instanceof Error ? err.message : "Verification failed",
      data: null,
    }
  }
}

// ── FORGOT PASSWORD — SEND OTP ────────────────────────────────────────────────
// Verifies the email exists, then sends a password-reset OTP.
export async function sendForgotPasswordOtpAction(
  input: ForgotPasswordEmailInput,
): Promise<AuthResponse<SendOtpResponseData>> {
  return sendOtpAction({ email: input.email, type: OTP_TYPES.FORGOT_PASSWORD })
}

// ── FORGOT PASSWORD — VERIFY OTP ─────────────────────────────────────────────
// Checks the code entered in step 2. On success the server sets a short-lived
// httpOnly cookie that authorises the password-reset call in step 3.
export async function verifyForgotPasswordOtpAction(
  email: string,
  input: ForgotPasswordOtpInput,
): Promise<AuthResponse<VerifyOtpResponseData>> {
  try {
    const res = await fetch(AUTH_API.VERIFY_OTP, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        otp: input.otp,
        type: OTP_TYPES.FORGOT_PASSWORD,
      }),
    })

    return res.json()
  } catch (err: unknown) {
    return {
      status: false,
      message: err instanceof Error ? err.message : "Verification failed",
      data: null,
    }
  }
}

// ── FORGOT PASSWORD — RESET PASSWORD ─────────────────────────────────────────
// Uses the httpOnly cookie set in step 2 to authorise a password update
// via the Supabase admin API (server-side only).
export async function resetPasswordAction(
  input: ForgotPasswordNewPasswordInput,
): Promise<AuthResponse<ResetPasswordResponseData>> {
  try {
    const res = await fetch(AUTH_API.RESET_PASSWORD, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: input.password }),
    })

    return res.json()
  } catch (err: unknown) {
    return {
      status: false,
      message: err instanceof Error ? err.message : "Password reset failed",
      data: null,
    }
  }
}
