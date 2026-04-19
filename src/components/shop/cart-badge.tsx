"use client";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils/tailwind-merge";
import { useCartCount } from "@/hooks/cart/use-cart";

export function CartBadge({ className }: { className?: string }) {
  const { data: count = 0 } = useCartCount();

  return (
    <Link
      href="/cart"
      aria-label={`Cart (${count} items)`}
      className={cn(
        "relative flex h-9 w-9 items-center justify-center rounded-xl",
        "border border-border bg-card text-muted-foreground",
        "shadow-sm transition-all duration-200",
        "hover:border-primary/30 hover:bg-primary/5 hover:text-primary",
        className,
      )}
    >
      <ShoppingCart className="h-4 w-4" />
      {count > 0 && (
        <span
          className={cn(
            "absolute -end-1 -top-1 flex h-4 w-4 items-center justify-center",
            "rounded-full bg-primary text-[10px] font-bold text-primary-foreground",
          )}
        >
          {count > 99 ? "99+" : count}
        </span>
      )}
    </Link>
  );
}
