"use client";

import { AlertTriangle } from "lucide-react";

interface Props {
  error: Error;
  reset: () => void;
}

export default function DefaultErrorFallback({ error, reset }: Props) {
  return (
    <div
      className="flex flex-col items-center justify-center gap-3 rounded-xl border border-red-200
      bg-red-50 p-6 text-center dark:border-red-900 dark:bg-red-950/30"
    >
      <AlertTriangle className="h-8 w-8 text-red-500" />
      <p className="text-sm font-medium text-red-700 dark:text-red-400">
        {error.message || "Something went wrong"}
      </p>
      <button
        onClick={reset}
        className="rounded-lg border border-red-300 px-4 py-1.5 text-xs font-medium
          text-red-600 transition-colors hover:bg-red-100
          dark:border-red-700 dark:text-red-400 dark:hover:bg-red-900/40"
      >
        Try again
      </button>
    </div>
  );
}
