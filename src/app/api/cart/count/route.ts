import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getCartCount } from "@/lib/services/cart/get-cart.service";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ count: 0 });

  try {
    const count = await getCartCount(user.id);
    return NextResponse.json({ count });
  } catch {
    return NextResponse.json({ count: 0 });
  }
}
