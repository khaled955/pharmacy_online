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

// [NEW] Virtual Pharmacy Experience imports
// [SAFE] Only rendered when ENABLE_VIRTUAL_EXPERIENCE = true; original components untouched
import { ENABLE_VIRTUAL_EXPERIENCE } from "@/lib/constants/virtual-pharmacy";
import PharmacyExperienceHero from "@/components/virtual-pharmacy/pharmacy-experience-hero";
import VirtualShelfCategories from "@/components/virtual-pharmacy/virtual-shelf-categories";

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
      {/*
        [MODIFIED] Hero section:
        - When ENABLE_VIRTUAL_EXPERIENCE=true → PharmacyExperienceHero (new, with mascot + journey CTA)
        - When false → original HeroSection (static, no fetch)
        [REVERSIBLE] Toggle ENABLE_VIRTUAL_EXPERIENCE in src/lib/constants/virtual-pharmacy.ts
      */}
      {ENABLE_VIRTUAL_EXPERIENCE ? <PharmacyExperienceHero /> : <HeroSection />}

      {/*
        [MODIFIED] Categories section:
        - When ENABLE_VIRTUAL_EXPERIENCE=true → VirtualShelfCategories (drawer interaction)
        - When false → original CategoriesSection (plain grid, no drawer)
      */}
      <ErrorBoundary>
        <Suspense fallback={<CategoriesFallback />}>
          {ENABLE_VIRTUAL_EXPERIENCE ? <VirtualShelfCategories /> : <CategoriesSection />}
        </Suspense>
      </ErrorBoundary>

      {/* ── All sections below are [SAFE] — unchanged from original ── */}

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
