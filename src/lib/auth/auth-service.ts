import { createClient } from "@/lib/supabase/client"
import { AuthResponse, LoginResponseData, RegisterResponseData } from "../types/auth"


// Register
export async function registerUser(input: {
  first_name: string
  last_name: string
  email: string
  phone: string
  password: string
  avatar?: File | null
}): Promise<AuthResponse<RegisterResponseData>> {
  const supabase = createClient()

  try {
    // Upload avatar if provided
    let avatar_url: string | null = null
    if (input.avatar) {
      const fileExt = input.avatar.name.split(".").pop()
      const fileName = `avatars/${Date.now()}.${fileExt}`

      const { data: uploadData, error: uploadError } = await supabase
        .storage
        .from("product-images")
        .upload(fileName, input.avatar)

      if (uploadError) throw new Error(uploadError.message)

      const { data: urlData } = supabase
        .storage
        .from("product-images")
        .getPublicUrl(uploadData.path)

      avatar_url = urlData.publicUrl
    }

    // Sign up user
    const { data, error } = await supabase.auth.signUp({
      email: input.email,
      password: input.password,
      options: {
        data: {
          first_name: input.first_name,
          last_name: input.last_name,
          phone: input.phone,
          avatar_url
        }
      }
    })

    // Allow already registered — we still send OTP
    if (error && !error.message.toLowerCase().includes("already registered")) {
      throw new Error(error.message)
    }

    // Send OTP
    const otpRes = await fetch("/api/auth/send-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: input.email })
    })

    const otpData = await otpRes.json()

    if (!otpData.status) throw new Error(otpData.message)

    return {
      status: true,
      message: "OTP sent to your email",
      data: {
        user: {
          id: data?.user?.id ?? "",
          email: input.email,
          first_name: input.first_name,
          last_name: input.last_name,
          phone: input.phone,
          avatar_url,
          role: "customer"
        },
        otp: otpData.data?.otp ?? null // only present in dev
      }
    }

  } catch (err: unknown) {
    return {
      status: false,
      message: err instanceof Error ? err.message : "Registration failed",
      data: null
    }
  }
}

// Login
export async function loginUser(input: {
  email: string
  password: string
}): Promise<AuthResponse<LoginResponseData>> {
  const supabase = createClient()

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: input.email,
      password: input.password
    })

    if (error) throw new Error(error.message)
    if (!data.user || !data.session) throw new Error("Login failed")

    // Fetch profile
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("first_name, last_name, phone, avatar_url, role")
      .eq("id", data.user.id)
      .single()

    if (profileError) throw new Error(profileError.message)

    return {
      status: true,
      message: "Login successful",
      data: {
        access_token: data.session.access_token,
        user: {
          id: data.user.id,
          email: data.user.email!,
          first_name: profile.first_name,
          last_name: profile.last_name,
          phone: profile.phone,
          avatar_url: profile.avatar_url,
          role: profile.role
        }
      }
    }

  } catch (err: unknown) {
    return {
      status: false,
      message: err instanceof Error ? err.message : "Login failed",
      data: null
    }
  }
}