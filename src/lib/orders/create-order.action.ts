"use server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { getAuthUserId } from "@/lib/auth/get-auth-user-id";
import type { AuthResponse } from "@/lib/types/auth";
import type {
  CreateOrderPayload,
  CreateOrderResult,
  OrderRow,
  OrderItemRow,
} from "@/lib/types/order";
import { SHOP_TABLES, SHIPPING_FEE, FREE_SHIPPING_THRESHOLD } from "@/lib/constants/shop";
import { buildAdminWhatsAppUrl } from "@/lib/notifications/order-messages";
import { sendAdminOrderEmail } from "@/lib/services/email/send-admin-order-email";
import { sendCustomerOrderEmail } from "@/lib/services/email/send-customer-order-email";
import { createAdminNotification } from "@/lib/services/notifications/create-notification";
import type { OrderEmailPayload } from "@/lib/types/email";

type CartItemWithProduct = {
  id: string;
  product_id: string;
  quantity: number;
  products: {
    id: string;
    name_en: string;
    name_ar: string;
    price: number;
    original_price: number | null;
    image_url: string | null;
    code: string | null;
    stock: number;
  } | null;
};

function generateOrderNumber(): string {
  const ts = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `ORD-${ts}-${rand}`;
}

export async function createOrderAction(
  payload: CreateOrderPayload,
): Promise<AuthResponse<CreateOrderResult>> {
  const userId = await getAuthUserId();
  if (!userId) {
    return { status: false, message: "Please log in to place an order", data: null };
  }

  try {
    // 1 — Fetch cart with joined product prices (server-validated)
    const { data: cartItems, error: cartError } = await supabaseAdmin
      .from(SHOP_TABLES.CART)
      .select(
        `
        id,
        product_id,
        quantity,
        products:product_id (
          id,
          name_en,
          name_ar,
          price,
          original_price,
          image_url,
          code,
          stock
        )
      `,
      )
      .eq("user_id", userId)
      .overrideTypes<CartItemWithProduct[]>();

    if (cartError) throw new Error(cartError.message);
    if (!cartItems || cartItems.length === 0) {
      return { status: false, message: "Your cart is empty", data: null };
    }

    // 2 — Validate stock and calculate server-side totals
    for (const item of cartItems) {
      if (!item.products) throw new Error(`Product not found for cart item ${item.id}`);
      if (item.products.stock < item.quantity) {
        throw new Error(
          `"${item.products.name_en}" only has ${item.products.stock} units available`,
        );
      }
    }

    const subtotal = cartItems.reduce(
      (sum, item) => sum + (item.products?.price ?? 0) * item.quantity,
      0,
    );
    const shippingFee = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
    const discountAmount = 0;
    const totalAmount = subtotal + shippingFee - discountAmount;

    // 3 — Resolve address
    let addressData = {
      customer_name: null as string | null,
      customer_phone: null as string | null,
      city: null as string | null,
      area: null as string | null,
      street_address: null as string | null,
      notes: null as string | null,
    };

    if (payload.addressId) {
      const { data: addr } = await supabaseAdmin
        .from(SHOP_TABLES.ADDRESSES)
        .select("*")
        .eq("id", payload.addressId)
        .eq("user_id", userId)
        .single();

      if (addr) {
        addressData = {
          customer_name: addr.recipient_name,
          customer_phone: addr.phone,
          city: addr.city,
          area: addr.area,
          street_address: addr.street_address,
          notes: payload.notes ?? addr.notes,
        };
      }
    } else if (payload.addressInput) {
      const a = payload.addressInput;

      await supabaseAdmin.from(SHOP_TABLES.ADDRESSES).insert({
        user_id: userId,
        recipient_name: a.recipient_name,
        phone: a.phone,
        city: a.city,
        area: a.area,
        street_address: a.street_address,
        building: a.building ?? null,
        floor: a.floor ?? null,
        apartment: a.apartment ?? null,
        notes: a.notes ?? null,
        is_default: a.is_default ?? false,
      });

      addressData = {
        customer_name: a.recipient_name,
        customer_phone: a.phone,
        city: a.city,
        area: a.area,
        street_address: a.street_address,
        notes: payload.notes ?? a.notes ?? null,
      };
    }

    // 4 — Insert order row
    const orderNumber = generateOrderNumber();

    const { data: orderData, error: orderError } = await supabaseAdmin
      .from(SHOP_TABLES.ORDERS)
      .insert({
        user_id: userId,
        order_number: orderNumber,
        status: "pending",
        payment_status: "pending",
        payment_method: payload.paymentMethod,
        subtotal,
        shipping_fee: shippingFee,
        discount_amount: discountAmount,
        total_amount: totalAmount,
        ...addressData,
      })
      .select()
      .single();
    const order = orderData as unknown as OrderRow | null;

    if (orderError) throw new Error(orderError.message);
    if (!order) throw new Error("Failed to create order");

    // 5 — Insert order_items rows
    const orderItems: Omit<OrderItemRow, "id" | "created_at">[] = cartItems.map((item) => ({
      order_id: order.id,
      product_id: item.product_id,
      product_code: item.products?.code ?? null,
      product_name_en: item.products?.name_en ?? "",
      product_name_ar: item.products?.name_ar ?? "",
      product_image_url: item.products?.image_url ?? null,
      unit_price: item.products?.price ?? 0,
      quantity: item.quantity,
      line_total: (item.products?.price ?? 0) * item.quantity,
    }));

    const { error: itemsError } = await supabaseAdmin
      .from(SHOP_TABLES.ORDER_ITEMS)
      .insert(orderItems);

    if (itemsError) throw new Error(itemsError.message);

    // 6 — Clear cart
    const cartIds = cartItems.map((i) => i.id);
    await supabaseAdmin.from(SHOP_TABLES.CART).delete().in("id", cartIds);

    // 7 — Build admin WhatsApp URL
    const adminPhone = process.env.ADMIN_WHATSAPP_PHONE ?? "";
    const adminWhatsAppUrl = buildAdminWhatsAppUrl(adminPhone, {
      order,
      items: cartItems.map((item) => ({
        name: item.products?.name_en ?? "",
        quantity: item.quantity,
        unitPrice: item.products?.price ?? 0,
      })),
    });

    // 8 — Fetch customer email (non-blocking; does not gate admin notifications)
    const {
      data: { user: authUser },
    } = await supabaseAdmin.auth.admin.getUserById(userId);
    const customerEmail = authUser?.email ?? "";

    const addressLine = [order.city, order.area, order.street_address]
      .filter(Boolean)
      .join(", ");

    const emailPayload: OrderEmailPayload = {
      orderNumber: order.order_number,
      customerName: order.customer_name,
      customerEmail,
      customerPhone: order.customer_phone,
      address: addressLine || "N/A",
      items: cartItems.map((item) => ({
        name: item.products?.name_en ?? "",
        quantity: item.quantity,
        unitPrice: item.products?.price ?? 0,
        lineTotal: (item.products?.price ?? 0) * item.quantity,
      })),
      subtotal: order.subtotal,
      shippingFee: order.shipping_fee,
      totalAmount: order.total_amount,
      paymentMethod: order.payment_method,
      notes: order.notes,
      createdAt: order.created_at,
    };

    // 9 — Fire-and-forget: admin email + notification (always sent, not gated on customer email)
    void Promise.allSettled([
      sendAdminOrderEmail(emailPayload).catch((err) => {
        console.error(
          "[createOrder] Admin email failed:",
          err instanceof Error ? err.message : err,
        );
      }),
      createAdminNotification({
        type: "NEW_ORDER",
        title: "New Order Received",
        message: `New order #${order.order_number} from ${(order.customer_name ?? customerEmail) || "Unknown"} — $${order.total_amount.toFixed(2)}`,
        orderId: order.id,
      }),
    ]);

    // 10 — Customer confirmation email (only when we have their address)
    if (customerEmail) {
      void sendCustomerOrderEmail(emailPayload).catch((err) => {
        console.error(
          "[createOrder] Customer email failed:",
          err instanceof Error ? err.message : err,
        );
      });
    }

    return {
      status: true,
      message: "Order placed successfully!",
      data: { order, adminWhatsAppUrl },
    };
  } catch (err: unknown) {
    return {
      status: false,
      message: err instanceof Error ? err.message : "Failed to place order",
      data: null,
    };
  }
}
