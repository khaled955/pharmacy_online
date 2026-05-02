import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { AUTH_COOKIES, PASSWORD_CONFIG } from "@/lib/constants/auth.constant";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export async function POST(request: NextRequest) {
  const locale = request.headers.get("Accept-Language") || "en";

  try {
    // ── Read the verification cookie set after OTP was confirmed ──────────
    const verifiedEmail = request.cookies.get(
      AUTH_COOKIES.PW_RESET_VERIFIED,
    )?.value;

    if (!verifiedEmail) {
      return NextResponse.json({
        status: false,
        message:
          locale === "ar"
            ? "انتهت صلاحية جلسة إعادة التعيين، يرجى البدء من جديد"
            : "Reset session expired. Please start over.",
        data: null,
      });
    }

    const { password } = await request.json();

    // ── Guard: password must meet minimum length ───────────────────────────
    if (!password || password.length < PASSWORD_CONFIG.MIN_LENGTH) {
      return NextResponse.json({
        status: false,
        message:
          locale === "ar"
            ? `كلمة المرور يجب أن تكون ${PASSWORD_CONFIG.MIN_LENGTH} أحرف على الأقل`
            : `Password must be at least ${PASSWORD_CONFIG.MIN_LENGTH} characters`,
        data: null,
      });
    }

    // ── Resolve the Supabase auth user by email
    // listUsers is acceptable for a pharmacy app with a bounded user count
    const { data: usersData, error: listError } =
      await supabase.auth.admin.listUsers({ page: 1, perPage: 1000 });

    if (listError) throw new Error(listError.message);

    const authUser = usersData.users.find((u) => u.email === verifiedEmail);

    if (!authUser) {
      return NextResponse.json({
        status: false,
        message:
          locale === "ar" ? "لم يتم العثور على الحساب" : "Account not found",
        data: null,
      });
    }

    // ── Update the password via Supabase admin API
    const { error: updateError } = await supabase.auth.admin.updateUserById(
      authUser.id,
      { password },
    );

    if (updateError) throw new Error(updateError.message);

    // ── Clear the verification cookie — it is single-use
    const response = NextResponse.json({
      status: true,
      message:
        locale === "ar"
          ? "تم تحديث كلمة المرور بنجاح"
          : "Password updated successfully",
      data: null,
    });

    response.cookies.delete(AUTH_COOKIES.PW_RESET_VERIFIED);

    return response;
  } catch (err: unknown) {
    return NextResponse.json({
      status: false,
      message: err instanceof Error ? err.message : "Password reset failed",
      data: null,
    });
  }
}
