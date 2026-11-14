"use client";

import * as React from "react";
import { BookOpen, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { SubjectCard } from "@/components/subjects/subject-card";
import { SubjectModal } from "@/components/subjects/subject-modal";
import { VTUQuestionExtractorModal } from "@/components/materials/vtu-question-extractor-modal";
import { Subject, Semester } from "@/types/database";

export default function SubjectsPage() {
  const [subjects, setSubjects] = React.useState<Subject[]>([]);
  const [semesters, setSemesters] = React.useState<Semester[]>([]);
  const [selectedSemesterId, setSelectedSemesterId] = React.useState<string>("all");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(true);

  // Modals state
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingSubject, setEditingSubject] = React.useState<Subject | null>(null);
  const [selectedSubjectForQuestions, setSelectedSubjectForQuestions] = React.useState<Subject | null>(null);

  const loadData = React.useCallback(async () => {
    try {
      setIsLoading(true);

      // 1. Fetch semesters
      const semsRes = await fetch("/api/semesters");
      if (semsRes.ok) {
        const { data: sems } = await semsRes.json();
        if (sems && Array.isArray(sems)) {
          setSemesters(sems);
        }
      }

      // 2. Fetch subjects
      const subsRes = await fetch("/api/subjects");
      if (subsRes.ok) {
        const { data: subs } = await subsRes.json();
        if (subs && Array.isArray(subs)) {
          setSubjects(subs);
        }
      }
    } catch (err) {
      console.error("Failed to load subjects:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSaveSubject = async (data: {
    id?: string;
    name: string;
    code?: string;
    description?: string;
    color: string;
    semester_id?: string;
    units?: { unit_number: number; title: string; description: string }[];
  }) => {
    const isEdit = !!data.id;
    const url = isEdit ? `/api/subjects/${data.id}` : "/api/subjects";
    const method = isEdit ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err?.error || "Failed to save subject");
    }

    await loadData();
  };

  const handleDeleteSubject = async (subject: Subject) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${subject.name}"? This will delete all associated units and study materials.`
    );
    if (!confirmed) return;

    try {
      const res = await fetch(`/api/subjects/${subject.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete subject");
      await loadData();
    } catch (err) {
      console.error("Error deleting subject:", err);
      alert("Failed to delete subject. Please try again.");
    }
  };

  // Filter subjects by semester and search query
  const filteredSubjects = subjects.filter((sub) => {
    const matchesSemester =
      selectedSemesterId === "all" || sub.semester_id === selectedSemesterId;
    const matchesQuery =
      sub.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (sub.code && sub.code.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesSemester && matchesQuery;
  });

  const activeSemester = semesters.find((s) => s.is_current);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Subjects & Courses
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Organize syllabus topics and lecture materials by subject.
          </p>
        </div>

        <Button
          size="sm"
          onClick={() => {
            setEditingSubject(null);
            setIsModalOpen(true);
          }}
          className="gap-1.5 self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          <span>Add New Subject</span>
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative w-full sm:flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search subjects by name or code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex h-9 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-xs text-slate-900 placeholder:text-slate-400 focus-visible:border-indigo-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
          />
        </div>

        {semesters.length > 0 && (
          <div className="w-full sm:w-48">
            <select
              value={selectedSemesterId}
              onChange={(e) => setSelectedSemesterId(e.target.value)}
              className="flex h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-900 focus-visible:border-indigo-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
            >
              <option value="all">All Semesters</option>
              {semesters.map((s) => (
                <option key={s.id} value={s.id}>
                  Semester {s.semester_number} {s.is_current ? "(Current)" : ""}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-36 w-full rounded-xl" />
          ))}
        </div>
      ) : filteredSubjects.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title={searchQuery ? "No matching subjects found" : "No subjects added yet"}
          description={
            searchQuery
              ? "Try adjusting your search query or semester filter."
              : "Create your first subject or pick from the VTU curriculum to organize syllabus units and study notes."
          }
          actionLabel={searchQuery ? undefined : "Add Subject"}
          onAction={() => {
            setEditingSubject(null);
            setIsModalOpen(true);
          }}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSubjects.map((sub) => (
            <SubjectCard
              key={sub.id}
              subject={sub}
              onExtractQuestions={(s) => setSelectedSubjectForQuestions(s)}
              onEdit={(subjectToEdit) => {
                setEditingSubject(subjectToEdit);
                setIsModalOpen(true);
              }}
              onDelete={handleDeleteSubject}
            />
          ))}
        </div>
      )}

      {/* Modal */}
      <SubjectModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingSubject(null);
        }}
        onSave={handleSaveSubject}
        subject={editingSubject}
        semesters={semesters}
        currentSemesterId={
          selectedSemesterId !== "all"
            ? selectedSemesterId
            : activeSemester?.id
        }
      />

      <VTUQuestionExtractorModal
        isOpen={!!selectedSubjectForQuestions}
        onClose={() => setSelectedSubjectForQuestions(null)}
        documentData={
          selectedSubjectForQuestions
            ? {
                title: `${selectedSubjectForQuestions.name} Question Bank`,
                fileName: `${selectedSubjectForQuestions.name}_VTU_2022_Scheme.pdf`,
                subjectName: selectedSubjectForQuestions.name,
                subjectCode: selectedSubjectForQuestions.code || undefined,
                subjectId: selectedSubjectForQuestions.id,
              }
            : null
        }
      />
    </div>
  );
}
