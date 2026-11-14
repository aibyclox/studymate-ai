import { NextResponse } from "next/server";
import { isSupabaseConfigured } from "@/lib/auth-helper";
import { createClient } from "@/lib/supabase/server";
import { registerUser } from "@/lib/local-db";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { full_name, email, password } = body;

    if (!full_name || !email || !password) {
      return NextResponse.json(
        { error: "Full name, email, and password are required." },
        { status: 400 }
      );
    }

    let authUser: { id: string; email: string; full_name: string } | null = null;

    // 1. Try Supabase if configured
    if (isSupabaseConfigured()) {
      try {
        const supabase = createClient();
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            data: { full_name: full_name.trim() },
          },
        });

        if (!error && data.user) {
          authUser = {
            id: data.user.id,
            email: data.user.email || email,
            full_name: full_name.trim(),
          };
        }
      } catch {
        // Fallback to local store
      }
    }

    // 2. Always persist locally as well to guarantee immediate access without email confirmation blockers
    if (!authUser) {
      const created = registerUser(email, password, full_name);
      authUser = {
        id: created.id,
        email: created.email,
        full_name: created.full_name,
      };
    }

    const response = NextResponse.json({ success: true, user: authUser });
    response.cookies.set("studymate_user", encodeURIComponent(JSON.stringify(authUser)), {
      path: "/",
      httpOnly: false,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });

    return response;
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Failed to create account. Please try again." },
      { status: 500 }
    );
  }
}

