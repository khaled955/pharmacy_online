import type { Metadata } from "next";
import { Heart } from "lucide-react";
import { WishlistGrid } from "./_components/wishlist-grid";

export const metadata: Metadata = { title: "My Wishlist" };

export default function WishlistPage() {
  return (
    <div className="section-container py-8">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-100 dark:bg-rose-950">
          <Heart className="h-5 w-5 text-rose-500" />
        </div>
        <h1 className="text-2xl font-extrabold text-foreground">My Wishlist</h1>
      </div>

      <WishlistGrid />
    </div>
  );
}
