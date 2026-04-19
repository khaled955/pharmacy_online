import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getWishlistProductIds } from "@/lib/services/wishlist/get-wishlist.service";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json([]);

  try {
    const ids = await getWishlistProductIds(user.id);
    return NextResponse.json(ids);
  } catch {
    return NextResponse.json([]);
  }
}
