"use client";
import { useState } from "react";
import {
  ShoppingBag,
  Clock,
  CheckCircle2,
  PackageCheck,
  XCircle,
  DollarSign,
  Package,
  TrendingUp,
  ArrowUpRight,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { RevenueChart } from "@/components/dashboard/revenue-chart";
import { OrderDetailsSheet } from "@/components/dashboard/order-details-sheet";
import { cn } from "@/lib/utils/tailwind-merge";
import { useDashboardStats } from "@/hooks/dashboard/use-dashboard-stats";
import { useDailyRevenue } from "@/hooks/dashboard/use-daily-revenue";
import { useMonthlyRevenue } from "@/hooks/dashboard/use-monthly-revenue";
import { useTopProducts } from "@/hooks/dashboard/use-top-products";
import { useRecentOrders } from "@/hooks/orders/use-recent-orders";
import { usePendingOrders } from "@/hooks/orders/use-pending-orders";
import { useProcessingOrders } from "@/hooks/orders/use-processing-orders";
import { useUpdateOrderStatus } from "@/hooks/orders/use-update-order-status";
import type { AdminOrderStats } from "@/lib/types/dashboard";
import type { AdminOrder } from "@/lib/types/dashboard";
import type { OrderStatus } from "@/lib/types/order";
import Image from "next/image";

// ─── Status config ────────────────────────────────────────────────────────────

type BadgeVariant = React.ComponentProps<typeof Badge>["variant"];

const STATUS_MAP: Record<OrderStatus, { label: string; variant: BadgeVariant; icon: LucideIcon }> =
  {
    pending: { label: "Pending", variant: "warning", icon: Clock },
    confirmed: { label: "Confirmed", variant: "info", icon: CheckCircle2 },
    ready: { label: "Ready", variant: "success", icon: PackageCheck },
    cancelled: { label: "Cancelled", variant: "destructive", icon: XCircle },
  };

// ─── Stat cards ───────────────────────────────────────────────────────────────

type StatItem = {
  key: keyof AdminOrderStats;
  label: string;
  icon: LucideIcon;
  color: string;
  bg: string;
  prefix?: string;
  format?: "number" | "currency";
};

const STAT_ITEMS: StatItem[] = [
  {
    key: "total_orders",
    label: "Total Orders",
    icon: ShoppingBag,
    color: "text-primary",
    bg: "bg-primary/10 dark:bg-primary/15",
  },
  {
    key: "pending_orders",
    label: "Pending",
    icon: Clock,
    color: "text-amber-500",
    bg: "bg-amber-50 dark:bg-amber-500/10",
  },
  {
    key: "confirmed_orders",
    label: "Confirmed",
    icon: CheckCircle2,
    color: "text-sky-500",
    bg: "bg-sky-50 dark:bg-sky-500/10",
  },
  {
    key: "ready_orders",
    label: "Ready",
    icon: PackageCheck,
    color: "text-emerald-500",
    bg: "bg-emerald-50 dark:bg-emerald-500/10",
  },
  {
    key: "cancelled_orders",
    label: "Cancelled",
    icon: XCircle,
    color: "text-red-500",
    bg: "bg-red-50 dark:bg-red-500/10",
  },
  {
    key: "active_revenue",
    label: "Active Revenue",
    icon: DollarSign,
    color: "text-violet-500",
    bg: "bg-violet-50 dark:bg-violet-500/10",
    format: "currency",
  },
];

function StatCardSkeleton() {
  return (
    <Card>
      <CardContent className="flex items-start gap-4 py-5">
        <Skeleton className="h-12 w-12 rounded-2xl" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-3.5 w-20" />
          <Skeleton className="h-7 w-16" />
        </div>
      </CardContent>
    </Card>
  );
}

function StatsGrid({
  stats,
  isLoading,
}: {
  stats?: AdminOrderStats;
  isLoading: boolean;
}) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-6">
        {STAT_ITEMS.map((item) => (
          <StatCardSkeleton key={item.key} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-6">
      {STAT_ITEMS.map(({ key, label, icon: Icon, color, bg, format }) => {
        const raw = stats?.[key] ?? 0;
        const value =
          format === "currency"
            ? `$${Number(raw)?.toFixed(2) || "0"}`
            : String(Number(raw));

        return (
          <Card key={key} hoverable>
            <CardContent className="flex flex-col gap-3 py-5">
              <div
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-2xl",
                  bg,
                )}
              >
                <Icon className={cn("h-4 w-4", color)} />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className="mt-0.5 text-2xl font-extrabold text-foreground">
                  {value}
                </p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

// ─── Top products ─────────────────────────────────────────────────────────────

function TopProductsSection() {
  const { data: products, isLoading } = useTopProducts();

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-primary" />
            Top Products
          </CardTitle>
          <span className="text-xs text-muted-foreground">by revenue</span>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {isLoading ? (
          <div className="space-y-1 p-5">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 py-2">
                <Skeleton className="h-5 w-5 rounded-full" />
                <Skeleton className="h-10 w-10 rounded-xl" />
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-3.5 w-32" />
                  <Skeleton className="h-3 w-20" />
                </div>
                <Skeleton className="h-4 w-16" />
              </div>
            ))}
          </div>
        ) : products && products.length > 0 ? (
          <div className="divide-y divide-border">
            {products.map((product, i) => (
              <div
                key={i}
                className="flex items-center gap-3 px-5 py-3 transition-colors hover:bg-muted/30"
              >
                <span className="w-5 text-center text-xs font-bold text-muted-foreground">
                  {i + 1}
                </span>
                {product.product_image_url ? (
                  <Image
                    src={product.product_image_url}
                    alt={product.product_name_en}
                    className="h-10 w-10 rounded-xl object-cover"
                  />
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted">
                    <Package className="h-4 w-4 text-muted-foreground" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm font-medium text-foreground">
                    {product.product_name_en}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {product.total_quantity} sold
                  </p>
                </div>
                <div className="text-end">
                  <p className="text-sm font-semibold text-foreground">
                    ${product?.total_revenue?.toFixed(2) || "0"}
                  </p>
                  <p className="text-xs text-muted-foreground">revenue</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-10 text-center text-sm text-muted-foreground">
            No product data yet
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ─── Orders table ─────────────────────────────────────────────────────────────

type OrdersTableProps = {
  orders: AdminOrder[] | undefined;
  isLoading: boolean;
  onViewDetails: (orderId: string) => void;
  emptyText?: string;
};

function OrdersTable({
  orders,
  isLoading,
  onViewDetails,
  emptyText = "No orders",
}: OrdersTableProps) {
  const mutation = useUpdateOrderStatus();

  type Action = { label: string; newStatus: OrderStatus; variant: "default" | "outline" };

  function getActions(status: OrderStatus): Action[] {
    switch (status) {
      case "pending":
        return [
          { label: "Confirm", newStatus: "confirmed", variant: "default" },
          { label: "Cancel", newStatus: "cancelled", variant: "outline" },
        ];
      case "confirmed":
        return [
          { label: "Mark Ready", newStatus: "ready", variant: "default" },
          { label: "Cancel", newStatus: "cancelled", variant: "outline" },
        ];
      default:
        return [];
    }
  }

  if (isLoading) {
    return (
      <div className="divide-y divide-border">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 px-5 py-4">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-5 w-20 rounded-full" />
            <Skeleton className="h-4 w-24 flex-1" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-8 w-20 rounded-xl" />
          </div>
        ))}
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="py-12 text-center text-sm text-muted-foreground">
        {emptyText}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border">
            {["Order #", "Date", "Customer", "Status", "Total", "Actions"].map(
              (col) => (
                <th
                  key={col}
                  className="px-5 py-3.5 text-start text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                >
                  {col}
                </th>
              ),
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {orders.map((order) => {
            const statusInfo = STATUS_MAP[order.status] ?? {
              label: order.status,
              variant: "muted" as BadgeVariant,
              icon: Clock,
            };
            const StatusIcon = statusInfo.icon;
            const actions = getActions(order.status);
            const isUpdating =
              mutation.isPending && mutation.variables?.orderId === order.id;

            return (
              <tr
                key={order.id}
                className="group transition-colors hover:bg-muted/30"
              >
                <td className="px-5 py-4 font-mono text-xs font-bold text-primary">
                  {order.order_number}
                </td>
                <td className="px-5 py-4 text-xs text-muted-foreground whitespace-nowrap">
                  {new Date(order.created_at).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </td>
                <td className="px-5 py-4 text-foreground">
                  <div>
                    <p className="font-medium">{order.customer_name ?? "—"}</p>
                    {order.customer_phone && (
                      <p className="text-xs text-muted-foreground">
                        {order.customer_phone}
                      </p>
                    )}
                  </div>
                </td>
                <td className="px-5 py-4">
                  <Badge variant={statusInfo.variant}>
                    <StatusIcon className="me-1 h-3 w-3" />
                    {statusInfo.label}
                  </Badge>
                </td>
                <td className="px-5 py-4 font-semibold text-foreground whitespace-nowrap">
                  ${order?.total_amount?.toFixed(2) || "0.00"}
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-1.5">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onViewDetails(order.id)}
                      className="text-xs"
                    >
                      View
                    </Button>
                    {actions.map((action) => (
                      <Button
                        key={action.newStatus}
                        size="sm"
                        variant={action.variant}
                        isLoading={
                          isUpdating &&
                          mutation.variables?.newStatus === action.newStatus
                        }
                        disabled={isUpdating}
                        onClick={() =>
                          mutation.mutate({
                            orderId: order.id,
                            newStatus: action.newStatus,
                          })
                        }
                        className={cn(
                          "text-xs",
                          action.newStatus === "cancelled" &&
                            "text-destructive hover:text-destructive",
                        )}
                      >
                        {action.label}
                      </Button>
                    ))}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// ─── Orders section with tabs ────────────────────────────────────────────────

type Tab = "recent" | "pending" | "confirmed";

const TABS: { id: Tab; label: string }[] = [
  { id: "recent", label: "Recent" },
  { id: "pending", label: "Pending" },
  { id: "confirmed", label: "Confirmed" },
];

function OrdersSection({ onViewDetails }: { onViewDetails: (id: string) => void }) {
  const [activeTab, setActiveTab] = useState<Tab>("recent");

  const recent = useRecentOrders();
  const pending = usePendingOrders();
  const processing = useProcessingOrders();

  const tabData = {
    recent: { data: recent.data, isLoading: recent.isLoading },
    pending: {
      data: pending.data,
      isLoading: pending.isLoading,
      emptyText: "No pending orders — all caught up! ✓",
    },
    confirmed: {
      data: processing.data,
      isLoading: processing.isLoading,
      emptyText: "No confirmed orders",
    },
  };

  const current = tabData[activeTab];

  const counts = {
    recent: recent.data?.length,
    pending: pending.data?.length,
    confirmed: processing.data?.length,
  };

  return (
    <Card>
      <CardHeader className="pb-0">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <CardTitle>Orders Management</CardTitle>
          {/* Tabs */}
          <div className="flex rounded-xl border border-border bg-muted/40 p-1 gap-1">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "relative rounded-lg px-3 py-1.5 text-xs font-semibold transition-all duration-200",
                  activeTab === tab.id
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {tab.label}
                {counts[tab.id] !== undefined && counts[tab.id]! > 0 && (
                  <span
                    className={cn(
                      "ms-1.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full px-1",
                      "text-[10px] font-bold",
                      tab.id === "pending"
                        ? "bg-amber-500 text-white"
                        : "bg-primary/15 text-primary",
                    )}
                  >
                    {counts[tab.id]}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0 pt-4">
        <OrdersTable
          orders={current.data}
          isLoading={current.isLoading}
          onViewDetails={onViewDetails}
          emptyText={"emptyText" in current ? current.emptyText : undefined}
        />
      </CardContent>
    </Card>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export function AdminDashboard() {
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const { data: daily, isLoading: dailyLoading } = useDailyRevenue();
  const { data: monthly, isLoading: monthlyLoading } = useMonthlyRevenue();

  const dailyPoints =
    daily?.map((d) => ({
      label: new Date(d.day).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      value: d.revenue,
    })) ?? [];

  const monthlyPoints =
    monthly?.map((d) => ({
      label: new Date(`${d.month}-01`).toLocaleDateString("en-US", {
        month: "short",
        year: "2-digit",
      }),
      value: d.revenue,
    })) ?? [];

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-foreground">
            Admin Dashboard
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Real-time overview of orders, revenue, and products
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-2xl border border-border bg-card px-4 py-2 text-xs text-muted-foreground shadow-card">
          <ArrowUpRight className="h-3.5 w-3.5 text-primary" />
          Live data
        </div>
      </div>

      {/* Stats cards */}
      <StatsGrid stats={stats} isLoading={statsLoading} />

      {/* Revenue charts */}
      <div className="grid gap-4 lg:grid-cols-2">
        <RevenueChart
          title="Daily Revenue — Last 30 Days"
          data={dailyPoints}
          isLoading={dailyLoading}
          barClass="bg-primary"
          totalLabel="30-day total"
        />
        <RevenueChart
          title="Monthly Revenue — Last 12 Months"
          data={monthlyPoints}
          isLoading={monthlyLoading}
          barClass="bg-emerald-500"
          totalLabel="12-month total"
        />
      </div>

      {/* Top products */}
      <TopProductsSection />

      {/* Orders management */}
      <OrdersSection onViewDetails={setSelectedOrderId} />

      {/* Order details modal */}
      {selectedOrderId && (
        <OrderDetailsSheet
          orderId={selectedOrderId}
          onClose={() => setSelectedOrderId(null)}
        />
      )}
    </div>
  );
}
