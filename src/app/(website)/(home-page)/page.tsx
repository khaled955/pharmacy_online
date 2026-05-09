
import { Suspense } from "react";
import ErrorBoundary from "@/components/shared/error-boundary";
import { Separator } from "@/components/ui/separator";
import { Skeleton, SectionHeaderSkeleton } from "@/components/ui/skeleton";

import { ENABLE_VIRTUAL_EXPERIENCE } from "@/lib/constants/virtual-pharmacy";
import PharmacyExperienceHero from "@/components/virtual-pharmacy/pharmacy-experience-hero";
import VirtualShelfCategories from "@/components/virtual-pharmacy/virtual-shelf-categories";
import HeroSection from "../_components/hero-section";
import CategoriesSection from "../_components/categories-section";
import PromotionsBanner from "../_components/promotions-banner";
import FeaturedProductsSection from "../_components/featured-products-section";
import BrandsSection from "../_components/brands-section";
import SiteReviewsSection from "../_components/site-reviews-section";
import HealthAdviceSection from "../_components/health-advice-section";
import AiAssistantBanner from "../_components/ai-assistant-banner";

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
 
  return (
    <div>
     
      {ENABLE_VIRTUAL_EXPERIENCE ? <PharmacyExperienceHero /> : <HeroSection />}

     \
      <ErrorBoundary>
        <Suspense fallback={<CategoriesFallback />}>
          {ENABLE_VIRTUAL_EXPERIENCE ? <VirtualShelfCategories /> : <CategoriesSection />}
        </Suspense>
      </ErrorBoundary>


      <Separator className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" />

      <PromotionsBanner />

      <Separator className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" />

      {/*Best sellers + trending carousels  */}
      <FeaturedProductsSection />

      {/*Featured brand */}
      <BrandsSection />

      <Separator className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" />

      {/*Customer reviews carousel */}
      <SiteReviewsSection />

      <Separator className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" />

      {/*Health advice articles */}
      <HealthAdviceSection />

      {/* 8. AI assistant*/}
      <AiAssistantBanner />

      {/* Spacing before footer */}
      <div className="h-4" />
    </div>
  );
}
