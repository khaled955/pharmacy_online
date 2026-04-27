import Link from "next/link";
import { Calendar, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils/tailwind-merge";
import { SectionHeader } from "@/components/shared/section-header";
import { Badge } from "@/components/ui/badge";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface HealthArticle {
  id: string;
  category: string;
  title: string;
  excerpt: string;
  readTime: string;
  date: string;
  href: string;
}

const articles: HealthArticle[] = [
  {
    id: "1",
    category: "Nutrition",
    title: "The Benefits of Vitamin D for Your Immune System",
    excerpt:
      "Discover how adequate Vitamin D levels can significantly boost your immunity and overall health throughout the year.",
    readTime: "4 min read",
    date: "Apr 12, 2026",
    href: "/health-advice/benefits-of-vitamin-d",
  },
  {
    id: "2",
    category: "Skin Care",
    title: "Daily Skin Care Routine for Healthy Glowing Skin",
    excerpt:
      "A step-by-step guide to building a consistent skincare routine that works for all skin types.",
    readTime: "6 min read",
    date: "Apr 10, 2026",
    href: "/health-advice/daily-skin-care-routine",
  },
  {
    id: "3",
    category: "Vitamins",
    title: "The Power of Vitamin C — When and Why to Take It",
    excerpt:
      "Learn about optimal timing and dosage for Vitamin C supplementation for maximum benefit.",
    readTime: "5 min read",
    date: "Apr 8, 2026",
    href: "/health-advice/power-of-vitamin-c",
  },
  {
    id: "4",
    category: "Wellness",
    title: "Building Healthy Sleep Habits for Better Recovery",
    excerpt:
      "Quality sleep is the foundation of good health. Explore proven strategies to improve your nightly rest.",
    readTime: "5 min read",
    date: "Apr 6, 2026",
    href: "/health-advice/healthy-sleep-habits",
  },
  {
    id: "5",
    category: "Fitness",
    title: "The Role of Magnesium in Muscle Health and Relaxation",
    excerpt:
      "Understand how magnesium supports muscle function, reduces cramps, and aids post-workout recovery.",
    readTime: "4 min read",
    date: "Apr 4, 2026",
    href: "/health-advice/magnesium-muscle-health",
  },
];

function ArticleCard({ article }: { article: HealthArticle }) {
  return (
    <Link
      href={article.href}
      className={cn(
        "group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card",
        "shadow-card transition-all duration-300",
        "hover:-translate-y-0.5 hover:shadow-card-hover hover:border-primary/20",
      )}
    >
      {/* Image placeholder — ready for real images */}
      <div
        className={cn(
          "h-44 w-full bg-gradient-to-br",
          "from-primary/15 via-accent/20 to-muted",
          "flex items-center justify-center",
          "transition-transform duration-300 group-hover:scale-[1.01]",
          "overflow-hidden",
        )}
      >
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
          <span className="text-3xl">🌿</span>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-2.5 p-4">
        <div className="flex items-center gap-2">
          <Badge variant="info">{article.category}</Badge>
          <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
            <Calendar className="h-3 w-3" />
            {article.date}
          </span>
        </div>

        <h3
          className={cn(
            "text-sm font-semibold leading-snug text-foreground",
            "line-clamp-2 transition-colors group-hover:text-primary",
          )}
        >
          {article.title}
        </h3>

        <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
          {article.excerpt}
        </p>

        <div className="mt-auto flex items-center justify-between pt-1">
          <span className="text-xs text-muted-foreground">{article.readTime}</span>
          <span
            className={cn(
              "flex items-center gap-1 text-xs font-medium text-primary",
              "opacity-0 transition-opacity group-hover:opacity-100",
            )}
          >
            Read more <ArrowRight className="h-3 w-3" />
          </span>
        </div>
      </div>
    </Link>
  );
}

export default function HealthAdviceSection() {
  return (
    <section className="section-container py-8">
      <SectionHeader
        title="Health Advice"
        description="Expert tips and guides to keep you healthy"
        viewAllHref="/health-advice"
        viewAllLabel="All Articles"
      />

      <Carousel opts={{ align: "start", loop: true }} className="w-full">
        <CarouselContent className="-ml-4">
          {articles.map((article) => (
            <CarouselItem
              key={article.id}
              className="pl-4 basis-full sm:basis-1/2 lg:basis-1/3"
            >
              <ArticleCard article={article} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="-left-4 hidden sm:flex" />
        <CarouselNext className="-right-4 hidden sm:flex" />
      </Carousel>
    </section>
  );
}
