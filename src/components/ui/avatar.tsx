import * as React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils/tailwind-merge";

interface AvatarProps {
  src?: string | null;
  alt?: string;
  fallback?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizeMap = {
  xs: { container: "h-6 w-6 text-[10px]", image: 24 },
  sm: { container: "h-8 w-8 text-xs",    image: 32 },
  md: { container: "h-9 w-9 text-sm",    image: 36 },
  lg: { container: "h-10 w-10 text-sm",  image: 40 },
  xl: { container: "h-12 w-12 text-base",image: 48 },
};

export function Avatar({
  src,
  alt = "",
  fallback,
  size = "md",
  className,
}: AvatarProps) {
  const { container, image: px } = sizeMap[size];

  if (src) {
    return (
      <div
        className={cn(
          container,
          "relative shrink-0 overflow-hidden rounded-full",
          "ring-2 ring-background",
          className,
        )}
      >
        <Image
          src={src}
          alt={alt}
          width={px}
          height={px}
          className="h-full w-full object-cover"
        />
      </div>
    );
  }

  const initials = fallback
    ? fallback
        .split(" ")
        .slice(0, 2)
        .map((w) => w[0]?.toUpperCase())
        .join("")
    : "?";

  return (
    <div
      className={cn(
        container,
        "relative shrink-0 overflow-hidden rounded-full",
        "bg-gradient-brand text-brand-foreground",
        "flex items-center justify-center font-semibold",
        "ring-2 ring-background",
        className,
      )}
      aria-label={alt || fallback}
    >
      {initials}
    </div>
  );
}
