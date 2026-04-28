import "server-only";
import type { CategoryRow } from "@/lib/types/product";
import { createClientFromServer } from "@/lib/supabase/server";

export async function getCategories(): Promise<CategoryRow[]> {
  const supabase = await createClientFromServer();

  const { data, error } = await supabase
    .from("categories")
    .select("id, name_en, name_ar, slug, icon, is_active")
    .eq("is_active", true)
    .order("name_en", { ascending: true });

  if (error) {
    throw new Error(`[getCategories] ${error.message}`);
  }

  return (data as CategoryRow[]) ?? [];
}
