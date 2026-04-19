"use server";
import { createClient } from "@/lib/supabase/server";
import type { AuthResponse } from "@/lib/types/auth";
import type { ToggleWishlistPayload, WishlistItemRow } from "@/lib/types/order";
import { SHOP_TABLES } from "@/lib/constants/shop";

export type ToggleWishlistResult = {
  action: "added" | "removed";
  item: WishlistItemRow | null;
};

export async function toggleWishlistAction(
  payload: ToggleWishlistPayload,
): Promise<AuthResponse<ToggleWishlistResult>> {
  const supabase = await createClient();

  try {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { status: false, message: "Please log in to manage your wishlist", data: null };
    }

    const { productId } = payload;

    const { data: existing } = await supabase
      .from(SHOP_TABLES.WISHLIST)
      .select("id")
      .eq("user_id", user.id)
      .eq("product_id", productId)
      .single();

    if (existing) {
      const { error } = await supabase
        .from(SHOP_TABLES.WISHLIST)
        .delete()
        .eq("id", (existing as { id: string }).id)
        .eq("user_id", user.id);

      if (error) throw new Error(error.message);
      return { status: true, message: "Removed from wishlist", data: { action: "removed", item: null } };
    }

    const { data, error } = await supabase
      .from(SHOP_TABLES.WISHLIST)
      .insert({ user_id: user.id, product_id: productId })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return {
      status: true,
      message: "Added to wishlist",
      data: { action: "added", item: data as unknown as WishlistItemRow },
    };
  } catch (err: unknown) {
    return {
      status: false,
      message: err instanceof Error ? err.message : "Failed to update wishlist",
      data: null,
    };
  }
}
