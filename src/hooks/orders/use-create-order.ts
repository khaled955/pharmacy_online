"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createOrderAction } from "@/lib/orders/create-order.action";
import { QUERY_KEYS, SHOP_MUTATION_KEYS } from "@/lib/constants/shop";
import type { CreateOrderPayload, CreateOrderResult } from "@/lib/types/order";
import type { AuthResponse } from "@/lib/types/auth";

export function useCreateOrder() {
  const queryClient = useQueryClient();
  const router = useRouter();

  const { mutate: createOrder, isPending: createOrderPending } = useMutation<
    AuthResponse<CreateOrderResult>,
    Error,
    CreateOrderPayload
  >({
    mutationKey: SHOP_MUTATION_KEYS.CREATE_ORDER,
    mutationFn: async (payload) => {
      const response = await createOrderAction(payload);
      if (!response.status) throw new Error(response.message);
      return response;
    },
    onSuccess: (response) => {
      toast.success("Order placed successfully! 🎉");
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CART });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CART_COUNT });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ORDERS });

      const orderId = response.data?.order?.id;
      if (orderId) {
        router.push(`/checkout/success?orderId=${orderId}`);
      }
    },
    onError: (error) => {
      toast.error(error.message || "Failed to place order. Please try again.");
    },
  });

  return { createOrder, createOrderPending };
}
