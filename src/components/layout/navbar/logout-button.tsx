"use client";

import { LogOut } from "lucide-react";
import { logoutAction } from "@/lib/auth/auth-service";

export default function LogoutButton() {

  async function handleLogout() {
    await logoutAction();
    window.location.href = "/";
  }

  return (
    <button
      onClick={handleLogout}
      className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2
        text-sm font-medium text-gray-700 shadow-sm transition-all
        hover:border-red-200 hover:bg-red-50 hover:text-red-600
        dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300
        dark:hover:border-red-800 dark:hover:bg-red-950/40 dark:hover:text-red-400"
    >
      <LogOut className="h-4 w-4" />
      Sign out
    </button>
  );
}
