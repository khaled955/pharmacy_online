import Link from "next/link";
import { cn } from "@/lib/utils/tailwind-merge";
import { SectionHeader } from "@/components/shared/section-header";
import { getCategories } from "@/lib/services/categories/get-categories.service";
import type { CategoryRow } from "@/lib/types/product";

// [MODIFIED] Now imports shared visual config instead of defining it inline
// [SAFE] Visual output is identical; only the source of the config moved
import { CATEGORY_VISUAL, DEFAULT_VISUAL } from "@/components/virtual-pharmacy/category-visuals";

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
