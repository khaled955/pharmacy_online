import { cn } from "@/lib/utils/tailwind-merge";
import { Separator } from "@/components/ui/separator";
import { SHIPPING_FEE, FREE_SHIPPING_THRESHOLD } from "@/lib/constants/shop";
import type { CartItemRow } from "@/lib/types/order";

interface OrderSummaryProps {
  items: CartItemRow[];
  className?: string;
}

export function OrderSummary({ items, className }: OrderSummaryProps) {
  const subtotal = items.reduce(
    (sum, item) => sum + (item.products?.price ?? 0) * item.quantity,
    0,
  );
  const shippingFee = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  const total = subtotal + shippingFee;

  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-card p-5 space-y-3 shadow-sm",
        className,
      )}
    >
      <h3 className="text-sm font-bold text-foreground">Order Summary</h3>

      <div className="space-y-2 text-sm">
        {items.map((item) => (
          <div key={item.id} className="flex justify-between gap-2">
            <span className="text-muted-foreground truncate flex-1">
              {item.products?.name_en ?? "Product"}{" "}
              <span className="text-xs">× {item.quantity}</span>
            </span>
            <span className="font-medium text-foreground shrink-0">
              ${((item.products?.price ?? 0) * item.quantity).toFixed(2)}
            </span>
          </div>
        ))}
      </div>

      <Separator />

      <div className="space-y-1.5 text-sm">
        <div className="flex justify-between text-muted-foreground">
          <span>Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-muted-foreground">
          <span>Shipping</span>
          <span>
            {shippingFee === 0 ? (
              <span className="text-emerald-600 dark:text-emerald-400 font-medium">Free</span>
            ) : (
              `$${shippingFee.toFixed(2)}`
            )}
          </span>
        </div>
        {subtotal < FREE_SHIPPING_THRESHOLD && (
          <p className="text-[11px] text-muted-foreground">
            Add ${(FREE_SHIPPING_THRESHOLD - subtotal).toFixed(2)} more for free shipping
          </p>
        )}
      </div>

      <Separator />

      <div className="flex justify-between text-base font-bold text-foreground">
        <span>Total</span>
        <span>${total.toFixed(2)}</span>
      </div>
    </div>
  );
}
