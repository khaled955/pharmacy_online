"use client";
import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/lib/constants/shop";
import type { WishlistItemRow } from "@/lib/types/order";

async function fetchWishlist(): Promise<WishlistItemRow[]> {
  const res = await fetch("/api/wishlist");
  if (!res.ok) throw new Error("Failed to fetch wishlist");
  return res.json();
}

async function fetchWishlistCount(): Promise<number> {
  const res = await fetch("/api/wishlist/count");
  if (!res.ok) return 0;
  const json = await res.json();
  return json.count ?? 0;
}

async function fetchWishlistProductIds(): Promise<string[]> {
  const res = await fetch("/api/wishlist/ids");
  if (!res.ok) return [];
  return res.json();
}

export function useWishlist() {
  return useQuery<WishlistItemRow[]>({
    queryKey: QUERY_KEYS.WISHLIST,
    queryFn: fetchWishlist,
    staleTime: 1000 * 60 * 2,
  });
}

export function useWishlistCount() {
  return useQuery<number>({
    queryKey: QUERY_KEYS.WISHLIST_COUNT,
    queryFn: fetchWishlistCount,
    staleTime: 1000 * 60 * 2,
  });
}

export function useWishlistProductIds() {
  return useQuery<string[]>({
    queryKey: [...QUERY_KEYS.WISHLIST, "ids"],
    queryFn: fetchWishlistProductIds,
    staleTime: 1000 * 60 * 2,
  });
}
