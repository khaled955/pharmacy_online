import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { AuthUser } from "@/lib/types/auth";
import { getAdminOrders } from "@/lib/services/orders/get-admin-orders.service";

async function requireAdmin(req: NextRequest): Promise<AuthUser | null> {
  const token = await getToken({ req });
  const user = token?.user as AuthUser | undefined;
  if (!user || user.role !== "admin") return null;
  return user;
}

export async function GET(req: NextRequest) {
  const user = await requireAdmin(req);
  if (!user) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const type = req.nextUrl.searchParams.get("type");

  type AdminView =
    | "dashboard_recent_orders"
    | "dashboard_pending_orders"
    | "dashboard_processing_orders";

  let view: AdminView;
  switch (type) {
    case "pending":
      view = "dashboard_pending_orders";
      break;
    case "confirmed":
      view = "dashboard_processing_orders";
      break;
    default:
      view = "dashboard_recent_orders";
  }

  const data = await getAdminOrders(view, 50);
  return NextResponse.json(data);
}
