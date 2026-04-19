import Link from "next/link";
import { Search, ShieldCheck, Truck, Clock, Star } from "lucide-react";
import { cn } from "@/lib/utils/tailwind-merge";

const trustBadges = [
  { icon: ShieldCheck, label: "Secure Checkout",    color: "text-primary" },
  { icon: Star,        label: "Trusted Products",   color: "text-amber-500 dark:text-amber-400" },
  { icon: Truck,       label: "Fast Delivery",      color: "text-emerald-600 dark:text-emerald-400" },
  { icon: Clock,       label: "24/7 Support",       color: "text-sky-500 dark:text-sky-400" },
];

const popularSearches = [
  "Panadol", "Vitamin C", "Aspirin", "Centrum", "Skin Care",
];

export default function HeroSection() {
  return (
    <section
      className={cn(
        "relative overflow-hidden",
        "bg-gradient-hero",
      )}
    >
      {/* Decorative background blobs */}
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute -end-24 -top-24",
          "h-96 w-96 rounded-full",
          "bg-primary/8 blur-3xl",
          "dark:bg-primary/6",
        )}
      />
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute -start-16 bottom-0",
          "h-72 w-72 rounded-full",
          "bg-secondary/60 blur-3xl",
          "dark:bg-primary/4",
        )}
      />

      <div className="section-container relative py-14 md:py-20">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">

          {/* Left: copy + search */}
          <div className="flex flex-col justify-center">
            <div className="mb-3 inline-flex w-fit items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary">
              <ShieldCheck className="h-3.5 w-3.5" />
              Your trusted online pharmacy
            </div>

            <h1 className="mb-4 text-4xl font-extrabold leading-tight tracking-tight text-foreground sm:text-5xl">
              Your trusted{" "}
              <span className="text-gradient-brand">online pharmacy</span>
              {" "}for everyday care
            </h1>

            <p className="mb-8 max-w-lg text-base leading-relaxed text-muted-foreground">
              Order medicines, vitamins, skincare and wellness essentials with
              fast delivery, trusted products, and smart AI assistance.
            </p>

            {/* Search bar */}
            <div
              className={cn(
                "relative flex h-13 w-full max-w-lg items-center overflow-hidden rounded-2xl",
                "border border-border bg-card shadow-card",
                "focus-within:border-primary/40 focus-within:shadow-card-hover",
                "focus-within:ring-4 focus-within:ring-primary/10",
                "transition-all duration-200",
              )}
            >
              <Search className="ms-4 h-5 w-5 shrink-0 text-muted-foreground" />
              <input
                type="search"
                placeholder="Search for medicines, vitamins, brands…"
                className={cn(
                  "h-full flex-1 bg-transparent px-3",
                  "text-sm text-foreground placeholder:text-muted-foreground/60",
                  "border-0 outline-none ring-0",
                )}
              />
              <div className="p-1.5">
                <button
                  type="button"
                  className={cn(
                    "flex h-9 items-center gap-1.5 rounded-xl px-4",
                    "bg-gradient-brand text-sm font-semibold text-white",
                    "transition-opacity duration-150 hover:opacity-90",
                  )}
                >
                  Search
                </button>
              </div>
            </div>

            {/* Popular searches */}
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="text-xs text-muted-foreground">Popular:</span>
              {popularSearches.map((term) => (
                <Link
                  key={term}
                  href={`/products?q=${encodeURIComponent(term)}`}
                  className={cn(
                    "rounded-full border border-border bg-card px-2.5 py-0.5",
                    "text-xs text-muted-foreground",
                    "transition-colors hover:border-primary/30 hover:text-primary",
                  )}
                >
                  {term}
                </Link>
              ))}
            </div>

            {/* CTA buttons */}
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/products"
                className={cn(
                  "inline-flex items-center rounded-xl px-6 py-2.5",
                  "bg-gradient-brand text-sm font-semibold text-white",
                  "shadow-sm transition-all hover:opacity-90 hover:shadow-md",
                )}
              >
                Shop Now
              </Link>
              <Link
                href="/support"
                className={cn(
                  "inline-flex items-center gap-2 rounded-xl border border-border px-6 py-2.5",
                  "bg-card text-sm font-semibold text-foreground",
                  "shadow-sm transition-all hover:border-primary/30 hover:text-primary",
                )}
              >
                Ask AI Assistant
              </Link>
            </div>
          </div>

          {/* Right: visual placeholder (ready for real product hero image) */}
          <div
            className={cn(
              "relative hidden lg:flex items-center justify-center",
              "rounded-3xl overflow-hidden",
              "bg-gradient-to-br from-primary/8 via-accent/30 to-background",
              "border border-border/50 min-h-80",
            )}
          >
            <div className="flex flex-col items-center gap-4 text-center p-8">
              <div
                className={cn(
                  "flex h-24 w-24 items-center justify-center rounded-2xl",
                  "bg-gradient-brand shadow-lg",
                )}
              >
                <ShieldCheck className="h-12 w-12 text-white" />
              </div>
              <div>
                <p className="text-lg font-bold text-foreground">MedBox Pharmacy</p>
                <p className="text-sm text-muted-foreground">Your Health • Delivered</p>
              </div>
              <div className="mt-2 grid grid-cols-2 gap-3 text-start">
                {[
                  { label: "Products",  value: "10,000+" },
                  { label: "Brands",    value: "500+" },
                  { label: "Customers", value: "250K+" },
                  { label: "Delivery",  value: "Same Day" },
                ].map(({ label, value }) => (
                  <div
                    key={label}
                    className={cn(
                      "rounded-xl border border-border bg-card px-4 py-3",
                      "shadow-card",
                    )}
                  >
                    <p className="text-lg font-bold text-primary">{value}</p>
                    <p className="text-xs text-muted-foreground">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Trust badges bar ── */}
      <div className="border-t border-border/50 bg-card/60 backdrop-blur-sm">
        <div className="section-container">
          <ul className="flex flex-wrap items-center justify-center divide-x divide-border/50 py-3">
            {trustBadges.map(({ icon: Icon, label, color }) => (
              <li
                key={label}
                className="flex items-center gap-2 px-5 py-2 text-sm font-medium text-foreground"
              >
                <Icon className={cn("h-4 w-4", color)} />
                {label}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
