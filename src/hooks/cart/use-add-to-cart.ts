"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { addToCartAction } from "@/lib/cart/add-to-cart.action";
import { QUERY_KEYS} from "@/lib/constants/shop";
import type { AddToCartPayload, CartItemRow } from "@/lib/types/order";
import type { AuthResponse } from "@/lib/types/auth";

export function useAddToCart() {
  // Navigation
   const router = useRouter();
  const pathname = usePathname();
  // Hooks
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();

  const { mutate: addToCart, isPending: addToCartPending } = useMutation<
    AuthResponse<CartItemRow>,
    Error,
    AddToCartPayload
  >({
    mutationFn: async (values) => {
      const payload = await addToCartAction(values);
      if (!payload.status) throw new Error(payload.message);
      return payload;
    },
    onSuccess: () => {
      toast.success("Added to cart!");
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CART });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CART_COUNT });
    },
    onError: (error) => {
      const isAuthError =
        error.message.toLowerCase().includes("log in")

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
