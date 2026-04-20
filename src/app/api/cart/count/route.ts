import { NextRequest, NextResponse } from "next/server";
import { getRouteUserId } from "@/lib/auth/get-route-user-id";
import { getCartCount } from "@/lib/services/cart/get-cart.service";

export async function GET(req: NextRequest) {
  const userId = await getRouteUserId(req);
  if (!userId) return NextResponse.json({ count: 0 });

  try {
    const count = await getCartCount(userId);
    return NextResponse.json({ count });
  } catch {
    return NextResponse.json({ count: 0 });
  }
}
