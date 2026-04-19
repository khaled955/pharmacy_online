import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { CategoryRow } from "@/lib/types/product";

export async function getCategories(): Promise<CategoryRow[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("categories")
    .select("id, name_en, name_ar, slug, icon, is_active")
    .eq("is_active", true)
    .order("name_en", { ascending: true });

  if (error) {
    console.error("[getCategories]", error.message);
    return [];
  }

  return (data as CategoryRow[]) ?? [];
}
