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
    const { unit_number, title, description } = body;

    if (isSupabaseConfigured()) {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("units")
          .update({
            unit_number: unit_number ? Number(unit_number) : undefined,
            title: title?.trim(),
            description: description?.trim() || null,
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
    const index = db.units.findIndex((u) => u.id === params.id && u.user_id === user.id);
    if (index === -1) {
      return NextResponse.json({ error: "Unit not found" }, { status: 404 });
    }

    db.units[index] = {
      ...db.units[index],
      unit_number: unit_number ? Number(unit_number) : db.units[index].unit_number,
      title: title?.trim() || db.units[index].title,
      description:
        description !== undefined ? description?.trim() || null : db.units[index].description,
      updated_at: new Date().toISOString(),
    };

    writeDb(db);
    return NextResponse.json({ data: db.units[index] });
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
          .from("units")
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
    db.units = db.units.filter((u) => !(u.id === params.id && u.user_id === user.id));
    // Clear unit_id on materials linked to this unit
    db.documents = db.documents.map((d) =>
      d.unit_id === params.id ? { ...d, unit_id: null } : d
    );

    writeDb(db);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Internal server error" }, { status: 500 });
  }
}
