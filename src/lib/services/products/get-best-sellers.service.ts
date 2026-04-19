import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { ProductCardData } from "@/lib/types/product";
import {
  PRODUCT_CARD_SELECT,
  mapProductCardRow,
  throwOnDbError,
} from "./_product-helpers";

export async function getBestSellers(limit = 5): Promise<ProductCardData[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_CARD_SELECT)
    .eq("is_active", true)
    .eq("is_best_seller", true)
    .order("display_priority", { ascending: true, nullsFirst: false })
    .order("sold_count", { ascending: false })
    .order("avg_rating", { ascending: false, nullsFirst: false })
    .limit(limit)
    .overrideTypes<ProductCardData[]>();

  throwOnDbError(error, "getBestSellers");
  return (data ?? []).map(mapProductCardRow);
}
