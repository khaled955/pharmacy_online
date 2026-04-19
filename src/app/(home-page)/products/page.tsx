import { Search } from "lucide-react";
import { cn } from "@/lib/utils/tailwind-merge";
import { InteractiveProductCard } from "@/components/shop/interactive-product-card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/shared/empty-state";
import { FilterSidebar, type ActiveFilters } from "./_components/filter-sidebar";
import { SortToolbar } from "./_components/sort-toolbar";
import { PaginationBar } from "./_components/pagination-bar";
import { getProducts, getProductBrands } from "@/lib/services/products/get-products.service";
import { getCategories } from "@/lib/services/categories/get-categories.service";
import { toProductCardProps } from "@/lib/utils/product-mapper";
import type { ProductFilters, SortOption } from "@/lib/types/product";

type PageSearchParams = Promise<Record<string, string | string[] | undefined>>;

function firstString(
  val: string | string[] | undefined,
): string | undefined {
  if (!val) return undefined;
  return Array.isArray(val) ? val[0] : val;
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: PageSearchParams;
}) {
  const raw = await searchParams;

  const activeFilters: ActiveFilters = {
    category: firstString(raw.category),
    brand: firstString(raw.brand),
    minPrice: firstString(raw.minPrice),
    maxPrice: firstString(raw.maxPrice),
    onSale: firstString(raw.onSale),
    sort: firstString(raw.sort),
    q: firstString(raw.q),
  };

  const filters: ProductFilters = {
    category: activeFilters.category,
    brand: activeFilters.brand,
    minPrice: activeFilters.minPrice ? Number(activeFilters.minPrice) : undefined,
    maxPrice: activeFilters.maxPrice ? Number(activeFilters.maxPrice) : undefined,
    onSale: activeFilters.onSale === "true",
    q: activeFilters.q,
    sort: (activeFilters.sort as SortOption | undefined) ?? "newest",
    page: raw.page ? Number(firstString(raw.page)) : 1,
    limit: 12,
  };

  const [result, categories, brands] = await Promise.all([
    getProducts(filters),
    getCategories(),
    getProductBrands(),
  ]);

  const { data: products, meta } = result;

  const activeCategoryLabel = activeFilters.category
    ? (categories.find((c) => c.slug === activeFilters.category)?.name_en ?? activeFilters.category)
    : null;

  return (
    <div className="section-container py-8">
      {/* Page header */}
      <div className="mb-6">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <Badge variant="muted">All Products</Badge>
          {activeCategoryLabel && (
            <>
              <span className="text-xs text-muted-foreground">›</span>
              <Badge variant="outline">{activeCategoryLabel}</Badge>
            </>
          )}
        </div>
        <h1 className="text-2xl font-bold text-foreground">
          {activeCategoryLabel ?? "All Products"}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Browse our full range of medicines, vitamins and wellness products
        </p>
      </div>

      {/* Search */}
      <form method="GET" action="/products">
        {/* Preserve filters when searching */}
        {activeFilters.category && (
          <input type="hidden" name="category" value={activeFilters.category} />
        )}
        {activeFilters.brand && (
          <input type="hidden" name="brand" value={activeFilters.brand} />
        )}
        <div
          className={cn(
            "relative mb-6 flex h-11 w-full items-center overflow-hidden rounded-xl",
            "border border-border bg-card shadow-card",
            "focus-within:border-primary/40 focus-within:ring-4 focus-within:ring-primary/10",
            "transition-all duration-200",
          )}
        >
          <Search className="ms-3.5 h-4 w-4 shrink-0 text-muted-foreground" />
          <input
            type="search"
            name="q"
            defaultValue={activeFilters.q ?? ""}
            placeholder="Search products…"
            className="h-full w-full bg-transparent px-3 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none border-0 ring-0"
          />
        </div>
      </form>

      {/* Layout: sidebar + grid */}
      <div className="flex gap-6">
        <FilterSidebar
          categories={categories}
          brands={brands}
          activeFilters={activeFilters}
        />

        {/* Main content */}
        <div className="flex-1 min-w-0">
          <SortToolbar total={meta.totalItems} activeFilters={activeFilters} />

          {products.length === 0 ? (
            <EmptyState
              title="No products found"
              description="Try adjusting your filters or search query to find what you need."
            />
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4">
              {products.map((product) => (
                <InteractiveProductCard key={product.id} {...toProductCardProps(product)} />
              ))}
            </div>
          )}

          <PaginationBar
            currentPage={meta.currentPage}
            totalPages={meta.totalPages}
            activeFilters={activeFilters}
          />
        </div>
      </div>
    </div>
  );
}
