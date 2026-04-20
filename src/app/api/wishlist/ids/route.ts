import { NextRequest, NextResponse } from "next/server";
import { getRouteUserId } from "@/lib/auth/get-route-user-id";
import { getWishlistProductIds } from "@/lib/services/wishlist/get-wishlist.service";

export async function GET(req: NextRequest) {
  const userId = await getRouteUserId(req);
  if (!userId) return NextResponse.json([]);

  try {
    const ids = await getWishlistProductIds(userId);
    return NextResponse.json(ids);
  } catch {
    return NextResponse.json([]);
  }
}
