import Link from "next/link";
import { ShieldCheck, Phone, Mail, MapPin } from "lucide-react";
import { cn } from "@/lib/utils/tailwind-merge";
import { Separator } from "@/components/ui/separator";

/* ─── Social icon SVGs (brand icons not in lucide) ─────── */
function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}
function TwitterIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}
function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}
function YoutubeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
      <polygon fill="white" points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" />
    </svg>
  );
}

/* ─── Static data — ready for dynamic props later ─────── */
const footerCategories = [
  { label: "Medicines",     href: "/products?category=medicines" },
  { label: "Vitamins",      href: "/products?category=vitamins" },
  { label: "Skin Care",     href: "/products?category=skin-care" },
  { label: "Baby Care",     href: "/products?category=baby-care" },
  { label: "Mother Care",   href: "/products?category=mother-care" },
  { label: "Supplements",   href: "/products?category=supplements" },
];

const footerLinks = [
  { label: "Home",             href: "/" },
  { label: "Best Sellers",     href: "/products?sort=best-sellers" },
  { label: "Offers",           href: "/products?offers=true" },
  { label: "About Us",         href: "/about" },
  { label: "Contact Us",       href: "/contact" },
  { label: "Support",          href: "/support" },
];

const customerLinks = [
  { label: "My Orders",        href: "/orders" },
  { label: "My Profile",       href: "/profile" },
  { label: "Wishlist",         href: "/wishlist" },
  { label: "Track Order",      href: "/orders/track" },
  { label: "Returns & Refunds",href: "/support/returns" },
  { label: "FAQs",             href: "/support/faq" },
];

const socialLinks = [
  { icon: FacebookIcon,  href: "#", label: "Facebook" },
  { icon: TwitterIcon,   href: "#", label: "Twitter" },
  { icon: InstagramIcon, href: "#", label: "Instagram" },
  { icon: YoutubeIcon,   href: "#", label: "YouTube" },
];

/* ─── Sub-components ────────────────────────────────────── */
function FooterHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-foreground">
      {children}
    </h3>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link
        href={href}
        className={cn(
          "text-sm text-muted-foreground",
          "transition-colors duration-150 hover:text-primary",
        )}
      >
        {children}
      </Link>
    </li>
  );
}

/* ─── Main Footer ───────────────────────────────────────── */
export default function HomeFooter() {
  return (
    <footer className="border-t border-border bg-card">
      {/* ── Top section ── */}
      <div className="section-container py-12">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">

          {/* Brand column */}
          <div className="sm:col-span-2 xl:col-span-2">
            <Link href="/" className="mb-4 flex items-center gap-2.5">
              <div
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-xl",
                  "bg-gradient-brand shadow-sm",
                )}
              >
                <ShieldCheck className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold text-foreground">MedBox</span>
            </Link>

            <p className="mb-5 max-w-xs text-sm leading-relaxed text-muted-foreground">
              Your trusted online pharmacy for everyday care. Order medicines,
              vitamins, skincare and wellness essentials with fast delivery and
              expert support.
            </p>

            {/* Contact info */}
            <ul className="space-y-2.5">
              <li className="flex items-center gap-2.5 text-sm text-muted-foreground">
                <Phone className="h-4 w-4 shrink-0 text-primary" />
                +1 (555) 123‑7777
              </li>
              <li className="flex items-center gap-2.5 text-sm text-muted-foreground">
                <Mail className="h-4 w-4 shrink-0 text-primary" />
                support@medbox.pharmacy
              </li>
              <li className="flex items-start gap-2.5 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 shrink-0 text-primary mt-0.5" />
                123 Health Ave, Medical District, NY 10001
              </li>
            </ul>

            {/* Social links */}
            <div className="mt-5 flex items-center gap-2">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <Link
                  key={label}
                  href={href}
                  aria-label={label}
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full",
                    "border border-border bg-background text-muted-foreground",
                    "transition-colors duration-150",
                    "hover:border-primary/30 hover:bg-primary/5 hover:text-primary",
                  )}
                >
                  <Icon className="h-4 w-4" />
                </Link>
              ))}
            </div>
          </div>

          {/* Popular Categories */}
          <div>
            <FooterHeading>Categories</FooterHeading>
            <ul className="space-y-2.5">
              {footerCategories.map((c) => (
                <FooterLink key={c.href} href={c.href}>
                  {c.label}
                </FooterLink>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <FooterHeading>Quick Links</FooterHeading>
            <ul className="space-y-2.5">
              {footerLinks.map((l) => (
                <FooterLink key={l.href} href={l.href}>
                  {l.label}
                </FooterLink>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <FooterHeading>Customer Service</FooterHeading>
            <ul className="space-y-2.5">
              {customerLinks.map((l) => (
                <FooterLink key={l.href} href={l.href}>
                  {l.label}
                </FooterLink>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <Separator />

      {/* ── Bottom bar ── */}
      <div className="section-container py-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            © 2025 MedBox Pharmacy. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link
              href="/privacy"
              className="text-xs text-muted-foreground hover:text-primary transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-xs text-muted-foreground hover:text-primary transition-colors"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
