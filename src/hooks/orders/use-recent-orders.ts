"use client";
import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/lib/constants/shop";
import type { AdminOrder } from "@/lib/types/dashboard";

async function fetchRecentOrders(): Promise<AdminOrder[]> {
  const res = await fetch("/api/admin/orders?type=recent");
  if (!res.ok) throw new Error("Failed to fetch recent orders");
  return res.json();
}

export function useRecentOrders() {
  return useQuery<AdminOrder[]>({
    queryKey: QUERY_KEYS.RECENT_ORDERS,
    queryFn: fetchRecentOrders,
    staleTime: 1000 * 30,
  });
}
