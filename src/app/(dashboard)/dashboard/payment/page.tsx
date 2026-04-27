import { CreditCard } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export const metadata = { title: "Payment | MedBox Dashboard" };

export default function DashboardPaymentPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-foreground">Payment</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your payment methods
        </p>
      </div>

      <Card>
        <CardContent className="flex flex-col items-center gap-4 py-16 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
            <CreditCard className="h-8 w-8 text-muted-foreground" />
          </div>
          <div>
            <p className="text-base font-semibold text-foreground">No payment methods</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Payment method management will be available soon.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
