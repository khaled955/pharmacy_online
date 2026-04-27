"use client";
import { useEffect } from "react";
import {
  X,
  Clock,
  MapPin,
  CreditCard,
  Package,
  Loader2,
  AlertCircle,
  FileText,
} from "lucide-react";
import { cn } from "@/lib/utils/tailwind-merge";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useOrderDetail } from "@/hooks/orders/use-order-detail";
import { STATUS_MAP } from "./status-config";

interface OrderDetailDialogProps {
  orderId: string | null;
  onClose: () => void;
}

export function OrderDetailDialog({ orderId, onClose }: OrderDetailDialogProps) {
  const open = !!orderId;
  const { data: order, isLoading, isError, error } = useOrderDetail(orderId);

  useEffect(() => {
    if (!open) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  const statusInfo = order
    ? (STATUS_MAP[order.status] ?? { variant: "muted" as const, label: order.status, icon: Clock })
    : null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Order details"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        className={cn(
          "relative z-10 flex w-full flex-col overflow-hidden",
          "rounded-t-2xl sm:rounded-2xl",
          "bg-card border border-border shadow-2xl",
          "max-h-[92dvh] sm:max-h-[88vh] sm:max-w-2xl",
        )}
      >
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-border px-5 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
              <Package className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Order details</p>
              {order && (
                <p className="font-mono text-sm font-bold text-primary leading-none">
                  {order.order_number}
                </p>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-xl",
              "border border-border bg-muted/50 text-muted-foreground",
              "hover:border-border hover:bg-muted hover:text-foreground",
              "transition-colors",
            )}
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body — scrollable */}
        <div className="flex-1 overflow-y-auto">
          {isLoading && (
            <div className="flex flex-col items-center gap-3 py-20 text-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Loading order details…</p>
            </div>
          )}

          {isError && (
            <div className="flex flex-col items-center gap-3 py-20 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-destructive/10">
                <AlertCircle className="h-7 w-7 text-destructive" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">Failed to load</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {error?.message ?? "Something went wrong"}
                </p>
              </div>
            </div>
          )}

          {!isLoading && !isError && order && (
            <div className="space-y-0">
              {/* Status + Date */}
              <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
                {statusInfo && (
                  <Badge variant={statusInfo.variant} className="gap-1.5">
                    <statusInfo.icon className="h-3 w-3" />
                    {statusInfo.label}
                  </Badge>
                )}
                <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Clock className="h-3.5 w-3.5" />
                  {new Date(order.created_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>

              <Separator />

              {/* Order summary grid */}
              <div className="grid grid-cols-2 gap-4 px-5 py-4 sm:grid-cols-4">
                <div>
                  <p className="text-xs text-muted-foreground">Subtotal</p>
                  <p className="mt-0.5 text-sm font-semibold">${order.subtotal.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Shipping</p>
                  <p className="mt-0.5 text-sm font-semibold">
                    {order.shipping_fee === 0 ? "Free" : `$${order.shipping_fee.toFixed(2)}`}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">
                    <CreditCard className="mb-0.5 me-1 inline h-3 w-3" />
                    Payment
                  </p>
                  <p className="mt-0.5 text-sm font-semibold capitalize">
                    {order.payment_method ?? "—"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Total</p>
                  <p className="mt-0.5 text-sm font-extrabold text-primary">
                    ${order.total_amount.toFixed(2)}
                  </p>
                </div>
              </div>

              {/* Delivery address */}
              {order.city && (
                <>
                  <Separator />
                  <div className="px-5 py-4">
                    <p className="mb-1 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                      <MapPin className="h-3.5 w-3.5" />
                      Delivery address
                    </p>
                    <p className="text-sm text-foreground">
                      {[order.street_address, order.area, order.city]
                        .filter(Boolean)
                        .join(", ")}
                    </p>
                    {order.customer_name && (
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {order.customer_name}
                        {order.customer_phone ? ` · ${order.customer_phone}` : ""}
                      </p>
                    )}
                  </div>
                </>
              )}

              {/* Notes */}
              {order.notes && (
                <>
                  <Separator />
                  <div className="px-5 py-4">
                    <p className="mb-1 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                      <FileText className="h-3.5 w-3.5" />
                      Notes
                    </p>
                    <p className="text-sm text-foreground">{order.notes}</p>
                  </div>
                </>
              )}

              {/* Items list */}
              <Separator />
              <div className="px-5 py-4">
                <p className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Items ({order.order_items.length})
                </p>

                {order.order_items.length === 0 ? (
                  <p className="py-4 text-center text-sm text-muted-foreground">
                    No items found for this order.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {order.order_items.map((item) => (
                      <div
                        key={item.id}
                        className={cn(
                          "flex gap-3 rounded-xl border border-border bg-muted/30 p-3",
                        )}
                      >
                        {/* Product image */}
                        <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-card">
                          {item.product_image_url ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={item.product_image_url}
                              alt={item.product_name_en}
                              className="h-full w-full object-contain p-1"
                              loading="lazy"
                            />
                          ) : (
                            <div className="h-full w-full bg-muted-foreground/10" />
                          )}
                        </div>

                        {/* Product info */}
                        <div className="flex flex-1 flex-col justify-between gap-1 min-w-0">
                          <p className="truncate text-sm font-semibold text-foreground">
                            {item.product_name_en}
                          </p>
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-xs text-muted-foreground">
                              ${item.unit_price.toFixed(2)} × {item.quantity}
                            </span>
                            <span className="text-sm font-bold text-foreground">
                              ${item.line_total.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Total footer */}
              <div className="border-t border-border bg-muted/30 px-5 py-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">Order total</span>
                  <span className="text-lg font-extrabold text-primary">
                    ${order.total_amount.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
