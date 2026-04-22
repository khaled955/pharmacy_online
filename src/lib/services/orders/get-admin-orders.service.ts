import "server-only";
import { supabaseAdmin } from "@/lib/supabase/admin";
import type { AdminOrder, AdminOrderDetail } from "@/lib/types/dashboard";

type AdminOrderView =
  | "dashboard_recent_orders"
  | "dashboard_pending_orders"
  | "dashboard_processing_orders";

export async function getAdminOrders(
  view: AdminOrderView,
  limit = 50,
): Promise<AdminOrder[]> {
  const { data, error } = await supabaseAdmin
    .from(view)
    .select("*")
    .limit(limit);

  if (error) {
    console.error(`[getAdminOrders:${view}]`, error.message);
    return [];
  }

  return (data ?? []) as AdminOrder[];
}

export async function getAdminOrderDetail(
  orderId: string,
): Promise<AdminOrderDetail | null> {
  const { data, error } = await supabaseAdmin
    .from("orders")
    .select(
      `id, order_number, status, customer_name, customer_phone,
       subtotal, shipping_fee, discount_amount, total_amount,
       payment_method, notes, city, area, street_address, created_at,
       order_items(
         id, product_name_en, product_name_ar, product_image_url,
         quantity, unit_price, line_total
       )`,
    )
    .eq("id", orderId)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null;
    console.error("[getAdminOrderDetail]", error.message);
    return null;
  }

  return data as unknown as AdminOrderDetail;
}
