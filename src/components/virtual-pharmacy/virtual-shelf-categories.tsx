// [NEW] VirtualShelfCategories — server wrapper for the virtual shelf experience
// [SAFE] Mirrors existing CategoriesSection structure; does not modify it
// Fetches categories on the server, passes to client VirtualShelfClient for interaction

import Link from "next/link";
import { cn } from "@/lib/utils/tailwind-merge";
import { SectionHeader } from "@/components/shared/section-header";
import { getCategories } from "@/lib/services/categories/get-categories.service";
import { VirtualShelfClient } from "./virtual-shelf-client";

export default async function VirtualShelfCategories() {
  const categories = await getCategories();

  if (categories.length === 0) return null;

  return (
    // [NEW] id="virtual-shelf" — target for the hero "Start Your Pharmacy Journey" CTA
    <section id="virtual-shelf" className="section-container py-10">
      <SectionHeader
        title="Browse Our Virtual Shelves"
        description="Click any shelf to open it and explore products inside"
        viewAllHref="/products"
        viewAllLabel="All Categories"
      />

      {/* [NEW] Pharmacist tip banner above shelves */}
      <div
        className={cn(
          "mb-5 flex items-center gap-3 rounded-2xl border border-primary/15",
          "bg-primary/5 px-4 py-3 text-sm text-primary",
        )}
      >
        <span className="text-base" aria-hidden="true">💡</span>
        <p>
          <span className="font-semibold">Pharmacist tip:</span>{" "}
          Click any shelf drawer to browse products in that category without leaving the page.
        </p>
        <Link
          href="/products"
          className="ms-auto shrink-0 text-xs font-semibold underline-offset-2 hover:underline"
        >
          Browse all
        </Link>
      </div>

      {/* [NEW] Interactive shelf client — handles open/close drawer state */}
      <VirtualShelfClient categories={categories} />
    </section>
  );
}
