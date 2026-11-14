import { NextResponse } from "next/server";
import { VTU_COLLEGES, VTU_DEPARTMENTS, getVTUSubjects } from "@/lib/vtu-data";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type"); // "colleges", "departments", "subjects"
  const query = searchParams.get("query") || "";
  const branch = searchParams.get("branch") || "CSE";
  const semester = parseInt(searchParams.get("semester") || "5");

  if (type === "colleges") {
    let list = VTU_COLLEGES;
    if (query) {
      const q = query.toLowerCase();
      list = list.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.code.toLowerCase().includes(q) ||
          c.region.toLowerCase().includes(q) ||
          c.district.toLowerCase().includes(q)
      );
    }
    return NextResponse.json({ data: list });
  }

  if (type === "departments") {
    return NextResponse.json({ data: VTU_DEPARTMENTS });
  }

  if (type === "subjects") {
    const subjects = getVTUSubjects(branch, semester);
    return NextResponse.json({ data: subjects });
  }

  return NextResponse.json({
    colleges: VTU_COLLEGES,
    departments: VTU_DEPARTMENTS,
    subjects: getVTUSubjects(branch, semester),
  });
}

