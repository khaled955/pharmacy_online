import "server-only";
import { supabaseAdmin } from "@/lib/supabase/admin";
import type { AddressRow } from "@/lib/types/order";
import { SHOP_TABLES } from "@/lib/constants/shop";

export async function getAddresses(userId: string): Promise<AddressRow[]> {
  const { data, error } = await supabaseAdmin
    .from(SHOP_TABLES.ADDRESSES)
    .select("*")
    .eq("user_id", userId)
    .order("is_default", { ascending: false })
    .order("created_at", { ascending: false })
    .overrideTypes<AddressRow[]>();

  if (error) throw new Error(`[getAddresses] ${error.message}`);
  return data ?? [];
}

export async function getAddressById(
  addressId: string,
  userId: string,
): Promise<AddressRow | null> {
  const { data, error } = await supabaseAdmin
    .from(SHOP_TABLES.ADDRESSES)
    .select("*")
    .eq("id", addressId)
    .eq("user_id", userId)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null;
    throw new Error(`[getAddressById] ${error.message}`);
  }

  return data as unknown as AddressRow | null;
}
