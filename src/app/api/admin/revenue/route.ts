import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { AuthUser } from "@/lib/types/auth";
import { getDailyRevenue } from "@/lib/services/dashboard/get-daily-revenue.service";
import { getMonthlyRevenue } from "@/lib/services/dashboard/get-monthly-revenue.service";

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

  if (type === "monthly") {
    const data = await getMonthlyRevenue(12);
    return NextResponse.json(data);
  }

  const data = await getDailyRevenue(30);
  return NextResponse.json(data);
}
