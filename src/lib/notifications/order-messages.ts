import type { OrderRow, OrderWithItems } from "@/lib/types/order";

// ─── Types ────────────────────────────────────────────────────────────────────

type AdminOrderItem = {
  name: string;
  quantity: number;
  unitPrice: number;
};

type AdminMessageInput = {
  order: OrderRow;
  items: AdminOrderItem[];
};

// ─── User message ─────────────────────────────────────────────────────────────

export function buildUserOrderMessage(order: OrderWithItems): string {
  const itemLines = order.order_items
    .map((i) => `  • ${i.product_name_en} × ${i.quantity} — $${i.line_total.toFixed(2)}`)
    .join("\n");

  const addressLine = [order.city, order.area, order.street_address]
    .filter(Boolean)
    .join(", ");

  return `
🧾 Order Confirmation — #${order.order_number}

Items:
${itemLines}

Subtotal:      $${order.subtotal.toFixed(2)}
Shipping:      $${order.shipping_fee.toFixed(2)}
Total:         $${order.total_amount.toFixed(2)}

Payment:       ${order.payment_method ?? "N/A"}
Delivery to:   ${addressLine || "N/A"}
Status:        ${order.status}
${order.notes ? `\nNotes: ${order.notes}` : ""}

Thank you for your order at MedBox! 🏥
`.trim();
}

// ─── Admin WhatsApp message ───────────────────────────────────────────────────

export function buildAdminWhatsAppMessage(input: AdminMessageInput): string {
  const { order, items } = input;

  const itemLines = items
    .map((i) => `  • ${i.name} × ${i.quantity} ($${(i.unitPrice * i.quantity).toFixed(2)})`)
    .join("\n");

  const addressLine = [order.city, order.area, order.street_address]
    .filter(Boolean)
    .join(", ");

  return `
🚨 *NEW ORDER* — #${order.order_number}

👤 Customer: ${order.customer_name ?? "N/A"}
📞 Phone: ${order.customer_phone ?? "N/A"}
📍 Address: ${addressLine || "N/A"}

🛒 Items:
${itemLines}

💰 Subtotal: $${order.subtotal.toFixed(2)}
🚚 Shipping: $${order.shipping_fee.toFixed(2)}
✅ Total: *$${order.total_amount.toFixed(2)}*

💳 Payment: ${order.payment_method ?? "N/A"}
${order.notes ? `\n📝 Notes: ${order.notes}` : ""}
`.trim();
}

export function buildAdminWhatsAppUrl(
  adminPhone: string,
  input: AdminMessageInput,
): string {
  const message = buildAdminWhatsAppMessage(input);
  const encoded = encodeURIComponent(message);
  const phone = adminPhone.replace(/\D/g, "");
  return phone
    ? `https://wa.me/${phone}?text=${encoded}`
    : `https://wa.me/?text=${encoded}`;
}
