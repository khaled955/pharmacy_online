"use client";

import * as React from "react";
import { useRouter, usePathname } from "next/navigation";
import { ChevronDown, SlidersHorizontal, X } from "lucide-react";
import { cn } from "@/lib/utils/tailwind-merge";
import type { CategoryRow } from "@/lib/types/product";

export type ActiveFilters = {
  category?: string;
  brand?: string;
  minPrice?: string;
  maxPrice?: string;
  onSale?: string;
  sort?: string;
  q?: string;
};

interface FilterSidebarProps {
  categories: CategoryRow[];
  brands: string[];
  activeFilters: ActiveFilters;
}

function CollapsibleGroup({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = React.useState(true);

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="mb-2.5 flex w-full items-center justify-between text-sm font-semibold text-foreground"
      >
        {label}
        <ChevronDown
          className={cn(
            "h-4 w-4 text-muted-foreground transition-transform",
            open && "rotate-180",
          )}
        />
      </button>
      {open && <div>{children}</div>}
    </div>
  );
}

export function FilterSidebar({
  categories,
  brands,
  activeFilters,
}: FilterSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();

  function buildUrl(overrides: Partial<ActiveFilters> & { page?: string }) {
    const next: Record<string, string> = {};

    const merged = { ...activeFilters, ...overrides };
    const keys: (keyof typeof merged)[] = [
      "category", "brand", "minPrice", "maxPrice", "onSale", "sort", "q",
    ];
    for (const key of keys) {
      const val = merged[key];
      if (val) next[key] = val;
    }
    if (overrides.page) {
      next.page = overrides.page;
    } else {
      next.page = "1"; // reset page on any filter change
    }

    const qs = new URLSearchParams(next).toString();
    return `${pathname}?${qs}`;
  }

  function toggle(key: keyof ActiveFilters, value: string) {
    const current = activeFilters[key];
    router.push(buildUrl({ [key]: current === value ? undefined : value }));
  }

  function clearAll() {
    router.push(pathname);
  }

  const hasFilters =
    !!activeFilters.category ||
    !!activeFilters.brand ||
    !!activeFilters.onSale ||
    !!activeFilters.minPrice ||
    !!activeFilters.maxPrice;

  return (
    <aside
      className={cn(
        "hidden lg:block w-56 shrink-0",
        "sticky top-28 self-start max-h-[calc(100vh-8rem)] overflow-y-auto",
      )}
    >
      <div
        className={cn(
          "rounded-2xl border border-border bg-card shadow-card",
          "p-5 space-y-5",
        )}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
            <h2 className="text-sm font-bold text-foreground">Filters</h2>
          </div>
          {hasFilters && (
            <button
              type="button"
              onClick={clearAll}
              className="flex items-center gap-1 text-xs font-medium text-primary hover:underline"
            >
              <X className="h-3 w-3" />
              Clear
            </button>
          )}
        </div>

        {/* On Sale toggle */}
        <div>
          <label className="flex cursor-pointer items-center gap-2.5">
            <input
              type="checkbox"
              checked={activeFilters.onSale === "true"}
              onChange={() =>
                router.push(
                  buildUrl({
                    onSale: activeFilters.onSale === "true" ? undefined : "true",
                  }),
                )
              }
              className="h-4 w-4 rounded-md border-border accent-primary cursor-pointer"
            />
            <span className="text-sm text-muted-foreground">On Sale</span>
          </label>
        </div>

        {/* Categories */}
        {categories.length > 0 && (
          <CollapsibleGroup label="Category">
            <ul className="space-y-1.5">
              {categories.map((cat) => (
                <li key={cat.id}>
                  <label className="flex cursor-pointer items-center gap-2.5">
                    <input
                      type="checkbox"
                      checked={activeFilters.category === cat.slug}
                      onChange={() => toggle("category", cat.slug)}
                      className="h-4 w-4 rounded-md border-border accent-primary cursor-pointer"
                    />
                    <span className="text-sm text-muted-foreground">
                      {cat.name_en}
                    </span>
                  </label>
                </li>
              ))}
            </ul>
          </CollapsibleGroup>
        )}

        {/* Brands */}
        {brands.length > 0 && (
          <CollapsibleGroup label="Brand">
            <ul className="space-y-1.5">
              {brands.map((brand) => (
                <li key={brand}>
                  <label className="flex cursor-pointer items-center gap-2.5">
                    <input
                      type="checkbox"
                      checked={activeFilters.brand === brand}
                      onChange={() => toggle("brand", brand)}
                      className="h-4 w-4 rounded-md border-border accent-primary cursor-pointer"
                    />
                    <span className="text-sm text-muted-foreground">
                      {brand}
                    </span>
                  </label>
                </li>
              ))}
            </ul>
          </CollapsibleGroup>
        )}

        {/* Price Range */}
        <CollapsibleGroup label="Price Range">
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Min"
              defaultValue={activeFilters.minPrice ?? ""}
              onBlur={(e) =>
                router.push(
                  buildUrl({ minPrice: e.target.value || undefined }),
                )
              }
              className={cn(
                "w-full rounded-xl border border-border bg-muted/40 px-2 py-1.5",
                "text-xs text-foreground placeholder:text-muted-foreground/50",
                "focus:border-primary/40 focus:outline-none",
              )}
            />
            <input
              type="number"
              placeholder="Max"
              defaultValue={activeFilters.maxPrice ?? ""}
              onBlur={(e) =>
                router.push(
                  buildUrl({ maxPrice: e.target.value || undefined }),
                )
              }
              className={cn(
                "w-full rounded-xl border border-border bg-muted/40 px-2 py-1.5",
                "text-xs text-foreground placeholder:text-muted-foreground/50",
                "focus:border-primary/40 focus:outline-none",
              )}
            />
          </div>
        </CollapsibleGroup>
      </div>
    </aside>
  );
}
