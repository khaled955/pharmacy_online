"use client";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { cn } from "@/lib/utils/tailwind-merge";
import type { ComponentPropsWithoutRef } from "react";

type NavLinkProps = ComponentPropsWithoutRef<typeof Link> & {
  activeClassName?: string;
};

function resolveHref(href: NavLinkProps["href"]): string {
  if (typeof href === "string") return href;
  const { pathname = "", search = "", hash = "" } = href;
  return `${pathname}${search}${hash}`;
}

export function NavLink({
  href,
  className,
  activeClassName,
  onMouseEnter,
  ...props
}: NavLinkProps) {
  const router = useRouter();
  const pathname = usePathname();
  const hrefStr = resolveHref(href);
  const isActive =
    hrefStr === "/" ? pathname === "/" : pathname === hrefStr || pathname.startsWith(hrefStr + "/");

  return (
    <Link
      href={href}
      className={cn(className, isActive && activeClassName)}
      onMouseEnter={(e) => {
        router.prefetch(hrefStr);
        onMouseEnter?.(e);
      }}
      {...props}
    />
  );
}
