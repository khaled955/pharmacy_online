import Link from "next/link";
import {
  Mail,
  MessageCircle,
  Phone,
  ShoppingBag,
  User,
  Truck,
  CreditCard,
  RefreshCw,
  HelpCircle,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils/tailwind-merge";
import { Card, CardContent } from "@/components/ui/card";

export const metadata = {
  title: "Support | MedBox",
  description:
    "Get help with your orders, account, and more. Our pharmacists and support team are here for you.",
};

const contactOptions = [
  {
    icon: Mail,
    title: "Email Support",
    desc: "Send us an email and we'll respond within 24 hours.",
    action: "Send an Email",
    href: "mailto:support@medbox.pharmacy",
    external: true,
  },
  {
    icon: MessageCircle,
    title: "Live Chat",
    desc: "Chat with a pharmacist or support agent in real time.",
    action: "Start Chat",
    href: "#",
    external: false,
  },
  {
    icon: Phone,
    title: "Phone Support",
    desc: "Speak directly with our team Monday–Saturday, 8am–8pm.",
    action: "Call Now",
    href: "tel:+15551237777",
    external: true,
  },
];

const helpTopics = [
  {
    icon: ShoppingBag,
    title: "Order Support",
    desc: "Track, modify, or cancel an order. Get help with missing or delayed deliveries.",
    href: "/allOrders",
    linkLabel: "View My Orders",
  },
  {
    icon: User,
    title: "Account Help",
    desc: "Update your profile, change your password, or manage your saved addresses.",
    href: "/profile",
    linkLabel: "Go to Profile",
  },
  {
    icon: Truck,
    title: "Delivery & Shipping",
    desc: "Information about delivery zones, timelines, and tracking your package.",
    href: "#",
    linkLabel: "Learn More",
  },
  {
    icon: RefreshCw,
    title: "Returns & Refunds",
    desc: "Learn about our return policy and how to request a refund for eligible orders.",
    href: "#",
    linkLabel: "Return Policy",
  },
  {
    icon: CreditCard,
    title: "Payment & Billing",
    desc: "Questions about payment methods, failed transactions, or billing issues.",
    href: "#",
    linkLabel: "Payment Help",
  },
  {
    icon: HelpCircle,
    title: "General FAQs",
    desc: "Find quick answers to the most common questions about MedBox.",
    href: "#",
    linkLabel: "Browse FAQs",
  },
];

const faqs = [
  {
    q: "How do I track my order?",
    a: 'Go to "My Orders" from your account. Each order shows its current status and expected delivery date.',
  },
  {
    q: "Can I cancel or change my order?",
    a: "Orders can be cancelled before they are dispatched. Visit My Orders and select the order you want to cancel.",
  },
  {
    q: "Is a prescription required for medicines?",
    a: "Prescription-only medicines require a valid prescription uploaded at checkout. Non-prescription items can be ordered freely.",
  },
  {
    q: "How long does delivery take?",
    a: "Most orders arrive within 1–3 business days. Same-day delivery is available in select cities.",
  },
  {
    q: "Are all products on MedBox genuine?",
    a: "Yes. We source all products directly from licensed manufacturers and authorised distributors.",
  },
  {
    q: "How do I change my password?",
    a: 'Go to your Profile page and scroll to the "Change Password" section to update your password securely.',
  },
];

export default function SupportPage() {
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
          <HelpCircle className="h-4 w-4" />
          Support Center
        </div>

        <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
          How Can We Help You?
        </h1>

        <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
          Our team of pharmacists and support specialists are here to help you
          with any questions about your orders, account, medicines, or anything
          else.
        </p>
      </section>

      {/* ── Contact options ── */}
      <section className="section-container pb-16">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          {contactOptions.map(({ icon: Icon, title, desc, action, href, external }) => (
            <Card key={title} hoverable>
              <CardContent className="flex flex-col gap-4 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-foreground">{title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                    {desc}
                  </p>
                </div>
                <a
                  href={href}
                  {...(external
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                  className={cn(
                    "inline-flex items-center gap-1.5 text-sm font-semibold text-primary",
                    "transition-colors duration-150 hover:text-primary/80",
                  )}
                >
                  {action}
                  <ChevronRight className="h-4 w-4" />
                </a>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* ── Help topics ── */}
      <section className="border-y border-border bg-muted/30">
        <div className="section-container py-16">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-extrabold tracking-tight text-foreground">
              Browse Help Topics
            </h2>
            <p className="mt-3 text-sm text-muted-foreground sm:text-base">
              Find the information you need by topic
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {helpTopics.map(({ icon: Icon, title, desc, href, linkLabel }) => (
              <Card key={title}>
                <CardContent className="flex flex-col gap-4 p-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-foreground">
                      {title}
                    </h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                      {desc}
                    </p>
                  </div>
                  <Link
                    href={href}
                    className={cn(
                      "inline-flex items-center gap-1.5 text-sm font-medium text-primary",
                      "transition-colors duration-150 hover:text-primary/80",
                    )}
                  >
                    {linkLabel}
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQs ── */}
      <section className="section-container py-16">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-foreground">
            Frequently Asked Questions
          </h2>
          <p className="mt-3 text-sm text-muted-foreground sm:text-base">
            Quick answers to common questions
          </p>
        </div>

        <div className="mx-auto max-w-3xl space-y-4">
          {faqs.map(({ q, a }) => (
            <Card key={q} flat>
              <CardContent className="p-5">
                <h3 className="text-sm font-semibold text-foreground">{q}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {a}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="border-t border-border bg-muted/30">
        <div className="section-container py-14 text-center">
          <h2 className="text-2xl font-extrabold text-foreground">
            Still need help?
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground sm:text-base">
            Our pharmacists and support team are available 7 days a week to
            answer any question you have.
          </p>
          <a
            href="mailto:support@medbox.pharmacy"
            className={cn(
              "mt-6 inline-flex items-center gap-2 rounded-2xl px-6 py-3 text-sm font-semibold",
              "bg-gradient-brand text-white shadow-sm",
              "transition-all duration-200 hover:opacity-90 hover:shadow-md",
            )}
          >
            <Mail className="h-4 w-4" />
            Email Our Support Team
          </a>
        </div>
      </section>
    </div>
  );
}
