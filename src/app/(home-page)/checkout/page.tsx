import type { Metadata } from "next";
import { ShieldCheck } from "lucide-react";
import { CheckoutForm } from "./_components/checkout-form";

export const metadata: Metadata = { title: "Checkout" };

export default function CheckoutPage() {
  return (
    <div className="section-container py-8">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
          <ShieldCheck className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-foreground">Checkout</h1>
          <p className="text-xs text-muted-foreground">Secure & encrypted order</p>
        </div>
      </div>

      <CheckoutForm />
    </div>
  );
}
