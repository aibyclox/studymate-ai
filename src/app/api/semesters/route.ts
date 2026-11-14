import { NextResponse } from "next/server";
import { getAuthenticatedUser, isSupabaseConfigured } from "@/lib/auth-helper";
import { createClient } from "@/lib/supabase/server";
import { readDb, writeDb } from "@/lib/local-db";

export async function GET(request: Request) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (isSupabaseConfigured()) {
      try {
        const supabase = createClient();
        const { data: semesters, error } = await supabase
          .from("semesters")
          .select("*")
          .eq("user_id", user.id)
          .order("semester_number", { ascending: true });

        if (!error && semesters && semesters.length > 0) {
          return NextResponse.json({ data: semesters });
        }
      } catch {
        // Fallback to local-db
      }
    }

    // Local DB fallback
    const db = readDb();
    let userSemesters = db.semesters.filter((s) => s.user_id === user.id);

    // If user has no semesters yet, seed semesters 1-8
    if (userSemesters.length === 0) {
      const profile = db.profiles.find((p) => p.id === user.id);
      const currentSemNum = profile?.current_semester || 5;

      const newSemesters = [];
      for (let s = 1; s <= 8; s++) {
        const sem = {
          id: `sem_${user.id}_${s}`,
          user_id: user.id,
          semester_number: s,
          academic_year: "2026-2027",
          is_current: s === currentSemNum,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        db.semesters.push(sem);
        newSemesters.push(sem);
      }
      writeDb(db);
      userSemesters = newSemesters;
    }

    userSemesters.sort((a, b) => a.semester_number - b.semester_number);
    return NextResponse.json({ data: userSemesters });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { current_semester_id, current_semester_number } = body;

    if (isSupabaseConfigured()) {
      try {
        const supabase = createClient();
        if (current_semester_id) {
          await supabase.from("semesters").update({ is_current: false }).eq("user_id", user.id);
          await supabase.from("semesters").update({ is_current: true }).eq("id", current_semester_id).eq("user_id", user.id);
        }
        if (current_semester_number) {
          await supabase.from("profiles").update({ current_semester: current_semester_number }).eq("id", user.id);
        }
      } catch {
        // Fallback
      }
    }

    const db = readDb();
    if (current_semester_id || current_semester_number) {
      db.semesters = db.semesters.map((s) => {
        if (s.user_id === user.id) {
          const isMatch = current_semester_id
            ? s.id === current_semester_id
            : s.semester_number === current_semester_number;
          return { ...s, is_current: isMatch, updated_at: new Date().toISOString() };
        }
        return s;
      });

      const profileIndex = db.profiles.findIndex((p) => p.id === user.id);
      if (profileIndex !== -1 && current_semester_number) {
        db.profiles[profileIndex].current_semester = current_semester_number;
      }
      writeDb(db);
    }

    const userSemesters = db.semesters
      .filter((s) => s.user_id === user.id)
      .sort((a, b) => a.semester_number - b.semester_number);

    return NextResponse.json({ success: true, data: userSemesters });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Internal server error" }, { status: 500 });
  }
}
