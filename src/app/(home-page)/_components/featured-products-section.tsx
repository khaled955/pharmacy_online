import { Suspense } from "react";
import { SectionHeader } from "@/components/shared/section-header";
import { InteractiveProductCard } from "@/components/shop/interactive-product-card";
import { EmptyState } from "@/components/shared/empty-state";
import ErrorBoundary from "@/components/shared/error-boundary";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { CarouselSectionSkeleton } from "@/components/ui/skeleton";
import { getBestSellers } from "@/lib/services/products/get-best-sellers.service";
import { getTrendingProducts } from "@/lib/services/products/get-trending-products.service";
import { toProductCardProps } from "@/lib/utils/product-mapper";

async function BestSellersSection() {
  const products = await getBestSellers(8);

  return (
    <section className="section-container py-8">
      <SectionHeader
        title="Best Sellers"
        description="Most trusted products by our customers"
        viewAllHref="/products?sort=sold_desc&bestSeller=true"
        viewAllLabel="View All"
      />
      {products.length === 0 ? (
        <EmptyState title="No products yet" description="Check back soon." />
      ) : (
        <Carousel opts={{ align: "start", loop: false }} className="w-full">
          <CarouselContent className="-ml-3">
            {products.map((product) => (
              <CarouselItem
                key={product.id}
                className="pl-3 basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5"
              >
                <InteractiveProductCard {...toProductCardProps(product)} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="-left-4 hidden sm:flex" />
          <CarouselNext className="-right-4 hidden sm:flex" />
        </Carousel>
      )}
    </section>
  );
}

async function TrendingSection() {
  const products = await getTrendingProducts(8);

  return (
    <section className="section-container py-8">
      <SectionHeader
        title="Trending Now"
        description="Products everyone is talking about"
        viewAllHref="/products?sort=trending_desc"
        viewAllLabel="View All"
      />
      {products.length === 0 ? (
        <EmptyState title="No trending products" description="Check back soon." />
      ) : (
        <Carousel opts={{ align: "start", loop: false }} className="w-full">
          <CarouselContent className="-ml-3">
            {products.map((product) => (
              <CarouselItem
                key={product.id}
                className="pl-3 basis-1/2 sm:basis-1/3 md:basis-1/4"
              >
                <InteractiveProductCard {...toProductCardProps(product)} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="-left-4 hidden sm:flex" />
          <CarouselNext className="-right-4 hidden sm:flex" />
        </Carousel>
      )}
    </section>
  );
}

export default function FeaturedProductsSection() {
  return (
    <>
      <ErrorBoundary>
        <Suspense fallback={<CarouselSectionSkeleton count={5} />}>
          <BestSellersSection />
        </Suspense>
      </ErrorBoundary>

      <ErrorBoundary>
        <Suspense fallback={<CarouselSectionSkeleton count={4} />}>
          <TrendingSection />
        </Suspense>
      </ErrorBoundary>
    </>
  );
}
