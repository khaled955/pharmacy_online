"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { saveAddressAction, deleteAddressAction } from "@/lib/addresses/save-address.action";
import { QUERY_KEYS, SHOP_MUTATION_KEYS } from "@/lib/constants/shop";
import type { AddressRow, AddressInput } from "@/lib/types/order";

async function fetchAddresses(): Promise<AddressRow[]> {
  const res = await fetch("/api/addresses");
  if (!res.ok) throw new Error("Failed to fetch addresses");
  return res.json();
}

export function useAddresses() {
  return useQuery<AddressRow[]>({
    queryKey: QUERY_KEYS.ADDRESSES,
    queryFn: fetchAddresses,
    staleTime: 1000 * 60 * 5,
  });
}

export function useSaveAddress() {
  const queryClient = useQueryClient();

  const { mutate: saveAddress, isPending: saveAddressPending } = useMutation<
    AddressRow,
    Error,
    AddressInput
  >({
    mutationKey: SHOP_MUTATION_KEYS.SAVE_ADDRESS,
    mutationFn: async (input) => {
      const response = await saveAddressAction(input);
      if (!response.status) throw new Error(response.message);
      return response.data!;
    },
    onSuccess: () => {
      toast.success("Address saved!");
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ADDRESSES });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to save address");
    },
  });

  return { saveAddress, saveAddressPending };
}

export function useDeleteAddress() {
  const queryClient = useQueryClient();

  const { mutate: deleteAddress, isPending: deleteAddressPending } = useMutation<
    void,
    Error,
    string
  >({
    mutationKey: SHOP_MUTATION_KEYS.DELETE_ADDRESS,
    mutationFn: async (addressId) => {
      const response = await deleteAddressAction(addressId);
      if (!response.status) throw new Error(response.message);
    },
    onSuccess: () => {
      toast.success("Address removed");
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ADDRESSES });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to remove address");
    },
  });

  return { deleteAddress, deleteAddressPending };
}
