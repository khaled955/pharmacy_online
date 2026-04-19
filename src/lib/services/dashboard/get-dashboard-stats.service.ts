import "server-only";
import { createClient } from "@/lib/supabase/server";

export type DashboardStats = {
  totalOrders: number;
  activeOrders: number;
  wishlistItems: number;
};

const ACTIVE_STATUSES = ["pending", "confirmed", "processing", "shipped"];

export async function getDashboardStats(userId: string): Promise<DashboardStats> {
  const supabase = await createClient();

  const [totalRes, activeRes, wishlistRes] = await Promise.all([
    supabase
      .from("orders")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId),
    supabase
      .from("orders")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)
      .in("status", ACTIVE_STATUSES),
    supabase
      .from("wishlist_items")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId),
  ]);

  return {
    totalOrders: totalRes.count ?? 0,
    activeOrders: activeRes.count ?? 0,
    wishlistItems: wishlistRes.count ?? 0,
  };
}
