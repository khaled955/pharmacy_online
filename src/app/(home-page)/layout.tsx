import HomeNavbar from "@/components/layout/navbar/home-navbar";
import HomeFooter from "@/components/layout/footer/home-footer";
import ErrorBoundary from "@/components/shared/error-boundary";
import { Suspense } from "react";
import { cn } from "@/lib/utils/tailwind-merge";

/* Lightweight navbar shell shown during SSR suspense */
function NavbarSkeleton() {
  return (
    <div
      className={cn(
        "sticky top-0 z-50 h-16 border-b border-border",
        "bg-card/90 backdrop-blur-md",
      )}
      aria-hidden="true"
    />
  );
}

export default async function WebsiteLayout({ children }: LayoutProp) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <ErrorBoundary>
        <Suspense fallback={<NavbarSkeleton />}>
          <HomeNavbar />
        </Suspense>
      </ErrorBoundary>

      <main className="flex-1">{children}</main>

      <HomeFooter />
    </div>
  );
}
