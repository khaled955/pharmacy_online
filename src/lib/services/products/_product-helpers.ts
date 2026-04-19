import "server-only";
import type { ProductCardData } from "@/lib/types/product";

export const PRODUCT_CARD_SELECT = [
  "id",
  "slug",
  "name_en",
  "name_ar",
  "price",
  "original_price",
  "stock",
  "image_url",
  "avg_rating",
  "reviews_count",
  "brand",
  "is_on_promotion",
  "promotion_label_en",
  "is_best_seller",
].join(", ");

export function mapProductCardRow(row: ProductCardData): ProductCardData {
  return {
    id: row.id,
    slug: row.slug,
    name_en: row.name_en,
    name_ar: row.name_ar,
    price: row.price,
    original_price: row.original_price,
    stock: row.stock,
    image_url: row.image_url,
    avg_rating: row.avg_rating,
    reviews_count: row.reviews_count,
    brand: row.brand,
    is_on_promotion: row.is_on_promotion,
    promotion_label_en: row.promotion_label_en,
    is_best_seller: row.is_best_seller,
  };
}

/** Throws a descriptive error if Supabase returned an error object. */
export function throwOnDbError(
  error: { message: string } | null,
  context: string,
): void {
  if (error) {
    throw new Error(`[${context}] ${error.message}`);
  }
}
