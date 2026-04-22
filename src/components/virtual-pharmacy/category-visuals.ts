// [NEW] Shared category visual config — used by both CategoriesSection and VirtualShelfCategories
// [SAFE] Extracted from categories-section.tsx; original still works if this is unused
import {
  Pill, Baby, Sparkles, Heart, Leaf, Syringe, Brain, Eye,
  Package, Thermometer, Stethoscope, FlaskConical,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type CategoryVisualConfig = {
  icon: LucideIcon;
  color: string;
  bgColor: string;
  borderColor: string;
  hoverBorder: string;
  /** Accent used in shelf drawer header */
  accent: string;
};

export const CATEGORY_VISUAL: Record<string, CategoryVisualConfig> = {
  medicines: {
    icon: Pill,
    color: "text-primary",
    bgColor: "bg-primary/10 dark:bg-primary/15",
    borderColor: "border-primary/20",
    hoverBorder: "hover:border-primary/40",
    accent: "from-primary/10 to-primary/5",
  },
  "baby-care": {
    icon: Baby,
    color: "text-rose-500 dark:text-rose-400",
    bgColor: "bg-rose-50 dark:bg-rose-500/10",
    borderColor: "border-rose-200/60 dark:border-rose-500/20",
    hoverBorder: "hover:border-rose-300 dark:hover:border-rose-400/40",
    accent: "from-rose-50 to-rose-50/30 dark:from-rose-500/10 dark:to-rose-500/5",
  },
  "skin-care": {
    icon: Sparkles,
    color: "text-violet-500 dark:text-violet-400",
    bgColor: "bg-violet-50 dark:bg-violet-500/10",
    borderColor: "border-violet-200/60 dark:border-violet-500/20",
    hoverBorder: "hover:border-violet-300 dark:hover:border-violet-400/40",
    accent: "from-violet-50 to-violet-50/30 dark:from-violet-500/10 dark:to-violet-500/5",
  },
  vitamins: {
    icon: Leaf,
    color: "text-emerald-600 dark:text-emerald-400",
    bgColor: "bg-emerald-50 dark:bg-emerald-500/10",
    borderColor: "border-emerald-200/60 dark:border-emerald-500/20",
    hoverBorder: "hover:border-emerald-300 dark:hover:border-emerald-400/40",
    accent: "from-emerald-50 to-emerald-50/30 dark:from-emerald-500/10 dark:to-emerald-500/5",
  },
  "mother-care": {
    icon: Heart,
    color: "text-pink-500 dark:text-pink-400",
    bgColor: "bg-pink-50 dark:bg-pink-500/10",
    borderColor: "border-pink-200/60 dark:border-pink-500/20",
    hoverBorder: "hover:border-pink-300 dark:hover:border-pink-400/40",
    accent: "from-pink-50 to-pink-50/30 dark:from-pink-500/10 dark:to-pink-500/5",
  },
  vaccines: {
    icon: Syringe,
    color: "text-sky-500 dark:text-sky-400",
    bgColor: "bg-sky-50 dark:bg-sky-500/10",
    borderColor: "border-sky-200/60 dark:border-sky-500/20",
    hoverBorder: "hover:border-sky-300 dark:hover:border-sky-400/40",
    accent: "from-sky-50 to-sky-50/30 dark:from-sky-500/10 dark:to-sky-500/5",
  },
  "mental-health": {
    icon: Brain,
    color: "text-amber-500 dark:text-amber-400",
    bgColor: "bg-amber-50 dark:bg-amber-500/10",
    borderColor: "border-amber-200/60 dark:border-amber-500/20",
    hoverBorder: "hover:border-amber-300 dark:hover:border-amber-400/40",
    accent: "from-amber-50 to-amber-50/30 dark:from-amber-500/10 dark:to-amber-500/5",
  },
  "eye-care": {
    icon: Eye,
    color: "text-cyan-500 dark:text-cyan-400",
    bgColor: "bg-cyan-50 dark:bg-cyan-500/10",
    borderColor: "border-cyan-200/60 dark:border-cyan-500/20",
    hoverBorder: "hover:border-cyan-300 dark:hover:border-cyan-400/40",
    accent: "from-cyan-50 to-cyan-50/30 dark:from-cyan-500/10 dark:to-cyan-500/5",
  },
  "first-aid": {
    icon: Thermometer,
    color: "text-red-500 dark:text-red-400",
    bgColor: "bg-red-50 dark:bg-red-500/10",
    borderColor: "border-red-200/60 dark:border-red-500/20",
    hoverBorder: "hover:border-red-300 dark:hover:border-red-400/40",
    accent: "from-red-50 to-red-50/30 dark:from-red-500/10 dark:to-red-500/5",
  },
  diagnostics: {
    icon: Stethoscope,
    color: "text-indigo-500 dark:text-indigo-400",
    bgColor: "bg-indigo-50 dark:bg-indigo-500/10",
    borderColor: "border-indigo-200/60 dark:border-indigo-500/20",
    hoverBorder: "hover:border-indigo-300 dark:hover:border-indigo-400/40",
    accent: "from-indigo-50 to-indigo-50/30 dark:from-indigo-500/10 dark:to-indigo-500/5",
  },
  supplements: {
    icon: FlaskConical,
    color: "text-teal-500 dark:text-teal-400",
    bgColor: "bg-teal-50 dark:bg-teal-500/10",
    borderColor: "border-teal-200/60 dark:border-teal-500/20",
    hoverBorder: "hover:border-teal-300 dark:hover:border-teal-400/40",
    accent: "from-teal-50 to-teal-50/30 dark:from-teal-500/10 dark:to-teal-500/5",
  },
};

export const DEFAULT_VISUAL: CategoryVisualConfig = {
  icon: Package,
  color: "text-primary",
  bgColor: "bg-primary/10 dark:bg-primary/15",
  borderColor: "border-primary/20",
  hoverBorder: "hover:border-primary/40",
  accent: "from-primary/10 to-primary/5",
};
