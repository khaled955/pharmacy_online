import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { ReviewRow } from "@/lib/types/product";

export async function getProductReviews(
  productId: string,
  limit = 10,
): Promise<ReviewRow[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("reviews")
    .select("id, user_id, product_id, rating, comment, created_at")
    .eq("product_id", productId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    throw new Error(`[getProductReviews] ${error.message}`);
  }

  return (data as unknown as ReviewRow[]) ?? [];
}
