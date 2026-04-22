"use client";
import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/lib/constants/shop";
import type { DailyRevenue } from "@/lib/types/dashboard";

async function fetchDailyRevenue(): Promise<DailyRevenue[]> {
  const res = await fetch("/api/admin/revenue?type=daily");
  if (!res.ok) throw new Error("Failed to fetch daily revenue");
  return res.json();
}

export function useDailyRevenue() {
  return useQuery<DailyRevenue[]>({
    queryKey: QUERY_KEYS.DAILY_REVENUE,
    queryFn: fetchDailyRevenue,
    staleTime: 1000 * 60 * 5,
  });
}
