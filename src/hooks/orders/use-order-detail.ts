"use client";
import { useQuery } from "@tanstack/react-query";
import { getOrderDetailAction } from "@/lib/orders/get-order-detail.action";
import { QUERY_KEYS } from "@/lib/constants/shop";
import type { OrderWithItems } from "@/lib/types/order";

export function useOrderDetail(orderId: string | null) {
  return useQuery<OrderWithItems | null, Error>({
    queryKey: QUERY_KEYS.ORDER(orderId ?? ""),
    queryFn: async () => {
      const res = await getOrderDetailAction(orderId!);
      if (!res.status) throw new Error(res.message);
      return res.data;
    },
    enabled: !!orderId,
    staleTime: 1000 * 60 * 5,
  });
}
