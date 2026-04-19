"use client";

import { AlertTriangle, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils/tailwind-merge";

interface Props {
  error: Error;
  reset: () => void;
}

export default function DefaultErrorFallback({ error, reset }: Props) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-4 rounded-2xl border p-8 text-center",
        "border-destructive/20 bg-destructive/5",
        "dark:border-destructive/30 dark:bg-destructive/10",
      )}
    >
      <div
        className={cn(
          "flex h-14 w-14 items-center justify-center rounded-2xl",
          "bg-destructive/10 text-destructive",
          "dark:bg-destructive/20",
        )}
      >
        <AlertTriangle className="h-7 w-7" />
      </div>
      <div className="max-w-xs space-y-1">
        <p className="text-sm font-semibold text-foreground">
          Something went wrong
        </p>
        <p className="text-xs leading-relaxed text-muted-foreground">
          {error.message || "An unexpected error occurred. Please try again."}
        </p>
      </div>
      <button
        onClick={reset}
        className={cn(
          "flex items-center gap-2 rounded-xl border border-destructive/30 px-4 py-2",
          "text-xs font-semibold text-destructive",
          "transition-colors hover:bg-destructive/10",
          "dark:border-destructive/40 dark:hover:bg-destructive/15",
        )}
      >
        <RefreshCw className="h-3.5 w-3.5" />
        Try again
      </button>
    </div>
  );
}
