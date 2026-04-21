import { redirect } from "next/navigation";
import { User, Mail, Lock, ShieldCheck, ShoppingBag, Heart } from "lucide-react";
import { cn } from "@/lib/utils/tailwind-merge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { fetchUserProfileService } from "@/lib/services/user/fetch-user-profile.service";
import { UpdateProfileForm } from "./_components/update-profile-form";
import { ChangePasswordForm } from "./_components/change-password-form";

export const metadata = { title: "My Profile | MedBox" };

export default async function ProfilePage() {
  const profile = await fetchUserProfileService();

  if (!profile) redirect("/login?callbackUrl=/profile");

  const fullName = `${profile.first_name} ${profile.last_name}`;

  return (
    <div className="section-container py-10 space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-foreground">My Profile</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your personal information and account settings
        </p>
      </div>

      {/* Profile overview */}
      <Card>
        <CardContent className="flex flex-col items-center gap-5 py-8 sm:flex-row sm:items-start sm:gap-8 sm:px-8">
          <Avatar
            src={profile.avatar_url}
            fallback={profile.first_name}
            alt={fullName}
            size="xl"
          />
          <div className="text-center sm:text-start">
            <h2 className="text-xl font-bold text-foreground">{fullName}</h2>
            <p className="mt-0.5 text-sm text-muted-foreground">{profile.email}</p>
            <span
              className={cn(
                "mt-2 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold",
                profile.role === "admin"
                  ? "bg-primary/10 text-primary"
                  : "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400",
              )}
            >
              <ShieldCheck className="h-3.5 w-3.5" />
              {profile.role === "admin" ? "Admin" : "Customer"}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Quick links */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {[
          {
            href: "/allOrders",
            icon: ShoppingBag,
            label: "My Orders",
            desc: "View order history",
          },
          {
            href: "/wishlist",
            icon: Heart,
            label: "Wishlist",
            desc: "Saved products",
          },
        ].map(({ href, icon: Icon, label, desc }) => (
          <a
            key={href}
            href={href}
            className={cn(
              "group flex items-center gap-4 rounded-2xl border border-border",
              "bg-card p-4 shadow-sm transition-all duration-200",
              "hover:-translate-y-0.5 hover:border-primary/20 hover:shadow-md",
            )}
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
              <Icon className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">{label}</p>
              <p className="text-xs text-muted-foreground">{desc}</p>
            </div>
          </a>
        ))}
      </div>

      {/* Edit profile form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-4 w-4 text-primary" />
            Edit Profile
          </CardTitle>
          <CardDescription>Update your personal information</CardDescription>
        </CardHeader>
        <CardContent className="pt-2">
          {/* Read-only email */}
          <div
            className={cn(
              "mb-5 flex items-center gap-3 rounded-xl",
              "border border-border bg-muted/40 px-4 py-3",
            )}
          >
            <Mail className="h-4 w-4 shrink-0 text-muted-foreground" />
            <div>
              <p className="text-xs font-medium text-muted-foreground">
                Email address (cannot be changed)
              </p>
              <p className="text-sm text-foreground">{profile.email}</p>
            </div>
          </div>

          <UpdateProfileForm
            first_name={profile.first_name}
            last_name={profile.last_name}
            phone={profile.phone}
          />
        </CardContent>
      </Card>

      {/* Change password */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-4 w-4 text-primary" />
            Change Password
          </CardTitle>
          <CardDescription>Update your account password</CardDescription>
        </CardHeader>
        <CardContent className="pt-2">
          <ChangePasswordForm />
        </CardContent>
      </Card>
    </div>
  );
}
