"use client";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils/tailwind-merge";
import { SearchDialog } from "@/components/shared/search-dialog";

// ─── Desktop trigger — looks like a real input bar ────────────────────────────

function DesktopSearchBar() {
  return (
    <div
      className={cn(
        "flex h-10 w-full items-center gap-2.5 overflow-hidden rounded-xl",
        "border border-border bg-background/70",
        "hover:border-primary/40 hover:bg-background",
        "hover:ring-4 hover:ring-primary/10",
        "transition-all duration-200 cursor-text",
      )}
      aria-hidden="true"
    >
      <Search className="ms-3 h-4 w-4 shrink-0 text-muted-foreground" />
      <span className="flex-1 px-1 text-sm text-muted-foreground/70 select-none">
        Search medicines, vitamins, brands…
      </span>
      <kbd
        className={cn(
          "me-2 hidden rounded-md border border-border bg-muted",
          "px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground",
          "sm:inline-flex",
        )}
      >
        /
      </kbd>
    </div>
  );
}

// ─── Mobile trigger — icon-only button ───────────────────────────────────────

function MobileSearchButton() {
  return (
    <div
      className={cn(
        "flex h-9 w-9 items-center justify-center rounded-xl",
        "border border-border bg-card text-muted-foreground",
        "shadow-sm transition-all duration-200",
        "hover:border-primary/30 hover:bg-primary/5 hover:text-primary",
      )}
      aria-hidden="true"
    >
      <Search className="h-4 w-4" />
    </div>
  );
}

// ─── Exports ──────────────────────────────────────────────────────────────────

/** Desktop search bar trigger — hidden on mobile */
export function NavbarDesktopSearch() {
  return (
    <SearchDialog
      triggerContent={<DesktopSearchBar />}
      triggerClassName="hidden flex-1 max-w-md md:flex"
    />
  );
}

/** Mobile search icon trigger — visible only on mobile */
export function NavbarMobileSearch() {
  return (
    <SearchDialog
      triggerContent={<MobileSearchButton />}
      triggerClassName="md:hidden"
    />
  );
}
