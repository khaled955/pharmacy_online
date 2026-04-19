import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { WishlistItemRow } from "@/lib/types/order";
import type { ProductCardData } from "@/lib/types/product";
import { SHOP_TABLES } from "@/lib/constants/shop";

const PRODUCT_COLUMNS =
  "id, slug, name_en, name_ar, price, original_price, stock, image_url, avg_rating, reviews_count, brand, is_on_promotion, promotion_label_en, is_best_seller";

export async function getWishlist(userId: string): Promise<WishlistItemRow[]> {
  const supabase = await createClient();

  const { data: items, error } = await supabase
    .from(SHOP_TABLES.WISHLIST)
    .select("id, user_id, product_id, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw new Error(`[getWishlist] ${error.message}`);
  if (!items || items.length === 0) return [];

  const productIds = items.map((i) => i.product_id as string);

  const { data: products, error: productsError } = await supabase
    .from("products")
    .select(PRODUCT_COLUMNS)
    .in("id", productIds);

  if (productsError) throw new Error(`[getWishlist products] ${productsError.message}`);

  const productMap = new Map(
    (products ?? []).map((p) => [p.id as string, p as unknown as ProductCardData]),
  );

  return items.map((item) => ({
    ...item,
    products: productMap.get(item.product_id as string) ?? null,
  })) as WishlistItemRow[];
}

export async function getWishlistCount(userId: string): Promise<number> {
  const supabase = await createClient();

  const { count, error } = await supabase
    .from(SHOP_TABLES.WISHLIST)
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId);

  if (error) throw new Error(`[getWishlistCount] ${error.message}`);
  return count ?? 0;
}

export async function getWishlistProductIds(userId: string): Promise<string[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from(SHOP_TABLES.WISHLIST)
    .select("product_id")
    .eq("user_id", userId);

  if (error) throw new Error(`[getWishlistProductIds] ${error.message}`);
  return (data ?? []).map((row) => row.product_id as string);
}
