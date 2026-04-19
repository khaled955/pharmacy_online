import type { ProductCardData } from "./product";

// ─── Payloads ────────────────────────────────────────────────────────────────

export type AddToCartPayload = {
  productId: string;
  quantity: number;
};

export type UpdateCartItemPayload = {
  cartItemId: string;
  quantity: number;
};

export type RemoveFromCartPayload = {
  cartItemId: string;
};

export type ToggleWishlistPayload = {
  productId: string;
};

export type AddressInput = {
  label?: string;
  recipient_name: string;
  phone: string;
  city: string;
  area: string;
  street_address: string;
  building?: string;
  floor?: string;
  apartment?: string;
  notes?: string;
  is_default?: boolean;
  lat?: number;
  lng?: number;
};

export type CreateOrderPayload = {
  addressId?: string;
  addressInput?: AddressInput;
  paymentMethod: string;
  notes?: string;
};

export type CreateOrderResult = {
  order: OrderRow;
  adminWhatsAppUrl: string;
};

// ─── Status enums ─────────────────────────────────────────────────────────────

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
