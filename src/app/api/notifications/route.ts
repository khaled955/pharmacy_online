import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { AuthUser } from "@/lib/types/auth";
import {
  getAdminNotifications,
  markNotificationRead,
  markAllNotificationsRead,
} from "@/lib/services/notifications/get-notifications";

async function requireAdmin(req: NextRequest): Promise<AuthUser | null> {
  const token = await getToken({ req });
  const user = token?.user as AuthUser | undefined;
  if (!user || user.role !== "admin") return null;
  return user;
}

// GET /api/notifications — admin only
export async function GET(req: NextRequest) {
  const user = await requireAdmin(req);
  if (!user) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const notifications = await getAdminNotifications(30);
  return NextResponse.json(notifications);
}

// PATCH /api/notifications — mark one or all as read
export async function PATCH(req: NextRequest) {
  const user = await requireAdmin(req);
  if (!user) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = (await req.json().catch(() => ({}))) as { id?: string; all?: boolean };

  if (body.all) {
    await markAllNotificationsRead();
    return NextResponse.json({ ok: true });
  }

  if (body.id) {
    await markNotificationRead(body.id);
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: "Provide id or all:true" }, { status: 400 });
}
