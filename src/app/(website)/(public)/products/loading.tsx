import { Skeleton, ProductCardSkeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils/tailwind-merge";

function FilterSkeleton() {
  return (
    <aside className="hidden lg:block w-56 shrink-0">
      <div className="rounded-2xl border border-border bg-card p-5 space-y-5">
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-12" />
        </div>
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-4 w-24" />
            {Array.from({ length: 4 }).map((_, j) => (
              <Skeleton key={j} className="h-4 w-full" />
            ))}
          </div>
        ))}
      </div>
    </aside>
  );
}

function ToolbarSkeleton() {
  return (
    <div className="mb-4 flex items-center justify-between">
      <Skeleton className="h-4 w-36" />
      <div className="flex items-center gap-2">
        <Skeleton className="h-9 w-36 rounded-xl" />
        <Skeleton className="h-9 w-20 rounded-xl" />
      </div>
    </div>
  );
}

export default function ProductsLoadingPage() {
  return (
    <div className="section-container py-8">
      {/* Header skeleton */}
      <div className="mb-6 space-y-2">
        <Skeleton className="h-5 w-32 rounded-full" />
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-72" />
      </div>

      {/* Search skeleton */}
      <Skeleton className="mb-6 h-11 w-full rounded-xl" />

      {/* Layout */}
      <div className="flex gap-6">
        <FilterSkeleton />

        <div className="flex-1 min-w-0">
          <ToolbarSkeleton />

          <div
            className={cn(
              "grid gap-3",
              "grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4",
            )}
          >
            {Array.from({ length: 12 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>

          {/* Pagination skeleton */}
          <div className="mt-8 flex items-center justify-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-9 w-9 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
