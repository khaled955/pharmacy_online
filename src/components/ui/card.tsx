import * as React from "react";
import { cn } from "@/lib/utils/tailwind-merge";

/* ─── Root Card ─────────────────────────────────────────── */
const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    /** Adds hover elevation + subtle border glow */
    hoverable?: boolean;
    /** Flat card — no shadow, only border */
    flat?: boolean;
  }
>(({ className, hoverable, flat, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      // base
      "rounded-2xl border border-border bg-card text-card-foreground",
      // shadow
      flat ? "shadow-none" : "shadow-card",
      // hover
      hoverable && [
        "cursor-pointer transition-all duration-300 ease-out",
        "hover:-translate-y-0.5 hover:shadow-card-hover hover:border-primary/20",
      ],
      className,
    )}
    {...props}
  />
));
Card.displayName = "Card";

/* ─── Card Header ───────────────────────────────────────── */
const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col gap-1.5 p-5 pb-0", className)}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

/* ─── Card Title ────────────────────────────────────────── */
const CardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-base font-semibold leading-tight tracking-tight text-foreground",
      className,
    )}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

/* ─── Card Description ──────────────────────────────────── */
const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm leading-relaxed text-muted-foreground", className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

/* ─── Card Content ──────────────────────────────────────── */
const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-5", className)} {...props} />
));
CardContent.displayName = "CardContent";

/* ─── Card Footer ───────────────────────────────────────── */
const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex items-center gap-3 border-t border-border p-5 pt-4",
      className,
    )}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";

export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
};
