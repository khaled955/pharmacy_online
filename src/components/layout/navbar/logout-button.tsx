"use client";

import { cn } from "@/lib/utils/tailwind-merge";
import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

export default function LogoutButton() {
  async function handleLogout() {
    await signOut({ callbackUrl: "/" });
  }

  return (
    <button
      onClick={handleLogout}
      className={cn(
        "flex items-center gap-2 rounded-xl border border-border",
        "bg-card px-3.5 py-2 text-sm font-medium text-muted-foreground",
        "shadow-sm transition-all duration-200",
        "hover:border-destructive/30 hover:bg-destructive/5 hover:text-destructive",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30",
        "dark:bg-surface dark:hover:bg-destructive/10",
      )}
    >
      <LogOut className="h-4 w-4" />
      <span className="hidden sm:inline">Sign out</span>
    </button>
  );
}
