"use client";
import { useState } from "react";
import Link from "next/link";
import { Clock, Package, ShoppingBag, ArrowRight, Eye } from "lucide-react";
import { cn } from "@/lib/utils/tailwind-merge";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SectionHeader } from "@/components/shared/section-header";
import { OrderDetailDialog } from "./order-detail-dialog";
import { STATUS_MAP } from "./status-config";
import type { OrderRow } from "@/lib/types/order";

interface OrdersListProps {
  orders: OrderRow[];
}

export function OrdersList({ orders }: OrdersListProps) {
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  return (
    <>
      {orders.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-4 py-16 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
              <ShoppingBag className="h-8 w-8 text-muted-foreground" />
            </div>
            <div>
              <p className="text-base font-semibold text-foreground">No orders yet</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Your completed orders will appear here.
              </p>
            </div>
            <Button asChild className="mt-2 bg-gradient-brand hover:opacity-90">
              <Link href="/products">
                Start Shopping
                <ArrowRight className="ms-1.5 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const statusInfo = STATUS_MAP[order.status] ?? {
              variant: "muted" as const,
              label: order.status,
              icon: Clock,
            };
            const StatusIcon = statusInfo.icon;

            return (
              <Card
                key={order.id}
                className={cn(
                  "overflow-hidden transition-shadow duration-200",
                  "hover:shadow-md hover:border-primary/20",
                )}
              >
                {/* Order header */}
                <div
                  className={cn(
                    "flex flex-wrap items-center justify-between gap-3",
                    "border-b border-border bg-muted/40 px-5 py-3",
                  )}
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-bold text-primary">
                      {order.order_number}
                    </span>
                    <Badge variant={statusInfo.variant}>
                      <StatusIcon className="me-1 h-3 w-3" />
                      {statusInfo.label}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Clock className="h-3.5 w-3.5" />
                      {new Date(order.created_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 gap-1.5 rounded-lg px-2.5 text-xs text-muted-foreground hover:text-primary"
                      onClick={() => setSelectedOrderId(order.id)}
                    >
                      <Eye className="h-3.5 w-3.5" />
                      Details
                    </Button>
                  </div>
                </div>

                {/* Order body */}
                <CardContent className="grid grid-cols-2 gap-4 py-4 sm:grid-cols-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Subtotal</p>
                    <p className="mt-0.5 text-sm font-semibold text-foreground">
                      ${order.subtotal.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Shipping</p>
                    <p className="mt-0.5 text-sm font-semibold text-foreground">
                      {order.shipping_fee === 0
                        ? "Free"
                        : `$${order.shipping_fee.toFixed(2)}`}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Payment</p>
                    <p className="mt-0.5 text-sm font-semibold text-foreground capitalize">
                      {order.payment_method ?? "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Total</p>
                    <p className="mt-0.5 text-sm font-extrabold text-primary">
                      ${order.total_amount.toFixed(2)}
                    </p>
                  </div>

                  {order.city && (
                    <div className="col-span-2 sm:col-span-4">
                      <p className="text-xs text-muted-foreground">Delivery to</p>
                      <p className="mt-0.5 text-sm font-medium text-foreground">
                        {[order.street_address, order.area, order.city]
                          .filter(Boolean)
                          .join(", ")}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <SectionHeader title="Continue Shopping" accent={false} />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {[
          { href: "/products",  label: "Browse Products", icon: Package },
          { href: "/wishlist",  label: "View Wishlist",   icon: ShoppingBag },
        ].map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "group flex items-center justify-between rounded-2xl border border-border",
              "bg-card p-4 shadow-sm transition-all duration-200",
              "hover:-translate-y-0.5 hover:border-primary/20 hover:shadow-md",
            )}
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                <Icon className="h-5 w-5 text-primary" />
              </div>
              <span className="text-sm font-semibold text-foreground">{label}</span>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
          </Link>
        ))}
      </div>

      <OrderDetailDialog
        orderId={selectedOrderId}
        onClose={() => setSelectedOrderId(null)}
      />
    </>
  );
}
