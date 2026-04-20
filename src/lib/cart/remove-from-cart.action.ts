"use server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { getAuthUserId } from "@/lib/auth/get-auth-user-id";
import type { AuthResponse } from "@/lib/types/auth";
import type { RemoveFromCartPayload } from "@/lib/types/order";
import { SHOP_TABLES } from "@/lib/constants/shop";

export async function removeFromCartAction(
  payload: RemoveFromCartPayload,
): Promise<AuthResponse<null>> {
  const userId = await getAuthUserId();
  if (!userId) {
    return { status: false, message: "Unauthorized", data: null };
  }

  try {
    const { error } = await supabaseAdmin
      .from(SHOP_TABLES.CART)
      .delete()
      .eq("id", payload.cartItemId)
      .eq("user_id", userId);

    if (error) throw new Error(error.message);
    return { status: true, message: "Item removed from cart", data: null };
  } catch (err: unknown) {
    return {
      status: false,
      message: err instanceof Error ? err.message : "Failed to remove item",
      data: null,
    };
  }
}
