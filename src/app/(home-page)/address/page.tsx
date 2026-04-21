import { redirect } from "next/navigation";
import { MapPin, Home, Building2, Plus } from "lucide-react";
import { cn } from "@/lib/utils/tailwind-merge";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getAuthUserId } from "@/lib/auth/get-auth-user-id";
import { getAddresses } from "@/lib/services/addresses/get-addresses.service";

export const metadata = { title: "My Addresses | MedBox" };

export default async function AddressPage() {
  const userId = await getAuthUserId();
  if (!userId) redirect("/login?callbackUrl=/address");

  const addresses = await getAddresses(userId);

  return (
    <div className="section-container py-10 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-foreground">My Addresses</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your saved delivery addresses
          </p>
        </div>
      </div>

      {addresses.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-4 py-16 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
              <MapPin className="h-8 w-8 text-muted-foreground" />
            </div>
            <div>
              <p className="text-base font-semibold text-foreground">No addresses saved</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Add a delivery address during checkout.
              </p>
            </div>
            <a
              href="/products"
              className={cn(
                "mt-2 inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium",
                "bg-gradient-brand text-white shadow-sm hover:opacity-90 transition-opacity",
              )}
            >
              <Plus className="h-4 w-4" />
              Start Shopping
            </a>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {addresses.map((addr) => (
            <Card key={addr.id} className={cn(addr.is_default && "border-primary/30")}>
              <CardContent className="flex items-start gap-4 py-5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                  {addr.label?.toLowerCase().includes("home") ? (
                    <Home className="h-5 w-5 text-primary" />
                  ) : (
                    <Building2 className="h-5 w-5 text-primary" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-foreground">
                      {addr.label ?? "Address"}
                    </p>
                    {addr.is_default && (
                      <Badge variant="info">Default</Badge>
                    )}
                  </div>
                  {addr.recipient_name && (
                    <p className="mt-1 text-xs text-muted-foreground">{addr.recipient_name}</p>
                  )}
                  <p className="mt-1 text-sm text-foreground">
                    {[addr.street_address, addr.area, addr.city]
                      .filter(Boolean)
                      .join(", ")}
                  </p>
                  {addr.phone && (
                    <p className="mt-1 text-xs text-muted-foreground">{addr.phone}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
