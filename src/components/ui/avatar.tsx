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
  sm: { container: "h-8 w-8 text-xs",     image: 32 },
  md: { container: "h-9 w-9 text-sm",     image: 36 },
  lg: { container: "h-10 w-10 text-sm",   image: 40 },
  xl: { container: "h-12 w-12 text-base", image: 48 },
};

// Deterministic palette — vivid, accessible on white text
const PALETTE = [
  "#e11d48", // rose-600
  "#dc2626", // red-600
  "#ea580c", // orange-600
  "#d97706", // amber-600
  "#16a34a", // green-600
  "#0891b2", // cyan-600
  "#2563eb", // blue-600
  "#7c3aed", // violet-600
  "#9333ea", // purple-600
  "#db2777", // pink-600
  "#0d9488", // teal-600
  "#0284c7", // sky-600
];

function colorForName(name: string): string {
  if (!name) return PALETTE[0];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return PALETTE[Math.abs(hash) % PALETTE.length];
}

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

  const initial = fallback ? fallback.trim()[0]?.toUpperCase() ?? "?" : "?";
  const bgColor = colorForName(fallback ?? "");

  return (
    <div
      className={cn(
        container,
        "relative shrink-0 overflow-hidden rounded-full",
        "flex items-center justify-center font-bold",
        "ring-2 ring-background",
        "select-none",
        className,
      )}
      style={{ backgroundColor: bgColor, color: "#fff" }}
      aria-label={alt || fallback}
    >
      {initial}
    </div>
  );
}
