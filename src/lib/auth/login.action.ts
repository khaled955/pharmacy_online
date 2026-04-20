"use server";

import { LoginFields } from "../schemas/auth/login.schema";
import { supabaseAdmin } from "../supabase/admin";
import type { AuthResponse, AuthUser } from "../types/auth";

export async function loginAction(
  loginValues: LoginFields,
): Promise<AuthResponse<AuthUser>> {
  try {
    const { data, error } = await supabaseAdmin.auth.signInWithPassword({
      email: loginValues.email,
      password: loginValues.password,
    });

    if (error) throw new Error(error.message);
    if (!data.user) throw new Error("Login failed");
    if (!data.session?.access_token) throw new Error("Access token not found");

    const { data: profile, error: profileError } = await supabaseAdmin
      .from("profiles")
      .select("first_name, last_name, phone, avatar_url, role")
      .eq("id", data.user.id)
      .single();

    if (profileError) {
      throw new Error(profileError.message);
    }

    return {
      status: true,
      message: "Login successful",
      data: {
        id: data.user.id,
        email: data.user.email ?? "",
        first_name:
          profile?.first_name ?? data.user.user_metadata?.first_name ?? "",
        last_name:
          profile?.last_name ?? data.user.user_metadata?.last_name ?? "",
        phone: profile?.phone ?? data.user.user_metadata?.phone ?? null,
        avatar_url:
          profile?.avatar_url ?? data.user.user_metadata?.avatar_url ?? null,
        role: profile?.role ?? data.user.user_metadata?.role ?? "customer",
        accessToken: data.session.access_token,
      },
    };
  } catch (err: unknown) {
    return {
      status: false,
      message: err instanceof Error ? err.message : "Login failed",
      data: null,
    };
  }
}
