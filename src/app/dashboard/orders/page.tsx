import Link from "next/link";
import { Clock, Package, CheckCircle2, XCircle, Truck, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils/tailwind-merge";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/server";
import { getOrders } from "@/lib/services/orders/get-orders.service";
import type { OrderStatus } from "@/lib/types/order";

export const metadata = { title: "Orders | MedBox Dashboard" };

const STATUS_MAP: Record<
  OrderStatus,
  { variant: "success" | "warning" | "info" | "destructive" | "muted"; label: string; icon: React.ElementType }
> = {
  pending:    { variant: "warning",     label: "Pending",    icon: Clock },
  confirmed:  { variant: "info",        label: "Confirmed",  icon: CheckCircle2 },
  processing: { variant: "info",        label: "Processing", icon: RefreshCw },
  shipped:    { variant: "warning",     label: "Shipped",    icon: Truck },
  delivered:  { variant: "success",     label: "Delivered",  icon: CheckCircle2 },
  cancelled:  { variant: "destructive", label: "Cancelled",  icon: XCircle },
  refunded:   { variant: "muted",       label: "Refunded",   icon: RefreshCw },
};

export default async function DashboardOrdersPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const orders = user?.id ? await getOrders(user.id, 50) : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-foreground">Orders</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {orders.length > 0 ? `${orders.length} total orders` : "No orders yet"}
        </p>
      </div>

      {orders.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-4 py-16 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
              <Package className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">
              No orders yet.{" "}
              <Link href="/products" className="text-primary hover:underline">
                Browse products
              </Link>
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  {["Order #", "Date", "Status", "Payment", "Total"].map((col) => (
                    <th
                      key={col}
                      className="px-5 py-3.5 text-start text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {orders.map((order) => {
                  const statusInfo = STATUS_MAP[order.status] ?? {
                    variant: "muted" as const,
                    label: order.status,
                    icon: Clock,
                  };
                  const StatusIcon = statusInfo.icon;

                  return (
                    <tr key={order.id} className="hover:bg-muted/40 transition-colors">
                      <td className="px-5 py-4 font-mono text-xs font-bold text-primary">
                        {order.order_number}
                      </td>
                      <td className="px-5 py-4 text-muted-foreground">
                        <span className={cn("flex items-center gap-1.5")}>
                          <Clock className="h-3.5 w-3.5" />
                          {new Date(order.created_at).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <Badge variant={statusInfo.variant}>
                          <StatusIcon className="me-1 h-3 w-3" />
                          {statusInfo.label}
                        </Badge>
                      </td>
                      <td className="px-5 py-4 capitalize text-muted-foreground">
                        {order.payment_method ?? "—"}
                      </td>
                      <td className="px-5 py-4 font-extrabold text-foreground">
                        ${order.total_amount.toFixed(2)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
