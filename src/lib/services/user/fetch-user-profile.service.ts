import { createClient } from "@/lib/supabase/server";
import { AuthUser } from "@/lib/types/auth";

export const fetchUserProfileService = async (): Promise<AuthUser | null> => {
  const supabase = await createClient();

  try {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return null;
    }

    return {
      id: user.id,
      email: user.email ?? "",
      first_name: user.user_metadata?.first_name ?? "",
      last_name: user.user_metadata?.last_name ?? "",
      phone: user.user_metadata?.phone || null,
      avatar_url: user.user_metadata?.avatar_url || null,
      role: user.user_metadata?.role ?? "customer",
    };
  } catch {
    return null;
  }
};
