import Link from "next/link";
import { Calendar, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils/tailwind-merge";
import { SectionHeader } from "@/components/shared/section-header";
import { Badge } from "@/components/ui/badge";

interface HealthArticle {
  id: string;
  category: string;
  title: string;
  excerpt: string;
  readTime: string;
  date: string;
  href: string;
  featured?: boolean;
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
    featured: true,
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
    featured: true,
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
    featured: true,
  },
];

function ArticleCard({ article }: { article: HealthArticle }) {
  return (
    <Link
      href={article.href}
      className={cn(
        "group flex flex-col overflow-hidden rounded-2xl border border-border bg-card",
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
        <div className="text-primary/30">
          <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center">
            <span className="text-3xl">🌿</span>
          </div>
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
            "line-clamp-2 group-hover:text-primary transition-colors",
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

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {articles.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
    </section>
  );
}
