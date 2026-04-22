"use client";
import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/lib/constants/shop";
import type { AdminOrder } from "@/lib/types/dashboard";

async function fetchProcessingOrders(): Promise<AdminOrder[]> {
  const res = await fetch("/api/admin/orders?type=confirmed");
  if (!res.ok) throw new Error("Failed to fetch confirmed orders");
  return res.json();
}

export function useProcessingOrders() {
  return useQuery<AdminOrder[]>({
    queryKey: QUERY_KEYS.PROCESSING_ORDERS,
    queryFn: fetchProcessingOrders,
    staleTime: 1000 * 30,
    refetchInterval: 1000 * 60,
  });
}
