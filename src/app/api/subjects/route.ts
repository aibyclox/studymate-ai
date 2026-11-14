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
        const { data: subjects, error } = await supabase
          .from("subjects")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (!error && subjects) {
          const { data: units } = await supabase
            .from("units")
            .select("subject_id")
            .eq("user_id", user.id);

          const { data: docs } = await supabase
            .from("documents")
            .select("subject_id")
            .eq("user_id", user.id);

          const enriched = subjects.map((sub) => ({
            ...sub,
            units_count: (units || []).filter((u) => u.subject_id === sub.id).length,
            documents_count: ((docs as any[]) || []).filter((d: any) => d.subject_id === sub.id).length,
          }));

          return NextResponse.json({ data: enriched });
        }
      } catch {
        // Fallback to local-db
      }
    }

    // Local DB fallback
    const db = readDb();
    const userSubjects = db.subjects.filter((s) => s.user_id === user.id);

    const enriched = userSubjects.map((sub) => ({
      ...sub,
      units_count: db.units.filter((u) => u.subject_id === sub.id).length,
      documents_count: db.documents.filter((d) => d.subject_id === sub.id).length,
    }));

    return NextResponse.json({ data: enriched });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, code, color, description, semester_id, units } = body;

    if (!name || typeof name !== "string") {
      return NextResponse.json({ error: "Subject name is required" }, { status: 400 });
    }

    if (isSupabaseConfigured()) {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("subjects")
          .insert({
            user_id: user.id,
            name: name.trim(),
            code: code?.trim() || null,
            color: color || "#4f46e5",
            description: description?.trim() || null,
            semester_id: semester_id || null,
          })
          .select()
          .single();

        if (!error && data) {
          if (units && Array.isArray(units) && units.length > 0) {
            const unitsToInsert = units.map((u: any) => ({
              user_id: user.id,
              subject_id: (data as any).id,
              unit_number: u.unit_number,
              title: u.title,
              description: u.description || null,
            }));
            await supabase.from("units").insert(unitsToInsert);
          }
          return NextResponse.json({ data }, { status: 201 });
        }
      } catch {
        // Fallback to local-db
      }
    }

    // Local DB fallback
    const db = readDb();
    const userSem = db.semesters.find((s) => s.user_id === user.id && s.is_current) ||
                    db.semesters.find((s) => s.user_id === user.id);
    const resolvedSemesterId = semester_id || userSem?.id || "sem_5";

    const newSubject = {
      id: "sub_" + Date.now() + "_" + Math.random().toString(36).substring(2, 6),
      user_id: user.id,
      semester_id: resolvedSemesterId,
      name: name.trim(),
      code: code?.trim() || null,
      color: color || "#4f46e5",
      icon: "BookOpen",
      description: description?.trim() || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    db.subjects.unshift(newSubject);

    // If custom units (e.g. from VTU syllabus) are provided, use them; otherwise create 5 units
    if (units && Array.isArray(units) && units.length > 0) {
      units.forEach((u: any) => {
        db.units.push({
          id: `unit_${newSubject.id}_${u.unit_number}`,
          user_id: user.id,
          subject_id: newSubject.id,
          unit_number: u.unit_number,
          title: u.title,
          description: u.description || null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
      });
    } else {
      for (let u = 1; u <= 5; u++) {
        db.units.push({
          id: `unit_${newSubject.id}_${u}`,
          user_id: user.id,
          subject_id: newSubject.id,
          unit_number: u,
          title: `Unit ${u}`,
          description: `Syllabus topics for Unit ${u}`,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
      }
    }

    writeDb(db);
    return NextResponse.json({ data: newSubject }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Internal server error" }, { status: 500 });
  }
}
