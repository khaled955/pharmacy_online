"use client";

// [NEW] ShelfCategoryCard — drawer/cabinet style category card with Framer Motion
// [SAFE] Completely new component; does not replace or affect existing CategoryCard
// [WARNING] Depth transform animation — lightweight, no GPU-heavy effects

import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils/tailwind-merge";
import type { CategoryRow } from "@/lib/types/product";
import { CATEGORY_VISUAL, DEFAULT_VISUAL } from "./category-visuals";

interface ShelfCategoryCardProps {
  category: CategoryRow;
  isOpen: boolean;
  index: number;
  onClick: () => void;
}

export function ShelfCategoryCard({
  category,
  isOpen,
  index,
  onClick,
}: ShelfCategoryCardProps) {
  const visual = CATEGORY_VISUAL[category.slug] ?? DEFAULT_VISUAL;
  const Icon = visual.icon;

  return (
    <motion.button
      type="button"
      onClick={onClick}
      aria-expanded={isOpen}
      aria-label={`${isOpen ? "Close" : "Open"} ${category.name_en} drawer`}
      /* Staggered entrance animation based on position in grid */
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut", delay: index * 0.04 }}
      /* Drawer "push" interaction on tap */
      whileTap={{ scale: 0.97 }}
      className={cn(
        // Base layout
        "group relative flex flex-col items-center gap-2.5 rounded-2xl border p-4 text-center",
        "w-full cursor-pointer select-none",
        // Depth: bottom shadow creates drawer-like 3D look
        "shadow-[0_4px_0_0_hsl(var(--border))]",
        "hover:shadow-[0_2px_0_0_hsl(var(--border))]",
        "hover:-translate-y-0.5",
        // Colours
        "bg-card",
        visual.borderColor,
        visual.hoverBorder,
        // Open state styling
        isOpen && "ring-2 ring-offset-1",
        isOpen && visual.borderColor.replace("border-", "ring-"),
        // Transitions
        "transition-all duration-200 ease-out",
      )}
    >
      {/* Drawer handle bar — decorative top strip */}
      <div
        aria-hidden="true"
        className={cn(
          "absolute left-1/2 top-1.5 h-1 w-8 -translate-x-1/2 rounded-full opacity-40",
          visual.bgColor,
        )}
      />

      {/* Icon */}
      <div
        className={cn(
          "flex h-12 w-12 items-center justify-center rounded-xl mt-1",
          visual.bgColor,
          "transition-transform duration-200 group-hover:scale-110",
          isOpen && "scale-105",
        )}
      >
        <Icon className={cn("h-6 w-6", visual.color)} />
      </div>

      {/* Label */}
      <p className="text-xs font-semibold leading-tight text-foreground">
        {category.name_en}
      </p>

      {/* Open indicator chevron */}
      <motion.div
        animate={{ rotate: isOpen ? 180 : 0 }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
        className="absolute bottom-1.5 right-2"
      >
        <ChevronDown className={cn("h-3 w-3", visual.color, "opacity-60")} />
      </motion.div>
    </motion.button>
  );
}
