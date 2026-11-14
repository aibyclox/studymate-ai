"use client";

import * as React from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Subject, Semester } from "@/types/database";
import { VTU_DEPARTMENTS, getVTUSubjects, VTUSubject } from "@/lib/vtu-data";
import { Sparkles } from "lucide-react";

const PRESET_COLORS = [
  "#4f46e5", // Indigo
  "#7c3aed", // Violet
  "#059669", // Emerald
  "#0284c7", // Sky
  "#d97706", // Amber
  "#e11d48", // Rose
  "#0d9488", // Teal
  "#475569", // Slate
];

export interface SubjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: {
    id?: string;
    name: string;
    code?: string;
    description?: string;
    color: string;
    semester_id?: string;
    units?: { unit_number: number; title: string; description: string }[];
  }) => Promise<void>;
  subject?: Subject | null;
  semesters?: Semester[];
  currentSemesterId?: string;
}

export function SubjectModal({
  isOpen,
  onClose,
  onSave,
  subject,
  semesters,
  currentSemesterId,
}: SubjectModalProps) {
  const [name, setName] = React.useState("");
  const [code, setCode] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [color, setColor] = React.useState("#4f46e5");
  const [semesterId, setSemesterId] = React.useState(currentSemesterId || "");
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  // VTU quick picker state
  const [vtuBranch, setVtuBranch] = React.useState("CSE");
  const [vtuSemester, setVtuSemester] = React.useState(5);
  const [vtuSubjects, setVtuSubjects] = React.useState<VTUSubject[]>([]);
  const [selectedVtuUnits, setSelectedVtuUnits] = React.useState<any[] | undefined>();

  // Load VTU subjects whenever branch or semester changes in quick pick
  React.useEffect(() => {
    const list = getVTUSubjects(vtuBranch, vtuSemester);
    setVtuSubjects(list);
  }, [vtuBranch, vtuSemester]);

  // Refs to guarantee form values are never wiped while modal is open
  const wasOpenRef = React.useRef(false);
  const editingSubjectIdRef = React.useRef<string | undefined>(subject?.id);

  // Initialize form ONLY on transition from closed -> open or subject change
  React.useEffect(() => {
    const isNewOpen = isOpen && !wasOpenRef.current;
    const subjectChanged = isOpen && subject?.id !== editingSubjectIdRef.current;

    if (isNewOpen || subjectChanged) {
      if (subject) {
        setName(subject.name || "");
        setCode(subject.code || "");
        setDescription(subject.description || "");
        setColor(subject.color || "#4f46e5");
        setSemesterId(subject.semester_id || currentSemesterId || "");
        setSelectedVtuUnits(undefined);
      } else {
        setName("");
        setCode("");
        setDescription("");
        setColor("#4f46e5");
        const defaultSem = currentSemesterId || (semesters && semesters.length > 0 ? semesters[0].id : "sem_5");
        setSemesterId(defaultSem);
        setSelectedVtuUnits(undefined);
      }
      setError("");
      editingSubjectIdRef.current = subject?.id;
    }

    wasOpenRef.current = isOpen;
  }, [isOpen, subject?.id, currentSemesterId, semesters]);

  const handleSelectVtuSubject = (vSub: VTUSubject) => {
    setName(vSub.name);
    setCode(vSub.code);
    setColor(vSub.color || "#4f46e5");
    setSelectedVtuUnits(vSub.units);
    if (vSub.units && vSub.units.length > 0) {
      setDescription(`VTU Curriculum: includes ${vSub.units.length} syllabus units.`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Subject name is required");
      return;
    }

    try {
      setIsLoading(true);
      setError("");
      await onSave({
        id: subject?.id,
        name: name.trim(),
        code: code.trim() || undefined,
        description: description.trim() || undefined,
        color,
        semester_id: semesterId || undefined,
        units: selectedVtuUnits,
      });
      onClose();
    } catch (err: any) {
      setError(err?.message || "Failed to save subject");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={subject ? "Edit Subject" : "Create New Subject"}
      description="Add a subject to organize syllabus units and study materials."
      className="max-w-xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4 pt-1">
        {error && (
          <div className="rounded-lg bg-red-50 p-3 text-xs text-red-600 dark:bg-red-950/40 dark:text-red-400">
            {error}
          </div>
        )}

        {/* VTU Syllabus Quick Pick (Only when adding a new subject) */}
        {!subject && (
          <div className="rounded-xl border border-indigo-100 bg-indigo-50/60 p-3 dark:border-indigo-900/50 dark:bg-indigo-950/30">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-indigo-900 dark:text-indigo-200 flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
                Quick Pick from VTU Syllabus Scheme
              </span>
              <div className="flex items-center gap-1.5">
                <select
                  value={vtuBranch}
                  onChange={(e) => setVtuBranch(e.target.value)}
                  className="rounded border border-indigo-200 bg-white px-2 py-0.5 text-[11px] text-slate-800 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                >
                  {VTU_DEPARTMENTS.slice(0, 10).map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.id}
                    </option>
                  ))}
                </select>
                <select
                  value={vtuSemester}
                  onChange={(e) => setVtuSemester(parseInt(e.target.value))}
                  className="rounded border border-indigo-200 bg-white px-2 py-0.5 text-[11px] text-slate-800 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                    <option key={s} value={s}>
                      Sem {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto">
              {vtuSubjects.map((vSub) => (
                <button
                  key={vSub.code}
                  type="button"
                  onClick={() => handleSelectVtuSubject(vSub)}
                  className={`inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-[11px] font-medium transition-colors ${
                    code === vSub.code
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-100 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-300"
                  }`}
                >
                  <span className="font-bold">{vSub.code}:</span>
                  <span className="truncate max-w-[150px]">{vSub.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Subject Name Input */}
        <div className="space-y-1.5">
          <label
            htmlFor="subject-name"
            className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400"
          >
            Subject Name
          </label>
          <input
            id="subject-name"
            type="text"
            placeholder="e.g. Database Management Systems"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="flex h-10 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm transition-colors focus-visible:border-indigo-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 placeholder:text-slate-400"
          />
        </div>

        {/* Subject Code and Semester */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label
              htmlFor="subject-code"
              className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400"
            >
              Subject Code
            </label>
            <input
              id="subject-code"
              type="text"
              placeholder="e.g. BCS504 / 21CS54"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="flex h-10 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm transition-colors focus-visible:border-indigo-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 placeholder:text-slate-400"
            />
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="subject-semester"
              className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400"
            >
              Semester
            </label>
            <select
              id="subject-semester"
              value={semesterId}
              onChange={(e) => setSemesterId(e.target.value)}
              className="flex h-10 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm transition-colors focus-visible:border-indigo-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
            >
              {(semesters && semesters.length > 0 ? semesters : [1, 2, 3, 4, 5, 6, 7, 8].map(n => ({ id: `sem_${n}`, semester_number: n }))).map((s) => (
                <option key={s.id} value={s.id}>
                  Semester {s.semester_number}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Description Textarea */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
            Description
          </label>
          <textarea
            className="flex min-h-[70px] w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm transition-colors focus-visible:border-indigo-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 placeholder:text-slate-400"
            placeholder="Optional syllabus overview or notes..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {/* Color Palette */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
            Theme Color
          </label>
          <div className="flex items-center gap-2 pt-1">
            {PRESET_COLORS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setColor(c)}
                className={`h-7 w-7 rounded-full transition-transform ${
                  color === c ? "scale-110 ring-2 ring-indigo-500 ring-offset-2" : "hover:scale-105"
                }`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isLoading}>
            {subject ? "Update Subject" : "Create Subject"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
