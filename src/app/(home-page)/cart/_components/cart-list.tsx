"use client";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CartItemCard } from "@/components/shop/cart-item-card";
import { OrderSummary } from "@/components/shop/order-summary";
import { EmptyState } from "@/components/shared/empty-state";
import { useCart } from "@/hooks/cart/use-cart";
import { Skeleton } from "@/components/ui/skeleton";

export function CartList() {
  const { data: items = [], isLoading, isError } = useCart();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-28 animate-pulse rounded-2xl bg-muted" />
          ))}
        </div>
        <div className="h-64 animate-pulse rounded-2xl bg-muted" />
      </div>
    );
  }

  if (isError) {
    return (
      <EmptyState
        icon={<ShoppingCart className="h-8 w-8" />}
        title="Could not load cart"
        description="Please refresh the page and try again."
      />
    );
  }

  if (items.length === 0) {
    return (
      <EmptyState
        icon={<ShoppingCart className="h-8 w-8" />}
        title="Your cart is empty"
        description="Browse our products and add items to your cart."
        action={
          <Button asChild>
            <Link href="/products">Browse Products</Link>
          </Button>
        }
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
      {/* Items */}
      <div className="space-y-3">
        {items.map((item) => (
          <CartItemCard key={item.id} item={item} />
        ))}
      </div>

      {/* Summary + Checkout */}
      <div className="space-y-3">
        <OrderSummary items={items} />
        <Button className="w-full bg-gradient-brand hover:opacity-90" size="lg" asChild>
          <Link href="/checkout">Proceed to Checkout</Link>
        </Button>
        <Button variant="outline" className="w-full" asChild>
          <Link href="/products">Continue Shopping</Link>
        </Button>
      </div>
    </div>
  );
}
