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

export  default async function proxy(req: NextRequest) {
  const token = await getToken({ req });
  const pathname = req.nextUrl.pathname;
  const homeUrl = new URL("/", req.nextUrl.origin);
  const loginUrl = new URL("/login", req.nextUrl.origin);
  const isProtected = PROTECTED_PATHS.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  );
  const isAuthPage = AUTH_PATHS.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  );

  const tokenUser = token?.user as AuthUser | undefined;

  if (pathname.startsWith(DASHBOARD_PREFIX)) {
    if (!token || tokenUser?.role !== "admin") {
      return NextResponse.redirect(homeUrl);
    }

    return NextResponse.next();
  }

  if (isProtected && !token) {
    loginUrl.searchParams.set(
      "callbackUrl",
      pathname + (req.nextUrl.search || ""),
    );
    return NextResponse.redirect(loginUrl);
  }

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
