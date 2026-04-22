"use client";
import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/lib/constants/shop";
import type { AdminOrderStats } from "@/lib/types/dashboard";

async function fetchAdminStats(): Promise<AdminOrderStats> {
  const res = await fetch("/api/admin/stats");
  if (!res.ok) throw new Error("Failed to fetch dashboard stats");
  return res.json();
}

export function useDashboardStats() {
  return useQuery<AdminOrderStats>({
    queryKey: QUERY_KEYS.ADMIN_STATS,
    queryFn: fetchAdminStats,
    staleTime: 1000 * 60 * 2,
  });
}
