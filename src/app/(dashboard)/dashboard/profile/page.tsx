import { User, Mail, Phone, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils/tailwind-merge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { fetchUserProfileService } from "@/lib/services/user/fetch-user-profile.service";

export const metadata = { title: "Profile | MedBox Dashboard" };

export default async function DashboardProfilePage() {
  const profile = await fetchUserProfileService();

  if (!profile) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-extrabold text-foreground">Profile</h1>
        <p className="text-sm text-muted-foreground">Unable to load profile.</p>
      </div>
    );
  }

  const fullName = `${profile.first_name} ${profile.last_name}`;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-foreground">Profile</h1>
        <p className="mt-1 text-sm text-muted-foreground">Your account details</p>
      </div>

      <Card>
        <CardContent className="flex flex-col items-center gap-5 py-8 sm:flex-row sm:items-start sm:gap-8 sm:px-8">
          <Avatar
            src={profile.avatar_url}
            fallback={profile.first_name}
            alt={fullName}
            size="lg"
          />
          <div>
            <h2 className="text-xl font-bold text-foreground">{fullName}</h2>
            <p className="mt-0.5 text-sm text-muted-foreground">{profile.email}</p>
            <span
              className={cn(
                "mt-2 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold",
                "bg-primary/10 text-primary",
              )}
            >
              <ShieldCheck className="h-3.5 w-3.5" />
              Admin
            </span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="divide-y divide-border py-0">
          {[
            { icon: User,  label: "Full Name", value: fullName },
            { icon: Mail,  label: "Email",     value: profile.email },
            { icon: Phone, label: "Phone",     value: profile.phone ?? "Not provided" },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-center gap-4 py-4 px-6">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                <Icon className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className="mt-0.5 text-sm font-medium text-foreground">{value}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
