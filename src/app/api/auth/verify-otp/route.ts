import { NextResponse } from "next/server";
import {
  AUTH_COOKIES,
  OTP_TYPES,
  RESET_COOKIE_EXPIRY_MINUTES,
} from "@/lib/constants/auth.constant";
import {
  removeAvatarService,
  uploadAvatarService,
} from "@/lib/auth/upload-avatar.service";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  const locale = request.headers.get("Accept-Language") || "en";

  try {
    const contentType = request.headers.get("content-type") || "";

    let email: string | undefined;
    let otp: string | undefined;
    let type: string = OTP_TYPES.FORGOT_PASSWORD;

    let first_name: string | undefined;
    let last_name: string | undefined;
    let phone: string | null = null;
    let password: string | undefined;
    let avatar: File | null = null;

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();

      email = formData.get("email")?.toString();
      otp = formData.get("otp")?.toString();
      type = formData.get("type")?.toString() ?? OTP_TYPES.FORGOT_PASSWORD;

      first_name = formData.get("first_name")?.toString();
      last_name = formData.get("last_name")?.toString();
      phone = formData.get("phone")?.toString() || null;
      password = formData.get("password")?.toString();

      const avatarValue = formData.get("avatar");
      avatar = avatarValue instanceof File ? avatarValue : null;
    } else {
      const body = await request.json();

      email = body.email;
      otp = body.otp;
      type = body.type ?? OTP_TYPES.FORGOT_PASSWORD;

      first_name = body.first_name;
      last_name = body.last_name;
      phone = body.phone ?? null;
      password = body.password;
    }

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

    const normalizedEmail = email.trim().toLowerCase();

    const { data: otpRecord, error } = await supabaseAdmin
      .from("password_reset_otps")
      .select("*")
      .eq("email", normalizedEmail)
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

    await supabaseAdmin
      .from("password_reset_otps")
      .update({ used: true })
      .eq("id", otpRecord.id);

    if (type === OTP_TYPES.REGISTER) {
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

      let avatar_url: string | null = null;
      let uploadedAvatarPath: string | null = null;

      if (avatar) {
        const uploadedAvatar = await uploadAvatarService(avatar);

        uploadedAvatarPath = uploadedAvatar.path;
        avatar_url = uploadedAvatar.publicUrl;
      }

      const { data: userData, error: createError } =
        await supabaseAdmin.auth.admin.createUser({
          email: normalizedEmail,
          password,
          user_metadata: {
            first_name,
            last_name,
            phone,
            avatar_url,
          },
          email_confirm: true,
        });

      if (createError || !userData.user) {
        if (uploadedAvatarPath) {
          await removeAvatarService(uploadedAvatarPath);
        }

        const isExisting =
          createError?.message.toLowerCase().includes("already registered") ||
          createError?.message.toLowerCase().includes("already exists");

        return NextResponse.json({
          status: false,
          message: isExisting
            ? locale === "ar"
              ? "البريد الإلكتروني مستخدم بالفعل"
              : "Email already registered"
            : createError?.message || "Failed to create user",
          data: null,
        });
      }

      const { error: profileError } = await supabaseAdmin
        .from("profiles")
        .upsert({
          id: userData.user.id,
          email: normalizedEmail,
          full_name: `${first_name} ${last_name}`,
          first_name,
          last_name,
          phone,
          avatar_url,
          role: "customer",
        });

      if (profileError) {
        await supabaseAdmin.auth.admin.deleteUser(userData.user.id);

        if (uploadedAvatarPath) {
          await removeAvatarService(uploadedAvatarPath);
        }

        throw new Error(profileError.message);
      }

      return NextResponse.json({
        status: true,
        message:
          locale === "ar"
            ? "تم إنشاء الحساب وتأكيد بريدك الإلكتروني"
            : "Account created and email verified",
        data: {
          email: normalizedEmail,
          avatar_url,
        },
      });
    }

    const response = NextResponse.json({
      status: true,
      message:
        locale === "ar" ? "تم التحقق بنجاح" : "Email verified successfully",
      data: {
        email: normalizedEmail,
      },
    });

    if (type === OTP_TYPES.FORGOT_PASSWORD) {
      response.cookies.set(AUTH_COOKIES.PW_RESET_VERIFIED, normalizedEmail, {
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
