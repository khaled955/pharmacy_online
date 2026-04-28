import "server-only";
import type { ProductCardData } from "@/lib/types/product";
import {
  PRODUCT_CARD_SELECT,
  mapProductCardRow,
  throwOnDbError,
} from "./_product-helpers";
import { createClientFromServer } from "@/lib/supabase/server";

export async function getSeasonalProducts(
  tag: string,
  limit = 4,
): Promise<ProductCardData[]> {
  const supabase = await createClientFromServer();

  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_CARD_SELECT)
    .eq("is_active", true)
    .eq("seasonal_tag", tag)
    .order("display_priority", { ascending: true, nullsFirst: false })
    .order("avg_rating", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false })
    .limit(limit)
    .overrideTypes<ProductCardData[]>();

  throwOnDbError(error, "getSeasonalProducts");
  return (data ?? []).map(mapProductCardRow);
}
