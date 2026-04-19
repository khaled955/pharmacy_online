"use client";

import * as React from "react";
import Link from "next/link";
import { ShoppingCart, Heart, Star } from "lucide-react";
import { cn } from "@/lib/utils/tailwind-merge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export interface ProductCardProps {
  id: string;
  slug: string;
  name: string;
  brand?: string;
  price: number;
  originalPrice?: number;
  currency?: string;
  rating?: number;
  reviewCount?: number;
  /** Relative URL or absolute URL for the product image */
  imageUrl?: string;
  inStock?: boolean;
  /** e.g. "20% OFF" */
  badge?: string;
  className?: string;
  /** Called when the user presses Add to Cart */
  onAddToCart?: (id: string) => void;
  /** Called when the user presses the wishlist button */
  onWishlist?: (id: string) => void;
  isWishlisted?: boolean;
}

function StarRow({ rating, count }: { rating: number; count?: number }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={cn(
              "h-3 w-3",
              i < Math.round(rating)
                ? "fill-amber-400 text-amber-400"
                : "fill-muted text-muted-foreground/30",
            )}
          />
        ))}
      </div>
      {count !== undefined && (
        <span className="text-xs text-muted-foreground">({count})</span>
      )}
    </div>
  );
}

export function ProductCard({
  id,
  slug,
  name,
  brand,
  price,
  originalPrice,
  currency = "$",
  rating,
  reviewCount,
  imageUrl,
  inStock = true,
  badge,
  className,
  onAddToCart,
  onWishlist,
  isWishlisted = false,
}: ProductCardProps) {
  const discountPercent =
    originalPrice && originalPrice > price
      ? Math.round(((originalPrice - price) / originalPrice) * 100)
      : null;

  return (
    <article
      className={cn(
        "group relative flex flex-col overflow-hidden",
        "rounded-2xl border border-border bg-card",
        "shadow-card transition-all duration-300 ease-out",
        "hover:-translate-y-0.5 hover:shadow-card-hover hover:border-primary/20",
        className,
      )}
    >
      {/* Wishlist button */}
      <button
        type="button"
        aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        onClick={() => onWishlist?.(id)}
        className={cn(
          "absolute end-3 top-3 z-10",
          "flex h-8 w-8 items-center justify-center rounded-full",
          "border border-border bg-card/90 backdrop-blur-sm",
          "transition-all duration-200",
          "hover:border-rose-300 hover:bg-rose-50 hover:text-rose-500",
          "dark:hover:border-rose-800 dark:hover:bg-rose-950/40",
          isWishlisted
            ? "text-rose-500 dark:text-rose-400"
            : "text-muted-foreground",
        )}
      >
        <Heart
          className={cn(
            "h-4 w-4",
            isWishlisted && "fill-rose-500 dark:fill-rose-400",
          )}
        />
      </button>

      {/* Discount badge */}
      {discountPercent && (
        <div className="absolute start-3 top-3 z-10">
          <Badge variant="sale">-{discountPercent}%</Badge>
        </div>
      )}

      {/* Image */}
      <Link href={`/products/${slug}`} tabIndex={-1} aria-hidden="true">
        <div
          className={cn(
            "relative mx-3 mt-3 flex h-44 items-center justify-center overflow-hidden rounded-xl",
            "bg-gradient-to-br from-muted/60 to-muted",
            "transition-transform duration-300 group-hover:scale-[1.02]",
          )}
        >
          {imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={imageUrl}
              alt={name}
              className="h-full w-full object-contain p-3"
              loading="lazy"
            />
          ) : (
            <div className="flex flex-col items-center gap-2 text-muted-foreground/40">
              <div className="h-16 w-16 rounded-xl bg-muted-foreground/10" />
              <span className="text-xs">No image</span>
            </div>
          )}
        </div>
      </Link>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-2 p-3 pt-2.5">
        {/* Brand */}
        {brand && (
          <span className="text-[11px] font-semibold uppercase tracking-wider text-primary/70">
            {brand}
          </span>
        )}

        {/* Name */}
        <Link
          href={`/products/${slug}`}
          className={cn(
            "line-clamp-2 text-sm font-semibold leading-snug text-foreground",
            "hover:text-primary transition-colors",
          )}
        >
          {name}
        </Link>

        {/* Rating */}
        {rating !== undefined && (
          <StarRow rating={rating} count={reviewCount} />
        )}

        {/* Badge label */}
        {badge && (
          <Badge variant="info" className="w-fit">
            {badge}
          </Badge>
        )}

        {/* Price row */}
        <div className="mt-auto flex items-center justify-between pt-1">
          <div className="flex items-baseline gap-1.5">
            <span className="text-base font-bold text-foreground">
              {currency}
              {price.toFixed(2)}
            </span>
            {originalPrice && originalPrice > price && (
              <span className="text-xs text-muted-foreground line-through">
                {currency}
                {originalPrice.toFixed(2)}
              </span>
            )}
          </div>

          {inStock ? (
            <Button
              size="sm"
              onClick={() => onAddToCart?.(id)}
              className="h-8 gap-1.5 rounded-xl px-3 text-xs"
            >
              <ShoppingCart className="h-3.5 w-3.5" />
              Add
            </Button>
          ) : (
            <span className="text-xs font-medium text-muted-foreground">
              Out of stock
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
