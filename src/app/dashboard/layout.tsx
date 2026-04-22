import Link from "next/link";
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Heart,
  User,
  MapPin,
  CreditCard,
  HeadphonesIcon,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils/tailwind-merge";
import ThemeToggle from "@/components/layout/navbar/theme-toggle";
import { NotificationsBell } from "@/components/dashboard/notifications-bell";
import type { AuthUser } from "@/lib/types/auth";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/next-auth";

/* ─── Sidebar nav items — ready for dynamic active state ── */
const navSections = [
  {
    label: "Overview",
    items: [
      { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
      { icon: ShoppingBag,     label: "Orders",    href: "/dashboard/orders" },
    ],
  },
  {
    label: "Catalogue",
    items: [
      { icon: Package, label: "Products",  href: "/dashboard/products" },
      { icon: Heart,   label: "Wishlist",  href: "/dashboard/wishlist" },
    ],
  },
  {
    label: "Account",
    items: [
      { icon: User,        label: "Profile",   href: "/dashboard/profile" },
      { icon: MapPin,      label: "Addresses", href: "/dashboard/addresses" },
      { icon: CreditCard,  label: "Payment",   href: "/dashboard/payment" },
    ],
  },
  {
    label: "Help",
    items: [
      { icon: HeadphonesIcon, label: "Support",  href: "/dashboard/support" },
    ],
  },
];

function Sidebar() {
  return (
    <aside
      className={cn(
        "hidden lg:flex flex-col",
        "w-60 shrink-0",
        "sticky top-0 h-screen overflow-y-auto",
        "border-e border-border bg-sidebar",
      )}
    >
      {/* Brand */}
      <div className="flex h-16 items-center gap-2.5 border-b border-border px-5">
        <div
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-lg",
            "bg-gradient-brand shadow-sm",
          )}
        >
          <ShieldCheck className="h-4 w-4 text-white" />
        </div>
        <span className="text-sm font-bold text-sidebar-foreground">MedBox</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-5 px-3 py-5">
        {navSections.map((section) => (
          <div key={section.label}>
            <p className="mb-1.5 px-2 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
              {section.label}
            </p>
            <ul className="space-y-0.5">
              {section.items.map(({ icon: Icon, label, href }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className={cn(
                      "flex items-center gap-3 rounded-xl px-3 py-2.5",
                      "text-sm font-medium text-sidebar-foreground",
                      "transition-colors duration-150",
                      "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                      // Active state placeholder:
                      // "bg-sidebar-accent text-sidebar-primary"
                    )}
                  >
                    <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      {/* Bottom: theme + back to shop */}
      <div className="border-t border-border p-4 space-y-2">
        <Link
          href="/"
          className={cn(
            "flex items-center gap-2 rounded-xl px-3 py-2",
            "text-xs font-medium text-muted-foreground",
            "hover:text-foreground transition-colors",
          )}
        >
          <ChevronRight className="h-3.5 w-3.5 rotate-180" />
          Back to Shop
        </Link>
      </div>
    </aside>
  );
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  const user = session?.user as AuthUser | undefined;
  const isAdmin = user?.role === "admin";

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />

      {/* Main area */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Top bar */}
        <header
          className={cn(
            "sticky top-0 z-40 flex h-16 items-center justify-between",
            "border-b border-border bg-card/90 backdrop-blur-md px-6",
          )}
        >
          <div className="flex items-center gap-3">
            {/* Mobile: logo */}
            <Link href="/" className="flex items-center gap-2 lg:hidden">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-brand">
                <ShieldCheck className="h-4 w-4 text-white" />
              </div>
              <span className="text-sm font-bold text-foreground">MedBox</span>
            </Link>
          </div>

          <div className="flex items-center gap-2 ms-auto">
            {isAdmin && <NotificationsBell />}
            <ThemeToggle />
          </div>
        </header>

        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
