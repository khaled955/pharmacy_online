import Link from "next/link";
import { Tag } from "lucide-react";
import { cn } from "@/lib/utils/tailwind-merge";
import { Badge } from "@/components/ui/badge";

/* Static promotion data — ready for dynamic props */
interface PromotionBannerData {
  id: string;
  badge?: string;
  brand: string;
  title: string;
  subtitle?: string;
  discount: string;
  href: string;
  accentFrom: string;
  accentTo: string;
}

const promotions: PromotionBannerData[] = [
  {
    id: "voltaren",
    badge: "Sponsored",
    brand: "Voltaren",
    title: "Emulgel",
    subtitle: "Targeted pain relief with EMULGEL™ technology",
    discount: "25% OFF",
    href: "/products/voltaren-emulgel",
    accentFrom: "from-blue-600",
    accentTo: "to-indigo-700",
  },
  {
    id: "panadol-advance",
    badge: "Best Seller",
    brand: "Panadol",
    title: "Advance 500mg",
    subtitle: "Fast-acting, gentle on the stomach",
    discount: "15% OFF",
    href: "/products/panadol-advance",
    accentFrom: "from-primary",
    accentTo: "to-teal-700",
  },
];

function PromoBanner({ promo }: { promo: PromotionBannerData }) {
  return (
    <Link
      href={promo.href}
      className={cn(
        "group relative overflow-hidden rounded-2xl",
        "bg-gradient-to-br",
        promo.accentFrom,
        promo.accentTo,
        "p-6 text-white",
        "shadow-card transition-all duration-300",
        "hover:-translate-y-0.5 hover:shadow-card-hover",
        "flex items-center justify-between gap-4",
        "min-h-36",
      )}
    >
      {/* Decorative circle */}
      <div
        aria-hidden="true"
        className="absolute -end-8 -top-8 h-32 w-32 rounded-full bg-white/8"
      />
      <div
        aria-hidden="true"
        className="absolute -bottom-6 end-12 h-20 w-20 rounded-full bg-white/6"
      />

      {/* Content */}
      <div className="relative z-10 flex-1">
        {promo.badge && (
          <span
            className={cn(
              "mb-2 inline-flex items-center gap-1 rounded-full",
              "bg-white/20 px-2.5 py-0.5 text-[11px] font-semibold text-white",
            )}
          >
            <Tag className="h-3 w-3" />
            {promo.badge}
          </span>
        )}
        <p className="text-sm font-semibold uppercase tracking-widest text-white/80">
          {promo.brand}
        </p>
        <h3 className="text-2xl font-extrabold text-white">{promo.title}</h3>
        {promo.subtitle && (
          <p className="mt-1 max-w-xs text-sm text-white/75">{promo.subtitle}</p>
        )}
        <div
          className={cn(
            "mt-3 inline-flex items-center rounded-full",
            "bg-white/20 px-3 py-1 text-sm font-bold text-white",
          )}
        >
          {promo.discount}
        </div>
      </div>

      {/* CTA */}
      <div className="relative z-10 shrink-0">
        <span
          className={cn(
            "inline-flex rounded-xl bg-white/20 px-4 py-2 text-sm font-semibold text-white",
            "border border-white/25",
            "transition-colors group-hover:bg-white/30",
          )}
        >
          Shop Now →
        </span>
      </div>
    </Link>
  );
}

export default function PromotionsBanner() {
  return (
    <section className="section-container py-6">
      <div className="mb-4 flex items-center gap-2">
        <Badge variant="sale" className="gap-1">
          <Tag className="h-3 w-3" />
          Paid Promotion
        </Badge>
        <Link
          href="/products?offers=true"
          className="ms-auto text-xs font-medium text-muted-foreground hover:text-primary transition-colors"
        >
          View all offers →
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {promotions.map((promo) => (
          <PromoBanner key={promo.id} promo={promo} />
        ))}
      </div>
    </section>
  );
}
