import AuthBrandPanel from "@/components/feature/auth/auth-brand-panel";
import AuthThemeToggle from "@/components/feature/auth/auth-theme-toggle";

export default function AuthLayout({ children }: LayoutProp) {
  return (
    <div className="relative flex min-h-screen">
      {/* theme-toggle */}
      <AuthThemeToggle />
      {/* auth-banner displayed in large screen only */}
      <AuthBrandPanel />
      <main
        className="flex grow flex-col items-center justify-center overflow-y-auto
          bg-linear-to-br from-teal-50 via-white to-cyan-50 px-4 py-10
          dark:from-gray-950 dark:via-gray-900 dark:to-gray-950"
      >
        {/* auth component displayed */}
        {children}
      </main>
    </div>
  );
}
