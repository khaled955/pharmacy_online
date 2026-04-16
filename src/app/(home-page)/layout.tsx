import HomeNavbar from "@/components/layout/navbar/home-navbar";
import ErrorBoundary from "@/components/shared/error-boundary";
import { Suspense } from "react";

export default async function WebsiteLayout({ children }: LayoutProp) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <ErrorBoundary>
        <Suspense fallback={<div>Loading navbar...</div>}>
          <HomeNavbar />
        </Suspense>
      </ErrorBoundary>

      <main>{children}</main>
    </div>
  );
}
