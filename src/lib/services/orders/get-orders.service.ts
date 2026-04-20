import "server-only";
import { supabaseAdmin } from "@/lib/supabase/admin";
import type { OrderRow, OrderItemRow, OrderWithItems } from "@/lib/types/order";

type RecentOrderItemRow = Pick<OrderItemRow, "product_name_en" | "quantity">;

type RecentOrderRow = Pick<
  OrderRow,
  "id" | "order_number" | "status" | "total_amount" | "created_at"
> & {
  order_items: RecentOrderItemRow[];
};

function mapOrderRow(row: OrderRow): OrderRow {
  return {
    id: row.id,
    user_id: row.user_id,
    order_number: row.order_number,
    status: row.status,
    payment_status: row.payment_status,
    payment_method: row.payment_method,
    subtotal: row.subtotal,
    shipping_fee: row.shipping_fee,
    discount_amount: row.discount_amount,
    total_amount: row.total_amount,
    customer_name: row.customer_name,
    customer_phone: row.customer_phone,
    city: row.city,
    area: row.area,
    street_address: row.street_address,
    notes: row.notes,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

export async function getOrders(userId: string, limit = 20): Promise<OrderRow[]> {
  const { data, error } = await supabaseAdmin
    .from("orders")
    .select(
      `id, user_id, order_number, status, payment_status, payment_method,
       subtotal, shipping_fee, discount_amount, total_amount,
       customer_name, customer_phone, city, area, street_address,
       notes, created_at, updated_at`,
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit)
    .overrideTypes<OrderRow[]>();

  if (error) throw new Error(`[getOrders] ${error.message}`);
  return (data ?? []).map(mapOrderRow);
}

export async function getOrderById(
  orderId: string,
  userId: string,
): Promise<OrderWithItems | null> {
  const { data, error } = await supabaseAdmin
    .from("orders")
    .select(
      `id, user_id, order_number, status, payment_status, payment_method,
       subtotal, shipping_fee, discount_amount, total_amount,
       customer_name, customer_phone, city, area, street_address,
       notes, created_at, updated_at,
       order_items(
         id, order_id, product_id, product_code,
         product_name_en, product_name_ar, product_image_url,
         unit_price, quantity, line_total, created_at
       )`,
    )
    .eq("id", orderId)
    .eq("user_id", userId)
    .single()
    .overrideTypes<OrderWithItems>();

  if (error) {
    if (error.code === "PGRST116") return null;
    throw new Error(`[getOrderById] ${error.message}`);
  }

  if (!data) return null;

  return {
    ...mapOrderRow(data),
    order_items: data.order_items ?? [],
  } as OrderWithItems;
}

export async function getRecentOrders(
  userId: string,
  limit = 5,
): Promise<RecentOrderRow[]> {
  const { data, error } = await supabaseAdmin
    .from("orders")
    .select(
      `id, order_number, status, total_amount, created_at,
       order_items(product_name_en, quantity)`,
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit)
    .overrideTypes<RecentOrderRow[]>();

  if (error) throw new Error(`[getRecentOrders] ${error.message}`);
  return data ?? [];
}
