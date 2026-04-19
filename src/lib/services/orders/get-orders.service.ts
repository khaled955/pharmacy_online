import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { OrderRow, OrderWithItems } from "@/lib/types/order";

export async function getOrders(userId: string, limit = 20): Promise<OrderRow[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("orders")
    .select(
      "id, user_id, order_number, status, payment_status, payment_method, " +
      "subtotal, shipping_fee, discount_amount, total_amount, " +
      "customer_name, customer_phone, city, area, street_address, notes, " +
      "created_at, updated_at",
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("[getOrders]", error.message);
    return [];
  }

  return (data as OrderRow[]) ?? [];
}

export async function getOrderById(
  orderId: string,
  userId: string,
): Promise<OrderWithItems | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("orders")
    .select(`
      *,
      order_items(
        id, order_id, product_id, product_code,
        product_name_en, product_name_ar, product_image_url,
        unit_price, quantity, line_total, created_at
      )
    `)
    .eq("id", orderId)
    .eq("user_id", userId)
    .single();

  if (error || !data) {
    console.error("[getOrderById]", error?.message);
    return null;
  }

  return data as unknown as OrderWithItems;
}

export async function getRecentOrders(
  userId: string,
  limit = 5,
): Promise<Array<OrderRow & { order_items: { product_name_en: string; quantity: number }[] }>> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("orders")
    .select(`
      id, order_number, status, total_amount, created_at,
      order_items(product_name_en, quantity)
    `)
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("[getRecentOrders]", error.message);
    return [];
  }

  return data as unknown as Array<
    OrderRow & { order_items: { product_name_en: string; quantity: number }[] }
  >;
}
