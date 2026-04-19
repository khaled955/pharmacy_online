export default function CheckoutLoading() {
  return (
    <div className="section-container py-8">
      <div className="mb-6 flex items-center gap-3">
        <div className="h-10 w-10 animate-pulse rounded-xl bg-muted" />
        <div className="h-8 w-28 animate-pulse rounded-lg bg-muted" />
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-4">
          {[1, 2, 3].map((i) => <div key={i} className="h-32 animate-pulse rounded-2xl bg-muted" />)}
        </div>
        <div className="h-64 animate-pulse rounded-2xl bg-muted" />
      </div>
    </div>
  );
}
