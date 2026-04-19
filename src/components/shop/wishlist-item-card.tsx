"use client";
import Link from "next/link";
import { ShoppingCart, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils/tailwind-merge";
import { Button } from "@/components/ui/button";
import { useToggleWishlist } from "@/hooks/wishlist/use-toggle-wishlist";
import { useAddToCart } from "@/hooks/cart/use-add-to-cart";
import type { WishlistItemRow } from "@/lib/types/order";

interface WishlistItemCardProps {
  item: WishlistItemRow;
}

export function WishlistItemCard({ item }: WishlistItemCardProps) {
  const { toggleWishlist, toggleWishlistPending } = useToggleWishlist();
  const { addToCart, addToCartPending } = useAddToCart();

  const product = item.products;
  if (!product) return null;

  const isBusy = toggleWishlistPending || addToCartPending;

  return (
    <div
      className={cn(
        "group relative flex flex-col overflow-hidden",
        "rounded-2xl border border-border bg-card",
        "shadow-sm transition-all duration-300",
        "hover:-translate-y-0.5 hover:shadow-md hover:border-primary/20",
        isBusy && "opacity-60 pointer-events-none",
      )}
    >
      {/* Remove button */}
      <button
        type="button"
        aria-label="Remove from wishlist"
        onClick={() => toggleWishlist({ productId: item.product_id })}
        className={cn(
          "absolute end-2 top-2 z-10",
          "flex h-7 w-7 items-center justify-center rounded-full",
          "border border-border bg-card/90 backdrop-blur-sm",
          "text-muted-foreground transition-all duration-200",
          "hover:border-rose-300 hover:bg-rose-50 hover:text-rose-500",
          "dark:hover:border-rose-800 dark:hover:bg-rose-950/40",
        )}
      >
        <Trash2 className="h-3.5 w-3.5" />
      </button>

      {/* Image */}
      <Link href={`/products/${product.slug}`} tabIndex={-1} aria-hidden="true">
        <div className="mx-3 mt-3 flex h-36 items-center justify-center overflow-hidden rounded-xl bg-muted/50">
          {product.image_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={product.image_url}
              alt={product.name_en}
              className="h-full w-full object-contain p-2"
              loading="lazy"
            />
          ) : (
            <div className="h-12 w-12 rounded-xl bg-muted-foreground/10" />
          )}
        </div>
      </Link>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-2 p-3 pt-2">
        {product.brand && (
          <span className="text-[11px] font-semibold uppercase tracking-wider text-primary/70">
            {product.brand}
          </span>
        )}
        <Link
          href={`/products/${product.slug}`}
          className="line-clamp-2 text-sm font-semibold leading-snug text-foreground hover:text-primary transition-colors"
        >
          {product.name_en}
        </Link>

        <div className="mt-auto flex items-center justify-between gap-2 pt-1">
          <span className="text-base font-bold text-foreground">
            ${product.price.toFixed(2)}
          </span>
          <Button
            size="sm"
            className="h-8 gap-1.5 rounded-xl px-3 text-xs"
            disabled={product.stock === 0}
            onClick={() => addToCart({ productId: item.product_id, quantity: 1 })}
          >
            <ShoppingCart className="h-3.5 w-3.5" />
            {product.stock === 0 ? "Out of stock" : "Add"}
          </Button>
        </div>
      </div>
    </div>
  );
}
