import Link from "next/link";
import { ShieldCheck, Search } from "lucide-react";
import { fetchUserProfileService } from "@/lib/services/user/fetch-user-profile.service";
import { AUTH_ROUTES } from "@/lib/constants/auth";
import LogoutButton from "./logout-button";
import ThemeToggle from "./theme-toggle";
import Greeting from "./greeting";
import { Avatar } from "@/components/ui/avatar";
import { cn } from "@/lib/utils/tailwind-merge";
import { CartBadge } from "@/components/shop/cart-badge";
import { WishlistBadge } from "@/components/shop/wishlist-badge";

const navLinks = [
  { label: "Home",        href: "/" },
  { label: "Medicine",    href: "/products?category=medicines" },
  { label: "Categories",  href: "/products" },
  { label: "Best Sellers",href: "/products?sort=best-sellers" },
  { label: "Offers",      href: "/products?offers=true" },
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

          {/* Search bar — hidden on mobile, shown md+ */}
          <div className="hidden flex-1 max-w-md md:flex">
            <div
              className={cn(
                "relative flex h-10 w-full items-center overflow-hidden rounded-xl",
                "border border-border bg-background/70",
                "focus-within:border-primary/40 focus-within:bg-background",
                "focus-within:ring-4 focus-within:ring-primary/10",
                "transition-all duration-200",
              )}
            >
              <Search className="ms-3 h-4 w-4 shrink-0 text-muted-foreground" />
              <input
                type="search"
                placeholder="Search medicines, vitamins, brands…"
                className={cn(
                  "h-full w-full bg-transparent px-2.5",
                  "text-sm text-foreground placeholder:text-muted-foreground/70",
                  "border-0 outline-none ring-0",
                )}
              />
            </div>
          </div>

          {/* Right cluster */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Mobile search icon */}
            <button
              type="button"
              aria-label="Search"
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-xl",
                "border border-border bg-card text-muted-foreground",
                "shadow-sm transition-all duration-200",
                "hover:border-primary/30 hover:bg-primary/5 hover:text-primary",
                "md:hidden",
              )}
            >
              <Search className="h-4 w-4" />
            </button>

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
                <Avatar
                  src={profile.avatar_url}
                  fallback={profile.first_name}
                  alt={profile.first_name}
                  size="sm"
                />
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

      {/* ── Navigation links bar — hidden on mobile ── */}
      <div className="hidden border-t border-border/50 md:block">
        <div className="section-container">
          <nav
            aria-label="Main navigation"
            className="flex items-center gap-1 py-1.5"
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-lg px-3 py-1.5 text-sm font-medium",
                  "text-muted-foreground transition-colors duration-150",
                  "hover:bg-primary/5 hover:text-primary",
                )}
              >
                {link.label}
              </Link>
            ))}

            <div className="ms-auto flex items-center gap-1">
              <Link
                href="/about"
                className={cn(
                  "rounded-lg px-3 py-1.5 text-sm font-medium",
                  "text-muted-foreground transition-colors duration-150",
                  "hover:bg-primary/5 hover:text-primary",
                )}
              >
                About Us
              </Link>
              <Link
                href="/support"
                className={cn(
                  "rounded-lg px-3 py-1.5 text-sm font-medium",
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
