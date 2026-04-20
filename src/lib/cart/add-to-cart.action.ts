"use server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { getAuthUserId } from "@/lib/auth/get-auth-user-id";
import type { AuthResponse } from "@/lib/types/auth";
import type { AddToCartPayload, CartItemRow } from "@/lib/types/order";
import { SHOP_TABLES } from "@/lib/constants/shop";

export async function addToCartAction(
  payload: AddToCartPayload,
): Promise<AuthResponse<CartItemRow>> {
  const userId = await getAuthUserId();
  if (!userId) {
    return { status: false, message: "Please log in to add items to cart", data: null };
  }

  try {
    const { productId, quantity } = payload;

    const { data: existing } = await supabaseAdmin
      .from(SHOP_TABLES.CART)
      .select("id, quantity")
      .eq("user_id", userId)
      .eq("product_id", productId)
      .single();

    if (existing) {
      const { data, error } = await supabaseAdmin
        .from(SHOP_TABLES.CART)
        .update({ quantity: (existing as { quantity: number }).quantity + quantity, updated_at: new Date().toISOString() })
        .eq("id", (existing as { id: string }).id)
        .select()
        .single();

      if (error) throw new Error(error.message);
      return { status: true, message: "Cart updated", data: data as unknown as CartItemRow };
    }

    const { data, error } = await supabaseAdmin
      .from(SHOP_TABLES.CART)
      .insert({ user_id: userId, product_id: productId, quantity })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return { status: true, message: "Added to cart", data: data as unknown as CartItemRow };
  } catch (err: unknown) {
    return {
      status: false,
      message: err instanceof Error ? err.message : "Failed to add to cart",
      data: null,
    };
  }
}
