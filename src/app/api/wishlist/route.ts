import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { SHOP_TABLES } from "@/lib/constants/shop";

const PRODUCT_COLUMNS =
  "id, slug, name_en, name_ar, price, original_price, stock, image_url, avg_rating, reviews_count, brand, is_on_promotion, promotion_label_en, is_best_seller";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return NextResponse.json([]);

  // Step 1: wishlist rows
  const { data: items, error: itemsError } = await supabase
    .from(SHOP_TABLES.WISHLIST)
    .select("id, user_id, product_id, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (itemsError) {
    console.error("[wishlist GET] items error:", itemsError.message);
    return NextResponse.json([]);
  }
  if (!items || items.length === 0) return NextResponse.json([]);

  // Step 2: products for those items
  const productIds = items.map((i) => i.product_id as string);

  const { data: products, error: productsError } = await supabase
    .from("products")
    .select(PRODUCT_COLUMNS)
    .in("id", productIds);

  if (productsError) {
    console.error("[wishlist GET] products error:", productsError.message);
    return NextResponse.json(items.map((item) => ({ ...item, products: null })));
  }

  const productMap = new Map(
    (products ?? []).map((p) => [p.id as string, p]),
  );

  const wishlist = items.map((item) => ({
    ...item,
    products: productMap.get(item.product_id as string) ?? null,
  }));

  return NextResponse.json(wishlist);
}
