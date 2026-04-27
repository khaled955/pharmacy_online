"use client";

import { useTheme } from "next-themes";
import { Moon, Sun, Monitor } from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import { cn } from "@/lib/utils/tailwind-merge";

type ThemeMode = "light" | "dark" | "system";

const iconMap = {
  light: <Sun className="size-4" aria-hidden="true" />,
  dark: <Moon className="size-4" aria-hidden="true" />,
  system: <Monitor className="size-4" aria-hidden="true" />,
};

const labelMap = {
  light: "Switch to dark mode",
  dark: "Switch to system mode",
  system: "Switch to light mode",
};

const modes: ThemeMode[] = ["light", "dark", "system"];

export default function ThemeToggle() {
  // State
  const [mounted, setMounted] = useState(false);
  // Hooks
  const { theme, setTheme } = useTheme();

  // Variables
  const currentMode: ThemeMode =
    theme === "light" || theme === "dark" || theme === "system"
      ? theme
      : "system";

  // function
  const cycleTheme = useCallback(() => {
    const currentIndex = modes.indexOf(currentMode);
    const nextTheme = modes[(currentIndex + 1) % modes.length];

    setTheme(nextTheme);
  }, [currentMode, setTheme]);

  // Effects
  useEffect(() => {
    // to prevent react 19 warning for sync updates of state during rendering
    const frame = requestAnimationFrame(() => {
      setMounted(true);
    });

    return () => cancelAnimationFrame(frame);
  }, []);

  if (!mounted) {
    return (
      <button
        type="button"
        aria-hidden="true"
        tabIndex={-1}
        disabled
        className={cn(
          "flex size-9 items-center justify-center rounded-xl border",
          "border-border bg-card text-muted-foreground",
          "shadow-sm opacity-0",
        )}
      />
    );
  }

  return (
    <button
      type="button"
      onClick={cycleTheme}
      aria-label={labelMap[currentMode]}
      title={`Theme: ${currentMode}`}
      className={cn(
        "relative flex size-9 items-center justify-center rounded-xl border",
        "border-border bg-card text-muted-foreground",
        "shadow-sm transition-all duration-200",
        "hover:border-primary/30 hover:bg-primary/5 hover:text-primary",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30",
        "active:scale-95",
        "dark:border-border dark:bg-surface",
        "dark:hover:border-primary/30 dark:hover:bg-primary/10 dark:hover:text-primary",
      )}
    >
      {iconMap[currentMode]}

      {currentMode !== "system" && (
        <span
          className="absolute inset-e-0.5 -top-0.5 size-1.5 rounded-full bg-primary"
          aria-hidden="true"
        />
      )}
    </button>
  );
}
