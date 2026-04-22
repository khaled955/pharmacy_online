"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createOrderAction } from "@/lib/orders/create-order.action";
import { QUERY_KEYS, SHOP_MUTATION_KEYS } from "@/lib/constants/shop";
import type { CreateOrderPayload, CreateOrderResult, CartItemRow } from "@/lib/types/order";
import type { AuthResponse } from "@/lib/types/auth";

export function useCreateOrder() {
  const queryClient = useQueryClient();
  const router = useRouter();

  type OrderMutationContext = {
    previousCart: CartItemRow[] | undefined;
    previousCartCount: number | undefined;
  };

  const { mutate: createOrder, isPending: createOrderPending } = useMutation<
    AuthResponse<CreateOrderResult>,
    Error,
    CreateOrderPayload,
    OrderMutationContext
  >({
    mutationKey: SHOP_MUTATION_KEYS.CREATE_ORDER,
    mutationFn: async (payload) => {
      const response = await createOrderAction(payload);
      if (!response.status) throw new Error(response.message);
      return response;
    },

    // Optimistically clear cart badge so the UI feels instant
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.CART });
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.CART_COUNT });

      const previousCart = queryClient.getQueryData<CartItemRow[]>(QUERY_KEYS.CART);
      const previousCartCount = queryClient.getQueryData<number>(QUERY_KEYS.CART_COUNT);

      queryClient.setQueryData(QUERY_KEYS.CART, []);
      queryClient.setQueryData(QUERY_KEYS.CART_COUNT, 0);

      return { previousCart, previousCartCount };
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

    onError: (error, _payload, context) => {
      // Rollback optimistic cart clear
      if (context?.previousCart !== undefined) {
        queryClient.setQueryData(QUERY_KEYS.CART, context.previousCart);
      }
      if (context?.previousCartCount !== undefined) {
        queryClient.setQueryData(QUERY_KEYS.CART_COUNT, context.previousCartCount);
      }

      toast.error(error.message || "Failed to place order. Please try again.");
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CART });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CART_COUNT });
    },
  });

  return { createOrder, createOrderPending };
}
