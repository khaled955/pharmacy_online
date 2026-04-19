"use client";
import { useState } from "react";
import { ShoppingCart, Heart, Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils/tailwind-merge";
import { Button } from "@/components/ui/button";
import { useAddToCart } from "@/hooks/cart/use-add-to-cart";
import { useToggleWishlist } from "@/hooks/wishlist/use-toggle-wishlist";
import { useWishlistProductIds } from "@/hooks/wishlist/use-wishlist";

interface ProductActionsProps {
  productId: string;
  stock: number;
}

export function ProductActions({ productId, stock }: ProductActionsProps) {
  const [qty, setQty] = useState(1);
  const { addToCart, addToCartPending } = useAddToCart();
  const { toggleWishlist, toggleWishlistPending } = useToggleWishlist();
  const { data: wishlistIds = [] } = useWishlistProductIds();

  const isWishlisted = wishlistIds.includes(productId);
  const outOfStock = stock === 0;

  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Quantity stepper */}
      <div className="flex items-center overflow-hidden rounded-xl border border-border bg-card">
        <button
          type="button"
          aria-label="Decrease quantity"
          disabled={qty <= 1}
          onClick={() => setQty((q) => Math.max(1, q - 1))}
          className="flex h-11 w-10 items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors disabled:opacity-40"
        >
          <Minus className="h-4 w-4" />
        </button>
        <span className="w-10 text-center text-sm font-semibold text-foreground">{qty}</span>
        <button
          type="button"
          aria-label="Increase quantity"
          disabled={qty >= stock}
          onClick={() => setQty((q) => Math.min(stock, q + 1))}
          className="flex h-11 w-10 items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors disabled:opacity-40"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      {/* Add to cart */}
      <Button
        className="flex-1 bg-gradient-brand hover:opacity-90"
        size="lg"
        disabled={outOfStock || addToCartPending}
        onClick={() => addToCart({ productId, quantity: qty })}
      >
        <ShoppingCart className="h-5 w-5" />
        {addToCartPending ? "Adding…" : outOfStock ? "Out of Stock" : "Add to Cart"}
      </Button>

      {/* Wishlist toggle */}
      <button
        type="button"
        aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        disabled={toggleWishlistPending}
        onClick={() => toggleWishlist({ productId })}
        className={cn(
          "flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-card",
          "transition-all duration-200",
          "hover:border-rose-300 hover:bg-rose-50 hover:text-rose-500",
          "dark:hover:border-rose-800 dark:hover:bg-rose-950/40",
          isWishlisted ? "text-rose-500 border-rose-300 dark:text-rose-400" : "text-muted-foreground",
          toggleWishlistPending && "opacity-60 pointer-events-none",
        )}
      >
        <Heart
          className={cn(
            "h-5 w-5",
            isWishlisted && "fill-rose-500 dark:fill-rose-400",
          )}
        />
      </button>
    </div>
  );
}
