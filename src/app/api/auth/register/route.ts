// POST /api/auth/register
// Validates input and checks whether the email is already registered.
// Does NOT create the Supabase Auth user — that happens in /api/auth/verify-otp
// once the user proves ownership of their email address.

import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
)

export async function POST(request: Request) {
  const locale = request.headers.get("Accept-Language") || "en"

  try {
    const { first_name, last_name, email, password } = await request.json()

    if (!first_name || !last_name || !email || !password) {
      return NextResponse.json({
        status: false,
        message:
          locale === "ar"
            ? "جميع الحقول المطلوبة يجب ملؤها"
            : "All required fields must be filled",
        data: null,
      })
    }

    // Check if email is already taken (service-role bypasses RLS on auth schema)
    const { data: existingUser } = await supabase
      .schema("auth")
      .from("users")
      .select("id")
      .eq("email", email)
      .maybeSingle()

    if (existingUser) {
      return NextResponse.json({
        status: false,
        message:
          locale === "ar"
            ? "البريد الإلكتروني مستخدم بالفعل"
            : "Email already registered",
        data: null,
      })
    }

    return NextResponse.json({
      status: true,
      message:
        locale === "ar" ? "البريد الإلكتروني متاح" : "Email is available",
      data: { email },
    })
  } catch (err: unknown) {
    return NextResponse.json({
      status: false,
      message: err instanceof Error ? err.message : "Registration failed",
      data: null,
    })
  }
}
