import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils/tailwind-merge";

const badgeVariants = cva(
  [
    "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5",
    "text-xs font-semibold leading-none",
    "transition-colors duration-150",
  ].join(" "),
  {
    variants: {
      variant: {
        default: cn(
          "border-transparent bg-primary text-primary-foreground",
        ),
        secondary: cn(
          "border-transparent bg-secondary text-secondary-foreground",
        ),
        brand: cn(
          "border-transparent bg-brand text-brand-foreground",
        ),
        outline: cn(
          "border-border bg-transparent text-foreground",
        ),
        success: cn(
          "border-transparent",
          "bg-emerald-100 text-emerald-700",
          "dark:bg-emerald-900/40 dark:text-emerald-300",
        ),
        warning: cn(
          "border-transparent",
          "bg-amber-100 text-amber-700",
          "dark:bg-amber-900/40 dark:text-amber-300",
        ),
        destructive: cn(
          "border-transparent",
          "bg-red-100 text-red-700",
          "dark:bg-red-900/40 dark:text-red-300",
        ),
        info: cn(
          "border-transparent",
          "bg-sky-100 text-sky-700",
          "dark:bg-sky-900/40 dark:text-sky-300",
        ),
        muted: cn(
          "border-transparent bg-muted text-muted-foreground",
        ),
        /** Used for promotional / sale percentage */
        sale: cn(
          "border-transparent",
          "bg-rose-500 text-white",
          "dark:bg-rose-600",
        ),
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
