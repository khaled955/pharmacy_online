"use client";

import * as React from "react";
import { Star, Check } from "lucide-react";
import { cn } from "@/lib/utils/tailwind-merge";
import { Separator } from "@/components/ui/separator";
import type { ReviewRow } from "@/lib/types/product";

type Tab = "description" | "reviews" | "specs";

interface SpecItem {
  label: string;
  value: string | null | undefined;
}

interface ProductTabsProps {
  description: string | null;
  usageInstructions: string | null;
  warnings: string | null;
  ingredients: string | null;
  reviews: ReviewRow[];
  reviewCount: number | null;
  avgRating: number | null;
  specs: SpecItem[];
}

function StarRow({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={cn(
            "h-3 w-3",
            i < Math.round(rating)
              ? "fill-amber-400 text-amber-400"
              : "fill-muted text-muted-foreground/30",
          )}
        />
      ))}
    </div>
  );
}

function ReviewCard({ review }: { review: ReviewRow }) {
  const authorName =
    review.profiles?.full_name ??
    ([review.profiles?.first_name, review.profiles?.last_name]
      .filter(Boolean)
      .join(" ") ||
      "Customer");

  const date = new Date(review.created_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
  });

  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-card">
      <div className="mb-2 flex items-start justify-between gap-2">
        <div>
          <p className="text-sm font-semibold text-foreground">{authorName}</p>
          <div className="mt-0.5">
            <StarRow rating={review.rating} />
          </div>
        </div>
        <span className="text-xs text-muted-foreground">{date}</span>
      </div>
      {review.comment && (
        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
          {review.comment}
        </p>
      )}
    </div>
  );
}

export function ProductTabs({
  description,
  usageInstructions,
  warnings,
  ingredients,
  reviews,
  reviewCount,
  avgRating,
  specs,
}: ProductTabsProps) {
  const [active, setActive] = React.useState<Tab>("description");

  const tabs: { id: Tab; label: string }[] = [
    { id: "description", label: "Description" },
    {
      id: "reviews",
      label: `Reviews (${(reviewCount ?? 0).toLocaleString()})`,
    },
    { id: "specs", label: "Specifications" },
  ];

  const visibleSpecs = specs.filter((s) => s.value);

  return (
    <div>
      {/* Tab nav */}
      <div className="mb-6 flex gap-1 overflow-x-auto border-b border-border">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActive(tab.id)}
            className={cn(
              "shrink-0 px-4 py-2.5 text-sm font-medium",
              "border-b-2 transition-colors",
              active === tab.id
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground",
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Description tab */}
      {active === "description" && (
        <div className="space-y-6">
          {description && (
            <div>
              <h2 className="mb-3 text-base font-bold text-foreground">
                Description
              </h2>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {description}
              </p>
            </div>
          )}

          {usageInstructions && (
            <>
              <Separator />
              <div>
                <h2 className="mb-3 text-base font-bold text-foreground">
                  Usage Instructions
                </h2>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {usageInstructions}
                </p>
              </div>
            </>
          )}

          {warnings && (
            <>
              <Separator />
              <div>
                <h2 className="mb-3 text-base font-bold text-foreground">
                  Warnings
                </h2>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {warnings}
                </p>
              </div>
            </>
          )}

          {ingredients && (
            <>
              <Separator />
              <div>
                <h2 className="mb-3 text-base font-bold text-foreground">
                  Ingredients
                </h2>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {ingredients}
                </p>
              </div>
            </>
          )}

          {!description && !usageInstructions && !warnings && !ingredients && (
            <p className="text-sm text-muted-foreground">
              No description available.
            </p>
          )}
        </div>
      )}

      {/* Reviews tab */}
      {active === "reviews" && (
        <div className="space-y-6">
          {/* Rating summary */}
          {avgRating !== null && (
            <div className="flex items-start gap-6">
              <div className="text-center">
                <p className="text-5xl font-extrabold text-foreground">
                  {avgRating.toFixed(1)}
                </p>
                <div className="mt-1 flex justify-center">
                  <StarRow rating={avgRating} />
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {(reviewCount ?? 0).toLocaleString()} reviews
                </p>
              </div>
            </div>
          )}

          {reviews.length > 0 ? (
            <div className="space-y-4">
              {reviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              No reviews yet. Be the first to review this product.
            </p>
          )}
        </div>
      )}

      {/* Specs tab */}
      {active === "specs" && (
        <div>
          {visibleSpecs.length > 0 ? (
            <dl className="space-y-3">
              {visibleSpecs.map(({ label, value }) => (
                <div
                  key={label}
                  className="flex items-start gap-2 rounded-xl border border-border bg-muted/30 px-4 py-3"
                >
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10">
                    <Check className="h-3 w-3 text-primary" />
                  </div>
                  <div>
                    <dt className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                      {label}
                    </dt>
                    <dd className="text-sm text-foreground">{value}</dd>
                  </div>
                </div>
              ))}
            </dl>
          ) : (
            <p className="text-sm text-muted-foreground">
              No specifications available.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
