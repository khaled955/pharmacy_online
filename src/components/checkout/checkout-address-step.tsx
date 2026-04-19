"use client";
import { useState } from "react";
import { MapPin, Plus, Check } from "lucide-react";
import { cn } from "@/lib/utils/tailwind-merge";
import { Button } from "@/components/ui/button";
import { useAddresses } from "@/hooks/addresses/use-addresses";
import type { AddressRow, AddressInput } from "@/lib/types/order";
import { AddressMapPicker, type MapCoords } from "./address-map-picker";

interface CheckoutAddressStepProps {
  onSelect: (addressId: string | null, newAddress: AddressInput | null) => void;
  selectedAddressId: string | null;
}

const EMPTY_FORM: AddressInput = {
  recipient_name: "",
  phone: "",
  city: "",
  area: "",
  street_address: "",
  building: "",
  floor: "",
  apartment: "",
  notes: "",
  is_default: false,
};

export function CheckoutAddressStep({
  onSelect,
  selectedAddressId,
}: CheckoutAddressStepProps) {
  const { data: addresses = [], isLoading } = useAddresses();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<AddressInput>(EMPTY_FORM);
  const [mapCoords, setMapCoords] = useState<MapCoords | undefined>();

  function handleSelectSaved(addr: AddressRow) {
    setShowForm(false);
    onSelect(addr.id, null);
  }

  function handleSubmitNew() {
    if (!form.recipient_name || !form.phone || !form.city || !form.street_address) return;
    onSelect(null, { ...form, lat: mapCoords?.lat, lng: mapCoords?.lng });
    setShowForm(false);
  }

  function update(field: keyof AddressInput, value: string | boolean) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-bold text-foreground">Delivery Address</h3>

      {/* Saved addresses */}
      {isLoading ? (
        <div className="space-y-2">
          {[1, 2].map((i) => (
            <div key={i} className="h-16 animate-pulse rounded-xl bg-muted" />
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {addresses.map((addr) => (
            <button
              key={addr.id}
              type="button"
              onClick={() => handleSelectSaved(addr)}
              className={cn(
                "w-full text-start rounded-xl border p-3 transition-all",
                "text-sm text-foreground",
                selectedAddressId === addr.id
                  ? "border-primary bg-primary/5"
                  : "border-border bg-card hover:border-primary/30",
              )}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <MapPin className="h-4 w-4 shrink-0 text-primary mt-0.5" />
                  <div className="min-w-0">
                    <p className="font-semibold truncate">{addr.recipient_name}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {[addr.city, addr.area, addr.street_address].filter(Boolean).join(", ")}
                    </p>
                    {addr.phone && (
                      <p className="text-xs text-muted-foreground">{addr.phone}</p>
                    )}
                  </div>
                </div>
                {selectedAddressId === addr.id && (
                  <Check className="h-4 w-4 shrink-0 text-primary" />
                )}
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Add new address toggle */}
      {!showForm ? (
        <Button
          variant="outline"
          size="sm"
          className="gap-2"
          onClick={() => {
            setShowForm(true);
            onSelect(null, null);
          }}
        >
          <Plus className="h-4 w-4" />
          Add new address
        </Button>
      ) : (
        <div className="rounded-xl border border-border bg-card p-4 space-y-3">
          <p className="text-sm font-semibold text-foreground">New Address</p>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Field
              label="Recipient name *"
              value={form.recipient_name}
              onChange={(v) => update("recipient_name", v)}
              placeholder="Full name"
            />
            <Field
              label="Phone *"
              value={form.phone}
              onChange={(v) => update("phone", v)}
              placeholder="+966 5xxxxxxxx"
            />
            <Field
              label="City *"
              value={form.city}
              onChange={(v) => update("city", v)}
              placeholder="City"
            />
            <Field
              label="Area / District *"
              value={form.area}
              onChange={(v) => update("area", v)}
              placeholder="Area"
            />
            <Field
              label="Street address *"
              value={form.street_address}
              onChange={(v) => update("street_address", v)}
              placeholder="Street"
              className="sm:col-span-2"
            />
            <Field
              label="Building"
              value={form.building ?? ""}
              onChange={(v) => update("building", v)}
              placeholder="Building no."
            />
            <Field
              label="Floor / Apartment"
              value={form.floor ?? ""}
              onChange={(v) => update("floor", v)}
              placeholder="Floor / Apt"
            />
            <Field
              label="Notes"
              value={form.notes ?? ""}
              onChange={(v) => update("notes", v)}
              placeholder="Delivery notes (optional)"
              className="sm:col-span-2"
            />
          </div>

          {/* Map picker */}
          <AddressMapPicker value={mapCoords} onChange={setMapCoords} />

          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={handleSubmitNew}
              disabled={
                !form.recipient_name || !form.phone || !form.city || !form.street_address
              }
            >
              Use this address
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setShowForm(false);
                setForm(EMPTY_FORM);
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  className,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  className?: string;
}) {
  return (
    <label className={cn("flex flex-col gap-1 text-xs", className)}>
      <span className="font-medium text-muted-foreground">{label}</span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={cn(
          "rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground",
          "placeholder:text-muted-foreground/60 outline-none",
          "focus:border-primary/40 focus:ring-2 focus:ring-primary/10",
          "transition-all duration-200",
        )}
      />
    </label>
  );
}
