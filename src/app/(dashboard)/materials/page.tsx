"use client";

import * as React from "react";
import { FolderArchive, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { MaterialCard } from "@/components/materials/material-card";
import { MaterialTable } from "@/components/materials/material-table";
import { MaterialFilters } from "@/components/materials/material-filters";
import { UploadModal } from "@/components/materials/upload-modal";
import { VTUQuestionExtractorModal } from "@/components/materials/vtu-question-extractor-modal";
import { DocumentItem, Subject } from "@/types/database";
import { getFileCategory } from "@/lib/utils";

export default function MaterialsPage() {
  const [materials, setMaterials] = React.useState<DocumentItem[]>([]);
  const [subjects, setSubjects] = React.useState<Subject[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  // Filters state
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedSubjectId, setSelectedSubjectId] = React.useState("all");
  const [selectedCategory, setSelectedCategory] = React.useState("all");
  const [viewMode, setViewMode] = React.useState<"grid" | "table">("grid");

  // Upload modal state
  const [isUploadModalOpen, setIsUploadModalOpen] = React.useState(false);
  const [selectedDocForQuestions, setSelectedDocForQuestions] = React.useState<DocumentItem | null>(null);

  const loadMaterialsAndSubjects = React.useCallback(async () => {
    try {
      setIsLoading(true);

      // Fetch subjects for filters
      const subjectsRes = await fetch("/api/subjects");
      if (subjectsRes.ok) {
        const { data } = await subjectsRes.json();
        if (data) setSubjects(data);
      }

      // Fetch materials
      const materialsRes = await fetch("/api/materials");
      if (materialsRes.ok) {
        const { data } = await materialsRes.json();
        if (data) setMaterials(data);
      }
    } catch (err) {
      console.error("Failed to load materials:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadMaterialsAndSubjects();
  }, [loadMaterialsAndSubjects]);

  const handleDeleteMaterial = async (material: DocumentItem) => {
    const confirmed = window.confirm(
      `Delete "${material.title}"? This cannot be undone.`
    );
    if (!confirmed) return;

    try {
      const res = await fetch(`/api/materials/${material.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete material");
      await loadMaterialsAndSubjects();
    } catch (err) {
      console.error("Error deleting material:", err);
      alert("Failed to delete material.");
    }
  };

  // Filter materials based on search, subject, and category
  const filteredMaterials = materials.filter((m) => {
    // Subject filter
    const matchesSubject =
      selectedSubjectId === "all" || m.subject_id === selectedSubjectId;

    // Search query filter
    const matchesQuery =
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.file_name.toLowerCase().includes(searchQuery.toLowerCase());

    // Category filter
    const category = getFileCategory(m.file_name, m.file_type);
    const matchesCategory =
      selectedCategory === "all" || category === selectedCategory;

    return matchesSubject && matchesQuery && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Study Material Library
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Browse, search, and manage all your lecture notes, presentations, and exam papers.
          </p>
        </div>

        <Button
          size="sm"
          onClick={() => setIsUploadModalOpen(true)}
          className="gap-1.5 self-start sm:self-auto"
        >
          <Upload className="h-4 w-4" />
          <span>Upload Material</span>
        </Button>
      </div>

      {/* Filter Toolbar */}
      <MaterialFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedSubjectId={selectedSubjectId}
        onSubjectChange={setSelectedSubjectId}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        subjects={subjects}
      />

      {/* Materials Content */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-44 w-full rounded-xl" />
          ))}
        </div>
      ) : filteredMaterials.length === 0 ? (
        <EmptyState
          icon={FolderArchive}
          title={
            searchQuery || selectedCategory !== "all" || selectedSubjectId !== "all"
              ? "No matching materials found"
              : "No study materials yet"
          }
          description={
            searchQuery || selectedCategory !== "all" || selectedSubjectId !== "all"
              ? "Try adjusting your search keywords, file type, or subject filters."
              : "Upload your first PDF notes, PPT slides, or question papers to start studying."
          }
          actionLabel="Upload Material"
          onAction={() => setIsUploadModalOpen(true)}
        />
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMaterials.map((mat) => (
            <MaterialCard
              key={mat.id}
              material={mat}
              onDelete={handleDeleteMaterial}
              onExtractQuestions={(m) => setSelectedDocForQuestions(m)}
            />
          ))}
        </div>
      ) : (
        <MaterialTable
          materials={filteredMaterials}
          onDelete={handleDeleteMaterial}
          onExtractQuestions={(m) => setSelectedDocForQuestions(m)}
        />
      )}

      {/* Upload Modal (automatically triggers Question Extractor on upload) */}
      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUploadComplete={loadMaterialsAndSubjects}
      />

      {/* Manual Trigger for any existing document */}
      <VTUQuestionExtractorModal
        isOpen={!!selectedDocForQuestions}
        onClose={() => setSelectedDocForQuestions(null)}
        documentData={
          selectedDocForQuestions
            ? {
                id: selectedDocForQuestions.id,
                title: selectedDocForQuestions.title,
                fileName: selectedDocForQuestions.file_name,
                subjectName: selectedDocForQuestions.subject_name,
                unitTitle: selectedDocForQuestions.unit_title,
                unitNumber: selectedDocForQuestions.unit_number,
                subjectId: selectedDocForQuestions.subject_id || undefined,
                unitId: selectedDocForQuestions.unit_id || undefined,
              }
            : null
        }
      />
    </div>
  );
}

