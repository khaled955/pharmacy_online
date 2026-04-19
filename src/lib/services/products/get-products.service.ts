import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { ProductCardData, ProductFilters } from "@/lib/types/product";
import type { PaginatedResponse } from "@/lib/types/api";

const DEFAULT_LIMIT = 12;

const CARD_SELECT = [
  "id", "slug", "name_en", "name_ar", "price", "original_price",
  "stock", "image_url", "avg_rating", "reviews_count", "brand",
  "is_on_promotion", "promotion_label_en", "is_best_seller",
].join(", ");

export async function getProducts(
  filters: ProductFilters = {},
): Promise<PaginatedResponse<ProductCardData>> {
  const supabase = await createClient();

  const page = filters.page ?? 1;
  const limit = filters.limit ?? DEFAULT_LIMIT;
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const emptyMeta = { currentPage: page, totalPages: 0, limit, totalItems: 0 };

  // Resolve category slug → id before building main query
  let categoryId: string | null = null;
  if (filters.category) {
    const { data: cat } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", filters.category)
      .eq("is_active", true)
      .single();

    if (!cat) return { data: [], meta: emptyMeta };
    categoryId = cat.id as string;
  }

  let query = supabase
    .from("products")
    .select(CARD_SELECT, { count: "exact" })
    .eq("is_active", true);

  if (categoryId) query = query.eq("category_id", categoryId);
  if (filters.brand) query = query.eq("brand", filters.brand);
  if (filters.minPrice !== undefined) query = query.gte("price", filters.minPrice);
  if (filters.maxPrice !== undefined) query = query.lte("price", filters.maxPrice);
  if (filters.onSale) query = query.eq("is_on_promotion", true);
  if (filters.prescriptionType) query = query.eq("prescription_type", filters.prescriptionType);
  if (filters.seasonalTag) query = query.eq("seasonal_tag", filters.seasonalTag);
  if (filters.bestSeller) query = query.eq("is_best_seller", true);
  if (filters.trending) query = query.eq("is_trending", true);

  if (filters.q) {
    const escaped = filters.q.replace(/[%_]/g, "\\$&");
    query = query.or(
      `name_en.ilike.%${escaped}%,name_ar.ilike.%${escaped}%,brand.ilike.%${escaped}%`,
    );
  }

  switch (filters.sort) {
    case "price_asc":
      query = query.order("price", { ascending: true });
      break;
    case "price_desc":
      query = query.order("price", { ascending: false });
      break;
    case "rating_desc":
      query = query.order("avg_rating", { ascending: false, nullsFirst: false });
      break;
    case "sold_desc":
      query = query.order("sold_count", { ascending: false });
      break;
    case "trending_desc":
      query = query.order("view_count", { ascending: false });
      break;
    default:
      query = query.order("created_at", { ascending: false });
      break;
  }

  const { data, count, error } = await query.range(from, to);

  if (error) {
    console.error("[getProducts]", error.message);
    return { data: [], meta: emptyMeta };
  }

  const totalItems = count ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalItems / limit));

  return {
    data: (data as ProductCardData[]) ?? [],
    meta: { currentPage: page, totalPages, limit, totalItems },
  };
}

export async function getProductBrands(): Promise<string[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("products")
    .select("brand")
    .eq("is_active", true)
    .not("brand", "is", null);

  if (error) return [];

  const brands = [
    ...new Set(
      (data ?? []).map((p) => p.brand as string).filter(Boolean),
    ),
  ].sort();

  return brands;
}
