"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { removeFromCartAction } from "@/lib/cart/remove-from-cart.action";
import { QUERY_KEYS, SHOP_MUTATION_KEYS } from "@/lib/constants/shop";
import type { RemoveFromCartPayload, CartItemRow } from "@/lib/types/order";
import type { AuthResponse } from "@/lib/types/auth";

export function useRemoveFromCart() {
  const queryClient = useQueryClient();

  const { mutate: removeFromCart, isPending: removeFromCartPending } = useMutation<
    AuthResponse<null>,
    Error,
    RemoveFromCartPayload,
    { previousCart: CartItemRow[] | undefined }
  >({
    mutationKey: SHOP_MUTATION_KEYS.REMOVE_FROM_CART,
    mutationFn: async (payload) => {
      const response = await removeFromCartAction(payload);
      if (!response.status) throw new Error(response.message);
      return response;
    },
    onMutate: async ({ cartItemId }) => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.CART });
      const previousCart = queryClient.getQueryData<CartItemRow[]>(QUERY_KEYS.CART);
      queryClient.setQueryData<CartItemRow[]>(QUERY_KEYS.CART, (old = []) =>
        old.filter((item) => item.id !== cartItemId),
      );
      return { previousCart };
    },
    onError: (error, _, context) => {
      if (context?.previousCart !== undefined) {
        queryClient.setQueryData(QUERY_KEYS.CART, context.previousCart);
      }
      toast.error(error.message || "Failed to remove item");
    },
    onSuccess: () => {
      toast.success("Removed from cart");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CART });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CART_COUNT });
    },
  });

  return { removeFromCart, removeFromCartPending };
}
