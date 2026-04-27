"use client";

import { useRouter, usePathname } from "next/navigation";
import { ChevronDown, Grid2X2, List, SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils/tailwind-merge";
import type { ActiveFilters } from "./filter-sidebar";

const SORT_OPTIONS: { value: string; label: string }[] = [
  { value: "newest", label: "Newest" },
  { value: "best_sellers", label: "Best Sellers" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "rating_desc", label: "Highest Rated" },
  { value: "sold_desc", label: "Most Sold" },
];

interface SortToolbarProps {
  total: number;
  activeFilters: ActiveFilters;
}

export function SortToolbar({ total, activeFilters }: SortToolbarProps) {
  const router = useRouter();
  const pathname = usePathname();

  function changeSort(sort: string) {
    const params = new URLSearchParams();
    const keys: (keyof ActiveFilters)[] = [
      "category", "brand", "minPrice", "maxPrice", "onSale", "q",
    ];
    for (const key of keys) {
      const val = activeFilters[key];
      if (val) params.set(key, val);
    }
    params.set("sort", sort);
    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
      <p className="text-sm text-muted-foreground">
        Showing{" "}
        <span className="font-semibold text-foreground">{total}</span> products
      </p>

      <div className="flex items-center gap-2">
        {/* Mobile filter button */}
        <button
          type="button"
          className={cn(
            "flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2",
            "text-sm font-medium text-foreground shadow-sm",
            "hover:border-primary/30 hover:text-primary transition-colors",
            "lg:hidden",
          )}
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filters
        </button>

        {/* Sort select */}
        <div className="relative">
          <select
            value={activeFilters.sort ?? "newest"}
            onChange={(e) => changeSort(e.target.value)}
            className={cn(
              "h-9 appearance-none rounded-xl border border-border bg-card",
              "pe-8 ps-3 text-sm text-foreground shadow-sm",
              "focus:border-primary/40 focus:ring-2 focus:ring-primary/10 focus:outline-none",
              "cursor-pointer",
            )}
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute end-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        </div>

        {/* View toggle */}
        <div className="hidden items-center rounded-xl border border-border bg-card shadow-sm sm:flex">
          <button
            type="button"
            aria-label="Grid view"
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-s-xl",
              "bg-primary text-primary-foreground",
            )}
          >
            <Grid2X2 className="h-4 w-4" />
          </button>
          <button
            type="button"
            aria-label="List view"
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-e-xl",
              "text-muted-foreground hover:text-foreground transition-colors",
            )}
          >
            <List className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
