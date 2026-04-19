import { Skeleton, SectionHeaderSkeleton } from "@/components/ui/skeleton";

function StatCardSkeleton() {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="flex items-start gap-4">
        <Skeleton className="h-12 w-12 rounded-2xl" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-3.5 w-28" />
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-3 w-36" />
        </div>
      </div>
    </div>
  );
}

function OrdersTableSkeleton() {
  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      <div className="border-b border-border p-4 bg-muted/30">
        <div className="flex gap-8">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-4 w-20" />
          ))}
        </div>
      </div>
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex gap-8 border-b border-border px-5 py-4">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-4 w-36" />
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-4 w-16" />
        </div>
      ))}
    </div>
  );
}

export default function DashboardLoadingPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <Skeleton className="h-8 w-36" />
        <Skeleton className="h-4 w-64" />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <StatCardSkeleton key={i} />
        ))}
      </div>

      {/* Recent orders */}
      <div className="space-y-4">
        <SectionHeaderSkeleton />
        <OrdersTableSkeleton />
      </div>

      {/* Quick actions */}
      <div className="space-y-4">
        <Skeleton className="h-6 w-32" />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-16 rounded-2xl" />
          ))}
        </div>
      </div>
    </div>
  );
}
