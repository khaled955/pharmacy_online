import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { getOrderById } from "@/lib/services/orders/get-orders.service";
import { OrderSuccessMessage } from "@/components/checkout/order-success-message";
import { buildAdminWhatsAppUrl } from "@/lib/notifications/order-messages";
import { WhatsAppAutoOpen } from "@/components/checkout/whatsapp-auto-open";

export const metadata: Metadata = { title: "Order Placed!" };

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ orderId?: string }>;
}) {
  const { orderId } = await searchParams;
  if (!orderId) redirect("/");

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const order = await getOrderById(orderId, user.id);
  if (!order) redirect("/");

  const adminPhone = process.env.ADMIN_WHATSAPP_PHONE ?? "";
  const adminWhatsAppUrl = buildAdminWhatsAppUrl(adminPhone, {
    order,
    items: order.order_items.map((item) => ({
      name: item.product_name_en,
      quantity: item.quantity,
      unitPrice: item.unit_price,
    })),
  });

  return (
    <div className="section-container py-8 max-w-lg mx-auto">
      <WhatsAppAutoOpen url={adminWhatsAppUrl} />
      <OrderSuccessMessage order={order} adminWhatsAppUrl={adminWhatsAppUrl} />
    </div>
  );
}
