"use server";
import { getOrderById } from "@/lib/services/orders/get-orders.service";
import { getAuthUserId } from "@/lib/auth/get-auth-user-id";
import type { AuthResponse } from "@/lib/types/auth";
import type { OrderWithItems } from "@/lib/types/order";

export async function getOrderDetailAction(
  orderId: string,
): Promise<AuthResponse<OrderWithItems | null>> {
  const userId = await getAuthUserId();
  if (!userId) {
    return { status: false, message: "Please log in to view order details", data: null };
  }

  try {
    const order = await getOrderById(orderId, userId);
    return { status: true, message: "OK", data: order };
  } catch (err: unknown) {
    return {
      status: false,
      message: err instanceof Error ? err.message : "Failed to load order details",
      data: null,
    };
  }
}
