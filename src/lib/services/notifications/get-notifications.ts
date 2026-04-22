import "server-only";
import { supabaseAdmin } from "@/lib/supabase/admin";

export type NotificationRow = {
  id: string;
  type: string;
  title: string;
  message: string;
  order_id: string | null;
  is_read: boolean;
  created_at: string;
};

export async function getAdminNotifications(limit = 30): Promise<NotificationRow[]> {
  const { data, error } = await supabaseAdmin
    .from("notifications")
    .select("id, type, title, message, order_id, is_read, created_at")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("[getAdminNotifications]", error.message);
    return [];
  }

  return (data ?? []) as NotificationRow[];
}

export async function getUnreadNotificationCount(): Promise<number> {
  const { count, error } = await supabaseAdmin
    .from("notifications")
    .select("*", { count: "exact", head: true })
    .eq("is_read", false);

  if (error) {
    console.error("[getUnreadNotificationCount]", error.message);
    return 0;
  }

  return count ?? 0;
}

export async function markNotificationRead(id: string): Promise<void> {
  const { error } = await supabaseAdmin
    .from("notifications")
    .update({ is_read: true })
    .eq("id", id);

  if (error) {
    console.error("[markNotificationRead]", error.message);
  }
}

export async function markAllNotificationsRead(): Promise<void> {
  const { error } = await supabaseAdmin
    .from("notifications")
    .update({ is_read: true })
    .eq("is_read", false);

  if (error) {
    console.error("[markAllNotificationsRead]", error.message);
  }
}
