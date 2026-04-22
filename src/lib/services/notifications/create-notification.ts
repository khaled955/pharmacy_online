import "server-only";
import { supabaseAdmin } from "@/lib/supabase/admin";

export type NotificationType = "NEW_ORDER" | "ORDER_STATUS";

type CreateNotificationInput = {
  type: NotificationType;
  title: string;
  message: string;
  orderId?: string;
};

export async function createAdminNotification(input: CreateNotificationInput): Promise<void> {
  const { error } = await supabaseAdmin.from("notifications").insert({
    type: input.type,
    title: input.title,
    message: input.message,
    order_id: input.orderId ?? null,
    is_read: false,
  });

  if (error) {
    console.error("[createAdminNotification]", error.message);
  }
}
