import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth-helper";
import { readDb } from "@/lib/local-db";

export async function GET() {
  const user = await getAuthenticatedUser();
  if (!user) {
    return NextResponse.json({ user: null });
  }

  const db = readDb();
  const profile = db.profiles.find((p) => p.id === user.id) || {
    id: user.id,
    full_name: user.full_name || "Student",
    current_semester: 5,
  };

  return NextResponse.json({ user, profile });
}

