import type { ProductCardData } from "@/lib/types/product";
import type { ProductCardProps } from "@/components/shared/product-card";

export function toProductCardProps(product: ProductCardData): ProductCardProps {
  const badge =
    product.promotion_label_en ??
    (product.is_best_seller ? "Best Seller" : undefined);

  return {
    id: product.id,
    slug: product.slug,
    name: product.name_en,
    brand: product.brand ?? undefined,
    price: product.price,
    originalPrice: product.original_price ?? undefined,
    rating: product.avg_rating ?? undefined,
    reviewCount: product.reviews_count ?? undefined,
    imageUrl: product.image_url ?? undefined,
    inStock: product.stock > 0,
    badge,
  };
}
