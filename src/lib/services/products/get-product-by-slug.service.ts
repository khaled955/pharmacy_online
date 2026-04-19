import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { ProductDetailsData } from "@/lib/types/product";

export async function getProductBySlug(
  slug: string,
): Promise<ProductDetailsData | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("products")
    .select("*, category:categories(id, name_en, name_ar, slug, icon, is_active)")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  if (error || !data) {
    if (error?.code !== "PGRST116") {
      console.error("[getProductBySlug]", error?.message);
    }
    return null;
  }

  return data as unknown as ProductDetailsData;
}
