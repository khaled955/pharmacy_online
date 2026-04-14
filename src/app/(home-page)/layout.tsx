import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { AUTH_ROUTES } from "@/lib/constants/auth";
import LogoutButton from "@/components/layout/navbar/logout-button";

export default async function WebsiteLayout({ children }: LayoutProp) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* ── Navbar ── */}
      <header
        className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-sm
          dark:border-gray-800 dark:bg-gray-900/80"
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <div
              className="flex h-9 w-9 items-center justify-center rounded-xl
                bg-teal-600 shadow-sm dark:bg-teal-700"
            >
              <ShieldCheck className="h-5 w-5 text-white" />
            </div>
            <span className="text-base font-bold text-gray-900 dark:text-white">
              Pharmacy
            </span>
          </Link>

          {/* Auth action */}
          {user ? (
            <LogoutButton />
          ) : (
            <Link
              href={AUTH_ROUTES.LOGIN}
              className="flex items-center gap-2 rounded-xl bg-teal-600 px-4 py-2
                text-sm font-medium text-white shadow-sm transition-all
                hover:bg-teal-700 dark:bg-teal-700 dark:hover:bg-teal-600"
            >
              Sign in
            </Link>
          )}
        </div>
      </header>

      {/* ── Page content ── */}
      <main>{children}</main>
    </div>
  );
}
