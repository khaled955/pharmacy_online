import { cn } from "@/lib/utils/tailwind-merge";

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-xl bg-muted",
        className,
      )}
      {...props}
    />
  );
}

/** Convenience: a full product-card shaped skeleton */
function ProductCardSkeleton() {
  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-card">
      <Skeleton className="mb-3 h-44 w-full rounded-xl" />
      <Skeleton className="mb-2 h-3.5 w-3/4" />
      <Skeleton className="mb-3 h-3 w-1/2" />
      <div className="flex items-center justify-between">
        <Skeleton className="h-5 w-16" />
        <Skeleton className="h-9 w-24 rounded-xl" />
      </div>
    </div>
  );
}

/** Convenience: a section-header shaped skeleton */
function SectionHeaderSkeleton() {
  return (
    <div className="mb-6 flex items-center justify-between">
      <div className="space-y-2">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-3.5 w-60" />
      </div>
      <Skeleton className="h-9 w-20 rounded-xl" />
    </div>
  );
}

/** Convenience: carousel-based section skeleton (header + horizontal card row) */
function CarouselSectionSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="section-container py-8">
      <SectionHeaderSkeleton />
      <div className="flex gap-4 overflow-hidden">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="w-[calc(50%-8px)] shrink-0 sm:w-[calc(33.333%-11px)] lg:w-[calc(25%-12px)]">
            <ProductCardSkeleton />
          </div>
        ))}
      </div>
    </div>
  );
}

/** Convenience: a single review card skeleton */
function ReviewCardSkeleton() {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
      <div className="mb-4 flex items-center gap-3">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="space-y-1.5">
          <Skeleton className="h-3.5 w-24" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>
      <Skeleton className="mb-2 h-3 w-full" />
      <Skeleton className="mb-2 h-3 w-full" />
      <Skeleton className="h-3 w-3/4" />
    </div>
  );
}

/** Convenience: carousel-based review section skeleton */
function ReviewCarouselSkeleton() {
  return (
    <div className="section-container py-12">
      <SectionHeaderSkeleton />
      <div className="flex gap-4 overflow-hidden">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="w-full shrink-0 sm:w-[calc(50%-8px)] lg:w-[calc(33.333%-11px)]">
            <ReviewCardSkeleton />
          </div>
        ))}
      </div>
    </div>
  );
}

export {
  Skeleton,
  ProductCardSkeleton,
  SectionHeaderSkeleton,
  CarouselSectionSkeleton,
  ReviewCardSkeleton,
  ReviewCarouselSkeleton,
};
