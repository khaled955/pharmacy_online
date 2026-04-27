import { Star } from "lucide-react";
import { SectionHeader } from "@/components/shared/section-header";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils/tailwind-merge";
import { SITE_REVIEWS, type SiteReview } from "@/data/site-reviews";

function StarRow({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={cn(
            "h-3.5 w-3.5",
            i < rating
              ? "fill-amber-400 text-amber-400"
              : "fill-muted text-muted-foreground/20",
          )}
        />
      ))}
    </div>
  );
}

function ReviewCard({ review }: { review: SiteReview }) {
  return (
    <article className="flex h-full flex-col rounded-2xl border border-border bg-card p-6 shadow-card">
      {/* Avatar + name */}
      <div className="mb-4 flex items-center gap-3">
        <div
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white",
            review.avatarColor,
          )}
          aria-hidden="true"
        >
          {review.initials}
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">{review.name}</p>
          <p className="text-xs text-muted-foreground">{review.location}</p>
        </div>
      </div>

      {/* Stars */}
      <StarRow rating={review.rating} />

      {/* Review text */}
      <blockquote className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
        &ldquo;{review.review}&rdquo;
      </blockquote>
    </article>
  );
}

export default function SiteReviewsSection() {
  return (
    <section className="section-container py-12">
      <SectionHeader
        title="What Our Customers Say"
        description="Trusted by thousands of families across Egypt"
      />

      <Carousel opts={{ align: "start", loop: true }} className="w-full">
        <CarouselContent className="-ml-4">
          {SITE_REVIEWS.map((review) => (
            <CarouselItem
              key={review.id}
              className="pl-4 basis-full sm:basis-1/2 lg:basis-1/3"
            >
              <ReviewCard review={review} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="-left-4 hidden sm:flex" />
        <CarouselNext className="-right-4 hidden sm:flex" />
      </Carousel>
    </section>
  );
}
