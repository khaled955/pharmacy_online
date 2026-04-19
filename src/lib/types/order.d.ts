import type { ProductCardData } from "./product";

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "refunded";

export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";

export type OrderRow = {
  id: string;
  user_id: string;
  order_number: string;
  status: OrderStatus;
  payment_status: PaymentStatus;
  payment_method: string | null;
  subtotal: number;
  shipping_fee: number;
  discount_amount: number;
  total_amount: number;
  customer_name: string | null;
  customer_phone: string | null;
  city: string | null;
  area: string | null;
  street_address: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type OrderItemRow = {
  id: string;
  order_id: string;
  product_id: string | null;
  product_code: string | null;
  product_name_en: string;
  product_name_ar: string;
  product_image_url: string | null;
  unit_price: number;
  quantity: number;
  line_total: number;
  created_at: string;
};

export type OrderWithItems = OrderRow & {
  order_items: OrderItemRow[];
};

export type CartItemRow = {
  id: string;
  user_id: string;
  product_id: string;
  quantity: number;
  created_at: string;
  updated_at: string;
  products?: ProductCardData | null;
};

export type WishlistItemRow = {
  id: string;
  user_id: string;
  product_id: string;
  created_at: string;
  products?: ProductCardData | null;
};

export type AddressRow = {
  id: string;
  user_id: string;
  label: string | null;
  recipient_name: string | null;
  phone: string | null;
  city: string | null;
  area: string | null;
  street_address: string | null;
  building: string | null;
  floor: string | null;
  apartment: string | null;
  notes: string | null;
  is_default: boolean;
  created_at: string;
  updated_at: string;
};
