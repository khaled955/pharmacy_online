import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import ErrorBoundary from "@/components/shared/error-boundary";
import { Separator } from "@/components/ui/separator";
import { Skeleton, SectionHeaderSkeleton } from "@/components/ui/skeleton";
import HeroSection from "./_components/hero-section";
import CategoriesSection from "./_components/categories-section";
import PromotionsBanner from "./_components/promotions-banner";
import FeaturedProductsSection from "./_components/featured-products-section";
import HealthAdviceSection from "./_components/health-advice-section";
import BrandsSection from "./_components/brands-section";
import AiAssistantBanner from "./_components/ai-assistant-banner";
import SiteReviewsSection from "./_components/site-reviews-section";

/* ── Per-section skeleton fallbacks ── */
function CategoriesFallback() {
  return (
    <div className="section-container py-10">
      <SectionHeaderSkeleton />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-24 rounded-2xl" />
        ))}
      </div>
    </div>
  );
}

export default async function Home() {
  /* ── Auth check — logic unchanged ── */
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  void user; // available for personalisation when needed

  return (
    <div>
      {/* 1. Hero + search + trust bar (static — no fetch) */}
      <HeroSection />

      {/* 2. Category grid */}
      <ErrorBoundary>
        <Suspense fallback={<CategoriesFallback />}>
          <CategoriesSection />
        </Suspense>
      </ErrorBoundary>

      <Separator className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" />

      {/* 3. Paid promotions (static — no fetch) */}
      <PromotionsBanner />

      <Separator className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" />

      {/* 4. Best sellers + trending carousels (each wrapped internally) */}
      <FeaturedProductsSection />

      {/* 5. Featured brand logos (static — no fetch) */}
      <BrandsSection />

      <Separator className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" />

      {/* 6. Customer reviews carousel (static data) */}
      <SiteReviewsSection />

      <Separator className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" />

      {/* 7. Health advice articles (static — no fetch) */}
      <HealthAdviceSection />

      {/* 8. AI assistant CTA (static — no fetch) */}
      <AiAssistantBanner />

      {/* Spacing before footer */}
      <div className="h-4" />
    </div>
  );
}
