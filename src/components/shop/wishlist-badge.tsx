"use client";
import Link from "next/link";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils/tailwind-merge";
import { useWishlistCount } from "@/hooks/wishlist/use-wishlist";

export function WishlistBadge({ className }: { className?: string }) {
  const { data: count = 0 } = useWishlistCount();

  return (
    <Link
      href="/wishlist"
      aria-label={`Wishlist (${count} items)`}
      className={cn(
        "relative hidden sm:flex h-9 w-9 items-center justify-center rounded-xl",
        "border border-border bg-card text-muted-foreground",
        "shadow-sm transition-all duration-200",
        "hover:border-primary/30 hover:bg-primary/5 hover:text-primary",
        className,
      )}
    >
      <Heart className="h-4 w-4" />
      {count > 0 && (
        <span
          className={cn(
            "absolute -end-1 -top-1 flex h-4 w-4 items-center justify-center",
            "rounded-full bg-rose-500 text-[10px] font-bold text-white",
          )}
        >
          {count > 99 ? "99+" : count}
        </span>
      )}
    </Link>
  );
}
