"use client";

// [NEW] VirtualShelfClient — interactive shelf grid with animated drawer
// [SAFE] Receives pre-fetched categories from server wrapper; no API calls here
// [MODIFIED] Replaces the static category grid when ENABLE_VIRTUAL_EXPERIENCE=true

import { useState, useRef } from "react";
import { AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils/tailwind-merge";
import type { CategoryRow } from "@/lib/types/product";
import { ShelfCategoryCard } from "./shelf-category-card";
import { ShelfDrawerPanel } from "./shelf-drawer-panel";

interface VirtualShelfClientProps {
  categories: CategoryRow[];
}

export function VirtualShelfClient({ categories }: VirtualShelfClientProps) {
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const selectedCategory = categories.find((c) => c.slug === openSlug) ?? null;

  function handleCardClick(slug: string) {
    if (openSlug === slug) {
      // Close if already open
      setOpenSlug(null);
    } else {
      setOpenSlug(slug);
      // Scroll the panel into view after animation starts
      setTimeout(() => {
        panelRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }, 120);
    }
  }

  return (
    <div className="space-y-0">
      {/* ── Shelf grid ────────────────────────────────────────────── */}
      {/*
        [NEW] Uses a visual "shelf" metaphor:
        - Cards are styled as drawers (see ShelfCategoryCard)
        - Clicking opens the animated ShelfDrawerPanel below
        - Grid col count matches original CategoriesSection
      */}
      <div
        className={cn(
          "grid gap-3",
          "grid-cols-3 sm:grid-cols-4",
          categories.length >= 8 ? "lg:grid-cols-8" : "lg:grid-cols-4",
        )}
      >
        {categories.map((cat, i) => (
          <ShelfCategoryCard
            key={cat.id}
            category={cat}
            isOpen={openSlug === cat.slug}
            index={i}
            onClick={() => handleCardClick(cat.slug)}
          />
        ))}
      </div>

      {/* ── Drawer panel (animated, below the grid) ───────────────── */}
      <div ref={panelRef}>
        <AnimatePresence mode="wait">
          {selectedCategory && (
            <ShelfDrawerPanel
              key={selectedCategory.slug}
              category={selectedCategory}
              onClose={() => setOpenSlug(null)}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
