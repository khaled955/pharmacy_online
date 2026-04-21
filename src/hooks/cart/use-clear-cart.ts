"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { clearCartAction } from "@/lib/cart/clear-cart.action";
import { QUERY_KEYS, SHOP_MUTATION_KEYS } from "@/lib/constants/shop";
import type { CartItemRow } from "@/lib/types/order";
import type { AuthResponse } from "@/lib/types/auth";

export function useClearCart() {
  const queryClient = useQueryClient();

  const { mutate: clearCart, isPending: clearCartPending } = useMutation<
    AuthResponse<null>,
    Error,
    void,
    { previousCart: CartItemRow[] | undefined }
  >({
    mutationKey: SHOP_MUTATION_KEYS.CLEAR_CART,
    mutationFn: async () => {
      const response = await clearCartAction();
      if (!response.status) throw new Error(response.message);
      return response;
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.CART });
      const previousCart = queryClient.getQueryData<CartItemRow[]>(QUERY_KEYS.CART);
      queryClient.setQueryData(QUERY_KEYS.CART, []);
      queryClient.setQueryData(QUERY_KEYS.CART_COUNT, 0);
      return { previousCart };
    },
    onError: (error, _, context) => {
      if (context?.previousCart !== undefined) {
        queryClient.setQueryData(QUERY_KEYS.CART, context.previousCart);
      }
      toast.error(error.message || "Failed to clear cart");
    },
    onSuccess: () => {
      toast.success("Cart cleared");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CART });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CART_COUNT });
    },
  });

  return { clearCart, clearCartPending };
}
