import "server-only";
import type { ReviewRow } from "@/lib/types/product";
import { createClientFromServer } from "@/lib/supabase/server";

export async function getProductReviews(
  productId: string,
  limit = 10,
): Promise<ReviewRow[]> {
  const supabase = await createClientFromServer();

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
