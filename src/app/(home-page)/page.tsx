import { createClient } from "@/lib/supabase/server";
import HeroSection from "./_components/hero-section";
import CategoriesSection from "./_components/categories-section";
import PromotionsBanner from "./_components/promotions-banner";
import FeaturedProductsSection from "./_components/featured-products-section";
import HealthAdviceSection from "./_components/health-advice-section";
import BrandsSection from "./_components/brands-section";
import AiAssistantBanner from "./_components/ai-assistant-banner";
import { Separator } from "@/components/ui/separator";

export default async function Home() {
  /* ── Auth check — logic unchanged ── */
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  void user; // available for personalisation when needed

  return (
    <div>
      {/* 1. Hero + search + trust bar */}
      <HeroSection />

      {/* 2. Category grid */}
      <CategoriesSection />

      <Separator className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" />

      {/* 3. Paid promotions */}
      <PromotionsBanner />

      <Separator className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" />

      {/* 4. Best sellers + best offers grids */}
      <FeaturedProductsSection />

      {/* 5. Featured brand logos */}
      <BrandsSection />

      {/* 6. Health advice articles */}
      <HealthAdviceSection />

      {/* 7. AI assistant CTA */}
      <AiAssistantBanner />

      {/* Spacing before footer */}
      <div className="h-4" />
    </div>
  );
}
