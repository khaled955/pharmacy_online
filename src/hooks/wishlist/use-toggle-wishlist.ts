"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { toggleWishlistAction } from "@/lib/wishlist/toggle-wishlist.action";
import { QUERY_KEYS} from "@/lib/constants/shop";
import type { ToggleWishlistPayload, WishlistItemRow } from "@/lib/types/order";
import type { AuthResponse } from "@/lib/types/auth";
import type { ToggleWishlistResult } from "@/lib/wishlist/toggle-wishlist.action";

type MutateContext = {
  previousWishlist: WishlistItemRow[] | undefined;
  previousIds: string[] | undefined;
  previousCount: number | undefined;
};

export function useToggleWishlist() {
  // Navigation
  const router = useRouter();
  const pathname = usePathname();
  // Hooks
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();

  const { mutate: toggleWishlist, isPending: toggleWishlistPending } =
    useMutation<
      AuthResponse<ToggleWishlistResult>,
      Error,
      ToggleWishlistPayload,
      MutateContext
    >({
      mutationFn: async (values) => {
        const payload = await toggleWishlistAction(values);
        if (!payload.status) throw new Error(payload.message);
        return payload;
      },
      // Optimistically update the wishlist in the UI before the mutation completes
      onMutate: async ({ productId }) => {
        await queryClient.cancelQueries({ queryKey: QUERY_KEYS.WISHLIST });
        await queryClient.cancelQueries({
          queryKey: [...QUERY_KEYS.WISHLIST, "ids"],
        });

        const previousWishlist = queryClient.getQueryData<WishlistItemRow[]>(
          QUERY_KEYS.WISHLIST,
        );
        const previousIds = queryClient.getQueryData<string[]>([
          ...QUERY_KEYS.WISHLIST,
          "ids",
        ]);
        const previousCount = queryClient.getQueryData<number>(
          QUERY_KEYS.WISHLIST_COUNT,
        );

        const isCurrentlyWishlisted = (previousIds ?? []).includes(productId);

        if (isCurrentlyWishlisted) {
          queryClient.setQueryData<WishlistItemRow[]>(
            QUERY_KEYS.WISHLIST,
            (old = []) => old.filter((item) => item.product_id !== productId),
          );
          queryClient.setQueryData<string[]>(
            [...QUERY_KEYS.WISHLIST, "ids"],
            (old = []) => old.filter((id) => id !== productId),
          );
          queryClient.setQueryData<number>(
            QUERY_KEYS.WISHLIST_COUNT,
            (old = 0) => Math.max(0, old - 1),
          );
        } else {
          queryClient.setQueryData<string[]>(
            [...QUERY_KEYS.WISHLIST, "ids"],
            (old = []) => [...old, productId],
          );
          queryClient.setQueryData<number>(
            QUERY_KEYS.WISHLIST_COUNT,
            (old = 0) => old + 1,
          );
        }

        return { previousWishlist, previousIds, previousCount };
      },
      onSuccess: (response) => {
        const action = response.data?.action;
        toast.success(
          action === "added" ? "Added to wishlist!" : "Removed from wishlist",
        );
      },
      onError: (error, _, context) => {
        if (context?.previousWishlist !== undefined) {
          queryClient.setQueryData(
            QUERY_KEYS.WISHLIST,
            context.previousWishlist,
          );
        }
        if (context?.previousIds !== undefined) {
          queryClient.setQueryData(
            [...QUERY_KEYS.WISHLIST, "ids"],
            context.previousIds,
          );
        }
        if (context?.previousCount !== undefined) {
          queryClient.setQueryData(
            QUERY_KEYS.WISHLIST_COUNT,
            context.previousCount,
          );
        }

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
      onSettled: () => {
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.WISHLIST });
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.WISHLIST_COUNT });
      },
    });

  return { toggleWishlist, toggleWishlistPending };
}
