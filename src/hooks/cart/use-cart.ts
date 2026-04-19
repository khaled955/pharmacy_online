"use client";
import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/lib/constants/shop";
import type { CartItemRow } from "@/lib/types/order";

async function fetchCart(): Promise<CartItemRow[]> {
  const res = await fetch("/api/cart");
  if (!res.ok) throw new Error("Failed to fetch cart");
  return res.json();
}

async function fetchCartCount(): Promise<number> {
  const res = await fetch("/api/cart/count");
  if (!res.ok) return 0;
  const json = await res.json();
  return json.count ?? 0;
}

export function useCart() {
  return useQuery<CartItemRow[]>({
    queryKey: QUERY_KEYS.CART,
    queryFn: fetchCart,
    staleTime: 1000 * 60 * 2,
  });
}

export function useCartCount() {
  return useQuery<number>({
    queryKey: QUERY_KEYS.CART_COUNT,
    queryFn: fetchCartCount,
    staleTime: 1000 * 60 * 2,
  });
}
