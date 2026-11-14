import { NextResponse } from "next/server";
import { isSupabaseConfigured } from "@/lib/auth-helper";
import { createClient } from "@/lib/supabase/server";

export async function POST() {
  if (isSupabaseConfigured()) {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
    } catch {
      // Ignore
    }
  }

  const response = NextResponse.json({ success: true });
  response.cookies.delete("studymate_user");
  return response;
}

