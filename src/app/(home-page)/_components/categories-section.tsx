import Link from "next/link";
import {
  Pill, Baby, Sparkles, Heart, Leaf, Syringe, Brain, Eye,
  Package, Thermometer, Stethoscope, FlaskConical, LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils/tailwind-merge";
import { SectionHeader } from "@/components/shared/section-header";
import { getCategories } from "@/lib/services/categories/get-categories.service";
import type { CategoryRow } from "@/lib/types/product";

/* ─── Slug → visual config mapping ─────────────────────────── */
type VisualConfig = {
  icon: LucideIcon;
  color: string;
  bgColor: string;
  borderColor: string;
  hoverBorder: string;
};

const CATEGORY_VISUAL: Record<string, VisualConfig> = {
  medicines: {
    icon: Pill,
    color: "text-primary",
    bgColor: "bg-primary/10 dark:bg-primary/15",
    borderColor: "border-primary/20",
    hoverBorder: "hover:border-primary/40",
  },
  "baby-care": {
    icon: Baby,
    color: "text-rose-500 dark:text-rose-400",
    bgColor: "bg-rose-50 dark:bg-rose-500/10",
    borderColor: "border-rose-200/60 dark:border-rose-500/20",
    hoverBorder: "hover:border-rose-300 dark:hover:border-rose-400/40",
  },
  "skin-care": {
    icon: Sparkles,
    color: "text-violet-500 dark:text-violet-400",
    bgColor: "bg-violet-50 dark:bg-violet-500/10",
    borderColor: "border-violet-200/60 dark:border-violet-500/20",
    hoverBorder: "hover:border-violet-300 dark:hover:border-violet-400/40",
  },
  vitamins: {
    icon: Leaf,
    color: "text-emerald-600 dark:text-emerald-400",
    bgColor: "bg-emerald-50 dark:bg-emerald-500/10",
    borderColor: "border-emerald-200/60 dark:border-emerald-500/20",
    hoverBorder: "hover:border-emerald-300 dark:hover:border-emerald-400/40",
  },
  "mother-care": {
    icon: Heart,
    color: "text-pink-500 dark:text-pink-400",
    bgColor: "bg-pink-50 dark:bg-pink-500/10",
    borderColor: "border-pink-200/60 dark:border-pink-500/20",
    hoverBorder: "hover:border-pink-300 dark:hover:border-pink-400/40",
  },
  vaccines: {
    icon: Syringe,
    color: "text-sky-500 dark:text-sky-400",
    bgColor: "bg-sky-50 dark:bg-sky-500/10",
    borderColor: "border-sky-200/60 dark:border-sky-500/20",
    hoverBorder: "hover:border-sky-300 dark:hover:border-sky-400/40",
  },
  "mental-health": {
    icon: Brain,
    color: "text-amber-500 dark:text-amber-400",
    bgColor: "bg-amber-50 dark:bg-amber-500/10",
    borderColor: "border-amber-200/60 dark:border-amber-500/20",
    hoverBorder: "hover:border-amber-300 dark:hover:border-amber-400/40",
  },
  "eye-care": {
    icon: Eye,
    color: "text-cyan-500 dark:text-cyan-400",
    bgColor: "bg-cyan-50 dark:bg-cyan-500/10",
    borderColor: "border-cyan-200/60 dark:border-cyan-500/20",
    hoverBorder: "hover:border-cyan-300 dark:hover:border-cyan-400/40",
  },
  "first-aid": {
    icon: Thermometer,
    color: "text-red-500 dark:text-red-400",
    bgColor: "bg-red-50 dark:bg-red-500/10",
    borderColor: "border-red-200/60 dark:border-red-500/20",
    hoverBorder: "hover:border-red-300 dark:hover:border-red-400/40",
  },
  diagnostics: {
    icon: Stethoscope,
    color: "text-indigo-500 dark:text-indigo-400",
    bgColor: "bg-indigo-50 dark:bg-indigo-500/10",
    borderColor: "border-indigo-200/60 dark:border-indigo-500/20",
    hoverBorder: "hover:border-indigo-300 dark:hover:border-indigo-400/40",
  },
  supplements: {
    icon: FlaskConical,
    color: "text-teal-500 dark:text-teal-400",
    bgColor: "bg-teal-50 dark:bg-teal-500/10",
    borderColor: "border-teal-200/60 dark:border-teal-500/20",
    hoverBorder: "hover:border-teal-300 dark:hover:border-teal-400/40",
  },
};

const DEFAULT_VISUAL: VisualConfig = {
  icon: Package,
  color: "text-primary",
  bgColor: "bg-primary/10 dark:bg-primary/15",
  borderColor: "border-primary/20",
  hoverBorder: "hover:border-primary/40",
};

function CategoryCard({ category }: { category: CategoryRow }) {
  const visual = CATEGORY_VISUAL[category.slug] ?? DEFAULT_VISUAL;
  const Icon = visual.icon;

  return (
    <Link
      href={`/products?category=${category.slug}`}
      className={cn(
        "group flex flex-col items-center gap-2 rounded-2xl border p-4 text-center",
        "bg-card transition-all duration-200",
        visual.borderColor,
        visual.hoverBorder,
        "hover:-translate-y-0.5 hover:shadow-card",
        "shadow-card",
      )}
    >
      <div
        className={cn(
          "flex h-11 w-11 items-center justify-center rounded-xl",
          visual.bgColor,
          "transition-transform duration-200 group-hover:scale-110",
        )}
      >
        <Icon className={cn("h-5 w-5", visual.color)} />
      </div>
      <div>
        <p className="text-xs font-semibold text-foreground leading-tight">
          {category.name_en}
        </p>
      </div>
    </Link>
  );
}

export default async function CategoriesSection() {
  const categories = await getCategories();

  if (categories.length === 0) return null;

  return (
    <section className="section-container py-10">
      <SectionHeader
        title="Shop by Category"
        description="Find everything you need for your health and wellbeing"
        viewAllHref="/products"
        viewAllLabel="All Categories"
      />

      <div
        className={cn(
          "grid gap-3",
          "grid-cols-2 sm:grid-cols-4",
          categories.length >= 8 ? "lg:grid-cols-8" : "lg:grid-cols-4",
        )}
      >
        {categories.map((cat) => (
          <CategoryCard key={cat.id} category={cat} />
        ))}
      </div>
    </section>
  );
}
