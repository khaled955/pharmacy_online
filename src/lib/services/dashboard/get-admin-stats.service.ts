import "server-only";
import { supabaseAdmin } from "@/lib/supabase/admin";
import type { AdminOrderStats } from "@/lib/types/dashboard";

const DEFAULT_STATS: AdminOrderStats = {
  total_orders: 0,
  pending_orders: 0,
  confirmed_orders: 0,
  ready_orders: 0,
  cancelled_orders: 0,
  active_revenue: 0,
};

export async function getAdminOrderStats(): Promise<AdminOrderStats> {
  const { data: rawData, error } = await supabaseAdmin
    .from("dashboard_order_stats")
    .select("*")
    .single();

  if (error) {
    console.error("[getAdminOrderStats]", error.message);
    return DEFAULT_STATS;
  }

  return (rawData as AdminOrderStats) ?? DEFAULT_STATS;
}
