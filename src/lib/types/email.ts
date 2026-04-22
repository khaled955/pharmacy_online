export type OrderEmailItem = {
  name: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
};

export type OrderEmailPayload = {
  orderNumber: string;
  customerName: string | null;
  customerEmail: string;
  customerPhone: string | null;
  address: string;
  items: OrderEmailItem[];
  subtotal: number;
  shippingFee: number;
  totalAmount: number;
  paymentMethod: string | null;
  notes: string | null;
  createdAt: string;
};
