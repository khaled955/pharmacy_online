"use server";
import { createClient } from "@/lib/supabase/server";
import type { AuthResponse } from "@/lib/types/auth";
import type { AddressRow, AddressInput } from "@/lib/types/order";
import { SHOP_TABLES } from "@/lib/constants/shop";

export async function saveAddressAction(
  input: AddressInput,
): Promise<AuthResponse<AddressRow>> {
  const supabase = await createClient();

  try {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { status: false, message: "Unauthorized", data: null };
    }

    if (input.is_default) {
      await supabase
        .from(SHOP_TABLES.ADDRESSES)
        .update({ is_default: false })
        .eq("user_id", user.id);
    }

    const { data, error } = await supabase
      .from(SHOP_TABLES.ADDRESSES)
      .insert({
        user_id: user.id,
        label: input.label ?? null,
        recipient_name: input.recipient_name,
        phone: input.phone,
        city: input.city,
        area: input.area,
        street_address: input.street_address,
        building: input.building ?? null,
        floor: input.floor ?? null,
        apartment: input.apartment ?? null,
        notes: input.notes ?? null,
        is_default: input.is_default ?? false,
      })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return { status: true, message: "Address saved", data: data as unknown as AddressRow };
  } catch (err: unknown) {
    return {
      status: false,
      message: err instanceof Error ? err.message : "Failed to save address",
      data: null,
    };
  }
}

export async function deleteAddressAction(
  addressId: string,
): Promise<AuthResponse<null>> {
  const supabase = await createClient();

  try {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { status: false, message: "Unauthorized", data: null };
    }

    const { error } = await supabase
      .from(SHOP_TABLES.ADDRESSES)
      .delete()
      .eq("id", addressId)
      .eq("user_id", user.id);

    if (error) throw new Error(error.message);
    return { status: true, message: "Address deleted", data: null };
  } catch (err: unknown) {
    return {
      status: false,
      message: err instanceof Error ? err.message : "Failed to delete address",
      data: null,
    };
  }
}
