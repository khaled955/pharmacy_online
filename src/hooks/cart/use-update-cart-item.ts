"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { updateCartItemAction } from "@/lib/cart/update-cart-item.action";
import { QUERY_KEYS, SHOP_MUTATION_KEYS } from "@/lib/constants/shop";
import type { UpdateCartItemPayload, CartItemRow } from "@/lib/types/order";
import type { AuthResponse } from "@/lib/types/auth";

export function useUpdateCartItem() {
  const queryClient = useQueryClient();

  const { mutate: updateCartItem, isPending: updateCartItemPending } = useMutation<
    AuthResponse<CartItemRow>,
    Error,
    UpdateCartItemPayload
  >({
    mutationKey: SHOP_MUTATION_KEYS.UPDATE_CART_ITEM,
    mutationFn: async (payload) => {
      const response = await updateCartItemAction(payload);
      if (!response.status) throw new Error(response.message);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CART });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CART_COUNT });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update cart");
    },
  });

  return { updateCartItem, updateCartItemPending };
}
