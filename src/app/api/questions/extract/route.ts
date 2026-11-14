import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth-helper";
import { readDb, writeDb } from "@/lib/local-db";
import { extractVTUQuestions } from "@/lib/vtu-questions";
import { VTUQuestion } from "@/types/database";

export async function GET(request: Request) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const documentId = searchParams.get("document_id");
    const subjectId = searchParams.get("subject_id");

    const db = readDb();
    let questions: VTUQuestion[] = (db as any).questions || [];

    if (documentId) {
      questions = questions.filter((q) => q.document_id === documentId);
    } else if (subjectId) {
      questions = questions.filter((q) => q.subject_id === subjectId);
    }

    return NextResponse.json({ data: questions });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { document_id, title, file_name, subject_id, unit_id } = body;

    const db = readDb();
    const subject = subject_id ? db.subjects.find((s) => s.id === subject_id) : undefined;
    const unit = unit_id ? db.units.find((u) => u.id === unit_id) : undefined;

    // Check if external LLM API (Gemini or OpenAI) is available
    const geminiKey = process.env.GEMINI_API_KEY;
    const openaiKey = process.env.OPENAI_API_KEY;

    let extracted: VTUQuestion[] = [];
    let source = "VTU Exam Archive & Syllabus Engine";

    if (geminiKey) {
      try {
        const prompt = `You are a Senior Chief Examiner for Visvesvaraya Technological University (VTU), Belagavi, Karnataka.
A student in the current academic year (2022 Scheme) uploaded study material:
- Title: "${title || "Study Notes"}"
- File: "${file_name || ""}"
- Subject: "${subject?.name || "Engineering Subject"} (${subject?.code || "VTU 2022 Scheme"})"
- Unit/Module: "${unit?.title || "Module 1"}" (Module #${unit?.unit_number || 1})

Generate authentic VTU 2022 Scheme examination questions (including repeated Previous Year Questions - PYQs and Model Question Paper questions) based on this material.
Follow the official VTU Bloom's Taxonomy and marking pattern (10 Marks each, or 7M/8M splits, Module 1-5).
Return ONLY valid JSON array matching this schema:
[
  {
    "id": "q_1",
    "question_no": "Q1 (a)",
    "question": "Full technical question text following VTU exam phrasing",
    "priority": "MUST_PREPARE",
    "marks": 10,
    "module": ${unit?.unit_number || 1},
    "scheme": "2022 Scheme (Current)",
    "blooms_level": "L2 (Understand)",
    "co_mapping": "CO${unit?.unit_number || 1}",
    "vtu_exam_years": ["2022 Scheme MQP-1", "Jan/Feb 2025", "July/Aug 2024"],
    "repeat_frequency": "Very High (MQP Core Question)",
    "key_marking_points": ["Neat block diagram - 4 Marks", "Step-by-step technical explanation - 4 Marks", "Key applications/formulas - 2 Marks"],
    "sample_answer_hint": "Summary of model answer and examiner tips"
  }
]`;

        const geminiRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }],
              generationConfig: { responseMimeType: "application/json" },
            }),
          }
        );

        if (geminiRes.ok) {
          const geminiData = await geminiRes.json();
          const rawText = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (rawText) {
            extracted = JSON.parse(rawText);
            source = "Gemini AI + VTU Exam Intelligence";
          }
        }
      } catch (aiErr) {
        console.error("Gemini AI extraction error, falling back to VTU knowledge bank:", aiErr);
      }
    }

    // If Gemini wasn't configured or failed, use the authentic VTU Exam Knowledge Engine
    if (!extracted || extracted.length === 0) {
      extracted = extractVTUQuestions({
        documentId: document_id,
        title: title || "Study Material",
        fileName: file_name || "",
        subjectName: subject?.name,
        subjectCode: subject?.code || undefined,
        unitTitle: unit?.title,
        unitNumber: unit?.unit_number,
      });
    }

    // Attach document, subject, and unit IDs
    extracted = extracted.map((q, idx) => ({
      ...q,
      id: q.id || `q_${document_id || Date.now()}_${idx + 1}`,
      document_id: document_id || undefined,
      subject_id: subject_id || undefined,
      unit_id: unit_id || undefined,
      is_saved: true,
    }));

    // Persist questions in local database
    if (!(db as any).questions) {
      (db as any).questions = [];
    }
    // Remove previous extractions for this document or subject
    if (document_id) {
      (db as any).questions = (db as any).questions.filter(
        (q: VTUQuestion) => q.document_id !== document_id
      );
    } else if (subject_id) {
      (db as any).questions = (db as any).questions.filter(
        (q: VTUQuestion) => q.subject_id !== subject_id
      );
    }
    (db as any).questions.push(...extracted);
    writeDb(db);

    return NextResponse.json({
      success: true,
      data: extracted,
      meta: {
        source,
        total_extracted: extracted.length,
        document_title: title,
        subject_name: subject?.name,
        unit_number: unit?.unit_number,
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Failed to extract VTU questions" },
      { status: 500 }
    );
  }
}

