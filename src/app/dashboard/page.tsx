import Link from "next/link";
import {
  ShoppingBag, Package, Heart, TrendingUp, ArrowRight, Clock,
} from "lucide-react";
import { cn } from "@/lib/utils/tailwind-merge";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { SectionHeader } from "@/components/shared/section-header";
import { createClient } from "@/lib/supabase/server";
import { getDashboardStats } from "@/lib/services/dashboard/get-dashboard-stats.service";
import { getRecentOrders } from "@/lib/services/orders/get-orders.service";
import type { OrderStatus } from "@/lib/types/order";

/* ─── Status display map ─────────────────────────────────────── */
const STATUS_MAP: Record<
  OrderStatus,
  { variant: "success" | "warning" | "info" | "destructive" | "muted"; label: string }
> = {
  pending:    { variant: "warning", label: "Pending" },
  confirmed:  { variant: "info",    label: "Confirmed" },
  processing: { variant: "info",    label: "Processing" },
  shipped:    { variant: "warning", label: "Shipped" },
  delivered:  { variant: "success", label: "Delivered" },
  cancelled:  { variant: "destructive", label: "Cancelled" },
  refunded:   { variant: "muted",   label: "Refunded" },
};

/* ─── Stat card ─────────────────────────────────────────────── */
type StatCardProps = {
  label: string;
  value: string | number;
  subtext: string;
  positive?: boolean;
  icon: React.ElementType;
  color: string;
  bg: string;
};

function StatCard({ label, value, subtext, positive = true, icon: Icon, color, bg }: StatCardProps) {
  return (
    <Card>
      <CardContent className="flex items-start gap-4 py-5">
        <div className={cn("flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl", bg)}>
          <Icon className={cn("h-5 w-5", color)} />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="mt-0.5 text-2xl font-extrabold text-foreground">{value}</p>
          <p
            className={cn(
              "mt-0.5 text-xs font-medium",
              positive ? "text-emerald-600 dark:text-emerald-400" : "text-destructive",
            )}
          >
            {subtext}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

/* ─── Page ───────────────────────────────────────────────────── */
export default async function DashboardHomePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const userId = user?.id;

  const [stats, recentOrders] = userId
    ? await Promise.all([
        getDashboardStats(userId),
        getRecentOrders(userId, 5),
      ])
    : [
        { totalOrders: 0, activeOrders: 0, wishlistItems: 0 },
        [],
      ];

  const statCards: StatCardProps[] = [
    {
      label: "Total Orders",
      value: stats.totalOrders,
      subtext: stats.totalOrders > 0 ? "All time orders" : "No orders yet",
      positive: true,
      icon: ShoppingBag,
      color: "text-primary",
      bg: "bg-primary/10 dark:bg-primary/15",
    },
    {
      label: "Active Orders",
      value: stats.activeOrders,
      subtext: stats.activeOrders > 0 ? "In transit / processing" : "No active orders",
      positive: stats.activeOrders > 0,
      icon: Package,
      color: "text-amber-500 dark:text-amber-400",
      bg: "bg-amber-50 dark:bg-amber-500/10",
    },
    {
      label: "Wishlist Items",
      value: stats.wishlistItems,
      subtext: stats.wishlistItems > 0 ? "Saved for later" : "Wishlist is empty",
      positive: true,
      icon: Heart,
      color: "text-rose-500 dark:text-rose-400",
      bg: "bg-rose-50 dark:bg-rose-500/10",
    },
    {
      label: "Completed Orders",
      value: Math.max(0, stats.totalOrders - stats.activeOrders),
      subtext: "Successfully delivered",
      positive: true,
      icon: TrendingUp,
      color: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-50 dark:bg-emerald-500/10",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-foreground">Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Welcome back — here&apos;s your health overview
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      {/* Recent orders */}
      <section>
        <SectionHeader
          title="Recent Orders"
          viewAllHref="/dashboard/orders"
          viewAllLabel="All Orders"
        />

        <Card>
          {recentOrders.length === 0 ? (
            <div className="p-8 text-center text-sm text-muted-foreground">
              No orders yet.{" "}
              <Link href="/products" className="text-primary hover:underline">
                Browse products
              </Link>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      {["Order ID", "Date", "Product", "Status", "Total"].map((col) => (
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
                    {recentOrders.map((order) => {
                      const statusInfo =
                        STATUS_MAP[order.status as OrderStatus] ?? {
                          variant: "muted" as const,
                          label: order.status,
                        };
                      const firstItem = order.order_items?.[0];

                      return (
                        <tr
                          key={order.id}
                          className="group hover:bg-muted/40 transition-colors"
                        >
                          <td className="px-5 py-4 font-mono text-xs font-semibold text-primary">
                            {order.order_number}
                          </td>
                          <td className="px-5 py-4 text-muted-foreground">
                            <span className="flex items-center gap-1.5">
                              <Clock className="h-3.5 w-3.5" />
                              {new Date(order.created_at).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              })}
                            </span>
                          </td>
                          <td className="px-5 py-4 font-medium text-foreground max-w-48 truncate">
                            {firstItem?.product_name_en ?? "—"}
                            {order.order_items.length > 1 && (
                              <span className="text-xs text-muted-foreground ml-1">
                                +{order.order_items.length - 1} more
                              </span>
                            )}
                          </td>
                          <td className="px-5 py-4">
                            <Badge variant={statusInfo.variant}>
                              {statusInfo.label}
                            </Badge>
                          </td>
                          <td className="px-5 py-4 font-semibold text-foreground">
                            ${order.total_amount.toFixed(2)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="border-t border-border p-4">
                <Link
                  href="/dashboard/orders"
                  className="flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
                >
                  View all orders
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </>
          )}
        </Card>
      </section>

      {/* Quick actions */}
      <section>
        <SectionHeader title="Quick Actions" accent={false} />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {[
            { label: "Browse Products", href: "/products",           icon: Package },
            { label: "View Wishlist",   href: "/dashboard/wishlist", icon: Heart },
            { label: "Get Support",     href: "/dashboard/support",  icon: ShoppingBag },
          ].map(({ label, href, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "group flex items-center justify-between rounded-2xl border border-border",
                "bg-card p-4 shadow-card",
                "transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card-hover",
                "hover:border-primary/20",
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
      </section>
    </div>
  );
}
