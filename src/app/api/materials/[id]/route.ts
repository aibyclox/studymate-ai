import { NextResponse } from "next/server";
import { getAuthenticatedUser, isSupabaseConfigured } from "@/lib/auth-helper";
import { createClient } from "@/lib/supabase/server";
import { readDb, writeDb } from "@/lib/local-db";
import fs from "fs";
import path from "path";

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
        const { data: document } = await supabase
          .from("documents")
          .select("file_path, storage_bucket")
          .eq("id", params.id)
          .eq("user_id", user.id)
          .single();

        if (document) {
          const docItem = document as any;
          await supabase.storage
            .from(docItem.storage_bucket || "study-materials")
            .remove([docItem.file_path]);

          await supabase
            .from("documents")
            .delete()
            .eq("id", params.id)
            .eq("user_id", user.id);

          return NextResponse.json({ success: true });
        }
      } catch {
        // Fallback to local-db
      }
    }

    // Local DB fallback
    const db = readDb();
    const doc = db.documents.find((d) => d.id === params.id && d.user_id === user.id);

    if (doc) {
      // Remove local file if exists
      try {
        const absPath = path.join(process.cwd(), "data", doc.file_path);
        if (fs.existsSync(absPath)) {
          fs.unlinkSync(absPath);
        }
      } catch {
        // Ignore file deletion error
      }

      db.documents = db.documents.filter((d) => d.id !== params.id);
      writeDb(db);
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
