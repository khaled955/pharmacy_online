"use client";
import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/lib/constants/shop";
import type { MonthlyRevenue } from "@/lib/types/dashboard";

async function fetchMonthlyRevenue(): Promise<MonthlyRevenue[]> {
  const res = await fetch("/api/admin/revenue?type=monthly");
  if (!res.ok) throw new Error("Failed to fetch monthly revenue");
  return res.json();
}

export function useMonthlyRevenue() {
  return useQuery<MonthlyRevenue[]>({
    queryKey: QUERY_KEYS.MONTHLY_REVENUE,
    queryFn: fetchMonthlyRevenue,
    staleTime: 1000 * 60 * 10,
  });
}
