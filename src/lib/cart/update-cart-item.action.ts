"use server";
import { createClient } from "@/lib/supabase/server";
import type { AuthResponse } from "@/lib/types/auth";
import type { CartItemRow, UpdateCartItemPayload } from "@/lib/types/order";
import { SHOP_TABLES } from "@/lib/constants/shop";

export async function updateCartItemAction(
  payload: UpdateCartItemPayload,
): Promise<AuthResponse<CartItemRow>> {
  const supabase = await createClient();

  try {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { status: false, message: "Unauthorized", data: null };
    }

    const { cartItemId, quantity } = payload;

    if (quantity < 1) {
      return { status: false, message: "Quantity must be at least 1", data: null };
    }

    const { data, error } = await supabase
      .from(SHOP_TABLES.CART)
      .update({ quantity, updated_at: new Date().toISOString() })
      .eq("id", cartItemId)
      .eq("user_id", user.id)
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
