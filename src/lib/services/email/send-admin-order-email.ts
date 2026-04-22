import "server-only";
import { Resend } from "resend";
import { adminOrderTemplate } from "@/lib/templates/email/admin-order-template";
import type { OrderEmailPayload } from "@/lib/types/email";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendAdminOrderEmail(payload: OrderEmailPayload): Promise<void> {
  const adminEmail = process.env.ADMIN_EMAIL;
  if (!adminEmail) {
    console.warn("[sendAdminOrderEmail] ADMIN_EMAIL not set — skipping");
    return;
  }

  try {
    await resend.emails.send({
      from: process.env.EMAIL_FROM ?? "MedBox <onboarding@resend.dev>",
      to: adminEmail,
      subject: `🆕 New Order #${payload.orderNumber} — $${payload.totalAmount.toFixed(2)}`,
      html: adminOrderTemplate(payload),
    });
  } catch (err) {
    console.error("[sendAdminOrderEmail] Failed:", err instanceof Error ? err.message : err);
  }
}
