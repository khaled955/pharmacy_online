import AuthBrandPanel from "@/components/feature/auth/auth-brand-panel";
import AuthMobileLogo from "@/components/feature/auth/auth-mobile-logo";
import AuthThemeToggle from "@/components/feature/auth/auth-theme-toggle";

export default function AuthLayout({ children }: LayoutProp) {
  return (
    <div className="relative flex min-h-screen">
      <AuthThemeToggle />

      <AuthBrandPanel />

      <main
        className="flex flex-1 flex-col items-center justify-center overflow-y-auto
          bg-linear-to-br from-teal-50 via-white to-cyan-50 px-4 py-10
          dark:from-gray-950 dark:via-gray-900 dark:to-gray-950"
      >
        <AuthMobileLogo />
        {children}
      </main>
    </div>
  );
}
