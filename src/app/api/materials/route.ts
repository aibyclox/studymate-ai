import { NextResponse } from "next/server";
import { getAuthenticatedUser, isSupabaseConfigured } from "@/lib/auth-helper";
import { createClient } from "@/lib/supabase/server";
import { readDb, writeDb } from "@/lib/local-db";
import fs from "fs";
import path from "path";

export async function GET(request: Request) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const subjectId = searchParams.get("subject_id");
    const unitId = searchParams.get("unit_id");

    if (isSupabaseConfigured()) {
      try {
        const supabase = createClient();
        let query = supabase.from("documents").select("*").eq("user_id", user.id);
        if (subjectId && subjectId !== "all") query = query.eq("subject_id", subjectId);
        if (unitId && unitId !== "all") query = query.eq("unit_id", unitId);

        const { data: documents, error: docsError } = await query.order("created_at", { ascending: false });

        if (!docsError && documents) {
          const { data: subjects } = await supabase.from("subjects").select("id, name, color").eq("user_id", user.id);
          const { data: units } = await supabase.from("units").select("id, title, unit_number").eq("user_id", user.id);

          const subList = (subjects as any[]) || [];
          const unitList = (units as any[]) || [];
          const enriched = ((documents as any[]) || []).map((doc: any) => {
            const sub = subList.find((s: any) => s.id === doc.subject_id);
            const unit = unitList.find((u: any) => u.id === doc.unit_id);
            return {
              ...doc,
              subject_name: sub?.name,
              subject_color: sub?.color,
              unit_title: unit?.title,
              unit_number: unit?.unit_number,
            };
          });

          return NextResponse.json({ data: enriched });
        }
      } catch {
        // Fallback to local-db
      }
    }

    // Local DB fallback
    const db = readDb();
    let docs = db.documents.filter((d) => d.user_id === user.id);

    if (subjectId && subjectId !== "all") {
      docs = docs.filter((d) => d.subject_id === subjectId);
    }
    if (unitId && unitId !== "all") {
      docs = docs.filter((d) => d.unit_id === unitId);
    }

    const enriched = docs.map((doc) => {
      const sub = db.subjects.find((s) => s.id === doc.subject_id);
      const unit = db.units.find((u) => u.id === doc.unit_id);
      return {
        ...doc,
        subject_name: sub?.name,
        subject_color: sub?.color,
        unit_title: unit?.title,
        unit_number: unit?.unit_number,
      };
    });

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

    const contentType = request.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      const file = formData.get("file") as File;
      const title = formData.get("title") as string;
      const subject_id = formData.get("subject_id") as string;
      const unit_id = formData.get("unit_id") as string;

      if (!file || !title) {
        return NextResponse.json({ error: "File and title are required" }, { status: 400 });
      }

      const timestamp = Date.now();
      const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
      const isServerless = !!(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);
      const baseDir = isServerless ? "/tmp" : path.join(process.cwd(), "data");
      const uploadDir = path.join(baseDir, "uploads");

      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const relativePath = `uploads/${user.id}_${timestamp}_${sanitizedName}`;
      const absolutePath = path.join(baseDir, relativePath);

      // Save file buffer to disk
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      fs.writeFileSync(absolutePath, buffer);

      const db = readDb();
      const newDoc = {
        id: "doc_" + timestamp + "_" + Math.random().toString(36).substring(2, 6),
        user_id: user.id,
        subject_id: subject_id || null,
        unit_id: unit_id || null,
        title: title.trim(),
        file_name: file.name,
        file_path: relativePath,
        file_size: file.size,
        file_type: file.name.split(".").pop()?.toLowerCase() || "unknown",
        storage_bucket: "study-materials",
        status: "ready" as const,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      db.documents.unshift(newDoc);
      writeDb(db);

      return NextResponse.json({ data: newDoc }, { status: 201 });
    } else {
      // JSON metadata
      const body = await request.json();
      const db = readDb();
      const newDoc = {
        id: "doc_" + Date.now() + "_" + Math.random().toString(36).substring(2, 6),
        user_id: user.id,
        subject_id: body.subject_id || null,
        unit_id: body.unit_id || null,
        title: body.title.trim(),
        file_name: body.file_name,
        file_path: body.file_path,
        file_size: body.file_size,
        file_type: body.file_type,
        storage_bucket: "study-materials",
        status: "ready" as const,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      db.documents.unshift(newDoc);
      writeDb(db);
      return NextResponse.json({ data: newDoc }, { status: 201 });
    }
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Failed to upload document" }, { status: 500 });
  }
}
