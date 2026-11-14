import { NextResponse } from "next/server";
import { getAuthenticatedUser, isSupabaseConfigured } from "@/lib/auth-helper";
import { createClient } from "@/lib/supabase/server";
import { readDb } from "@/lib/local-db";
import fs from "fs";
import path from "path";

export async function GET(
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
          .select("*")
          .eq("id", params.id)
          .eq("user_id", user.id)
          .single();

        if (document) {
          const docItem = document as any;
          const { data } = await supabase.storage
            .from(docItem.storage_bucket || "study-materials")
            .createSignedUrl(docItem.file_path, 60);

          if (data?.signedUrl) {
            return NextResponse.redirect(data.signedUrl);
          }
        }
      } catch {
        // Fallback
      }
    }

    // Local DB fallback
    const db = readDb();
    const doc = db.documents.find((d) => d.id === params.id && d.user_id === user.id);

    if (!doc) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 });
    }

    let localFile = path.join(process.cwd(), "data", doc.file_path);
    if (!fs.existsSync(localFile) && (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME)) {
      localFile = path.join("/tmp", doc.file_path);
    }
    if (fs.existsSync(localFile)) {
      const buffer = fs.readFileSync(localFile);
      const mimeTypes: Record<string, string> = {
        pdf: "application/pdf",
        doc: "application/msword",
        docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ppt: "application/vnd.ms-powerpoint",
        pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        png: "image/png",
        jpg: "image/jpeg",
        jpeg: "image/jpeg",
        txt: "text/plain",
      };

      const ext = doc.file_name.split(".").pop()?.toLowerCase() || "";
      const contentType = mimeTypes[ext] || "application/octet-stream";

      return new NextResponse(buffer, {
        headers: {
          "Content-Type": contentType,
          "Content-Disposition": `inline; filename="${doc.file_name}"`,
        },
      });
    }

    // If demo sample note
    return new NextResponse(`StudyMate AI Notes: ${doc.title}\n\nContents for ${doc.file_name}`, {
      headers: {
        "Content-Type": "text/plain",
        "Content-Disposition": `inline; filename="${doc.file_name}.txt"`,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Download error" }, { status: 500 });
  }
}

