"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  Plus,
  Trash2,
  GraduationCap,
  AlertCircle,
  Search,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { VTU_COLLEGES, VTU_DEPARTMENTS, getVTUSubjects, VTUSubject } from "@/lib/vtu-data";

export function OnboardingForm() {
  const router = useRouter();

  // University / College state
  const [collegeSearch, setCollegeSearch] = React.useState("");
  const [selectedCollege, setSelectedCollege] = React.useState(VTU_COLLEGES[0].name);
  const [isCollegeDropdownOpen, setIsCollegeDropdownOpen] = React.useState(false);

  // Academic details
  const [course, setCourse] = React.useState("B.E. / B.Tech (VTU)");
  const [branch, setBranch] = React.useState("CSE");
  const [currentSemester, setCurrentSemester] = React.useState("5");

  // VTU Subjects state
  const [availableVtuSubjects, setAvailableVtuSubjects] = React.useState<VTUSubject[]>([]);
  const [selectedSubjects, setSelectedSubjects] = React.useState<
    { name: string; code: string; color: string; units?: any[] }[]
  >([]);
  const [customSubjectName, setCustomSubjectName] = React.useState("");
  const [customSubjectCode, setCustomSubjectCode] = React.useState("");

  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  // Filter colleges based on search
  const filteredColleges = React.useMemo(() => {
    if (!collegeSearch.trim()) return VTU_COLLEGES.slice(0, 15);
    const q = collegeSearch.toLowerCase();
    return VTU_COLLEGES.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.code.toLowerCase().includes(q) ||
        c.region.toLowerCase().includes(q)
    );
  }, [collegeSearch]);

  // Update VTU subjects whenever Branch or Semester changes
  React.useEffect(() => {
    const semNum = parseInt(currentSemester) || 5;
    const subjects = getVTUSubjects(branch, semNum);
    setAvailableVtuSubjects(subjects);

    // Default select all official VTU subjects for this semester
    const colors = ["#4f46e5", "#0284c7", "#7c3aed", "#059669", "#d97706", "#e11d48"];
    setSelectedSubjects(
      subjects.map((s, idx) => ({
        name: s.name,
        code: s.code,
        color: s.color || colors[idx % colors.length],
        units: s.units,
      }))
    );
  }, [branch, currentSemester]);

  const handleToggleVtuSubject = (subject: VTUSubject) => {
    const exists = selectedSubjects.some((s) => s.code === subject.code);
    if (exists) {
      setSelectedSubjects(selectedSubjects.filter((s) => s.code !== subject.code));
    } else {
      const colors = ["#4f46e5", "#0284c7", "#7c3aed", "#059669", "#d97706", "#e11d48"];
      setSelectedSubjects([
        ...selectedSubjects,
        {
          name: subject.name,
          code: subject.code,
          color: subject.color || colors[selectedSubjects.length % colors.length],
          units: subject.units,
        },
      ]);
    }
  };

  const handleAddCustomSubject = () => {
    if (!customSubjectName.trim()) return;
    setSelectedSubjects([
      ...selectedSubjects,
      {
        name: customSubjectName.trim(),
        code: customSubjectCode.trim() || `VTU-${Date.now().toString().slice(-3)}`,
        color: "#4f46e5",
      },
    ]);
    setCustomSubjectName("");
    setCustomSubjectCode("");
  };

  const handleRemoveSelectedSubject = (code: string) => {
    setSelectedSubjects(selectedSubjects.filter((s) => s.code !== code));
  };

  const handleCompleteOnboarding = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedSubjects.length === 0) {
      setError("Please select at least one subject for your semester.");
      return;
    }

    try {
      setIsLoading(true);
      setError("");
      const semNum = parseInt(currentSemester) || 5;

      const selectedDept = VTU_DEPARTMENTS.find((d) => d.id === branch);
      const branchLabel = selectedDept ? selectedDept.name : branch;

      // 1. Update Profile via API
      const profileRes = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          college: selectedCollege,
          course,
          branch: branchLabel,
          current_semester: semNum,
        }),
      });

      if (!profileRes.ok) {
        const pErr = await profileRes.json();
        throw new Error(pErr?.error || "Failed to update profile settings.");
      }

      // 2. Seed Subjects and their Units via API
      for (const sub of selectedSubjects) {
        const subRes = await fetch("/api/subjects", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: sub.name,
            code: sub.code,
            color: sub.color,
            semester_id: `sem_${semNum}`,
          }),
        });

        if (subRes.ok && sub.units && sub.units.length > 0) {
          const { data: createdSub } = await subRes.json();
          if (createdSub?.id) {
            // Seed actual syllabus units
            for (const u of sub.units) {
              await fetch("/api/units", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  subject_id: createdSub.id,
                  unit_number: u.unit_number,
                  title: u.title,
                  description: u.description,
                }),
              });
            }
          }
        }
      }

      router.push("/dashboard");
      router.refresh();
    } catch (err: any) {
      setError(err?.message || "Failed to set up workspace. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleCompleteOnboarding} className="space-y-6">
      {error && (
        <div className="flex items-center gap-2 rounded-lg bg-red-50 p-3 text-xs text-red-600 dark:bg-red-950/40 dark:text-red-400">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* VTU Affiliated College Selection */}
      <div className="space-y-2">
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <GraduationCap className="h-4 w-4 text-indigo-600" />
            Select VTU Affiliated College / Institution
          </span>
          <span className="text-[11px] font-normal text-indigo-600 dark:text-indigo-400">
            Source: vtu.ac.in
          </span>
        </label>

        {/* Selected College Card */}
        <div className="relative">
          <div
            onClick={() => setIsCollegeDropdownOpen(!isCollegeDropdownOpen)}
            className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-3 cursor-pointer shadow-sm hover:border-indigo-400 dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="min-w-0 pr-2">
              <p className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">
                {selectedCollege}
              </p>
              <p className="text-[10px] text-slate-400 mt-0.5">
                Visvesvaraya Technological University (VTU)
              </p>
            </div>
            <Button type="button" variant="outline" size="sm" className="h-7 text-xs">
              Change
            </Button>
          </div>

          {/* College Dropdown Search */}
          {isCollegeDropdownOpen && (
            <div className="absolute left-0 right-0 top-14 z-50 rounded-xl border border-slate-200 bg-white p-3 shadow-2xl dark:border-slate-800 dark:bg-slate-900 animate-in fade-in zoom-in-95">
              <div className="relative mb-2">
                <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by college name, code (e.g. 1RV, BMSCE, DSCE)..."
                  value={collegeSearch}
                  onChange={(e) => setCollegeSearch(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 pl-8 pr-3 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 focus-visible:border-indigo-500 focus-visible:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
                  autoFocus
                />
              </div>

              <div className="max-h-60 overflow-y-auto divide-y divide-slate-100 text-xs dark:divide-slate-800">
                {filteredColleges.map((c) => (
                  <div
                    key={c.code}
                    onClick={() => {
                      setSelectedCollege(c.name);
                      setIsCollegeDropdownOpen(false);
                      setCollegeSearch("");
                    }}
                    className="p-2 hover:bg-indigo-50/60 dark:hover:bg-slate-800 cursor-pointer rounded-lg transition-colors flex items-center justify-between"
                  >
                    <div>
                      <span className="font-semibold text-slate-900 dark:text-slate-100 block">
                        {c.name}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        Code: {c.code} • Region: {c.region} ({c.district})
                      </span>
                    </div>
                    <Badge variant="secondary" className="text-[10px]">
                      {c.code}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* VTU Department & Semester */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
            VTU Department / Branch
          </label>
          <select
            value={branch}
            onChange={(e) => setBranch(e.target.value)}
            className="flex h-10 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-900 shadow-sm focus-visible:border-indigo-500 focus-visible:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
          >
            {VTU_DEPARTMENTS.map((dept) => (
              <option key={dept.id} value={dept.id}>
                {dept.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
            Current Semester
          </label>
          <select
            value={currentSemester}
            onChange={(e) => setCurrentSemester(e.target.value)}
            className="flex h-10 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-900 shadow-sm focus-visible:border-indigo-500 focus-visible:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
          >
            {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
              <option key={s} value={s.toString()}>
                Semester {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Official VTU Syllabus Subjects Section */}
      <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-indigo-600" />
              VTU Syllabus Subjects (Semester {currentSemester})
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Curriculum Scheme from VTU Belagavi. Check the subjects you are studying this semester:
            </p>
          </div>
          <Badge variant="default" className="text-xs">
            {selectedSubjects.length} Selected
          </Badge>
        </div>

        {/* VTU Subject Checkboxes */}
        <div className="grid grid-cols-1 gap-2 max-h-56 overflow-y-auto pr-1">
          {availableVtuSubjects.map((sub) => {
            const isSelected = selectedSubjects.some((s) => s.code === sub.code);
            return (
              <div
                key={sub.code}
                onClick={() => handleToggleVtuSubject(sub)}
                className={`flex items-center justify-between rounded-xl border p-3 cursor-pointer transition-all ${
                  isSelected
                    ? "border-indigo-500 bg-indigo-50/50 dark:border-indigo-800 dark:bg-indigo-950/30"
                    : "border-slate-200 bg-white hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-5 w-5 items-center justify-center rounded border transition-colors ${
                      isSelected
                        ? "border-indigo-600 bg-indigo-600 text-white"
                        : "border-slate-300 dark:border-slate-700"
                    }`}
                  >
                    {isSelected && <CheckCircle2 className="h-3.5 w-3.5" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                        {sub.name}
                      </span>
                      <Badge variant="secondary" className="text-[10px]">
                        {sub.code}
                      </Badge>
                    </div>
                    {sub.units && (
                      <span className="text-[10px] text-slate-400">
                        Includes {sub.units.length} standard syllabus units
                      </span>
                    )}
                  </div>
                </div>

                <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">
                  {sub.credits} Credits • {sub.type}
                </span>
              </div>
            );
          })}
        </div>

        {/* Add custom / elective subject */}
        <div className="pt-2">
          <p className="text-[11px] font-semibold text-slate-500 mb-1.5">
            Studying an elective or lab not listed above?
          </p>
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Subject Name (e.g. Cloud Security)"
              value={customSubjectName}
              onChange={(e) => setCustomSubjectName(e.target.value)}
              className="flex h-9 flex-1 rounded-lg border border-slate-200 bg-white px-3 text-xs placeholder:text-slate-400 focus-visible:border-indigo-500 focus-visible:outline-none dark:border-slate-800 dark:bg-slate-950"
            />
            <input
              type="text"
              placeholder="Code (e.g. 21CS55)"
              value={customSubjectCode}
              onChange={(e) => setCustomSubjectCode(e.target.value)}
              className="flex h-9 w-28 rounded-lg border border-slate-200 bg-white px-3 text-xs placeholder:text-slate-400 focus-visible:border-indigo-500 focus-visible:outline-none dark:border-slate-800 dark:bg-slate-950"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddCustomSubject}
            >
              <Plus className="h-4 w-4 mr-1" />
              Add
            </Button>
          </div>
        </div>
      </div>

      <Button type="submit" className="w-full mt-6" isLoading={isLoading}>
        <Sparkles className="h-4 w-4 mr-2" />
        Launch My VTU Academic Workspace
      </Button>
    </form>
  );
}
