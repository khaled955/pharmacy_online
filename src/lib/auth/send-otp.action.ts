import { AUTH_API, OTP_TYPES } from "@/lib/constants/auth.constant";
import type { AuthResponse, SendOtpResponseData } from "@/lib/types/auth";

function getBaseUrl() {
  if (typeof window !== "undefined") return "";

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  return `http://localhost:${process.env.PORT ?? 3000}`;
}

type SendOtpInput = {
  email: string;
  type: (typeof OTP_TYPES)[keyof typeof OTP_TYPES];
};

export async function sendOtpAction(
  input: SendOtpInput,
): Promise<AuthResponse<SendOtpResponseData>> {
  try {
    const normalizedEmail = input.email.trim().toLowerCase();

    if (!normalizedEmail) {
      return {
        status: false,
        message: "Email is required",
        data: null,
      };
    }

    const res = await fetch(`${getBaseUrl()}${AUTH_API.SEND_OTP}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...input,
        email: normalizedEmail,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      return {
        status: false,
        message: data.message || "Failed to send OTP",
        data: null,
      };
    }

    return data;
  } catch (err: unknown) {
    return {
      status: false,
      message: err instanceof Error ? err.message : "Failed to send OTP",
      data: null,
    };
  }
}
