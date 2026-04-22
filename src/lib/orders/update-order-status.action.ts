"use server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/next-auth";
import type { AuthUser } from "@/lib/types/auth";
import type { AuthResponse } from "@/lib/types/auth";
import type { OrderStatus } from "@/lib/types/order";
import { createAdminNotification } from "@/lib/services/notifications/create-notification";

type Transition = { from: OrderStatus; to: OrderStatus };

const ALLOWED: Transition[] = [
  { from: "pending", to: "confirmed" },
  { from: "confirmed", to: "ready" },
  { from: "pending", to: "cancelled" },
  { from: "confirmed", to: "cancelled" },
];

function isAllowed(from: OrderStatus, to: OrderStatus): boolean {
  return ALLOWED.some((t) => t.from === from && t.to === to);
}

export async function updateOrderStatusAction(
  orderId: string,
  newStatus: OrderStatus,
): Promise<AuthResponse<{ orderId: string; status: OrderStatus }>> {
  const session = await getServerSession(authOptions);
  const user = session?.user as AuthUser | undefined;

  if (!user || user.role !== "admin") {
    return { status: false, message: "Forbidden", data: null };
  }

  try {
    const { data: order, error: fetchError } = await supabaseAdmin
      .from("orders")
      .select("id, order_number, status, customer_name")
      .eq("id", orderId)
      .single();

    if (fetchError || !order) {
      return { status: false, message: "Order not found", data: null };
    }

    const currentStatus = order.status as OrderStatus;

    if (!isAllowed(currentStatus, newStatus)) {
      return {
        status: false,
        message: `Cannot move order from "${currentStatus}" to "${newStatus}"`,
        data: null,
      };
    }

    // Try the prepared RPC function first; fall back to direct update
    const { error: rpcError } = await supabaseAdmin.rpc("update_order_status", {
      order_id: orderId,
      new_status: newStatus,
    });

    if (rpcError) {
      const { error: directError } = await supabaseAdmin
        .from("orders")
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq("id", orderId);

      if (directError) throw new Error(directError.message);
    }

    void createAdminNotification({
      type: "ORDER_STATUS",
      title: "Order Status Updated",
      message: `Order #${order.order_number} (${order.customer_name ?? "Unknown"}) → ${newStatus}`,
      orderId,
    });

    return {
      status: true,
      message: `Order status updated to ${newStatus}`,
      data: { orderId, status: newStatus },
    };
  } catch (err) {
    return {
      status: false,
      message: err instanceof Error ? err.message : "Failed to update order status",
      data: null,
    };
  }
}
