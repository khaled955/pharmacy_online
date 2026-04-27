import { HeadphonesIcon, Mail, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils/tailwind-merge";
import { Card, CardContent } from "@/components/ui/card";

export const metadata = { title: "Support | MedBox Dashboard" };

const channels = [
  {
    icon: Mail,
    label: "Email Support",
    desc: "Send us an email and we'll respond within 24 hours.",
    action: "mailto:support@medbox.com",
    actionLabel: "Send Email",
  },
  {
    icon: MessageCircle,
    label: "Live Chat",
    desc: "Chat with our support team in real time.",
    action: "#",
    actionLabel: "Start Chat",
  },
];

export default function DashboardSupportPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-foreground">Support</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Get help from our team
        </p>
      </div>

      <Card>
        <CardContent className="flex flex-col items-center gap-3 py-8 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
            <HeadphonesIcon className="h-8 w-8 text-primary" />
          </div>
          <p className="text-base font-semibold text-foreground">How can we help?</p>
          <p className="max-w-sm text-sm text-muted-foreground">
            Our pharmacist support team is available 24/7 to assist you with orders,
            medications, or any account issues.
          </p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {channels.map(({ icon: Icon, label, desc, action, actionLabel }) => (
          <Card key={label}>
            <CardContent className="flex flex-col gap-4 py-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                <Icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">{label}</p>
                <p className="mt-1 text-xs text-muted-foreground">{desc}</p>
              </div>
              <a
                href={action}
                className={cn(
                  "inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-medium",
                  "border border-border bg-card text-foreground shadow-sm",
                  "hover:border-primary/30 hover:bg-primary/5 hover:text-primary transition-colors",
                )}
              >
                {actionLabel}
              </a>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
