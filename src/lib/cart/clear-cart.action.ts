"use server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { getAuthUserId } from "@/lib/auth/get-auth-user-id";
import type { AuthResponse } from "@/lib/types/auth";
import { SHOP_TABLES } from "@/lib/constants/shop";

export async function clearCartAction(
  itemIds?: string[],
): Promise<AuthResponse<null>> {
  const userId = await getAuthUserId();
  if (!userId) {
    return { status: false, message: "Unauthorized", data: null };
  }

  try {
    let query = supabaseAdmin
      .from(SHOP_TABLES.CART)
      .delete()
      .eq("user_id", userId);

    if (itemIds && itemIds.length > 0) {
      query = query.in("id", itemIds);
    }

    const { error } = await query;
    if (error) throw new Error(error.message);

    return { status: true, message: "Cart cleared", data: null };
  } catch (err: unknown) {
    return {
      status: false,
      message: err instanceof Error ? err.message : "Failed to clear cart",
      data: null,
    };
  }
}
