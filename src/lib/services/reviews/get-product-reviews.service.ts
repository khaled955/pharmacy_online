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
    .select(`
      id,
      user_id,
      product_id,
      rating,
      comment,
      created_at,
      profiles(first_name, last_name, full_name, avatar_url)
    `)
    .eq("product_id", productId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("[getProductReviews]", error.message);
    return [];
  }

  return (data as unknown as ReviewRow[]) ?? [];
}
