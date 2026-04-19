"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { removeFromCartAction } from "@/lib/cart/remove-from-cart.action";
import { QUERY_KEYS, SHOP_MUTATION_KEYS } from "@/lib/constants/shop";
import type { RemoveFromCartPayload } from "@/lib/types/order";
import type { AuthResponse } from "@/lib/types/auth";

export function useRemoveFromCart() {
  const queryClient = useQueryClient();

  const { mutate: removeFromCart, isPending: removeFromCartPending } = useMutation<
    AuthResponse<null>,
    Error,
    RemoveFromCartPayload
  >({
    mutationKey: SHOP_MUTATION_KEYS.REMOVE_FROM_CART,
    mutationFn: async (payload) => {
      const response = await removeFromCartAction(payload);
      if (!response.status) throw new Error(response.message);
      return response;
    },
    onSuccess: () => {
      toast.success("Removed from cart");
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CART });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CART_COUNT });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to remove item");
    },
  });

  return { removeFromCart, removeFromCartPending };
}
