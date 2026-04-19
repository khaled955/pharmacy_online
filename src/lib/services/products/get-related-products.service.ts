import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { ProductCardData } from "@/lib/types/product";

const CARD_SELECT = [
  "id", "slug", "name_en", "name_ar", "price", "original_price",
  "stock", "image_url", "avg_rating", "reviews_count", "brand",
  "is_on_promotion", "promotion_label_en", "is_best_seller",
].join(", ");

export async function getRelatedProducts(opts: {
  productId: string;
  categoryId: string | null;
  brand: string | null;
  seasonalTag: string | null;
  limit?: number;
}): Promise<ProductCardData[]> {
  const { productId, categoryId, brand, seasonalTag, limit = 4 } = opts;
  const supabase = await createClient();

  // Priority 1: same category
  if (categoryId) {
    const { data } = await supabase
      .from("products")
      .select(CARD_SELECT)
      .eq("is_active", true)
      .eq("category_id", categoryId)
      .neq("id", productId)
      .order("avg_rating", { ascending: false, nullsFirst: false })
      .limit(limit);

    if (data && data.length >= limit) return data as ProductCardData[];
  }

  // Priority 2: same brand
  if (brand) {
    const { data } = await supabase
      .from("products")
      .select(CARD_SELECT)
      .eq("is_active", true)
      .eq("brand", brand)
      .neq("id", productId)
      .order("avg_rating", { ascending: false, nullsFirst: false })
      .limit(limit);

    if (data && data.length >= limit) return data as ProductCardData[];
  }

  // Priority 3: same seasonal tag
  if (seasonalTag) {
    const { data } = await supabase
      .from("products")
      .select(CARD_SELECT)
      .eq("is_active", true)
      .eq("seasonal_tag", seasonalTag)
      .neq("id", productId)
      .order("avg_rating", { ascending: false, nullsFirst: false })
      .limit(limit);

    if (data && data.length > 0) return data as ProductCardData[];
  }

  // Fallback: best sellers
  const { data } = await supabase
    .from("products")
    .select(CARD_SELECT)
    .eq("is_active", true)
    .neq("id", productId)
    .order("sold_count", { ascending: false })
    .limit(limit);

  return (data as ProductCardData[]) ?? [];
}
