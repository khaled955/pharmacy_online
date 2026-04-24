import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { AuthUser } from "@/lib/types/auth";

// Variables
const PROTECTED_PATHS = [
  "/profile",
  "/address",
  "/allOrders",
  "/cart",
  "/checkout",
];
const AUTH_PATHS = ["/login", "/register", "/forgot-password"];
const DASHBOARD_PREFIX = "/dashboard";

export default async function proxy(req: NextRequest) {
  // Get the token from the request (if it exists)
  const token = await getToken({ req });
  // Extract the pathname and prepare URLs for redirection
  const pathname = req.nextUrl.pathname;
  // Prepare URLs for redirection
  const homeUrl = new URL("/", req.nextUrl.origin);
  // Login URL with callback
  const loginUrl = new URL("/login", req.nextUrl.origin);
  // Check if the requested path is protected
  const isProtected = PROTECTED_PATHS.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  );
  // Check if the requested path is an auth page
  const isAuthPage = AUTH_PATHS.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  );

  const tokenUser = token?.user as AuthUser | undefined;

  // Dashboard — must have token + admin role
  if (pathname.startsWith(DASHBOARD_PREFIX)) {
    if (!token || tokenUser?.role !== "admin") {
      return NextResponse.redirect(homeUrl);
    }

    return NextResponse.next();
  }

  // Protected pages — must have token
  if (isProtected && !token) {
    loginUrl.searchParams.set(
      "callbackUrl",
      pathname + (req.nextUrl.search || ""),
    );
    return NextResponse.redirect(loginUrl);
  }

  // Auth pages — must NOT have token
  if (isAuthPage && token) {
    return NextResponse.redirect(homeUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon\\.ico|.*\\.(?:png|jpg|jpeg|gif|svg|ico|webp|woff2?|ttf|otf|eot)).*)",
  ],
};
