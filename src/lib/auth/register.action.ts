
"use server";

import { OTP_TYPES } from "@/lib/constants/auth.constant";
import { sendOtpService } from "./send-otp.service";
import type { RegisterFormValues } from "../schemas/auth/register.schema";
import { supabaseAdmin } from "../supabase/admin";

export async function registerAction(input: RegisterFormValues) {
  try {
    // Check email availability before sending OTP
    const { data, error } = await supabaseAdmin.auth.admin.listUsers();

    if (error) {
      throw new Error(error.message);
    }

    const existingUser = data.users.find(
      (user) => user.email?.toLowerCase() === input.email.toLowerCase(),
    );

    if (existingUser) {
      return {
        status: false,
        message: "Email already registered",
        data: null,
      };
    }

    // Send verification OTP only
    const otpData = await sendOtpService(input.email, OTP_TYPES.REGISTER);

    if (!otpData.status) {
      throw new Error(otpData.message);
    }

    return {
      status: true,
      message: "OTP sent to your email",
      data: {
        email: input.email,
        otp:
          process.env.NODE_ENV === "development"
            ? (otpData.data?.otp ?? null)
            : null,
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
