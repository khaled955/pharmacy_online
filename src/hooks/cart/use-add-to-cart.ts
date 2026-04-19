"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { addToCartAction } from "@/lib/cart/add-to-cart.action";
import { QUERY_KEYS, SHOP_MUTATION_KEYS } from "@/lib/constants/shop";
import type { AddToCartPayload, CartItemRow } from "@/lib/types/order";
import type { AuthResponse } from "@/lib/types/auth";

export function useAddToCart() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const { mutate: addToCart, isPending: addToCartPending } = useMutation<
    AuthResponse<CartItemRow>,
    Error,
    AddToCartPayload
  >({
    mutationKey: SHOP_MUTATION_KEYS.ADD_TO_CART,
    mutationFn: async (payload) => {
      const response = await addToCartAction(payload);
      if (!response.status) throw new Error(response.message);
      return response;
    },
    onSuccess: () => {
      toast.success("Added to cart!");
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CART });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CART_COUNT });
    },
    onError: (error) => {
      const isAuthError =
        error.message.toLowerCase().includes("log in") ||
        error.message.toLowerCase().includes("unauthorized");

      if (isAuthError) {
        const callbackUrl = searchParams.toString()
          ? `${pathname}?${searchParams.toString()}`
          : pathname;
        router.push(`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`);
        return;
      }
      toast.error(error.message || "Failed to add to cart");
    },
  });

  return { addToCart, addToCartPending };
}
