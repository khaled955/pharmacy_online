import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
  // Get the cookie store for the current request/response cycle
  // Used to read/write Supabase auth session (access token, refresh token)
  const cookieStore = await cookies();

  // Create a server-side Supabase client bound to the current request
  return createServerClient(
    // Supabase project URL (public)
    process.env.NEXT_PUBLIC_SUPABASE_URL!,

    // Supabase anon key (public but safe for client/server usage)
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,

    {
      // This connects Supabase auth system with Next.js cookies
      cookies: {
        // Read all cookies from the request
        // Used by Supabase to detect current session
        getAll() {
          return cookieStore.getAll();
        },

        // Write cookies to the response
        // Used when login/logout/refresh token happens
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {}
        },
      },
    },
  );
}
