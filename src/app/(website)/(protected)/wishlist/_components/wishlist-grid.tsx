"use client";
import Link from "next/link";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WishlistItemCard } from "@/components/shop/wishlist-item-card";
import { EmptyState } from "@/components/shared/empty-state";
import { useWishlist } from "@/hooks/wishlist/use-wishlist";

export function WishlistGrid() {
  const { data: items = [], isLoading, isError } = useWishlist();

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-64 animate-pulse rounded-2xl bg-muted" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <EmptyState
        icon={<Heart className="h-8 w-8" />}
        title="Could not load wishlist"
        description="Please refresh the page and try again."
      />
    );
  }

  if (items.length === 0) {
    return (
      <EmptyState
        icon={<Heart className="h-8 w-8" />}
        title="Your wishlist is empty"
        description="Save items you love and come back to them later."
        action={
          <Button asChild>
            <Link href="/products">Browse Products</Link>
          </Button>
        }
      />
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
      {items.map((item) => (
        <WishlistItemCard key={item.id} item={item} />
      ))}
    </div>
  );
}
