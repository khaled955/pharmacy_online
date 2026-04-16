"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils/tailwind-merge";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  // Prevent hydration mismatch — render nothing until mounted on client
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const isDark = theme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className={cn(
        "flex h-9 w-9 items-center justify-center rounded-xl border transition-all",
        "border-gray-200 bg-white text-gray-600 shadow-sm",
        "hover:border-teal-300 hover:bg-teal-50 hover:text-teal-600",
        "dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300",
        "dark:hover:border-teal-700 dark:hover:bg-teal-950/40 dark:hover:text-teal-400",
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
