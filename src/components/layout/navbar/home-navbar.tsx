import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { fetchUserProfileService } from "@/lib/services/user/fetch-user-profile.service";
import { AUTH_ROUTES } from "@/lib/constants/auth";
import LogoutButton from "./logout-button";
import ThemeToggle from "./theme-toggle";
import Greeting from "./greeting";
import Image from "next/image";

export default async function HomeNavbar() {
  const profile = await fetchUserProfileService();
  return (
    <header
      className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-sm
        dark:border-gray-800 dark:bg-gray-900/80"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        {/* ── Logo ── */}
        <Link href="/" className="flex items-center gap-2.5">
          <div
            className="flex h-9 w-9 items-center justify-center rounded-xl
              bg-teal-600 shadow-sm dark:bg-teal-700"
          >
            <ShieldCheck className="h-5 w-5 text-white" />
          </div>
          <span className="text-base font-bold text-gray-900 dark:text-white">
            MedBox
          </span>
        </Link>

        {/* ── Right side ── */}
        <div className="flex items-center gap-3">
          {/* Greeting — shown only when a user is logged in */}
          {profile && <Greeting firstName={profile.first_name} />}
           {profile && profile.avatar_url && <Image alt={profile.first_name} src={profile.avatar_url} width={40} height={40} />}
          {/* Dark / light mode toggle */}
          <ThemeToggle />

          {/* Auth action */}
          {profile ? (
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
      </div>
    </header>
  );
}
