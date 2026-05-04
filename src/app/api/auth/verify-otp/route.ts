import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import {
  AUTH_COOKIES,
  OTP_TYPES,
  RESET_COOKIE_EXPIRY_MINUTES,
} from "@/lib/constants/auth.constant";
import { uploadAvatarService } from "@/lib/auth/upload-avatar.service";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export async function POST(request: Request) {
  const locale = request.headers.get("Accept-Language") || "en";

  try {
  
const formData = await request.formData();

const email = formData.get("email")?.toString();
const otp = formData.get("otp")?.toString();
const type = formData.get("type")?.toString() ?? OTP_TYPES.FORGOT_PASSWORD;

const first_name = formData.get("first_name")?.toString();
const last_name = formData.get("last_name")?.toString();
const phone = formData.get("phone")?.toString() || null;
const password = formData.get("password")?.toString();

const avatarValue = formData.get("avatar");
const avatar = avatarValue instanceof File ? avatarValue : null;




    if (!email || !otp) {
      return NextResponse.json({
        status: false,
        message:
          locale === "ar"
            ? "البريد الإلكتروني والرمز مطلوبان"
            : "Email and OTP are required",
        data: null,
      });
    }

    // ── Look up the matching, unused OTP record ───────────────────────────
    const { data: otpRecord, error } = await supabase
      .from("password_reset_otps")
      .select("*")
      .eq("email", email)
      .eq("otp", otp)
      .eq("used", false)
      .single();

    if (error || !otpRecord) {
      return NextResponse.json({
        status: false,
        message: locale === "ar" ? "رمز التحقق غير صحيح" : "Invalid OTP",
        data: null,
      });
    }

    // ── Reject expired OTPs ───────────────────────────────────────────────
    if (new Date(otpRecord.expires_at) < new Date()) {
      return NextResponse.json({
        status: false,
        message:
          locale === "ar"
            ? "انتهت صلاحية الرمز، اطلب رمزاً جديداً"
            : "OTP has expired, please request a new one",
        data: null,
      });
    }

    // ── Mark OTP as used so it cannot be replayed ─────────────────────────
    await supabase
      .from("password_reset_otps")
      .update({ used: true })
      .eq("id", otpRecord.id);

    // ── register flow: create the Auth user + profile now ─────────────────
    if (type === OTP_TYPES.REGISTER) {
      // const { first_name, last_name, phone, password, avatar_url } = body;

let avatar_url: string | null = null;

if (avatar) {
  const uploadedAvatar = await uploadAvatarService(avatar);
  avatar_url = uploadedAvatar.publicUrl;
}



      if (!first_name || !last_name || !password) {
        return NextResponse.json({
          status: false,
          message:
            locale === "ar"
              ? "بيانات التسجيل ناقصة"
              : "Missing registration data",
          data: null,
        });
      }

      const { data: userData, error: createError } =
        await supabase.auth.admin.createUser({
          email,
          password,
          user_metadata: {
            first_name,
            last_name,
            phone: phone ?? null,
            avatar_url: avatar_url ?? null,
          },
          email_confirm: true,
        });

      if (createError) {
        const isExisting =
          createError.message.toLowerCase().includes("already registered") ||
          createError.message.toLowerCase().includes("already exists");

        return NextResponse.json({
          status: false,
          message: isExisting
            ? locale === "ar"
              ? "البريد الإلكتروني مستخدم بالفعل"
              : "Email already registered"
            : createError.message,
          data: null,
        });
      }

      const { error: profileError } = await supabase.from("profiles").upsert({
        id: userData.user.id,
        full_name: `${first_name} ${last_name}`,
        first_name,
        last_name,
        phone: phone ?? null,
        avatar_url: avatar_url ?? null,
        role: "customer",
      });

      if (profileError) {
        // Roll back the Auth user so we don't leave orphaned records
        await supabase.auth.admin.deleteUser(userData.user.id);
        throw new Error(profileError.message);
      }

      return NextResponse.json({
        status: true,
        message:
          locale === "ar"
            ? "تم إنشاء الحساب وتأكيد بريدك الإلكتروني"
            : "Account created and email verified",
        data: { email },
      });
    }

    // ── forgot_password flow: set short-lived cookie ──────────────────────
    const response = NextResponse.json({
      status: true,
      message:
        locale === "ar" ? "تم التحقق بنجاح" : "Email verified successfully",
      data: { email },
    });

    if (type === OTP_TYPES.FORGOT_PASSWORD) {
      response.cookies.set(AUTH_COOKIES.PW_RESET_VERIFIED, email, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: RESET_COOKIE_EXPIRY_MINUTES * 60,
        path: "/",
      });
    }

    return response;
  } catch (err: unknown) {
    return NextResponse.json({
      status: false,
      message: err instanceof Error ? err.message : "Verification failed",
      data: null,
    });
  }
}
