import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getAddresses } from "@/lib/services/addresses/get-addresses.service";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json([]);

  try {
    const addresses = await getAddresses(user.id);
    return NextResponse.json(addresses);
  } catch {
    return NextResponse.json([]);
  }
}
