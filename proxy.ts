import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { AuthUser } from "@/lib/types/auth";

const PROTECTED_PATHS = [
  "/profile",
  "/address",
  "/allOrders",
  "/checkout-flow/checkout",
];

const AUTH_PATHS = ["/login", "/register", "/forgot-password"];

const DASHBOARD_PREFIX = "/dashboard";

export default async function middleware(req: NextRequest) {
  const token = await getToken({ req });

  const pathname = req.nextUrl.pathname;

  const homeUrl = new URL("/", req.nextUrl.origin);
  const loginUrl = new URL("/login", req.nextUrl.origin);

  const tokenUser = token?.user as AuthUser | undefined;

  // Dashboard — must have token + admin role
  if (pathname.startsWith(DASHBOARD_PREFIX)) {
    if (!token) return NextResponse.redirect(homeUrl);
    if (tokenUser?.role !== "admin") return NextResponse.redirect(homeUrl);
    return NextResponse.next();
  }

  // Protected routes — must have token
  const isProtected = PROTECTED_PATHS.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  );

  if (isProtected && !token) {
    loginUrl.searchParams.set(
      "callbackUrl",
      pathname + (req.nextUrl.search || ""),
    );
    return NextResponse.redirect(loginUrl);
  }

  // Auth pages — redirect home if already signed in
  const isAuthPage = AUTH_PATHS.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  );

  if (isAuthPage && token) {
    return NextResponse.redirect(homeUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
