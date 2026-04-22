import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { AuthUser } from "@/lib/types/auth";
import { getTopProducts } from "@/lib/services/dashboard/get-top-products.service";

async function requireAdmin(req: NextRequest): Promise<AuthUser | null> {
  const token = await getToken({ req });
  const user = token?.user as AuthUser | undefined;
  if (!user || user.role !== "admin") return null;
  return user;
}

export async function GET(req: NextRequest) {
  const user = await requireAdmin(req);
  if (!user) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const data = await getTopProducts(10);
  return NextResponse.json(data);
}
