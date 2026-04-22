import "server-only";
import { Resend } from "resend";
import { customerOrderTemplate } from "@/lib/templates/email/customer-order-template";
import type { OrderEmailPayload } from "@/lib/types/email";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendCustomerOrderEmail(payload: OrderEmailPayload): Promise<void> {
  if (!payload.customerEmail) {
    console.warn("[sendCustomerOrderEmail] No customer email — skipping");
    return;
  }

  try {
    await resend.emails.send({
      from: process.env.EMAIL_FROM ?? "MedBox <onboarding@resend.dev>",
      to: payload.customerEmail,
      subject: `✅ Order Confirmed — #${payload.orderNumber}`,
      html: customerOrderTemplate(payload),
    });
  } catch (err) {
    console.error("[sendCustomerOrderEmail] Failed:", err instanceof Error ? err.message : err);
  }
}
