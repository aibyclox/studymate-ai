import { NextResponse } from "next/server";
import { getAuthenticatedUser, isSupabaseConfigured } from "@/lib/auth-helper";
import { createClient } from "@/lib/supabase/server";
import { readDb, writeDb } from "@/lib/local-db";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, code, color, description, semester_id } = body;

    if (isSupabaseConfigured()) {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("subjects")
          .update({
            name: name?.trim(),
            code: code?.trim() || null,
            color: color || "#4f46e5",
            description: description?.trim() || null,
            semester_id: semester_id || null,
          })
          .eq("id", params.id)
          .eq("user_id", user.id)
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
    const index = db.subjects.findIndex(
      (s) => s.id === params.id && s.user_id === user.id
    );

    if (index === -1) {
      return NextResponse.json({ error: "Subject not found" }, { status: 404 });
    }

    db.subjects[index] = {
      ...db.subjects[index],
      name: name?.trim() || db.subjects[index].name,
      code: code !== undefined ? code?.trim() || null : db.subjects[index].code,
      color: color || db.subjects[index].color,
      description:
        description !== undefined
          ? description?.trim() || null
          : db.subjects[index].description,
      semester_id: semester_id || db.subjects[index].semester_id,
      updated_at: new Date().toISOString(),
    };

    writeDb(db);
    return NextResponse.json({ data: db.subjects[index] });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (isSupabaseConfigured()) {
      try {
        const supabase = createClient();
        const { error } = await supabase
          .from("subjects")
          .delete()
          .eq("id", params.id)
          .eq("user_id", user.id);

        if (!error) {
          return NextResponse.json({ success: true });
        }
      } catch {
        // Fallback to local-db
      }
    }

    // Local DB fallback
    const db = readDb();
    db.subjects = db.subjects.filter(
      (s) => !(s.id === params.id && s.user_id === user.id)
    );
    db.units = db.units.filter((u) => u.subject_id !== params.id);
    db.documents = db.documents.filter((d) => d.subject_id !== params.id);

    writeDb(db);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Internal server error" }, { status: 500 });
  }
}
