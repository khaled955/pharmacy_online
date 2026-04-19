"use client";
import { CheckCircle, MessageCircle, Package } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils/tailwind-merge";
import { Button } from "@/components/ui/button";
import { buildAdminWhatsAppUrl } from "@/lib/notifications/order-messages";
import type { OrderRow } from "@/lib/types/order";

interface OrderSuccessMessageProps {
  order: OrderRow;
  adminWhatsAppUrl?: string;
}

export function OrderSuccessMessage({ order, adminWhatsAppUrl }: OrderSuccessMessageProps) {
  const addressLine = [order.city, order.area, order.street_address]
    .filter(Boolean)
    .join(", ");

  return (
    <div className="flex flex-col items-center gap-6 py-10 text-center">
      {/* Success icon */}
      <div
        className={cn(
          "flex h-20 w-20 items-center justify-center rounded-full",
          "bg-emerald-100 dark:bg-emerald-950",
        )}
      >
        <CheckCircle className="h-10 w-10 text-emerald-600 dark:text-emerald-400" />
      </div>

      <div className="space-y-1.5">
        <h2 className="text-2xl font-extrabold text-foreground">Order Placed! 🎉</h2>
        <p className="text-sm text-muted-foreground">
          Thank you for your order. We&apos;ll prepare it right away.
        </p>
      </div>

      {/* Order card */}
      <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-5 text-start shadow-sm space-y-3">
        <div className="flex items-center gap-2">
          <Package className="h-4 w-4 text-primary" />
          <span className="text-sm font-bold text-foreground">Order #{order.order_number}</span>
        </div>

        <div className="space-y-1.5 text-sm text-muted-foreground">
          <div className="flex justify-between">
            <span>Status</span>
            <span className="font-medium text-foreground capitalize">{order.status}</span>
          </div>
          <div className="flex justify-between">
            <span>Total</span>
            <span className="font-bold text-foreground">${order.total_amount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Payment</span>
            <span className="font-medium text-foreground">{order.payment_method ?? "N/A"}</span>
          </div>
          {addressLine && (
            <div className="flex justify-between gap-4">
              <span className="shrink-0">Deliver to</span>
              <span className="font-medium text-foreground text-end">{addressLine}</span>
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap justify-center gap-3">
        <Button asChild>
          <Link href="/dashboard/orders">View my orders</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/products">Continue shopping</Link>
        </Button>
        {adminWhatsAppUrl && (
          <Button
            variant="outline"
            className="gap-2 border-emerald-500 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/20"
            asChild
          >
            <a href={adminWhatsAppUrl} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="h-4 w-4" />
              Contact via WhatsApp
            </a>
          </Button>
        )}
      </div>
    </div>
  );
}

// Re-export helper so pages can use it without extra imports
export { buildAdminWhatsAppUrl };
