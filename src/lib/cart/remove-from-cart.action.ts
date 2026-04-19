"use server";
import { createClient } from "@/lib/supabase/server";
import type { AuthResponse } from "@/lib/types/auth";
import type { RemoveFromCartPayload } from "@/lib/types/order";
import { SHOP_TABLES } from "@/lib/constants/shop";

export async function removeFromCartAction(
  payload: RemoveFromCartPayload,
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

    const { error } = await supabase
      .from(SHOP_TABLES.CART)
      .delete()
      .eq("id", payload.cartItemId)
      .eq("user_id", user.id);

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
