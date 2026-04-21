import { redirect } from "next/navigation";
import Link from "next/link";
import { Package } from "lucide-react";
import { cn } from "@/lib/utils/tailwind-merge";
import { getAuthUserId } from "@/lib/auth/get-auth-user-id";
import { getOrders } from "@/lib/services/orders/get-orders.service";
import { OrdersList } from "./_components/orders-list";

export const metadata = { title: "My Orders | MedBox" };

export default async function AllOrdersPage() {
  const userId = await getAuthUserId();
  if (!userId) redirect("/login?callbackUrl=/allOrders");

  const orders = await getOrders(userId);

  return (
    <div className="section-container py-10 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-foreground">My Orders</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {orders.length > 0
              ? `${orders.length} order${orders.length === 1 ? "" : "s"} total`
              : "No orders yet"}
          </p>
        </div>
        <Link
          href="/products"
          className={cn(
            "inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium",
            "bg-gradient-brand text-white shadow-sm",
            "hover:opacity-90 transition-opacity",
          )}
        >
          <Package className="h-4 w-4" />
          Browse Products
        </Link>
      </div>

      <OrdersList orders={orders} />
    </div>
  );
}
