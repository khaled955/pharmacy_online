"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { updateOrderStatusAction } from "@/lib/orders/update-order-status.action";
import { QUERY_KEYS, SHOP_MUTATION_KEYS } from "@/lib/constants/shop";
import type { OrderStatus } from "@/lib/types/order";

type UpdateStatusPayload = {
  orderId: string;
  newStatus: OrderStatus;
};

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation<
    { orderId: string; status: OrderStatus },
    Error,
    UpdateStatusPayload
  >({
    mutationKey: SHOP_MUTATION_KEYS.UPDATE_ORDER_STATUS,
    mutationFn: async ({ orderId, newStatus }) => {
      const res = await updateOrderStatusAction(orderId, newStatus);
      if (!res.status) throw new Error(res.message);
      return res.data!;
    },
    onSuccess: (data) => {
      toast.success(`Order status updated to "${data.status}"`);
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ADMIN_STATS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.RECENT_ORDERS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PENDING_ORDERS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PROCESSING_ORDERS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ADMIN_ORDER(data.orderId) });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update order status");
    },
  });
}
