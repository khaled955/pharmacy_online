"use client";
import { ProductCard, type ProductCardProps } from "@/components/shared/product-card";
import { useAddToCart } from "@/hooks/cart/use-add-to-cart";
import { useToggleWishlist } from "@/hooks/wishlist/use-toggle-wishlist";
import { useWishlistProductIds } from "@/hooks/wishlist/use-wishlist";

type InteractiveProductCardProps = Omit<
  ProductCardProps,
  "onAddToCart" | "onWishlist" | "isWishlisted"
>;

export function InteractiveProductCard(props: InteractiveProductCardProps) {
  const { addToCart } = useAddToCart();
  const { toggleWishlist } = useToggleWishlist();
  const { data: wishlistIds = [] } = useWishlistProductIds();

  return (
    <ProductCard
      {...props}
      isWishlisted={wishlistIds.includes(props.id)}
      onAddToCart={(id) => addToCart({ productId: id, quantity: 1 })}
      onWishlist={(id) => toggleWishlist({ productId: id })}
    />
  );
}
