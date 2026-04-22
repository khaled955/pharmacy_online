"use client";
import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/lib/constants/shop";
import type { AdminOrder } from "@/lib/types/dashboard";

async function fetchPendingOrders(): Promise<AdminOrder[]> {
  const res = await fetch("/api/admin/orders?type=pending");
  if (!res.ok) throw new Error("Failed to fetch pending orders");
  return res.json();
}

export function usePendingOrders() {
  return useQuery<AdminOrder[]>({
    queryKey: QUERY_KEYS.PENDING_ORDERS,
    queryFn: fetchPendingOrders,
    staleTime: 1000 * 30,
    refetchInterval: 1000 * 60,
  });
}
