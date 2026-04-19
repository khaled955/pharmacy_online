import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { ProductCardData } from "@/lib/types/product";
import {
  PRODUCT_CARD_SELECT,
  mapProductCardRow,
  throwOnDbError,
} from "./_product-helpers";

export async function getTrendingProducts(limit = 4): Promise<ProductCardData[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_CARD_SELECT)
    .eq("is_active", true)
    .eq("is_trending", true)
    .order("display_priority", { ascending: true, nullsFirst: false })
    .order("view_count", { ascending: false })
    .order("wishlist_count", { ascending: false })
    .order("avg_rating", { ascending: false, nullsFirst: false })
    .limit(limit)
    .overrideTypes<ProductCardData[]>();

  throwOnDbError(error, "getTrendingProducts");
  return (data ?? []).map(mapProductCardRow);
}
