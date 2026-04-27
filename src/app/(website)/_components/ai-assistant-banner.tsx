import Link from "next/link";
import { Bot, ArrowRight, Stethoscope } from "lucide-react";
import { cn } from "@/lib/utils/tailwind-merge";

export default function AiAssistantBanner() {
  return (
    <section className="section-container py-8">
      <div
        className={cn(
          "relative overflow-hidden rounded-3xl",
          "bg-gradient-to-br from-primary via-primary/90 to-teal-700",
          "dark:from-primary/80 dark:via-primary/70 dark:to-teal-800",
          "p-8 text-white shadow-lg",
          "sm:p-10",
        )}
      >
        {/* Decorative blobs */}
        <div
          aria-hidden="true"
          className="absolute -end-12 -top-12 h-48 w-48 rounded-full bg-white/8 blur-2xl"
        />
        <div
          aria-hidden="true"
          className="absolute -bottom-8 end-1/3 h-32 w-32 rounded-full bg-white/6 blur-xl"
        />

        <div className="relative z-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <div
              className={cn(
                "flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl",
                "bg-white/15 backdrop-blur-sm",
              )}
            >
              <Bot className="h-7 w-7 text-white" />
            </div>
            <div>
              <div className="mb-1 flex items-center gap-2">
                <Stethoscope className="h-4 w-4 text-white/70" />
                <span className="text-xs font-semibold uppercase tracking-widest text-white/70">
                  Ask our Smart Pharmacy Assistant
                </span>
              </div>
              <h2 className="text-2xl font-extrabold text-white sm:text-3xl">
                Get instant health tips &amp; exclusive offers
              </h2>
              <p className="mt-1.5 max-w-md text-sm text-white/75">
                Chat with our AI for personalised medicine advice, dosage
                guidance, and curated product recommendations.
              </p>
            </div>
          </div>

          <div className="flex shrink-0 gap-3">
            <Link
              href="/support"
              className={cn(
                "inline-flex items-center gap-2 rounded-xl",
                "bg-white px-5 py-2.5 text-sm font-semibold text-primary",
                "transition-all hover:bg-white/90 hover:shadow-md",
              )}
            >
              Start Chat
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/products"
              className={cn(
                "inline-flex items-center rounded-xl border border-white/25",
                "bg-white/15 px-5 py-2.5 text-sm font-semibold text-white",
                "transition-all hover:bg-white/25",
              )}
            >
              Shop Now
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
