"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils/tailwind-merge";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return <div className="h-9 w-9" aria-hidden="true" />;

  const isDark = theme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className={cn(
        "flex h-9 w-9 items-center justify-center rounded-xl border",
        "border-border bg-card text-muted-foreground",
        "shadow-sm transition-all duration-200",
        "hover:border-primary/30 hover:bg-primary/5 hover:text-primary",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30",
        "dark:border-border dark:bg-surface",
        "dark:hover:border-primary/30 dark:hover:bg-primary/10 dark:hover:text-primary",
      )}
    >
      {isDark ? (
        <Sun className="h-4 w-4" />
      ) : (
        <Moon className="h-4 w-4" />
      )}
    </button>
  );
}
