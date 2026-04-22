import type { OrderStatus } from "./order";

export type AdminOrderStats = {
  total_orders: number;
  pending_orders: number;
  confirmed_orders: number;
  ready_orders: number;
  cancelled_orders: number;
  active_revenue: number;
};

export type DailyRevenue = {
  day: string;
  revenue: number;
  orders_count: number;
};

export type MonthlyRevenue = {
  month: string;
  revenue: number;
  orders_count: number;
};

export type TopProduct = {
  product_name_en: string;
  product_name_ar: string;
  product_image_url: string | null;
  total_quantity: number;
  total_revenue: number;
};

export type AdminOrder = {
  id: string;
  order_number: string;
  status: OrderStatus;
  customer_name: string | null;
  customer_phone: string | null;
  total_amount: number;
  payment_method: string | null;
  created_at: string;
  items_count?: number;
};

export type AdminOrderDetail = {
  id: string;
  order_number: string;
  status: OrderStatus;
  customer_name: string | null;
  customer_phone: string | null;
  subtotal: number;
  shipping_fee: number;
  discount_amount: number;
  total_amount: number;
  payment_method: string | null;
  notes: string | null;
  city: string | null;
  area: string | null;
  street_address: string | null;
  created_at: string;
  order_items: Array<{
    id: string;
    product_name_en: string;
    product_name_ar: string;
    product_image_url: string | null;
    quantity: number;
    unit_price: number;
    line_total: number;
  }>;
};
