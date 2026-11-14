"use client";

import * as React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  BookOpen,
  Plus,
  Upload,
  Layers,
  FolderArchive,
  Edit2,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { UnitList } from "@/components/subjects/unit-list";
import { UnitModal } from "@/components/subjects/unit-modal";
import { SubjectModal } from "@/components/subjects/subject-modal";
import { UploadModal } from "@/components/materials/upload-modal";
import { VTUQuestionExtractorModal } from "@/components/materials/vtu-question-extractor-modal";
import { Subject, Unit, DocumentItem } from "@/types/database";

export default function SubjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const subjectId = params.id as string;

  const [subject, setSubject] = React.useState<Subject | null>(null);
  const [units, setUnits] = React.useState<Unit[]>([]);
  const [documents, setDocuments] = React.useState<DocumentItem[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  // Modals state
  const [isUnitModalOpen, setIsUnitModalOpen] = React.useState(false);
  const [editingUnit, setEditingUnit] = React.useState<Unit | null>(null);
  const [isSubjectEditOpen, setIsSubjectEditOpen] = React.useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = React.useState(false);
  const [uploadUnitId, setUploadUnitId] = React.useState<string | undefined>();
  const [selectedDocForQuestions, setSelectedDocForQuestions] = React.useState<any>(null);

  const loadSubjectData = React.useCallback(async () => {
    try {
      setIsLoading(true);

      // 1. Fetch all subjects to locate current subject
      const subsRes = await fetch("/api/subjects");
      if (subsRes.ok) {
        const { data } = await subsRes.json();
        const found = (data || []).find((s: Subject) => s.id === subjectId);
        if (!found) {
          router.push("/subjects");
          return;
        }
        setSubject(found);
      }

      // 2. Fetch units for this subject
      const unitsRes = await fetch(`/api/units?subject_id=${subjectId}`);
      if (unitsRes.ok) {
        const { data } = await unitsRes.json();
        setUnits(data || []);
      }

      // 3. Fetch materials for this subject
      const docsRes = await fetch(`/api/materials?subject_id=${subjectId}`);
      if (docsRes.ok) {
        const { data } = await docsRes.json();
        setDocuments(data || []);
      }
    } catch (err) {
      console.error("Failed to load subject detail:", err);
    } finally {
      setIsLoading(false);
    }
  }, [subjectId, router]);

  React.useEffect(() => {
    loadSubjectData();
  }, [loadSubjectData]);

  const handleSaveUnit = async (data: {
    id?: string;
    unit_number: number;
    title: string;
    description?: string;
  }) => {
    const isEdit = !!data.id;
    const url = isEdit ? `/api/units/${data.id}` : "/api/units";
    const method = isEdit ? "PUT" : "POST";

    const payload = isEdit
      ? data
      : { ...data, subject_id: subjectId };

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err?.error || "Failed to save unit");
    }

    await loadSubjectData();
  };

  const handleDeleteUnit = async (unit: Unit) => {
    const confirmed = window.confirm(
      `Delete "Unit ${unit.unit_number}: ${unit.title}"? Materials linked to this unit will be unassigned.`
    );
    if (!confirmed) return;

    try {
      const res = await fetch(`/api/units/${unit.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete unit");
      await loadSubjectData();
    } catch (err) {
      console.error("Error deleting unit:", err);
      alert("Failed to delete unit.");
    }
  };

  const handleUpdateSubject = async (data: any) => {
    const res = await fetch(`/api/subjects/${subjectId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to update subject");
    await loadSubjectData();
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-28 w-full rounded-xl" />
        <Skeleton className="h-48 w-full rounded-xl" />
      </div>
    );
  }

  if (!subject) return null;

  return (
    <div className="space-y-6">
      {/* Back Link */}
      <Link
        href="/subjects"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors dark:text-slate-400"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        <span>Back to All Subjects</span>
      </Link>

      {/* Subject Header Card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div
              className="flex h-12 w-12 items-center justify-center rounded-xl text-white shadow-sm shrink-0"
              style={{ backgroundColor: subject.color || "#4f46e5" }}
            >
              <BookOpen className="h-6 w-6" />
            </div>

            <div>
              {subject.code && (
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  {subject.code}
                </span>
              )}
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                {subject.name}
              </h1>
              {subject.description && (
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 max-w-xl">
                  {subject.description}
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-start">
            <Button
              size="sm"
              onClick={() => {
                setSelectedDocForQuestions({
                  title: `${subject.name} (Official VTU PYQ Bank)`,
                  fileName: `${subject.name}_VTU_2022_Scheme.pdf`,
                  subjectName: subject.name,
                  subjectCode: subject.code || undefined,
                  subjectId: subject.id,
                });
              }}
              className="gap-1.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-sm"
            >
              <Sparkles className="h-4 w-4" />
              <span>⚡ VTU PYQs</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsSubjectEditOpen(true)}
              className="gap-1.5"
            >
              <Edit2 className="h-3.5 w-3.5" />
              <span>Edit</span>
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setUploadUnitId(undefined);
                setIsUploadModalOpen(true);
              }}
              className="gap-1.5"
            >
              <Upload className="h-4 w-4" />
              <span>Upload Note</span>
            </Button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="mt-6 flex items-center gap-6 pt-4 border-t border-slate-100 text-xs text-slate-500 dark:border-slate-800/80 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <Layers className="h-4 w-4 text-indigo-500" />
            <span className="font-semibold text-slate-900 dark:text-slate-100">
              {units.length}
            </span>
            <span>Syllabus Units</span>
          </div>
          <div className="flex items-center gap-2">
            <FolderArchive className="h-4 w-4 text-indigo-500" />
            <span className="font-semibold text-slate-900 dark:text-slate-100">
              {documents.length}
            </span>
            <span>Uploaded Materials</span>
          </div>
        </div>
      </div>

      {/* Units Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
            Syllabus Units & Modules
          </h2>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setEditingUnit(null);
              setIsUnitModalOpen(true);
            }}
            className="gap-1 text-xs"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add Unit</span>
          </Button>
        </div>

        <UnitList
          units={units}
          documents={documents}
          onAddUnit={() => {
            setEditingUnit(null);
            setIsUnitModalOpen(true);
          }}
          onEditUnit={(u) => {
            setEditingUnit(u);
            setIsUnitModalOpen(true);
          }}
          onDeleteUnit={handleDeleteUnit}
          onUploadForUnit={(uId) => {
            setUploadUnitId(uId);
            setIsUploadModalOpen(true);
          }}
          onExtractQuestions={(doc, u) => {
            setSelectedDocForQuestions({
              id: doc.id,
              title: doc.title,
              fileName: doc.file_name,
              subjectName: subject?.name,
              subjectCode: subject?.code,
              unitTitle: u.title,
              unitNumber: u.unit_number,
              subjectId: subjectId,
              unitId: u.id,
            });
          }}
        />
      </div>

      {/* Modals */}
      <UnitModal
        isOpen={isUnitModalOpen}
        onClose={() => {
          setIsUnitModalOpen(false);
          setEditingUnit(null);
        }}
        onSave={handleSaveUnit}
        unit={editingUnit}
        suggestedUnitNumber={units.length + 1}
      />

      <SubjectModal
        isOpen={isSubjectEditOpen}
        onClose={() => setIsSubjectEditOpen(false)}
        onSave={handleUpdateSubject}
        subject={subject}
      />

      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUploadComplete={loadSubjectData}
        preselectedSubjectId={subjectId}
        preselectedUnitId={uploadUnitId}
      />

      <VTUQuestionExtractorModal
        isOpen={!!selectedDocForQuestions}
        onClose={() => setSelectedDocForQuestions(null)}
        documentData={selectedDocForQuestions}
      />
    </div>
  );
}
