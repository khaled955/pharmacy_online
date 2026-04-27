"use client";
import { useState } from "react";
import { CreditCard, Banknote, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils/tailwind-merge";
import { Button } from "@/components/ui/button";
import { CheckoutAddressStep } from "@/components/checkout/checkout-address-step";
import { OrderSummary } from "@/components/shop/order-summary";
import { EmptyState } from "@/components/shared/empty-state";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/hooks/cart/use-cart";
import { useCreateOrder } from "@/hooks/orders/use-create-order";
import type { AddressInput } from "@/lib/types/order";
import Link from "next/link";

const PAYMENT_METHODS = [
  { id: "cash_on_delivery", label: "Cash on Delivery", icon: Banknote },
  { id: "card_online", label: "Credit / Debit Card", icon: CreditCard },
] as const;

type Step = "address" | "review";

export function CheckoutForm() {
  const { data: cartItems = [], isLoading } = useCart();
  const { createOrder, createOrderPending } = useCreateOrder();

  const [step, setStep] = useState<Step>("address");
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [newAddress, setNewAddress] = useState<AddressInput | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<string>("cash_on_delivery");
  const [notes, setNotes] = useState("");

  function handleAddressSelect(addressId: string | null, address: AddressInput | null) {
    setSelectedAddressId(addressId);
    setNewAddress(address);
  }

  const addressReady = selectedAddressId !== null || newAddress !== null;

  function handlePlaceOrder() {
    createOrder({
      addressId: selectedAddressId ?? undefined,
      addressInput: newAddress ?? undefined,
      paymentMethod,
      notes: notes.trim() || undefined,
    });
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-4">
          {[1, 2].map((i) => <div key={i} className="h-32 animate-pulse rounded-2xl bg-muted" />)}
        </div>
        <div className="h-64 animate-pulse rounded-2xl bg-muted" />
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <EmptyState
        icon={<ShoppingCart className="h-8 w-8" />}
        title="Your cart is empty"
        description="Add items to your cart before checking out."
        action={<Button asChild><Link href="/products">Browse Products</Link></Button>}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
      {/* Left: steps */}
      <div className="space-y-4">
        {/* Step indicator */}
        <div className="flex items-center gap-2 text-sm">
          <StepDot active={step === "address"} done={step === "review"} label="1. Address" />
          <ChevronRight className="h-3 w-3 text-muted-foreground" />
          <StepDot active={step === "review"} done={false} label="2. Review & Pay" />
        </div>

        {step === "address" && (
          <div className="space-y-4">
            <CheckoutAddressStep
              onSelect={handleAddressSelect}
              selectedAddressId={selectedAddressId}
            />
            <Button
              disabled={!addressReady}
              onClick={() => setStep("review")}
              className="w-full"
            >
              Continue to Review
            </Button>
          </div>
        )}

        {step === "review" && (
          <div className="space-y-4">
            {/* Address summary */}
            <div className="rounded-xl border border-border bg-card p-4 text-sm space-y-1">
              <p className="font-semibold text-foreground">Delivery Address</p>
              {selectedAddressId && (
                <p className="text-muted-foreground">Using saved address</p>
              )}
              {newAddress && (
                <p className="text-muted-foreground">
                  {[newAddress.city, newAddress.area, newAddress.street_address]
                    .filter(Boolean)
                    .join(", ")}
                </p>
              )}
              <button
                type="button"
                className="text-xs text-primary hover:underline"
                onClick={() => setStep("address")}
              >
                Change address
              </button>
            </div>

            {/* Payment */}
            <div className="space-y-2">
              <p className="text-sm font-semibold text-foreground">Payment Method</p>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {PAYMENT_METHODS.map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setPaymentMethod(id)}
                    className={cn(
                      "flex items-center gap-3 rounded-xl border p-3 text-sm transition-all",
                      paymentMethod === id
                        ? "border-primary bg-primary/5 text-foreground"
                        : "border-border bg-card text-muted-foreground hover:border-primary/30",
                    )}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Notes */}
            <label className="flex flex-col gap-1 text-xs">
              <span className="font-medium text-muted-foreground">Order Notes (optional)</span>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any special instructions for your order…"
                className={cn(
                  "rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground",
                  "placeholder:text-muted-foreground/60 outline-none resize-none",
                  "focus:border-primary/40 focus:ring-2 focus:ring-primary/10",
                )}
              />
            </label>
          </div>
        )}
      </div>

      {/* Right: summary + CTA */}
      <div className="space-y-3">
        <OrderSummary items={cartItems} />

        {step === "review" && (
          <Button
            className="w-full bg-gradient-brand hover:opacity-90"
            size="lg"
            disabled={createOrderPending}
            onClick={handlePlaceOrder}
          >
            {createOrderPending ? "Placing order…" : "Place Order"}
          </Button>
        )}
      </div>
    </div>
  );
}

function StepDot({
  active,
  done,
  label,
}: {
  active: boolean;
  done: boolean;
  label: string;
}) {
  return (
    <span
      className={cn(
        "text-sm font-medium transition-colors",
        active && "text-primary",
        done && "text-emerald-600 dark:text-emerald-400",
        !active && !done && "text-muted-foreground",
      )}
    >
      {label}
    </span>
  );
}
