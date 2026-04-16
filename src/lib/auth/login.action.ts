"use server";
import { LoginFields } from "../schemas/auth/login.schema";
import { createClient } from "../supabase/server";
import { AuthResponse, LoginResponseData } from "../types/auth";

export async function loginAction(
  loginValues: LoginFields,
): Promise<AuthResponse<LoginResponseData>> {
  const supabase = createClient();

  try {
    const { data, error } = await (
      await supabase
    ).auth.signInWithPassword({
      email: loginValues.email,
      password: loginValues.password,
    });
    if (error) throw new Error(error.message);
    if (!data.user || !data.session) throw new Error("Login failed");
    return {
      status: true,
      message: "Login successful",
      data: {
        user: {
          id: data.user.id,
          email: data.user.email!,
          first_name: "",
          last_name: "",
          phone: null,
          avatar_url: null,
          role: "customer",
        },
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
