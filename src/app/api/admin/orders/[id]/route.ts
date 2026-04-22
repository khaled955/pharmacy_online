import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { AuthUser } from "@/lib/types/auth";
import { getAdminOrderDetail } from "@/lib/services/orders/get-admin-orders.service";

async function requireAdmin(req: NextRequest): Promise<AuthUser | null> {
  const token = await getToken({ req });
  const user = token?.user as AuthUser | undefined;
  if (!user || user.role !== "admin") return null;
  return user;
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await requireAdmin(req);
  if (!user) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;
  const data = await getAdminOrderDetail(id);

  if (!data) return NextResponse.json({ error: "Order not found" }, { status: 404 });

  return NextResponse.json(data);
}
