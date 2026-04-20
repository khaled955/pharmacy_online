"use server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { getAuthUserId } from "@/lib/auth/get-auth-user-id";
import type { AuthResponse } from "@/lib/types/auth";
import type { CartItemRow, UpdateCartItemPayload } from "@/lib/types/order";
import { SHOP_TABLES } from "@/lib/constants/shop";

export async function updateCartItemAction(
  payload: UpdateCartItemPayload,
): Promise<AuthResponse<CartItemRow>> {
  const userId = await getAuthUserId();
  if (!userId) {
    return { status: false, message: "Unauthorized", data: null };
  }

  try {
    const { cartItemId, quantity } = payload;

    if (quantity < 1) {
      return { status: false, message: "Quantity must be at least 1", data: null };
    }

    const { data, error } = await supabaseAdmin
      .from(SHOP_TABLES.CART)
      .update({ quantity, updated_at: new Date().toISOString() })
      .eq("id", cartItemId)
      .eq("user_id", userId)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return { status: true, message: "Cart updated", data: data as unknown as CartItemRow };
  } catch (err: unknown) {
    return {
      status: false,
      message: err instanceof Error ? err.message : "Failed to update cart",
      data: null,
    };
  }
}
