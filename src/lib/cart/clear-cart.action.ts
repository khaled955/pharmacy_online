"use server";
import { createClient } from "@/lib/supabase/server";
import type { AuthResponse } from "@/lib/types/auth";
import { SHOP_TABLES } from "@/lib/constants/shop";

export async function clearCartAction(
  itemIds?: string[],
): Promise<AuthResponse<null>> {
  const supabase = await createClient();

  try {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { status: false, message: "Unauthorized", data: null };
    }

    let query = supabase
      .from(SHOP_TABLES.CART)
      .delete()
      .eq("user_id", user.id);

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
