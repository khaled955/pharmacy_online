import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  // Create a fresh server client for this request only
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        // Read all incoming cookies from the request
        getAll() {
          return request.cookies.getAll();
        },

        // Write refreshed cookies back to both the request and response
        setAll(cookiesToSet, headers) {
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value);
          });

          supabaseResponse = NextResponse.next({ request });

          cookiesToSet.forEach(({ name, value, options }) => {
            supabaseResponse.cookies.set(name, value, options);
          });

          Object.entries(headers).forEach(([key, value]) => {
            supabaseResponse.headers.set(key, value);
          });
        },
      },
    },
  );

  const { data } = await supabase.auth.getClaims();
  const user = data?.claims;

  const pathname = request.nextUrl.pathname;

  const isAuthRoute =
    pathname.startsWith("/login") ||
    pathname.startsWith("/register") ||
    pathname.startsWith("/forgot-password");

  const isProtectedRoute =
    pathname.startsWith("/cart") ||
    pathname.startsWith("/profile") ||
    pathname.startsWith("/orders");

  const isAdminRoute = pathname.startsWith("/dashboard");

  if (!user && (isProtectedRoute || isAdminRoute)) {
    const url = request.nextUrl.clone();

    // create callback url to redirect back after login
    const callbackUrl = request.nextUrl.pathname + request.nextUrl.search;

    url.pathname = "/login";
    url.searchParams.set("callbackUrl", callbackUrl);

    return NextResponse.redirect(url);
  }

  if (user && isAuthRoute) {
    const url = request.nextUrl.clone();

    url.pathname = "/";
    return NextResponse.redirect(url);
  }
// 
  return supabaseResponse;
}
