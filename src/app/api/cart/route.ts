import { NextRequest, NextResponse } from "next/server";
import { getRouteUserId } from "@/lib/auth/get-route-user-id";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { SHOP_TABLES } from "@/lib/constants/shop";

const PRODUCT_COLUMNS =
  "id, slug, name_en, name_ar, price, original_price, stock, image_url, avg_rating, reviews_count, brand, is_on_promotion, promotion_label_en, is_best_seller";

export async function GET(req: NextRequest) {
  const userId = await getRouteUserId(req);
  if (!userId) return NextResponse.json([]);

  const { data: items, error: itemsError } = await supabaseAdmin
    .from(SHOP_TABLES.CART)
    .select("id, user_id, product_id, quantity, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (itemsError) {
    console.error("[cart GET] items error:", itemsError.message);
    return NextResponse.json([]);
  }
  if (!items || items.length === 0) return NextResponse.json([]);

  const productIds = items.map((i) => i.product_id as string);

  const { data: products, error: productsError } = await supabaseAdmin
    .from("products")
    .select(PRODUCT_COLUMNS)
    .in("id", productIds);

  if (productsError) {
    console.error("[cart GET] products error:", productsError.message);
    return NextResponse.json(items.map((item) => ({ ...item, products: null })));
  }

  const productMap = new Map(
    (products ?? []).map((p) => [p.id as string, p]),
  );

  return NextResponse.json(
    items.map((item) => ({
      ...item,
      products: productMap.get(item.product_id as string) ?? null,
    })),
  );
}
