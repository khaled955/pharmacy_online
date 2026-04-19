import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { ProductCardData } from "@/lib/types/product";

const CARD_SELECT = [
  "id", "slug", "name_en", "name_ar", "price", "original_price",
  "stock", "image_url", "avg_rating", "reviews_count", "brand",
  "is_on_promotion", "promotion_label_en", "is_best_seller",
].join(", ");

export async function getBestSellers(limit = 5): Promise<ProductCardData[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("products")
    .select(CARD_SELECT)
    .eq("is_active", true)
    .eq("is_best_seller", true)
    .order("display_priority", { ascending: true, nullsFirst: false })
    .order("sold_count", { ascending: false })
    .order("avg_rating", { ascending: false, nullsFirst: false })
    .limit(limit);

  if (error) {
    console.error("[getBestSellers]", error.message);
    return [];
  }

  return (data as ProductCardData[]) ?? [];
}
