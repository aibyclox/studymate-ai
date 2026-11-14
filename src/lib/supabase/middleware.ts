import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const pathname = request.nextUrl.pathname;
  const isAuthRoute =
    pathname.startsWith("/login") ||
    pathname.startsWith("/signup") ||
    pathname.startsWith("/forgot-password");

  const isProtectedRoute =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/subjects") ||
    pathname.startsWith("/materials") ||
    pathname.startsWith("/profile") ||
    pathname.startsWith("/onboarding");

  // 1. Check local session cookie first
  const localUserCookie = request.cookies.get("studymate_user")?.value;
  let hasUser = false;

  if (localUserCookie) {
    try {
      const parsed = JSON.parse(decodeURIComponent(localUserCookie));
      if (parsed && parsed.id) {
        hasUser = true;
      }
    } catch {
      // Invalid cookie
    }
  }

  // 2. If no local cookie, try Supabase session if configured
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
  const isSupabaseLive =
    supabaseUrl &&
    supabaseAnonKey &&
    !supabaseUrl.includes("your-project") &&
    !supabaseUrl.includes("placeholder");

  if (!hasUser && isSupabaseLive) {
    try {
      const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
        cookies: {
          get(name: string) {
            return request.cookies.get(name)?.value;
          },
          set(name: string, value: string, options: CookieOptions) {
            request.cookies.set({ name, value, ...options });
            response = NextResponse.next({ request: { headers: request.headers } });
            response.cookies.set({ name, value, ...options });
          },
          remove(name: string, options: CookieOptions) {
            request.cookies.set({ name, value: "", ...options });
            response = NextResponse.next({ request: { headers: request.headers } });
            response.cookies.set({ name, value: "", ...options });
          },
        },
      });

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        hasUser = true;
      }
    } catch {
      // Supabase unreachable
    }
  }

  // Redirect unauthenticated user trying to access protected route
  if (!hasUser && isProtectedRoute) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("redirectedFrom", pathname);
    return NextResponse.redirect(url);
  }

  // Redirect authenticated user away from login/signup to dashboard
  if (hasUser && isAuthRoute) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return response;
}
