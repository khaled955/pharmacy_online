"use client";
import { useQuery } from "@tanstack/react-query";
import { X, Package, MapPin, CreditCard, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { QUERY_KEYS } from "@/lib/constants/shop";
import type { AdminOrderDetail } from "@/lib/types/dashboard";
import type { OrderStatus } from "@/lib/types/order";
import { cn } from "@/lib/utils/tailwind-merge";

type BadgeVariant = React.ComponentProps<typeof Badge>["variant"];

const STATUS_MAP: Record<OrderStatus, { label: string; variant: BadgeVariant }> = {
  pending: { label: "Pending", variant: "warning" },
  confirmed: { label: "Confirmed", variant: "info" },
  ready: { label: "Ready", variant: "success" },
  cancelled: { label: "Cancelled", variant: "destructive" },
};

type Props = {
  orderId: string;
  onClose: () => void;
};

function OrderDetailSkeleton() {
  return (
    <div className="space-y-5 p-6">
      <Skeleton className="h-6 w-48" />
      <Skeleton className="h-4 w-32" />
      <Separator />
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex items-center gap-3">
          <Skeleton className="h-12 w-12 rounded-xl" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-3.5 w-40" />
            <Skeleton className="h-3 w-24" />
          </div>
          <Skeleton className="h-4 w-16" />
        </div>
      ))}
      <Separator />
      <Skeleton className="h-20 w-full rounded-xl" />
    </div>
  );
}

export function OrderDetailsSheet({ orderId, onClose }: Props) {
  const { data: order, isLoading } = useQuery<AdminOrderDetail>({
    queryKey: QUERY_KEYS.ADMIN_ORDER(orderId),
    queryFn: async () => {
      const res = await fetch(`/api/admin/orders/${orderId}`);
      if (!res.ok) throw new Error("Failed to fetch order details");
      return res.json();
    },
    staleTime: 1000 * 60 * 5,
  });

  const statusInfo = order ? STATUS_MAP[order.status] : null;
  const address = order
    ? [order.city, order.area, order.street_address].filter(Boolean).join(", ")
    : null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />

      {/* Panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Order Details"
        className={cn(
          "fixed inset-0 z-50 flex items-center justify-center p-4",
          "pointer-events-none",
        )}
      >
        <div
          className={cn(
            "pointer-events-auto relative w-full max-w-2xl",
            "max-h-[90vh] overflow-y-auto",
            "rounded-2xl border border-border bg-card shadow-2xl",
            "animate-in fade-in zoom-in-95 duration-200",
          )}
        >
          {/* Header */}
          <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-border bg-card/95 p-5 backdrop-blur-sm">
            <div>
              {isLoading ? (
                <>
                  <Skeleton className="mb-2 h-5 w-40" />
                  <Skeleton className="h-4 w-24" />
                </>
              ) : order ? (
                <>
                  <p className="font-mono text-sm font-bold text-primary">
                    {order.order_number}
                  </p>
                  <div className="mt-1 flex items-center gap-2">
                    {statusInfo && (
                      <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
                    )}
                    <span className="text-xs text-muted-foreground">
                      {new Date(order.created_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </>
              ) : (
                <p className="text-sm text-muted-foreground">Order not found</p>
              )}
            </div>
            <Button size="icon" variant="ghost" onClick={onClose} aria-label="Close">
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Content */}
          {isLoading ? (
            <OrderDetailSkeleton />
          ) : order ? (
            <div className="space-y-6 p-5">
              {/* Customer info */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                    <Package className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Customer
                    </p>
                    <p className="mt-0.5 text-sm font-medium text-foreground">
                      {order.customer_name ?? "—"}
                    </p>
                    {order.customer_phone && (
                      <p className="text-xs text-muted-foreground">
                        {order.customer_phone}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                    <MapPin className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Delivery Address
                    </p>
                    <p className="mt-0.5 text-sm text-foreground">
                      {address || "—"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                    <CreditCard className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Payment
                    </p>
                    <p className="mt-0.5 text-sm capitalize text-foreground">
                      {order.payment_method ?? "—"}
                    </p>
                  </div>
                </div>

                {order.notes && (
                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                      <FileText className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Notes
                      </p>
                      <p className="mt-0.5 text-sm text-foreground">{order.notes}</p>
                    </div>
                  </div>
                )}
              </div>

              <Separator />

              {/* Items */}
              <div>
                <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Items ({order.order_items.length})
                </p>
                <div className="space-y-3">
                  {order.order_items.map((item) => (
                    <div key={item.id} className="flex items-center gap-3">
                      {item.product_image_url ? (
                        <img
                          src={item.product_image_url}
                          alt={item.product_name_en}
                          className="h-12 w-12 rounded-xl object-cover"
                        />
                      ) : (
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-muted">
                          <Package className="h-5 w-5 text-muted-foreground" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="truncate text-sm font-medium text-foreground">
                          {item.product_name_en}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {item.quantity} × ${item.unit_price.toFixed(2)}
                        </p>
                      </div>
                      <p className="shrink-0 text-sm font-semibold text-foreground">
                        ${item.line_total.toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Pricing */}
              <div className="space-y-2 rounded-2xl bg-muted/40 p-4 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span>${order.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Shipping</span>
                  <span>
                    {order.shipping_fee === 0 ? (
                      <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                        Free
                      </span>
                    ) : (
                      `$${order.shipping_fee.toFixed(2)}`
                    )}
                  </span>
                </div>
                {order.discount_amount > 0 && (
                  <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                    <span>Discount</span>
                    <span>−${order.discount_amount.toFixed(2)}</span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between font-extrabold text-foreground">
                  <span>Total</span>
                  <span>${order.total_amount.toFixed(2)}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-sm text-muted-foreground">
              Could not load order details.
            </div>
          )}
        </div>
      </div>
    </>
  );
}
