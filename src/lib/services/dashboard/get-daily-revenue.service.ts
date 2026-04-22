import "server-only";
import { supabaseAdmin } from "@/lib/supabase/admin";
import type { DailyRevenue } from "@/lib/types/dashboard";

export async function getDailyRevenue(days = 30): Promise<DailyRevenue[]> {
  const { data, error } = await supabaseAdmin
    .from("dashboard_daily_revenue")
    .select("*")
    .limit(days);

  if (error) {
    console.error("[getDailyRevenue]", error.message);
    return [];
  }

  return (data ?? []) as DailyRevenue[];
}
