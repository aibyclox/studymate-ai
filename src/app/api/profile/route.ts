import { NextResponse } from "next/server";
import { getAuthenticatedUser, isSupabaseConfigured } from "@/lib/auth-helper";
import { createClient } from "@/lib/supabase/server";
import { readDb, writeDb } from "@/lib/local-db";

export async function GET() {
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (isSupabaseConfigured()) {
      try {
        const supabase = createClient();
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (profile) {
          return NextResponse.json({
            data: { ...(profile as any), email: user.email },
          });
        }
      } catch {
        // Fallback to local-db
      }
    }

    // Local DB fallback
    const db = readDb();
    const profile = db.profiles.find((p) => p.id === user.id) || {
      id: user.id,
      full_name: user.full_name || "Student",
      college: "Stanford School of Engineering",
      course: "B.Tech",
      branch: "Computer Science & Engineering",
      current_semester: 5,
      avatar_url: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    return NextResponse.json({
      data: {
        ...profile,
        email: user.email,
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { full_name, college, course, branch, current_semester } = body;

    if (isSupabaseConfigured()) {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("profiles")
          .upsert({
            id: user.id,
            full_name: full_name?.trim() || null,
            college: college?.trim() || null,
            course: course?.trim() || null,
            branch: branch?.trim() || null,
            current_semester: current_semester ? Number(current_semester) : 1,
            updated_at: new Date().toISOString(),
          })
          .select()
          .single();

        if (!error && data) {
          return NextResponse.json({ data });
        }
      } catch {
        // Fallback to local-db
      }
    }

    // Local DB fallback
    const db = readDb();
    let index = db.profiles.findIndex((p) => p.id === user.id);
    const updatedProfile = {
      id: user.id,
      full_name: full_name?.trim() || user.full_name || "Student",
      college: college?.trim() || "University Student",
      course: course?.trim() || "B.Tech",
      branch: branch?.trim() || "Computer Science",
      current_semester: current_semester ? Number(current_semester) : 5,
      avatar_url: null,
      created_at: index !== -1 ? db.profiles[index].created_at : new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    if (index !== -1) {
      db.profiles[index] = updatedProfile;
    } else {
      db.profiles.push(updatedProfile);
    }

    // Update user record full_name
    const userIndex = db.users.findIndex((u) => u.id === user.id);
    if (userIndex !== -1 && full_name) {
      db.users[userIndex].full_name = full_name.trim();
    }

    // Update semesters current flag
    if (current_semester) {
      db.semesters = db.semesters.map((s) =>
        s.user_id === user.id
          ? { ...s, is_current: s.semester_number === Number(current_semester) }
          : s
      );
    }

    writeDb(db);
    return NextResponse.json({ data: updatedProfile });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
