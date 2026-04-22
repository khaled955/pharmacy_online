"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, X, ArrowRight, Loader2 } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils/tailwind-merge";
import { useDebounce } from "@/hooks/use-debounce";
import type { ProductCardData } from "@/lib/types/product";

// ─── Types ────────────────────────────────────────────────────────────────────

interface SearchResponse {
  data: ProductCardData[];
  meta: { totalItems: number };
}

export interface SearchDialogProps {
  /** The visual content rendered inside the trigger button */
  triggerContent: React.ReactNode;
  /** Extra classes applied to the trigger wrapper button */
  triggerClassName?: string;
}

// ─── Result Item ──────────────────────────────────────────────────────────────

function ResultItem({
  product,
  isActive,
  onSelect,
  onHover,
}: {
  product: ProductCardData;
  isActive: boolean;
  onSelect: () => void;
  onHover: () => void;
}) {
  const discount =
    product.original_price && product.original_price > product.price
      ? Math.round(
          ((product.original_price - product.price) / product.original_price) *
            100,
        )
      : 0;

  return (
    <button
      type="button"
      role="option"
      aria-selected={isActive}
      onClick={onSelect}
      onMouseEnter={onHover}
      className={cn(
        "flex w-full items-center gap-3 px-4 py-2.5 text-start",
        "transition-colors duration-100",
        isActive ? "bg-primary/5" : "hover:bg-muted/50",
      )}
    >
      {/* Thumbnail */}
      <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-xl border border-border bg-muted">
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.name_en}
            fill
            className="object-cover"
            sizes="44px"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-lg">
            💊
          </div>
        )}
      </div>

      {/* Info */}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-foreground">
          {product.name_en}
        </p>
        {product.brand && (
          <p className="truncate text-xs text-muted-foreground">
            {product.brand}
          </p>
        )}
      </div>

      {/* Price */}
      <div className="shrink-0 text-end">
        <p className="text-sm font-semibold text-primary">
          ${product.price.toFixed(2)}
        </p>
        {discount > 0 && (
          <p className="text-xs text-muted-foreground line-through">
            ${product.original_price!.toFixed(2)}
          </p>
        )}
      </div>
    </button>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function SearchDialog({ triggerContent, triggerClassName }: SearchDialogProps) {
  // State
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ProductCardData[]>([]);
  const [totalResults, setTotalResults] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  // Refs
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  // Navigation
  const router = useRouter();

  // Debounced query — 300ms prevents a request on every keystroke
  const debouncedQuery = useDebounce(query, 300);

  // Functions
  const openDialog = useCallback(() => {
    setOpen(true);
    // Defer focus so the DOM node is visible first
    setTimeout(() => inputRef.current?.focus(), 50);
  }, []);

  const closeDialog = useCallback(() => {
    setOpen(false);
    setQuery("");
    setResults([]);
    setActiveIndex(-1);
  }, []);

  const navigateToProduct = useCallback(
    (slug: string) => {
      router.push(`/products/${slug}`);
      closeDialog();
    },
    [router, closeDialog],
  );

  const viewAllResults = useCallback(() => {
    if (!query.trim()) return;
    router.push(`/products?q=${encodeURIComponent(query.trim())}`);
    closeDialog();
  }, [query, router, closeDialog]);

  // ── Live search ──────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!debouncedQuery.trim() || debouncedQuery.length < 2) {
      setResults([]);
      setTotalResults(0);
      setIsLoading(false);
      return;
    }

    let cancelled = false;
    setIsLoading(true);

    fetch(`/api/products/search?q=${encodeURIComponent(debouncedQuery)}`)
      .then((r) => r.json())
      .then((json: SearchResponse) => {
        if (!cancelled) {
          setResults(json.data ?? []);
          setTotalResults(json.meta?.totalItems ?? 0);
          setActiveIndex(-1);
        }
      })
      .catch(() => {
        if (!cancelled) setResults([]);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [debouncedQuery]);

  // ── Keyboard navigation ───────────────────────────────────────────────────────
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (!open) return;

      if (e.key === "Escape") {
        closeDialog();
        return;
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((i) => Math.min(i + 1, results.length - 1));
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((i) => Math.max(i - 1, -1));
      }
      if (e.key === "Enter") {
        if (activeIndex >= 0) {
          const item = results[activeIndex];
          if (item) navigateToProduct(item.slug);
        } else if (query.trim().length >= 2) {
          viewAllResults();
        }
      }
    }

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, results, activeIndex, query, navigateToProduct, viewAllResults, closeDialog]);

  // ── Scroll active item into view ──────────────────────────────────────────────
  useEffect(() => {
    if (activeIndex < 0 || !listRef.current) return;
    const child = listRef.current.children[activeIndex] as HTMLElement | undefined;
    child?.scrollIntoView({ block: "nearest" });
  }, [activeIndex]);

  // ── Body scroll lock ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const hasResults = results.length > 0;
  const showEmpty =
    !isLoading && debouncedQuery.length >= 2 && !hasResults;
  const showIdle = debouncedQuery.length < 2;

  return (
    <>
      {/* ── Trigger ── */}
      <button
        type="button"
        onClick={openDialog}
        className={triggerClassName}
        aria-label="Open search"
        aria-haspopup="dialog"
      >
        {triggerContent}
      </button>

      {/* ── Overlay + Dialog ── */}
      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Search products"
          className="fixed inset-0 z-[200] flex flex-col"
        >
          {/* Backdrop */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-foreground/25 backdrop-blur-sm"
            onClick={closeDialog}
          />

          {/* Panel — sits near the top for easy thumb reach on mobile */}
          <div className="relative mx-auto mt-14 w-full max-w-xl px-4 sm:mt-20">
            <div
              className={cn(
                "overflow-hidden rounded-2xl",
                "border border-border bg-card shadow-2xl",
                "animate-in fade-in slide-in-from-top-3 duration-200",
              )}
            >
              {/* ── Search input row ── */}
              <div className="flex h-14 items-center gap-3 border-b border-border px-4">
                {isLoading ? (
                  <Loader2 className="h-5 w-5 shrink-0 animate-spin text-primary" />
                ) : (
                  <Search className="h-5 w-5 shrink-0 text-muted-foreground" />
                )}
                <input
                  ref={inputRef}
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search medicines, vitamins, brands…"
                  autoComplete="off"
                  autoCorrect="off"
                  spellCheck={false}
                  aria-label="Search products"
                  aria-autocomplete="list"
                  aria-controls="search-results-list"
                  className={cn(
                    "h-full flex-1 bg-transparent text-sm text-foreground",
                    "placeholder:text-muted-foreground/60",
                    "border-0 outline-none ring-0",
                  )}
                />
                <button
                  type="button"
                  onClick={closeDialog}
                  aria-label="Close search"
                  className={cn(
                    "flex h-7 w-7 items-center justify-center rounded-lg",
                    "text-muted-foreground",
                    "hover:bg-muted hover:text-foreground",
                    "transition-colors",
                  )}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* ── Results list ── */}
              {hasResults && (
                <ul
                  id="search-results-list"
                  ref={listRef}
                  role="listbox"
                  aria-label="Search results"
                  className="max-h-[55vh] overflow-y-auto py-2"
                >
                  {results.map((product, index) => (
                    <li key={product.id} role="presentation">
                      <ResultItem
                        product={product}
                        isActive={index === activeIndex}
                        onSelect={() => navigateToProduct(product.slug)}
                        onHover={() => setActiveIndex(index)}
                      />
                    </li>
                  ))}
                </ul>
              )}

              {/* ── Empty state ── */}
              {showEmpty && (
                <div className="px-4 py-8 text-center">
                  <p className="text-sm text-muted-foreground">
                    No results for{" "}
                    <span className="font-semibold text-foreground">
                      &ldquo;{query}&rdquo;
                    </span>
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground/70">
                    Try a different keyword or browse all products.
                  </p>
                </div>
              )}

              {/* ── Idle hint ── */}
              {showIdle && (
                <div className="px-4 py-6 text-center">
                  <p className="text-sm text-muted-foreground">
                    Type at least 2 characters to search
                  </p>
                </div>
              )}

              {/* ── View-all footer ── */}
              {hasResults && (
                <div className="border-t border-border px-4 py-3">
                  <button
                    type="button"
                    onClick={viewAllResults}
                    className={cn(
                      "flex w-full items-center justify-between",
                      "rounded-xl px-3 py-2",
                      "text-sm font-medium text-primary",
                      "hover:bg-primary/5 transition-colors",
                    )}
                  >
                    <span>
                      {totalResults > 6
                        ? `See all ${totalResults} results for "${query}"`
                        : `View all results for "${query}"`}
                    </span>
                    <ArrowRight className="h-4 w-4 shrink-0" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
