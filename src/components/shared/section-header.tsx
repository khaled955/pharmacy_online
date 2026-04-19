import * as React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils/tailwind-merge";

interface SectionHeaderProps {
  title: string;
  description?: string;
  viewAllHref?: string;
  viewAllLabel?: string;
  /** Accent bar on the start side of the title */
  accent?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export function SectionHeader({
  title,
  description,
  viewAllHref,
  viewAllLabel = "View All",
  accent = true,
  className,
  children,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "mb-6 flex flex-wrap items-start justify-between gap-3",
        className,
      )}
    >
      <div className="flex items-start gap-3">
        {accent && (
          <span
            className="mt-1 block h-5 w-1 shrink-0 rounded-full bg-gradient-brand"
            aria-hidden="true"
          />
        )}
        <div>
          <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
            {title}
          </h2>
          {description && (
            <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        {children}
        {viewAllHref && (
          <Link
            href={viewAllHref}
            className={cn(
              "inline-flex items-center gap-1 rounded-xl border border-border",
              "px-3.5 py-1.5 text-sm font-medium",
              "text-foreground transition-colors duration-150",
              "hover:border-primary/40 hover:bg-primary/5 hover:text-primary",
              "dark:hover:border-primary/30 dark:hover:bg-primary/10",
            )}
          >
            {viewAllLabel}
            <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        )}
      </div>
    </div>
  );
}
