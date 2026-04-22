import "server-only";
import { supabaseAdmin } from "@/lib/supabase/admin";
import type { MonthlyRevenue } from "@/lib/types/dashboard";

export async function getMonthlyRevenue(months = 12): Promise<MonthlyRevenue[]> {
  const { data, error } = await supabaseAdmin
    .from("dashboard_monthly_revenue")
    .select("*")
    .limit(months);

  if (error) {
    console.error("[getMonthlyRevenue]", error.message);
    return [];
  }

  return (data ?? []) as MonthlyRevenue[];
}
