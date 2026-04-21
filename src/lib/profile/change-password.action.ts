"use server";

import { supabaseAdmin } from "@/lib/supabase/admin";
import { getAuthUserId } from "@/lib/auth/get-auth-user-id";
import { fetchUserProfileService } from "@/lib/services/user/fetch-user-profile.service";
import type { AuthResponse } from "@/lib/types/auth";
import type { ChangePasswordFields } from "@/lib/schemas/profile/change-password.schema";

export async function changePasswordAction(
  values: ChangePasswordFields,
): Promise<AuthResponse> {
  try {
    const [userId, profile] = await Promise.all([
      getAuthUserId(),
      fetchUserProfileService(),
    ]);

    if (!userId || !profile) throw new Error("Not authenticated");

    // Verify current password before allowing the change
    const { error: signInError } = await supabaseAdmin.auth.signInWithPassword({
      email: profile.email,
      password: values.current_password,
    });

    if (signInError) throw new Error("Current password is incorrect");

    const { error } = await supabaseAdmin.auth.admin.updateUserById(userId, {
      password: values.new_password,
    });

    if (error) throw new Error(error.message);

    return { status: true, message: "Password changed successfully", data: null };
  } catch (err) {
    return {
      status: false,
      message: err instanceof Error ? err.message : "Failed to change password",
      data: null,
    };
  }
}
