"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { toggleWishlistAction } from "@/lib/wishlist/toggle-wishlist.action";
import { QUERY_KEYS, SHOP_MUTATION_KEYS } from "@/lib/constants/shop";
import type { ToggleWishlistPayload } from "@/lib/types/order";
import type { AuthResponse } from "@/lib/types/auth";
import type { ToggleWishlistResult } from "@/lib/wishlist/toggle-wishlist.action";

export function useToggleWishlist() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const { mutate: toggleWishlist, isPending: toggleWishlistPending } = useMutation<
    AuthResponse<ToggleWishlistResult>,
    Error,
    ToggleWishlistPayload
  >({
    mutationKey: SHOP_MUTATION_KEYS.ADD_TO_WISHLIST,
    mutationFn: async (payload) => {
      const response = await toggleWishlistAction(payload);
      if (!response.status) throw new Error(response.message);
      return response;
    },
    onSuccess: (response) => {
      const action = response.data?.action;
      toast.success(action === "added" ? "Added to wishlist!" : "Removed from wishlist");
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.WISHLIST });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.WISHLIST_COUNT });
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
      toast.error(error.message || "Failed to update wishlist");
    },
  });

  return { toggleWishlist, toggleWishlistPending };
}
