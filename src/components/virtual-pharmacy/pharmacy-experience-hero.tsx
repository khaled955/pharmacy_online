"use client";

// [NEW] PharmacyExperienceHero — enhanced hero with pharmacist mascot + "Start Your Journey" CTA
// [SAFE] Replaces HeroSection only when ENABLE_VIRTUAL_EXPERIENCE=true; original file untouched
// [WARNING] Framer Motion entrance animations — negligible perf cost

import Link from "next/link";
import {
  Search,
  ShieldCheck,
  Truck,
  Clock,
  Star,
  Stethoscope,
  HeartPulse,
  Pill,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { motion } from "framer-motion";
import type { Easing } from "framer-motion";
import { cn } from "@/lib/utils/tailwind-merge";

/* ─── Static data (same as original hero) ──────────────────────── */
const trustBadges = [
  { icon: ShieldCheck, label: "Secure Checkout",  color: "text-primary" },
  { icon: Star,        label: "Trusted Products", color: "text-amber-500 dark:text-amber-400" },
  { icon: Truck,       label: "Fast Delivery",    color: "text-emerald-600 dark:text-emerald-400" },
  { icon: Clock,       label: "24/7 Support",     color: "text-sky-500 dark:text-sky-400" },
];

const popularSearches = ["Panadol", "Vitamin C", "Aspirin", "Centrum", "Skin Care"];

/* ─── Pharmacist tips shown in mascot card ──────────────────────── */
const pharmacistTips = [
  "Stay hydrated — drink at least 8 glasses of water a day",
  "Take vitamins with food for better absorption",
  "Store medicines away from heat and humidity",
];

/* ─── Shared ease constant (typed to satisfy Framer Motion v12) ─── */
const EASE_OUT: Easing = "easeOut";

/** Helper: returns the animation object for a staggered fade-up entrance */
function fadeUp(delay: number) {
  return {
    initial: { opacity: 0, y: 20 } as const,
    animate: { opacity: 1, y: 0 } as const,
    transition: { duration: 0.45, ease: EASE_OUT, delay },
  };
}

/** Helper: returns the animation object for a staggered fade-in entrance */
function fadeIn(delay: number) {
  return {
    initial: { opacity: 0 } as const,
    animate: { opacity: 1 } as const,
    transition: { duration: 0.4, ease: EASE_OUT, delay },
  };
}

/* ─── Pharmacist Mascot illustration (inline, zero extra deps) ──── */
function PharmacistMascot() {
  return (
    <div
      className={cn(
        "relative flex h-60 w-60 items-center justify-center",
        "rounded-3xl border border-border/50",
        "bg-gradient-to-br from-primary/8 via-accent/30 to-background",
        "shadow-card",
      )}
    >
      {/* Coat silhouette */}
      <div className="relative flex flex-col items-center">
        {/* Head */}
        <div className="h-16 w-16 rounded-full bg-amber-100 dark:bg-amber-900/30 border-2 border-amber-200/60 dark:border-amber-700/40 flex items-center justify-center">
          <Stethoscope className="h-7 w-7 text-primary" />
        </div>
        {/* Body / white coat */}
        <div className="mt-2 flex flex-col items-center gap-1">
          <div className="h-20 w-24 rounded-b-2xl bg-white dark:bg-slate-100/10 border border-border/60 flex flex-col items-center justify-center gap-2 shadow-sm">
            <div className="flex items-center gap-1.5">
              <HeartPulse className="h-4 w-4 text-rose-500" />
              <Pill className="h-4 w-4 text-primary" />
            </div>
            <div className="h-1 w-12 rounded-full bg-primary/20" />
            <div className="h-1 w-8 rounded-full bg-primary/10" />
          </div>
        </div>
      </div>

      {/* Floating badge: "Pharmacist" */}
      <div
        className={cn(
          "absolute -top-3 left-1/2 -translate-x-1/2",
          "flex items-center gap-1 rounded-full px-3 py-1",
          "bg-primary text-white text-xs font-semibold shadow-sm whitespace-nowrap",
        )}
      >
        <Sparkles className="h-3 w-3" />
        Your Pharmacist
      </div>

      {/* Tip bubble */}
      <div
        className={cn(
          "absolute -right-4 top-8",
          "max-w-[130px] rounded-2xl rounded-tl-none border border-border",
          "bg-card px-3 py-2 shadow-card",
          "text-[11px] leading-snug text-muted-foreground",
        )}
      >
        💊 {pharmacistTips[0]}
      </div>
    </div>
  );
}

/* ─── Main component ────────────────────────────────────────────── */
export default function PharmacyExperienceHero() {
  /** Smooth-scroll to the virtual shelf section */
  function handleStartJourney() {
    document.getElementById("virtual-shelf")?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <section className={cn("relative overflow-hidden", "bg-gradient-hero")}>
      {/* Decorative blobs — identical to original hero */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -end-24 -top-24 h-96 w-96 rounded-full bg-primary/8 blur-3xl dark:bg-primary/6"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -start-16 bottom-0 h-72 w-72 rounded-full bg-secondary/60 blur-3xl dark:bg-primary/4"
      />

      <div className="section-container relative py-14 md:py-20">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">

          {/* ── Left: copy + search + CTAs ─────────────────────── */}
          <div className="flex flex-col justify-center">

            {/* [NEW] Pharmacist welcome badge */}
            <motion.div {...fadeIn(0)} className="mb-3 inline-flex w-fit items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary">
              <HeartPulse className="h-3.5 w-3.5" />
              Welcome, how can I help you today?
            </motion.div>

            {/* [MODIFIED] Heading — same copy, added entrance animation */}
            <motion.h1
              {...fadeUp(0.08)}
              className="mb-4 text-4xl font-extrabold leading-tight tracking-tight text-foreground sm:text-5xl"
            >
              Your trusted{" "}
              <span className="text-gradient-brand">online pharmacy</span>
              {" "}for everyday care
            </motion.h1>

            <motion.p
              {...fadeUp(0.15)}
              className="mb-8 max-w-lg text-base leading-relaxed text-muted-foreground"
            >
              Order medicines, vitamins, skincare and wellness essentials with
              fast delivery, trusted products, and smart AI assistance.
            </motion.p>

            {/* Search bar — [SAFE] identical to original */}
            <motion.div {...fadeUp(0.22)}>
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
            </motion.div>

            {/* [NEW] CTAs — includes new "Start Your Pharmacy Journey" */}
            <motion.div {...fadeUp(0.3)} className="mt-8 flex flex-wrap gap-3">
              {/* [NEW] Primary CTA — scrolls to virtual shelf */}
              <button
                type="button"
                onClick={handleStartJourney}
                className={cn(
                  "inline-flex items-center gap-2 rounded-xl px-6 py-2.5",
                  "bg-gradient-brand text-sm font-semibold text-white",
                  "shadow-sm transition-all hover:opacity-90 hover:shadow-md",
                )}
              >
                Start Your Pharmacy Journey
                <ChevronRight className="h-4 w-4" />
              </button>

              {/* [SAFE] Secondary CTA — links to products */}
              <Link
                href="/products"
                className={cn(
                  "inline-flex items-center rounded-xl border border-border px-6 py-2.5",
                  "bg-card text-sm font-semibold text-foreground",
                  "shadow-sm transition-all hover:border-primary/30 hover:text-primary",
                )}
              >
                Browse All Products
              </Link>
            </motion.div>
          </div>

          {/* ── Right: Pharmacist mascot ─────────────────────────── */}
          <motion.div
            {...fadeIn(0.15)}
            className="relative hidden lg:flex flex-col items-center justify-center gap-6"
          >
            <PharmacistMascot />

            {/* Stats grid below mascot */}
            <div className="grid grid-cols-2 gap-3 w-full max-w-xs">
              {[
                { label: "Products",  value: "10,000+" },
                { label: "Brands",    value: "500+" },
                { label: "Customers", value: "250K+" },
                { label: "Delivery",  value: "Same Day" },
              ].map(({ label, value }, i) => (
                <motion.div
                  key={label}
                  {...fadeUp(0.3 + i * 0.06)}
                  className={cn(
                    "rounded-xl border border-border bg-card px-4 py-3",
                    "shadow-card",
                  )}
                >
                  <p className="text-lg font-bold text-primary">{value}</p>
                  <p className="text-xs text-muted-foreground">{label}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── Trust badges bar — [SAFE] identical to original ──────── */}
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
