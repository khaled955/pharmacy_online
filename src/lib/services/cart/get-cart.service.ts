import "server-only";
import { supabaseAdmin } from "@/lib/supabase/admin";
import type { CartItemRow } from "@/lib/types/order";
import type { ProductCardData } from "@/lib/types/product";
import { SHOP_TABLES } from "@/lib/constants/shop";

const PRODUCT_COLUMNS =
  "id, slug, name_en, name_ar, price, original_price, stock, image_url, avg_rating, reviews_count, brand, is_on_promotion, promotion_label_en, is_best_seller";

export async function getCart(userId: string): Promise<CartItemRow[]> {
  const { data: items, error } = await supabaseAdmin
    .from(SHOP_TABLES.CART)
    .select("id, user_id, product_id, quantity, created_at, updated_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw new Error(`[getCart] ${error.message}`);
  if (!items || items.length === 0) return [];

  const productIds = items.map((i) => i.product_id as string);

  const { data: products, error: productsError } = await supabaseAdmin
    .from("products")
    .select(PRODUCT_COLUMNS)
    .in("id", productIds);

  if (productsError) throw new Error(`[getCart products] ${productsError.message}`);

  const productMap = new Map(
    (products ?? []).map((p) => [p.id as string, p as unknown as ProductCardData]),
  );

  return items.map((item) => ({
    ...item,
    products: productMap.get(item.product_id as string) ?? null,
  })) as CartItemRow[];
}

export async function getCartCount(userId: string): Promise<number> {
  const { count, error } = await supabaseAdmin
    .from(SHOP_TABLES.CART)
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId);

  if (error) throw new Error(`[getCartCount] ${error.message}`);
  return count ?? 0;
}
