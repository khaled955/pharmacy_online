import { Skeleton, ProductCardSkeleton, SectionHeaderSkeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils/tailwind-merge";

function HeroSkeleton() {
  return (
    <div className="bg-gradient-hero">
      <div className="section-container py-14 md:py-20">
        <div className="max-w-xl space-y-4">
          <Skeleton className="h-5 w-48 rounded-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-4/5" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-12 w-full rounded-2xl" />
          <div className="flex gap-2">
            <Skeleton className="h-10 w-28 rounded-xl" />
            <Skeleton className="h-10 w-36 rounded-xl" />
          </div>
        </div>
      </div>
      <div className="border-t border-border/50 bg-card/60">
        <div className="section-container flex justify-center gap-8 py-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-5 w-32 rounded-full" />
          ))}
        </div>
      </div>
    </div>
  );
}

function CategoriesSkeleton() {
  return (
    <div className="section-container py-10">
      <SectionHeaderSkeleton />
      <div className="grid grid-cols-4 gap-3 sm:grid-cols-8">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-24 rounded-2xl" />
        ))}
      </div>
    </div>
  );
}

function ProductGridSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="section-container py-8">
      <SectionHeaderSkeleton />
      <div className={cn(
        "grid gap-3",
        count === 5
          ? "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
          : "grid-cols-2 sm:grid-cols-3 md:grid-cols-4",
      )}>
        {Array.from({ length: count }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

export default function HomeLoadingPage() {
  return (
    <div>
      <HeroSkeleton />
      <CategoriesSkeleton />
      <ProductGridSkeleton count={5} />
      <ProductGridSkeleton count={4} />
    </div>
  );
}
