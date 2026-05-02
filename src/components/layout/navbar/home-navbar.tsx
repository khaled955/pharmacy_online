import Link from "next/link";
import { ShieldCheck, LayoutDashboard } from "lucide-react";
import { fetchUserProfileService } from "@/lib/services/user/fetch-user-profile.service";
import { AUTH_ROUTES } from "@/lib/constants/auth.constant";
import LogoutButton from "./logout-button";
import ThemeToggle from "./theme-toggle";
import Greeting from "./greeting";
import { Avatar } from "@/components/ui/avatar";
import { cn } from "@/lib/utils/tailwind-merge";
import { CartBadge } from "@/components/shop/cart-badge";
import { WishlistBadge } from "@/components/shop/wishlist-badge";
import { NavbarDesktopSearch, NavbarMobileSearch } from "./navbar-search";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Medicine", href: "/products?category=medicines" },
  { label: "Categories", href: "/products" },
  { label: "Best Sellers", href: "/products?sort=best-sellers" },
  { label: "Offers", href: "/products?offers=true" },
];

export default async function HomeNavbar() {
  const profile = await fetchUserProfileService();

  return (
    <header
      className={cn(
        "sticky top-0 z-50",
        "border-b border-border",
        "bg-card/90 backdrop-blur-md",
        "supports-[backdrop-filter]:bg-card/80",
      )}
    >
      {/* ── Top bar ── */}
      <div className="section-container">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex shrink-0 items-center gap-2.5">
            <div
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-xl",
                "bg-gradient-brand shadow-sm",
              )}
            >
              <ShieldCheck className="h-5 w-5 text-white" />
            </div>
            <span className="text-base font-bold tracking-tight text-foreground">
              MedBox
            </span>
          </Link>

          {/* Search — desktop bar (md+) opens overlay dialog */}
          <NavbarDesktopSearch />

          {/* Right cluster */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Search — mobile icon (hidden md+) opens overlay dialog */}
            <NavbarMobileSearch />

            {/* Wishlist — dynamic count badge */}
            <WishlistBadge />

            {/* Cart — dynamic count badge */}
            <CartBadge />

            {/* Theme toggle */}
            <ThemeToggle />

            {/* Separator */}
            <div className="h-5 w-px bg-border" aria-hidden="true" />

            {/* Auth section */}
            {profile ? (
              <div className="flex items-center gap-2">
                <Greeting firstName={profile.first_name} />
                <Link
                  href={profile.role === "admin" ? "/dashboard" : "/profile"}
                  aria-label={
                    profile.role === "admin"
                      ? "Go to dashboard"
                      : "Go to profile"
                  }
                  className={cn(
                    "rounded-xl transition-all duration-200",
                    "hover:ring-2 hover:ring-primary/30 hover:ring-offset-1",
                  )}
                >
                  <Avatar
                    src={profile.avatar_url}
                    fallback={profile.first_name}
                    alt={profile.first_name}
                    size="sm"
                  />
                </Link>
                <LogoutButton />
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href={AUTH_ROUTES.LOGIN}
                  className={cn(
                    "rounded-xl px-4 py-2 text-sm font-medium",
                    "text-foreground border border-border bg-card",
                    "shadow-sm transition-all duration-200",
                    "hover:border-primary/30 hover:bg-primary/5 hover:text-primary",
                    "hidden sm:inline-flex",
                  )}
                >
                  Sign in
                </Link>
                <Link
                  href={AUTH_ROUTES.REGISTER}
                  className={cn(
                    "inline-flex rounded-xl px-4 py-2 text-sm font-medium",
                    "bg-gradient-brand text-white",
                    "shadow-sm transition-all duration-200",
                    "hover:opacity-90 hover:shadow-md",
                  )}
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Navigation links bar — scrollable on mobile ── */}
      <div className="border-t border-border/50">
        <div className="section-container">
          <nav
            aria-label="Main navigation"
            className={cn(
              "flex items-center gap-1 py-1.5",
              "overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none]",
              "[&::-webkit-scrollbar]:hidden",
            )}
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "shrink-0 rounded-lg px-3 py-1.5 text-sm font-medium",
                  "text-muted-foreground transition-colors duration-150",
                  "hover:bg-primary/5 hover:text-primary",
                )}
              >
                {link.label}
              </Link>
            ))}

            <div className="ms-auto flex shrink-0 items-center gap-1">
              {profile && (
                <Link
                  href="/allOrders"
                  className={cn(
                    "shrink-0 rounded-lg px-3 py-1.5 text-sm font-medium",
                    "text-muted-foreground transition-colors duration-150",
                    "hover:bg-primary/5 hover:text-primary",
                  )}
                >
                  My Orders
                </Link>
              )}
              <Link
                href="/dashboard"
                className={cn(
                  "shrink-0 hidden items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium",
                  "text-muted-foreground transition-colors duration-150",
                  "hover:bg-primary/5 hover:text-primary",
                  profile?.role === "admin" ? "md:flex" : "hidden",
                )}
              >
                <LayoutDashboard className="h-3.5 w-3.5" />
                Dashboard
              </Link>
              <Link
                href="/about"
                className={cn(
                  "shrink-0 rounded-lg px-3 py-1.5 text-sm font-medium",
                  "text-muted-foreground transition-colors duration-150",
                  "hover:bg-primary/5 hover:text-primary",
                )}
              >
                About Us
              </Link>
              <Link
                href="/support"
                className={cn(
                  "shrink-0 rounded-lg px-3 py-1.5 text-sm font-medium",
                  "text-muted-foreground transition-colors duration-150",
                  "hover:bg-primary/5 hover:text-primary",
                )}
              >
                Support
              </Link>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
