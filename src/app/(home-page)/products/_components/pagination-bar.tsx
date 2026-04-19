"use client";

import { useRouter, usePathname } from "next/navigation";
import { cn } from "@/lib/utils/tailwind-merge";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { ActiveFilters } from "./filter-sidebar";

interface PaginationBarProps {
  currentPage: number;
  totalPages: number;
  activeFilters: ActiveFilters;
}

export function PaginationBar({
  currentPage,
  totalPages,
  activeFilters,
}: PaginationBarProps) {
  const router = useRouter();
  const pathname = usePathname();

  if (totalPages <= 1) return null;

  function buildUrl(page: number) {
    const params = new URLSearchParams();
    const keys: (keyof ActiveFilters)[] = [
      "category", "brand", "minPrice", "maxPrice", "onSale", "sort", "q",
    ];
    for (const key of keys) {
      const val = activeFilters[key];
      if (val) params.set(key, val);
    }
    params.set("page", String(page));
    return `${pathname}?${params.toString()}`;
  }

  function getPageNumbers(): (number | "…")[] {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);

    const pages: (number | "…")[] = [1];
    if (currentPage > 3) pages.push("…");

    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);
    for (let i = start; i <= end; i++) pages.push(i);

    if (currentPage < totalPages - 2) pages.push("…");
    pages.push(totalPages);

    return pages;
  }

  return (
    <div className="mt-8 flex items-center justify-center gap-1">
      {/* Prev */}
      <button
        type="button"
        disabled={currentPage === 1}
        onClick={() => router.push(buildUrl(currentPage - 1))}
        className={cn(
          "flex h-9 w-9 items-center justify-center rounded-xl",
          "border text-sm font-medium transition-colors",
          currentPage === 1
            ? "border-border bg-card text-muted-foreground/40 cursor-not-allowed"
            : "border-border bg-card text-muted-foreground hover:border-primary/30 hover:text-primary",
        )}
        aria-label="Previous page"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      {getPageNumbers().map((page, i) =>
        page === "…" ? (
          <span
            key={`ellipsis-${i}`}
            className="flex h-9 w-9 items-center justify-center text-sm text-muted-foreground"
          >
            …
          </span>
        ) : (
          <button
            key={page}
            type="button"
            onClick={() => router.push(buildUrl(page))}
            className={cn(
              "flex h-9 min-w-9 items-center justify-center rounded-xl",
              "border text-sm font-medium transition-colors px-2",
              page === currentPage
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card text-muted-foreground hover:border-primary/30 hover:text-primary",
            )}
          >
            {page}
          </button>
        ),
      )}

      {/* Next */}
      <button
        type="button"
        disabled={currentPage === totalPages}
        onClick={() => router.push(buildUrl(currentPage + 1))}
        className={cn(
          "flex h-9 w-9 items-center justify-center rounded-xl",
          "border text-sm font-medium transition-colors",
          currentPage === totalPages
            ? "border-border bg-card text-muted-foreground/40 cursor-not-allowed"
            : "border-border bg-card text-muted-foreground hover:border-primary/30 hover:text-primary",
        )}
        aria-label="Next page"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}
