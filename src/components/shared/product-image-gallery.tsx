"use client";

import * as React from "react";
import { cn } from "@/lib/utils/tailwind-merge";
import { Badge } from "@/components/ui/badge";
import { Heart } from "lucide-react";

interface ProductImageGalleryProps {
  imageUrl: string | null;
  images: string[] | null;
  productName: string;
  discountPercent: number | null;
}

export function ProductImageGallery({
  imageUrl,
  images,
  productName,
  discountPercent,
}: ProductImageGalleryProps) {
  const allImages = React.useMemo(() => {
    if (images && images.length > 0) return images;
    if (imageUrl) return [imageUrl];
    return [];
  }, [images, imageUrl]);

  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const current = allImages[selectedIndex] ?? null;

  return (
    <div className="space-y-3">
      {/* Main image */}
      <div
        className={cn(
          "relative flex h-96 items-center justify-center overflow-hidden rounded-2xl",
          "border border-border bg-gradient-to-br from-muted/60 to-muted",
        )}
      >
        {discountPercent !== null && (
          <div className="absolute start-4 top-4 z-10">
            <Badge variant="sale" className="text-sm px-2.5 py-1">
              -{discountPercent}%
            </Badge>
          </div>
        )}

        {current ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={current}
            alt={productName}
            className="h-full w-full object-contain p-6"
          />
        ) : (
          <div className="flex flex-col items-center gap-3 text-muted-foreground/30">
            <div className="h-32 w-32 rounded-2xl bg-muted-foreground/10" />
            <span className="text-sm">No image</span>
          </div>
        )}

        {/* Wishlist */}
        <button
          type="button"
          aria-label="Add to wishlist"
          className={cn(
            "absolute end-4 top-4 flex h-9 w-9 items-center justify-center rounded-full",
            "border border-border bg-card/90 backdrop-blur-sm",
            "text-muted-foreground transition-all hover:border-rose-300 hover:text-rose-500",
          )}
        >
          <Heart className="h-4 w-4" />
        </button>
      </div>

      {/* Thumbnails */}
      {allImages.length > 1 && (
        <div className="flex gap-2">
          {allImages.map((src, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setSelectedIndex(i)}
              className={cn(
                "flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl",
                "border-2 bg-muted transition-colors",
                i === selectedIndex
                  ? "border-primary"
                  : "border-border hover:border-primary/40",
              )}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt={`${productName} view ${i + 1}`}
                className="h-full w-full object-contain p-1"
              />
            </button>
          ))}
        </div>
      )}

      {/* Placeholder thumbnails when no images but need visual rows */}
      {allImages.length === 0 && (
        <div className="flex gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className={cn(
                "flex h-16 w-16 items-center justify-center overflow-hidden rounded-xl",
                "border-2 border-border bg-muted",
                i === 0 && "border-primary",
              )}
            >
              <div className="h-10 w-10 rounded-lg bg-muted-foreground/10" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
