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

    const { searchParams } = new URL(request.url);
    const subjectId = searchParams.get("subject_id");

    if (isSupabaseConfigured()) {
      try {
        const supabase = createClient();
        let query = supabase.from("units").select("*").eq("user_id", user.id);
        if (subjectId) {
          query = query.eq("subject_id", subjectId);
        }
        const { data, error } = await query.order("unit_number", { ascending: true });
        if (!error && data) {
          return NextResponse.json({ data });
        }
      } catch {
        // Fallback to local-db
      }
    }

    // Local DB fallback
    const db = readDb();
    let units = db.units.filter((u) => u.user_id === user.id);
    if (subjectId) {
      units = units.filter((u) => u.subject_id === subjectId);
    }
    units.sort((a, b) => a.unit_number - b.unit_number);

    return NextResponse.json({ data: units });
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
    const { subject_id, unit_number, title, description } = body;

    if (!subject_id || !unit_number || !title) {
      return NextResponse.json(
        { error: "Subject ID, Unit Number, and Title are required" },
        { status: 400 }
      );
    }

    if (isSupabaseConfigured()) {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("units")
          .insert({
            user_id: user.id,
            subject_id,
            unit_number: Number(unit_number),
            title: title.trim(),
            description: description?.trim() || null,
          })
          .select()
          .single();

        if (!error && data) {
          return NextResponse.json({ data }, { status: 201 });
        }
      } catch {
        // Fallback to local-db
      }
    }

    // Local DB fallback
    const db = readDb();
    const newUnit = {
      id: "unit_" + Date.now() + "_" + Math.random().toString(36).substring(2, 6),
      user_id: user.id,
      subject_id,
      unit_number: Number(unit_number),
      title: title.trim(),
      description: description?.trim() || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    db.units.push(newUnit);
    writeDb(db);
    return NextResponse.json({ data: newUnit }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Internal server error" }, { status: 500 });
  }
}
