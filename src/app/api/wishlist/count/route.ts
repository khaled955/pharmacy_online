import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getWishlistCount } from "@/lib/services/wishlist/get-wishlist.service";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ count: 0 });

  try {
    const count = await getWishlistCount(user.id);
    return NextResponse.json({ count });
  } catch {
    return NextResponse.json({ count: 0 });
  }
}
