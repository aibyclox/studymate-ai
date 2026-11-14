import { cookies } from "next/headers";
import { type NextRequest } from "next/server";
import { createClient as createSupabaseServerClient } from "@/lib/supabase/server";

export interface AuthenticatedUser {
  id: string;
  email: string;
  full_name?: string;
  is_demo?: boolean;
}

export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return false;
  if (url.includes("your-project") || url.includes("placeholder")) return false;
  return url.startsWith("https://");
}

export async function getAuthenticatedUser(
  request?: NextRequest | Request
): Promise<AuthenticatedUser | null> {
  // 1. Try Supabase if configured
  if (isSupabaseConfigured()) {
    try {
      const supabase = createSupabaseServerClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        return {
          id: user.id,
          email: user.email || "",
          full_name: user.user_metadata?.full_name,
        };
      }
    } catch {
      // Supabase fetch error; proceed to cookie fallback
    }
  }

  // 2. Check local cookie `studymate_user`
  try {
    let cookieVal: string | undefined;

    if (request && "cookies" in request && typeof (request as any).cookies?.get === "function") {
      cookieVal = (request as any).cookies.get("studymate_user")?.value;
    } else if (request && request.headers) {
      const cookieHeader = request.headers.get("cookie") || "";
      const match = cookieHeader.match(/studymate_user=([^;]+)/);
      if (match) {
        cookieVal = match[1];
      }
    }

    if (!cookieVal) {
      try {
        const cookieStore = cookies();
        cookieVal = cookieStore.get("studymate_user")?.value;
      } catch {
        // cookies() might fail outside server action or render context
      }
    }

    if (cookieVal) {
      const parsed = JSON.parse(decodeURIComponent(cookieVal));
      if (parsed && parsed.id && parsed.email) {
        return parsed as AuthenticatedUser;
      }
    }
  } catch (err) {
    // Malformed cookie
  }

  return null;
}

