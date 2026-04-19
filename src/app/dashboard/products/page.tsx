import { Package, Search } from "lucide-react";
import { cn } from "@/lib/utils/tailwind-merge";
import { SectionHeader } from "@/components/shared/section-header";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/shared/empty-state";
import { getProducts } from "@/lib/services/products/get-products.service";

type PageSearchParams = Promise<Record<string, string | string[] | undefined>>;

function stockStatus(stock: number): {
  label: string;
  variant: "success" | "warning" | "muted";
} {
  if (stock === 0) return { label: "Out of Stock", variant: "muted" };
  if (stock < 20) return { label: "Low Stock", variant: "warning" };
  return { label: "Active", variant: "success" };
}

export default async function DashboardProductsPage({
  searchParams,
}: {
  searchParams: PageSearchParams;
}) {
  const raw = await searchParams;
  const q = Array.isArray(raw.q) ? raw.q[0] : (raw.q ?? "");
  const page = raw.page ? Number(Array.isArray(raw.page) ? raw.page[0] : raw.page) : 1;

  const { data: products, meta } = await getProducts({
    q: q || undefined,
    page,
    limit: 20,
    sort: "newest",
  });

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Products"
        description={`${meta.totalItems} products in catalogue`}
        accent
      />

      {/* Search — form submission updates URL */}
      <form method="GET" action="/dashboard/products">
        <div
          className={cn(
            "relative flex h-11 w-full max-w-md items-center overflow-hidden rounded-xl",
            "border border-border bg-card shadow-card",
            "focus-within:border-primary/40 focus-within:ring-4 focus-within:ring-primary/10",
            "transition-all duration-200",
          )}
        >
          <Search className="ms-3.5 h-4 w-4 shrink-0 text-muted-foreground" />
          <input
            type="search"
            name="q"
            defaultValue={q}
            placeholder="Search products…"
            className="h-full w-full bg-transparent px-3 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none border-0 ring-0"
          />
        </div>
      </form>

      {products.length === 0 ? (
        <EmptyState
          icon={<Package className="h-8 w-8" />}
          title="No products found"
          description={q ? "Try a different search term." : "No products in the catalogue yet."}
        />
      ) : (
        <div className="rounded-2xl border border-border bg-card shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  {["Product", "Brand", "Stock", "Price", "Status"].map((col) => (
                    <th
                      key={col}
                      className="px-5 py-3.5 text-start text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {products.map((product) => {
                  const { label, variant } = stockStatus(product.stock);
                  return (
                    <tr
                      key={product.id}
                      className="hover:bg-muted/30 transition-colors"
                    >
                      <td className="px-5 py-4 font-medium text-foreground max-w-64 truncate">
                        {product.name_en}
                      </td>
                      <td className="px-5 py-4 text-muted-foreground">
                        {product.brand ?? "—"}
                      </td>
                      <td className="px-5 py-4 text-foreground tabular-nums">
                        {product.stock}
                      </td>
                      <td className="px-5 py-4 font-semibold text-foreground tabular-nums">
                        ${product.price.toFixed(2)}
                      </td>
                      <td className="px-5 py-4">
                        <Badge variant={variant}>{label}</Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination hint */}
          {meta.totalPages > 1 && (
            <div className="border-t border-border px-5 py-3 text-xs text-muted-foreground">
              Page {meta.currentPage} of {meta.totalPages} — {meta.totalItems} products total
            </div>
          )}
        </div>
      )}
    </div>
  );
}
