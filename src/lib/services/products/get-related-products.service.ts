import "server-only";
import type { ProductCardData } from "@/lib/types/product";
import {
  PRODUCT_CARD_SELECT,
  mapProductCardRow,
  throwOnDbError,
} from "./_product-helpers";
import { createClientFromServer } from "@/lib/supabase/server";

export async function getRelatedProducts(opts: {
  productId: string;
  categoryId: string | null;
  brand: string | null;
  seasonalTag: string | null;
  limit?: number;
}): Promise<ProductCardData[]> {
  const { productId, categoryId, brand, seasonalTag, limit = 4 } = opts;
  const supabase = await createClientFromServer();

  // Priority 1: same category
  if (categoryId) {
    const { data, error } = await supabase
      .from("products")
      .select(PRODUCT_CARD_SELECT)
      .eq("is_active", true)
      .eq("category_id", categoryId)
      .neq("id", productId)
      .order("avg_rating", { ascending: false, nullsFirst: false })
      .limit(limit)
      .overrideTypes<ProductCardData[]>();

    if (!error && data && data.length >= limit) return data.map(mapProductCardRow);
  }

  // Priority 2: same brand
  if (brand) {
    const { data, error } = await supabase
      .from("products")
      .select(PRODUCT_CARD_SELECT)
      .eq("is_active", true)
      .eq("brand", brand)
      .neq("id", productId)
      .order("avg_rating", { ascending: false, nullsFirst: false })
      .limit(limit)
      .overrideTypes<ProductCardData[]>();

    if (!error && data && data.length >= limit) return data.map(mapProductCardRow);
  }

  // Priority 3: same seasonal tag
  if (seasonalTag) {
    const { data, error } = await supabase
      .from("products")
      .select(PRODUCT_CARD_SELECT)
      .eq("is_active", true)
      .eq("seasonal_tag", seasonalTag)
      .neq("id", productId)
      .order("avg_rating", { ascending: false, nullsFirst: false })
      .limit(limit)
      .overrideTypes<ProductCardData[]>();

    if (!error && data && data.length > 0) return data.map(mapProductCardRow);
  }

  // Fallback: top by sold count
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_CARD_SELECT)
    .eq("is_active", true)
    .neq("id", productId)
    .order("sold_count", { ascending: false })
    .limit(limit)
    .overrideTypes<ProductCardData[]>();

  throwOnDbError(error, "getRelatedProducts");
  return (data ?? []).map(mapProductCardRow);
}
