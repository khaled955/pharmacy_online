import { MapPin, Home, Building2 } from "lucide-react";
import { cn } from "@/lib/utils/tailwind-merge";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/server";
import { getAddresses } from "@/lib/services/addresses/get-addresses.service";

export const metadata = { title: "Addresses | MedBox Dashboard" };

export default async function DashboardAddressesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const addresses = user?.id ? await getAddresses(user.id) : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-foreground">Addresses</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {addresses.length > 0
            ? `${addresses.length} saved address${addresses.length === 1 ? "" : "es"}`
            : "No saved addresses"}
        </p>
      </div>

      {addresses.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-4 py-16 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
              <MapPin className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">
              Addresses are saved when you complete an order with a new address.
            </p>
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
                    {addr.is_default && <Badge variant="info">Default</Badge>}
                  </div>
                  {addr.recipient_name && (
                    <p className="mt-1 text-xs text-muted-foreground">{addr.recipient_name}</p>
                  )}
                  <p className="mt-1 text-sm text-foreground">
                    {[addr.street_address, addr.area, addr.city].filter(Boolean).join(", ")}
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
