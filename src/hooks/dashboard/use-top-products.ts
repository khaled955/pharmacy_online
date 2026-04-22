"use client";
import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/lib/constants/shop";
import type { TopProduct } from "@/lib/types/dashboard";

async function fetchTopProducts(): Promise<TopProduct[]> {
  const res = await fetch("/api/admin/top-products");
  if (!res.ok) throw new Error("Failed to fetch top products");
  return res.json();
}

export function useTopProducts() {
  return useQuery<TopProduct[]>({
    queryKey: QUERY_KEYS.TOP_PRODUCTS,
    queryFn: fetchTopProducts,
    staleTime: 1000 * 60 * 5,
  });
}
