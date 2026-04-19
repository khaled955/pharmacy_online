"use client";
import { Minus, Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils/tailwind-merge";
import { Button } from "@/components/ui/button";
import { useUpdateCartItem } from "@/hooks/cart/use-update-cart-item";
import { useRemoveFromCart } from "@/hooks/cart/use-remove-from-cart";
import type { CartItemRow } from "@/lib/types/order";

interface CartItemCardProps {
  item: CartItemRow;
}

export function CartItemCard({ item }: CartItemCardProps) {
  const { updateCartItem, updateCartItemPending } = useUpdateCartItem();
  const { removeFromCart, removeFromCartPending } = useRemoveFromCart();

  const product = item.products;
  if (!product) return null;

  const isBusy = updateCartItemPending || removeFromCartPending;
  const lineTotal = product.price * item.quantity;

  return (
    <div
      className={cn(
        "flex gap-3 rounded-2xl border border-border bg-card p-3",
        "shadow-sm transition-opacity",
        isBusy && "opacity-60 pointer-events-none",
      )}
    >
      {/* Image */}
      <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-muted">
        {product.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.image_url}
            alt={product.name_en}
            className="h-full w-full object-contain p-1"
            loading="lazy"
          />
        ) : (
          <div className="h-full w-full bg-muted-foreground/10" />
        )}
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col gap-1 min-w-0">
        <p className="truncate text-sm font-semibold text-foreground">{product.name_en}</p>
        {product.brand && (
          <span className="text-[11px] font-medium uppercase tracking-wide text-primary/70">
            {product.brand}
          </span>
        )}

        <div className="mt-auto flex items-center justify-between gap-2">
          {/* Quantity stepper */}
          <div className="flex items-center overflow-hidden rounded-lg border border-border">
            <button
              type="button"
              aria-label="Decrease quantity"
              onClick={() => {
                if (item.quantity <= 1) {
                  removeFromCart({ cartItemId: item.id });
                } else {
                  updateCartItem({ cartItemId: item.id, quantity: item.quantity - 1 });
                }
              }}
              className="flex h-7 w-7 items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              <Minus className="h-3 w-3" />
            </button>
            <span className="w-8 text-center text-xs font-semibold text-foreground">
              {item.quantity}
            </span>
            <button
              type="button"
              aria-label="Increase quantity"
              onClick={() =>
                updateCartItem({ cartItemId: item.id, quantity: item.quantity + 1 })
              }
              disabled={product.stock <= item.quantity}
              className="flex h-7 w-7 items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors disabled:opacity-40"
            >
              <Plus className="h-3 w-3" />
            </button>
          </div>

          {/* Line total */}
          <span className="text-sm font-bold text-foreground">${lineTotal.toFixed(2)}</span>

          {/* Remove */}
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-muted-foreground hover:text-destructive"
            onClick={() => removeFromCart({ cartItemId: item.id })}
            aria-label="Remove item"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
