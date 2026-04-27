import type { Metadata } from "next";
import { ShoppingCart } from "lucide-react";
import { CartList } from "./_components/cart-list";

export const metadata: Metadata = { title: "My Cart" };

export default function CartPage() {
  return (
    <div className="section-container py-8">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
          <ShoppingCart className="h-5 w-5 text-primary" />
        </div>
        <h1 className="text-2xl font-extrabold text-foreground">My Cart</h1>
      </div>

      <CartList />
    </div>
  );
}
