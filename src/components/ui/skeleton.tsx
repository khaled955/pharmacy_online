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

export { Skeleton, ProductCardSkeleton, SectionHeaderSkeleton };
