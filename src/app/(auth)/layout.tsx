import {
  ShieldCheck,
  Pill,
  HeartPulse,
  BadgeCheck,
  Truck,
} from "lucide-react";
import ThemeToggle from "@/components/layout/navbar/theme-toggle";

const features = [
  {
    icon: Pill,
    title: "10,000+ medications",
    desc: "Genuine products from licensed suppliers",
  },
  {
    icon: HeartPulse,
    title: "24 / 7 pharmacist support",
    desc: "Chat with a certified pharmacist anytime",
  },
  {
    icon: BadgeCheck,
    title: "Verified & licensed",
    desc: "Fully regulated online pharmacy",
  },
  {
    icon: Truck,
    title: "Fast home delivery",
    desc: "Same-day delivery in most cities",
  },
];

export default function AuthLayout({ children }: LayoutProp) {
  return (
    <div className="relative flex min-h-screen">
      {/* ── Theme toggle — floats over both panels ── */}
      <div className="absolute right-4 top-4 z-50">
        <ThemeToggle />
      </div>
      {/* ══════════════════════════════════════════════════════════════
          LEFT PANEL — visible on lg+ screens
      ══════════════════════════════════════════════════════════════ */}
      <aside
        className="relative hidden w-[480px] shrink-0 flex-col justify-between
          overflow-hidden bg-gradient-to-br from-teal-700 via-teal-600 to-cyan-700
          px-12 py-14 lg:flex"
      >
        {/* ── Animated background blobs ── */}
        <span
          className="absolute -left-20 -top-20 h-72 w-72 animate-pulse rounded-full
            bg-white/10 blur-3xl"
        />
        <span
          className="absolute -bottom-24 -right-16 h-80 w-80 animate-pulse rounded-full
            bg-teal-400/20 blur-3xl [animation-delay:1.5s]"
        />
        <span
          className="absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2
            animate-pulse rounded-full bg-white/5 blur-2xl [animation-delay:3s]"
        />

        {/* ── Floating pill shapes ── */}
        <span
          className="absolute right-10 top-24 h-3 w-10 animate-bounce rounded-full
            bg-white/20 [animation-delay:0.5s]"
        />
        <span
          className="absolute bottom-32 left-8 h-3 w-14 animate-bounce rounded-full
            bg-white/15 [animation-delay:1s]"
        />
        <span
          className="absolute right-20 top-1/2 h-2 w-8 animate-bounce rounded-full
            bg-cyan-200/30 [animation-delay:2s]"
        />

        {/* ── Brand ── */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
            <ShieldCheck className="h-6 w-6 text-white" />
          </div>
          <div>
            <p className="text-lg font-bold leading-none text-white">MedBox</p>
            <p className="text-xs text-teal-200">Licensed &amp; Trusted</p>
          </div>
        </div>

        {/* ── Headline ── */}
        <div className="relative z-10 space-y-5">
          <div>
            <h2 className="text-3xl font-extrabold leading-tight text-white">
              Your health,
              <br />
              <span className="text-cyan-200">delivered to your door.</span>
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-teal-100/80">
              MedBox connects you with a fully licensed online pharmacy — order
              prescription and over-the-counter medicines with complete peace of
              mind.
            </p>
          </div>

          {/* ── Feature list ── */}
          <ul className="space-y-3.5">
            {features.map(({ icon: Icon, title, desc }) => (
              <li key={title} className="flex items-start gap-3">
                <span
                  className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center
                    rounded-lg bg-white/15"
                >
                  <Icon className="h-4 w-4 text-white" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-white">{title}</p>
                  <p className="text-xs text-teal-200/80">{desc}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* ── Footer ── */}
        <p className="relative z-10 text-[11px] text-teal-300/60">
          © 2026 MedBox Pharmacy · All rights reserved
        </p>
      </aside>

      {/* ══════════════════════════════════════════════════════════════
          RIGHT PANEL — auth forms
      ══════════════════════════════════════════════════════════════ */}
      <main
        className="flex flex-1 flex-col items-center justify-center overflow-y-auto
          bg-gradient-to-br from-teal-50 via-white to-cyan-50 px-4 py-10
          dark:from-gray-950 dark:via-gray-900 dark:to-gray-950"
      >
        {/* Mobile-only logo badge */}
        <div className="mb-8 flex items-center gap-2 lg:hidden">
          <div
            className="flex h-8 w-8 items-center justify-center rounded-lg
              bg-teal-600 dark:bg-teal-700"
          >
            <ShieldCheck className="h-4 w-4 text-white" />
          </div>
          <span className="text-base font-bold text-gray-900 dark:text-white">
            MedBox
          </span>
        </div>

        {children}
      </main>
    </div>
  );
}
