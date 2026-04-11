import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Service role client — bypasses RLS
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export async function POST(request: Request) {
  const locale = request.headers.get("Accept-Language") || "en";

  try {
    const { first_name, last_name, email, phone, password, avatar_url } =
      await request.json();

    // Create user in Supabase Auth
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: {
        first_name,
        last_name,
        phone,
        avatar_url: avatar_url ?? null,
      },
      email_confirm: true, // skip email confirmation
    });

    if (error) {
      // User already exists — they may have registered but never completed OTP.
      // Look up their existing record and return it so the frontend can proceed
      // to the OTP step and send them a fresh code instead of blocking them.
      if (
        error.message.toLowerCase().includes("already registered") ||
        error.message.toLowerCase().includes("already exists")
      ) {
        const { data: usersData } = await supabase.auth.admin.listUsers({
          page: 1,
          perPage: 1000,
        });

        const existingUser = usersData?.users.find((u) => u.email === email);

        if (!existingUser) throw new Error(error.message);

        // Fetch their profile (may not exist yet if a previous attempt failed mid-way)
        const { data: profile } = await supabase
          .from("profiles")
          .select("first_name, last_name, phone, avatar_url, role")
          .eq("id", existingUser.id)
          .maybeSingle();

        return NextResponse.json({
          status: true,
          message:
            locale === "ar"
              ? "الحساب موجود، سيتم إرسال رمز تحقق جديد"
              : "Account exists, sending a new verification code",
          data: {
            user: {
              id: existingUser.id,
              email: existingUser.email,
              first_name: profile?.first_name ?? first_name,
              last_name: profile?.last_name ?? last_name,
              phone: profile?.phone ?? phone,
              avatar_url: profile?.avatar_url ?? avatar_url ?? null,
              role: profile?.role ?? "customer",
            },
          },
        });
      }

      throw new Error(error.message);
    }

    if (!data.user) throw new Error("Registration failed");

    // Insert profile manually using service role
    const { error: profileError } = await supabase.from("profiles").upsert({
      id: data.user.id,
      full_name: `${first_name} ${last_name}`,
      first_name,
      last_name,
      phone: phone ?? null,
      avatar_url: avatar_url ?? null,
      role: "customer",
    });

    if (profileError) throw new Error(profileError.message);

    return NextResponse.json({
      status: true,
      message:
        locale === "ar" ? "تم إنشاء الحساب" : "Account created successfully",
      data: {
        user: {
          id: data.user.id,
          email: data.user.email,
          first_name,
          last_name,
          phone,
          avatar_url: avatar_url ?? null,
          role: "customer",
        },
      },
    });
  } catch (err: unknown) {
    return NextResponse.json({
      status: false,
      message: err instanceof Error ? err.message : "Registration failed",
      data: null,
    });
  }
}
