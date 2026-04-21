"use server";

import { supabaseAdmin } from "@/lib/supabase/admin";
import { getAuthUserId } from "@/lib/auth/get-auth-user-id";
import type { AuthResponse } from "@/lib/types/auth";
import type { UpdateProfileFields } from "@/lib/schemas/profile/update-profile.schema";

export async function updateProfileAction(
  values: UpdateProfileFields,
): Promise<AuthResponse> {
  try {
    const userId = await getAuthUserId();
    if (!userId) throw new Error("Not authenticated");

    const { error } = await supabaseAdmin
      .from("profiles")
      .update({
        first_name: values.first_name,
        last_name: values.last_name,
        phone: values.phone || null,
      })
      .eq("id", userId);

    if (error) throw new Error(error.message);

    return { status: true, message: "Profile updated successfully", data: null };
  } catch (err) {
    return {
      status: false,
      message: err instanceof Error ? err.message : "Failed to update profile",
      data: null,
    };
  }
}
