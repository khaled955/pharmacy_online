import Link from "next/link";
import {
  ShieldCheck,
  Truck,
  HeartPulse,
  BadgeCheck,
  Users,
  Star,
  Phone,
  Mail,
} from "lucide-react";
import { cn } from "@/lib/utils/tailwind-merge";
import { Card, CardContent } from "@/components/ui/card";

export const metadata = {
  title: "About Us | MedBox",
  description:
    "Learn about MedBox — your trusted online pharmacy for medicines, vitamins, and wellness products.",
};

const features = [
  {
    icon: BadgeCheck,
    title: "Licensed & Regulated",
    desc: "Fully licensed online pharmacy operating under strict pharmaceutical regulations to ensure your safety.",
  },
  {
    icon: HeartPulse,
    title: "24/7 Pharmacist Support",
    desc: "Our certified pharmacists are available around the clock to answer your health questions.",
  },
  {
    icon: Truck,
    title: "Fast & Reliable Delivery",
    desc: "Same-day delivery available in most cities. All orders tracked from warehouse to your door.",
  },
  {
    icon: Star,
    title: "100% Genuine Products",
    desc: "Every product is sourced directly from licensed manufacturers and authorised distributors.",
  },
  {
    icon: Users,
    title: "Trusted by Thousands",
    desc: "Serving thousands of customers across the region with consistent quality and care.",
  },
  {
    icon: ShieldCheck,
    title: "Secure & Private",
    desc: "Your personal and medical data is always protected with industry-grade security.",
  },
];

const stats = [
  { value: "10,000+", label: "Products" },
  { value: "50,000+", label: "Happy Customers" },
  { value: "24/7", label: "Pharmacist Support" },
  { value: "99%", label: "Satisfaction Rate" },
];

const highlights = [
  { icon: BadgeCheck, label: "Licensed Pharmacy" },
  { icon: ShieldCheck, label: "Secure Shopping" },
  { icon: HeartPulse, label: "Expert Pharmacists" },
  { icon: Truck, label: "Fast Delivery" },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* ── Hero ── */}
      <section className="section-container py-16 text-center">
        <div
          className={cn(
            "mb-6 inline-flex items-center gap-2 rounded-full px-4 py-1.5",
            "bg-primary/10 text-primary text-sm font-medium",
          )}
        >
          <ShieldCheck className="h-4 w-4" />
          Your Trusted Online Pharmacy
        </div>

        <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
          Caring for Your Health,
          <br />
          <span className="text-primary">Every Step of the Way</span>
        </h1>

        <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
          MedBox was founded with a simple mission — to make quality healthcare
          accessible, affordable, and convenient for everyone. We combine modern
          technology with genuine pharmaceutical expertise to bring you the best
          online pharmacy experience.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href="/products"
            className={cn(
              "inline-flex items-center gap-2 rounded-2xl px-6 py-3 text-sm font-semibold",
              "bg-gradient-brand text-white shadow-sm",
              "transition-all duration-200 hover:opacity-90 hover:shadow-md",
            )}
          >
            Shop Now
          </Link>
          <Link
            href="/support"
            className={cn(
              "inline-flex items-center gap-2 rounded-2xl px-6 py-3 text-sm font-semibold",
              "border border-border bg-card text-foreground shadow-sm",
              "transition-all duration-200 hover:border-primary/30 hover:bg-primary/5 hover:text-primary",
            )}
          >
            Contact Support
          </Link>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="border-y border-border bg-muted/30">
        <div className="section-container py-10">
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            {stats.map(({ value, label }) => (
              <div key={label} className="text-center">
                <p className="text-3xl font-extrabold text-primary">{value}</p>
                <p className="mt-1 text-sm text-muted-foreground">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Who we are ── */}
      <section className="section-container py-16">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight text-foreground">
              Who We Are
            </h2>
            <div className="mt-5 space-y-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
              <p>
                MedBox is a fully licensed online pharmacy dedicated to
                providing safe, high-quality medicines and wellness products
                directly to your home. We work with certified pharmaceutical
                distributors to ensure every product you receive is genuine and
                effective.
              </p>
              <p>
                Our team of registered pharmacists, healthcare professionals,
                and customer care specialists work together to give you a
                seamless and safe experience — from browsing our catalogue to
                receiving your order.
              </p>
              <p>
                We believe everyone deserves easy access to the medicines and
                health products they need, without the hassle of long queues or
                limited stock.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {highlights.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className={cn(
                  "flex flex-col items-center gap-3 rounded-2xl border border-border",
                  "bg-card p-5 text-center shadow-sm",
                )}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <p className="text-sm font-semibold text-foreground">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Our Mission ── */}
      <section className="border-y border-border bg-muted/30">
        <div className="section-container py-16 text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-foreground">
            Our Mission
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            To make quality healthcare products accessible to everyone through a
            safe, convenient, and professional online pharmacy experience —
            backed by real pharmacists and delivered with genuine care.
          </p>
        </div>
      </section>

      {/* ── Why choose us ── */}
      <section className="section-container py-16">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-foreground">
            Why Customers Choose MedBox
          </h2>
          <p className="mt-3 text-sm text-muted-foreground sm:text-base">
            Here&apos;s what sets us apart from a regular pharmacy
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(({ icon: Icon, title, desc }) => (
            <Card key={title}>
              <CardContent className="flex flex-col gap-4 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground">
                    {title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                    {desc}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* ── CTA banner ── */}
      <section className="section-container pb-16">
        <div className="rounded-3xl bg-gradient-brand p-10 text-center text-white shadow-lg">
          <h2 className="text-2xl font-extrabold sm:text-3xl">
            Ready to Experience Better Healthcare?
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-white/80 sm:text-base">
            Browse thousands of genuine medicines, vitamins, and wellness
            products with same-day delivery and 24/7 pharmacist support.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link
              href="/products"
              className={cn(
                "inline-flex items-center gap-2 rounded-2xl px-6 py-3 text-sm font-semibold",
                "bg-white text-primary shadow-sm",
                "transition-all duration-200 hover:bg-white/90 hover:shadow-md",
              )}
            >
              Browse Products
            </Link>
            <Link
              href="/support"
              className={cn(
                "inline-flex items-center gap-2 rounded-2xl px-6 py-3 text-sm font-semibold",
                "border border-white/30 text-white",
                "transition-all duration-200 hover:bg-white/10",
              )}
            >
              Talk to a Pharmacist
            </Link>
          </div>
        </div>
      </section>

      {/* ── Contact strip ── */}
      <section className="border-t border-border bg-muted/30">
        <div className="section-container py-10">
          <div className="flex flex-col items-center gap-5 text-center sm:flex-row sm:justify-center sm:gap-12">
            <a
              href="tel:+15551237777"
              className="flex items-center gap-3 text-sm text-muted-foreground transition-colors hover:text-primary"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
                <Phone className="h-4 w-4 text-primary" />
              </div>
              +1 (555) 123-7777
            </a>
            <a
              href="mailto:support@medbox.pharmacy"
              className="flex items-center gap-3 text-sm text-muted-foreground transition-colors hover:text-primary"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
                <Mail className="h-4 w-4 text-primary" />
              </div>
              support@medbox.pharmacy
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
