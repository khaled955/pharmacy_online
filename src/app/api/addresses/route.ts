import { NextRequest, NextResponse } from "next/server";
import { getRouteUserId } from "@/lib/auth/get-route-user-id";
import { getAddresses } from "@/lib/services/addresses/get-addresses.service";

export async function GET(req: NextRequest) {
  const userId = await getRouteUserId(req);
  if (!userId) return NextResponse.json([]);

  try {
    const addresses = await getAddresses(userId);
    return NextResponse.json(addresses);
  } catch {
    return NextResponse.json([]);
  }
}
