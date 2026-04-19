import { createClient } from "@/lib/supabase/server";
import type { AuthUser } from "@/lib/types/auth";

export const fetchUserProfileService = async (): Promise<AuthUser | null> => {
  const supabase = await createClient();

  try {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) return null;

    const { data: profile } = await supabase
      .from("profiles")
      .select("first_name, last_name, phone, avatar_url, role")
      .eq("id", user.id)
      .single();

    return {
      id: user.id,
      email: user.email ?? "",
      first_name: profile?.first_name ?? user.user_metadata?.first_name ?? "",
      last_name:  profile?.last_name  ?? user.user_metadata?.last_name  ?? "",
      phone:      profile?.phone      ?? user.user_metadata?.phone      ?? null,
      avatar_url: profile?.avatar_url ?? user.user_metadata?.avatar_url ?? null,
      role:       profile?.role       ?? user.user_metadata?.role       ?? "customer",
    };
  } catch {
    return null;
  }
};
