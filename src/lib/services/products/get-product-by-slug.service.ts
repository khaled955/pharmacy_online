import "server-only";
import type { ProductDetailsData } from "@/lib/types/product";
import { createClientFromServer } from "@/lib/supabase/server";

export async function getProductBySlug(
  slug: string,
): Promise<ProductDetailsData | null> {
  const supabase = await createClientFromServer();

  const { data, error } = await supabase
    .from("products")
    .select("*, category:categories(id, name_en, name_ar, slug, icon, is_active)")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  if (error) {
    // PGRST116 = no rows found → treat as 404, not an error
    if (error.code === "PGRST116") return null;
    throw new Error(`[getProductBySlug] ${error.message}`);
  }

  return data as unknown as ProductDetailsData;
}
