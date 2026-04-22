"use client";

// [NEW] ShelfDrawerPanel — animated panel that slides open below the shelf grid
// [SAFE] Uses existing /api/products route and InteractiveProductCard; no existing logic changed
// [WARNING] Fetches products on open via /api/products — keep category limit <= 12

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { X, ArrowRight, Loader2, ShoppingCart, Star } from "lucide-react";
import { cn } from "@/lib/utils/tailwind-merge";
import type { CategoryRow, ProductCardData } from "@/lib/types/product";
import { CATEGORY_VISUAL, DEFAULT_VISUAL } from "./category-visuals";
import { ProductFlyToCart } from "./product-fly-to-cart";
import { useAddToCart } from "@/hooks/cart/use-add-to-cart";
import { useWishlistProductIds } from "@/hooks/wishlist/use-wishlist";
import { useToggleWishlist } from "@/hooks/wishlist/use-toggle-wishlist";
import { Heart } from "lucide-react";

interface ShelfDrawerPanelProps {
  category: CategoryRow;
  onClose: () => void;
}

/* ─── Mini product card styled for the drawer ───────────────────── */
function DrawerProductCard({ product }: { product: ProductCardData }) {
  const { addToCart } = useAddToCart();
  const { toggleWishlist } = useToggleWishlist();
  const { data: wishlistIds = [] } = useWishlistProductIds();
  const isWishlisted = wishlistIds.includes(product.id);

  const discount =
    product.original_price && product.original_price > product.price
      ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
      : null;

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={cn(
        "group relative flex flex-col overflow-hidden",
        "rounded-2xl border border-border bg-card",
        "shadow-card hover:shadow-card-hover hover:border-primary/20",
        "transition-all duration-200",
      )}
    >
      {/* Wishlist */}
      <button
        type="button"
        aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        onClick={() => toggleWishlist({ productId: product.id })}
        className={cn(
          "absolute end-2 top-2 z-10",
          "flex h-7 w-7 items-center justify-center rounded-full",
          "border border-border bg-card/90 backdrop-blur-sm",
          "hover:border-rose-300 hover:bg-rose-50 hover:text-rose-500",
          "transition-all duration-200",
          isWishlisted ? "text-rose-500" : "text-muted-foreground",
        )}
      >
        <Heart className={cn("h-3.5 w-3.5", isWishlisted && "fill-rose-500")} />
      </button>

      {/* Discount badge */}
      {discount && (
        <div className="absolute start-2 top-2 z-10 rounded-lg bg-rose-500 px-1.5 py-0.5 text-[10px] font-bold text-white">
          -{discount}%
        </div>
      )}

      {/* Image */}
      <Link href={`/products/${product.slug}`} tabIndex={-1} aria-hidden="true">
        <div className="relative mx-2.5 mt-2.5 flex h-32 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-muted/60 to-muted transition-transform duration-300 group-hover:scale-[1.02]">
          {product.image_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={product.image_url}
              alt={product.name_en}
              className="h-full w-full object-contain p-2"
              loading="lazy"
            />
          ) : (
            <ShoppingCart className="h-10 w-10 text-muted-foreground/20" />
          )}
        </div>
      </Link>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-1.5 p-2.5">
        {product.brand && (
          <span className="text-[10px] font-semibold uppercase tracking-wider text-primary/70">
            {product.brand}
          </span>
        )}

        <Link
          href={`/products/${product.slug}`}
          className="line-clamp-2 text-xs font-semibold leading-snug text-foreground hover:text-primary transition-colors"
        >
          {product.name_en}
        </Link>

        {/* Rating */}
        {product.avg_rating && (
          <div className="flex items-center gap-1">
            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
            <span className="text-[10px] text-muted-foreground">
              {product.avg_rating.toFixed(1)}
              {product.reviews_count ? ` (${product.reviews_count})` : ""}
            </span>
          </div>
        )}

        {/* Price + add to cart */}
        <div className="mt-auto flex items-center justify-between pt-1">
          <div className="flex flex-col">
            <span className="text-sm font-bold text-foreground">
              ${product.price.toFixed(2)}
            </span>
            {product.original_price && product.original_price > product.price && (
              <span className="text-[10px] text-muted-foreground line-through">
                ${product.original_price.toFixed(2)}
              </span>
            )}
          </div>

          {product.stock > 0 ? (
            // [NEW] Fly-to-cart animation wrapper instead of plain Button
            <ProductFlyToCart
              onAddToCart={() => addToCart({ productId: product.id, quantity: 1 })}
            />
          ) : (
            <span className="text-[10px] font-medium text-muted-foreground">
              Out of stock
            </span>
          )}
        </div>
      </div>
    </motion.article>
  );
}

/* ─── Main drawer panel ─────────────────────────────────────────── */
export function ShelfDrawerPanel({ category, onClose }: ShelfDrawerPanelProps) {
  const visual = CATEGORY_VISUAL[category.slug] ?? DEFAULT_VISUAL;
  const Icon = visual.icon;

  const [products, setProducts] = useState<ProductCardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // [SAFE] Fetches from new /api/products route; no existing routes affected
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(false);

    fetch(`/api/products?category=${encodeURIComponent(category.slug)}&limit=8`)
      .then((r) => r.json())
      .then((json) => {
        if (!cancelled) {
          setProducts((json.data as ProductCardData[]) ?? []);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setError(true);
          setLoading(false);
        }
      });

    return () => { cancelled = true; };
  }, [category.slug]);

  return (
    // [NEW] Animated drawer panel — slides down with ease-in-out
    <motion.div
      key={category.slug}
      initial={{ opacity: 0, height: 0, marginTop: 0 }}
      animate={{ opacity: 1, height: "auto", marginTop: 16 }}
      exit={{ opacity: 0, height: 0, marginTop: 0 }}
      transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
      className="overflow-hidden"
    >
      <div
        className={cn(
          "rounded-2xl border border-border bg-card shadow-card",
          "overflow-hidden",
        )}
      >
        {/* Drawer header */}
        <div
          className={cn(
            "flex items-center justify-between px-4 py-3",
            "bg-gradient-to-r",
            visual.accent,
            "border-b border-border/60",
          )}
        >
          <div className="flex items-center gap-2.5">
            <div className={cn("flex h-9 w-9 items-center justify-center rounded-xl", visual.bgColor)}>
              <Icon className={cn("h-5 w-5", visual.color)} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground">{category.name_en}</h3>
              <p className="text-xs text-muted-foreground">
                {loading ? "Loading products…" : `${products.length} products`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* View all link */}
            <Link
              href={`/products?category=${category.slug}`}
              className={cn(
                "flex items-center gap-1 rounded-xl border border-border bg-card px-3 py-1.5",
                "text-xs font-semibold text-foreground",
                "hover:border-primary/30 hover:text-primary transition-colors",
              )}
            >
              View All
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>

            {/* Close button */}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close drawer"
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-xl border border-border bg-card",
                "text-muted-foreground hover:text-foreground hover:bg-muted",
                "transition-colors",
              )}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Drawer body */}
        <div className="p-4">
          {loading && (
            <div className="flex items-center justify-center py-10">
              <Loader2 className={cn("h-6 w-6 animate-spin", visual.color)} />
            </div>
          )}

          {error && !loading && (
            <p className="py-8 text-center text-sm text-muted-foreground">
              Failed to load products.{" "}
              <Link href={`/products?category=${category.slug}`} className="text-primary underline">
                Browse category instead
              </Link>
            </p>
          )}

          {!loading && !error && products.length === 0 && (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No products found in this category yet.
            </p>
          )}

          {!loading && !error && products.length > 0 && (
            <>
              {/* [NEW] Product grid inside the drawer */}
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4">
                {products.map((product) => (
                  <DrawerProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Continue shopping suggestion */}
              <div className={cn(
                "mt-4 flex items-center justify-between rounded-xl border border-dashed border-border px-4 py-3",
                "bg-muted/30",
              )}>
                <p className="text-xs text-muted-foreground">
                  ✨ Explore more in{" "}
                  <span className="font-semibold text-foreground">{category.name_en}</span>
                </p>
                <Link
                  href={`/products?category=${category.slug}`}
                  className={cn(
                    "flex items-center gap-1 text-xs font-semibold",
                    visual.color,
                    "hover:underline",
                  )}
                >
                  See all <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}
