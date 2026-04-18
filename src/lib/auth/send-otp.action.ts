import { AUTH_API, OTP_TYPES } from "@/lib/constants/auth"
import type { AuthResponse, SendOtpResponseData } from "@/lib/types/auth"

function getBaseUrl() {
  if (typeof window !== "undefined") return ""
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`
  return `http://localhost:${process.env.PORT ?? 3000}`
}

// Generates and emails a 5-digit OTP for either registration or password reset.
export async function sendOtpAction(input: {
  email: string
  type: (typeof OTP_TYPES)[keyof typeof OTP_TYPES]
}): Promise<AuthResponse<SendOtpResponseData>> {
  try {
    const res = await fetch(`${getBaseUrl()}${AUTH_API.SEND_OTP}`, {
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
