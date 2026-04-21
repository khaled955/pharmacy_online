import Link from "next/link";
import { Heart, Package } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export const metadata = { title: "Wishlist | MedBox Dashboard" };

export default async function DashboardWishlistPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let count = 0;
  if (user?.id) {
    const { count: c } = await supabaseAdmin
      .from("wishlist_items")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id);
    count = c ?? 0;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-foreground">Wishlist</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {count > 0 ? `${count} saved item${count === 1 ? "" : "s"}` : "Your wishlist is empty"}
        </p>
      </div>

      <Card>
        <CardContent className="flex flex-col items-center gap-4 py-16 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-50 dark:bg-rose-500/10">
            <Heart className="h-8 w-8 text-rose-500" />
          </div>
          <div>
            <p className="text-base font-semibold text-foreground">
              {count > 0 ? `${count} item${count === 1 ? "" : "s"} saved` : "No items saved"}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Manage your wishlist from the shop.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-3 mt-2">
            <Link
              href="/wishlist"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-brand px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:opacity-90 transition-opacity"
            >
              <Heart className="h-4 w-4" />
              View Wishlist
            </Link>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-5 py-2.5 text-sm font-medium text-foreground shadow-sm hover:border-primary/30 hover:bg-primary/5 transition-colors"
            >
              <Package className="h-4 w-4" />
              Browse Products
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
