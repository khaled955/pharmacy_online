import "server-only";
import { supabaseAdmin } from "@/lib/supabase/admin";
import type { TopProduct } from "@/lib/types/dashboard";

export async function getTopProducts(limit = 10): Promise<TopProduct[]> {
  const { data, error } = await supabaseAdmin
    .from("dashboard_top_products")
    .select("*")
    .limit(limit);

  if (error) {
    console.error("[getTopProducts]", error.message);
    return [];
  }

  return (data ?? []) as TopProduct[];
}
