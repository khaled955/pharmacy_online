import { Skeleton, ProductCardSkeleton, SectionHeaderSkeleton } from "@/components/ui/skeleton";

function ImageGallerySkeleton() {
  return (
    <div className="space-y-3">
      <Skeleton className="h-96 w-full rounded-2xl" />
      <div className="flex gap-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-16 rounded-xl" />
        ))}
      </div>
    </div>
  );
}

function ProductInfoSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-4 w-20" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-3/4" />
      <Skeleton className="h-5 w-32" />
      <Skeleton className="h-10 w-36" />
      <Skeleton className="h-5 w-24" />
      <div className="pt-2">
        <Skeleton className="h-px w-full" />
      </div>
      <div className="flex gap-3 pt-2">
        <Skeleton className="h-11 w-28 rounded-xl" />
        <Skeleton className="h-11 flex-1 rounded-xl" />
      </div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-12 rounded-xl" />
        ))}
      </div>
    </div>
  );
}

function TabsSkeleton() {
  return (
    <div>
      <div className="mb-6 flex gap-1 border-b border-border">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-9 w-24 rounded-t-xl" />
        ))}
      </div>
      <div className="space-y-3">
        <Skeleton className="h-5 w-48" />
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-4 w-full" />
        ))}
      </div>
    </div>
  );
}

export default function ProductDetailLoadingPage() {
  return (
    <div className="section-container py-8">
      {/* Breadcrumb */}
      <div className="mb-6 flex items-center gap-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-3.5 w-16 rounded-full" />
        ))}
      </div>

      {/* Main section */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[420px_1fr]">
        <ImageGallerySkeleton />
        <ProductInfoSkeleton />
      </div>

      {/* Tabs */}
      <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_280px]">
        <TabsSkeleton />
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-xl" />
          ))}
        </div>
      </div>

      {/* Related products */}
      <div className="mt-12">
        <SectionHeaderSkeleton />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
