"use client";

import * as React from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Upload, FileText, CheckCircle2, AlertCircle, X, Sparkles } from "lucide-react";
import { Subject, Unit } from "@/types/database";
import { formatBytes } from "@/lib/utils";
import { VTUQuestionExtractorModal } from "./vtu-question-extractor-modal";

const ALLOWED_EXTENSIONS = [
  "pdf",
  "ppt",
  "pptx",
  "doc",
  "docx",
  "txt",
  "png",
  "jpg",
  "jpeg",
];
const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25 MB

export interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadComplete?: () => void;
  preselectedSubjectId?: string;
  preselectedUnitId?: string;
}

export function UploadModal({
  isOpen,
  onClose,
  onUploadComplete,
  preselectedSubjectId,
  preselectedUnitId,
}: UploadModalProps) {
  const [file, setFile] = React.useState<File | null>(null);
  const [title, setTitle] = React.useState("");
  const [subjectId, setSubjectId] = React.useState(preselectedSubjectId || "");
  const [unitId, setUnitId] = React.useState(preselectedUnitId || "");

  const [subjects, setSubjects] = React.useState<Subject[]>([]);
  const [units, setUnits] = React.useState<Unit[]>([]);

  const [isDragOver, setIsDragOver] = React.useState(false);
  const [uploadStatus, setUploadStatus] = React.useState<
    "idle" | "uploading" | "success" | "error"
  >("idle");
  const [statusMessage, setStatusMessage] = React.useState("");
  const [errorMessage, setErrorMessage] = React.useState("");

  // Extractor popup state
  const [isExtractorOpen, setIsExtractorOpen] = React.useState(false);
  const [extractedDoc, setExtractedDoc] = React.useState<any>(null);

  // Load user's subjects from API
  React.useEffect(() => {
    if (!isOpen) return;

    const loadSubjects = async () => {
      try {
        const res = await fetch("/api/subjects");
        if (res.ok) {
          const { data } = await res.json();
          if (data) {
            setSubjects(data);
            if (!subjectId && data.length > 0) {
              setSubjectId(preselectedSubjectId || data[0].id);
            }
          }
        }
      } catch (err) {
        console.error("Failed to fetch subjects:", err);
      }
    };

    loadSubjects();
  }, [isOpen, preselectedSubjectId]);

  // Load units whenever subjectId changes
  React.useEffect(() => {
    if (!subjectId) {
      setUnits([]);
      setUnitId("");
      return;
    }

    const loadUnits = async () => {
      try {
        const res = await fetch(`/api/units?subject_id=${subjectId}`);
        if (res.ok) {
          const { data } = await res.json();
          if (data) {
            setUnits(data);
            if (preselectedUnitId && data.some((u: Unit) => u.id === preselectedUnitId)) {
              setUnitId(preselectedUnitId);
            } else {
              setUnitId("");
            }
          }
        }
      } catch (err) {
        console.error("Failed to fetch units:", err);
      }
    };

    loadUnits();
  }, [subjectId, preselectedUnitId]);

  const validateFile = (selectedFile: File): string | null => {
    const ext = selectedFile.name.split(".").pop()?.toLowerCase();
    if (!ext || !ALLOWED_EXTENSIONS.includes(ext)) {
      return `Unsupported file format (.${ext}). Allowed: ${ALLOWED_EXTENSIONS.join(", ")}`;
    }
    if (selectedFile.size > MAX_FILE_SIZE) {
      return `File exceeds maximum size of 25MB (${formatBytes(selectedFile.size)})`;
    }
    return null;
  };

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelected(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelected = (selectedFile: File) => {
    const error = validateFile(selectedFile);
    if (error) {
      setErrorMessage(error);
      setFile(null);
      return;
    }

    setErrorMessage("");
    setFile(selectedFile);
    if (!title) {
      const cleanTitle = selectedFile.name.replace(/\.[^/.]+$/, "");
      setTitle(cleanTitle);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setErrorMessage("Please choose a file to upload");
      return;
    }
    if (!title.trim()) {
      setErrorMessage("Document title is required");
      return;
    }

    try {
      setUploadStatus("uploading");
      setStatusMessage("Uploading file and processing metadata...");
      setErrorMessage("");

      const formData = new FormData();
      formData.append("file", file);
      formData.append("title", title.trim());
      if (subjectId) formData.append("subject_id", subjectId);
      if (unitId) formData.append("unit_id", unitId);

      const res = await fetch("/api/materials", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData?.error || "Failed to upload document.");
      }

      const resJson = await res.json();
      const uploadedDoc = resJson?.data;

      const currentSubject = subjects.find((s) => s.id === subjectId);
      const currentUnit = units.find((u) => u.id === unitId);

      setUploadStatus("success");
      setStatusMessage("Upload complete! Opening VTU Question & PYQ Extractor...");

      if (onUploadComplete) onUploadComplete();

      // Automatically launch the VTU Question Extractor popup
      setTimeout(() => {
        setExtractedDoc({
          id: uploadedDoc?.id,
          title: title.trim(),
          fileName: file.name,
          subjectName: currentSubject?.name,
          subjectCode: currentSubject?.code || undefined,
          unitTitle: currentUnit?.title,
          unitNumber: currentUnit?.unit_number,
          subjectId: subjectId || undefined,
          unitId: unitId || undefined,
        });
        setIsExtractorOpen(true);
        resetForm();
      }, 700);
    } catch (err: any) {
      setUploadStatus("error");
      setErrorMessage(err?.message || "Upload failed. Please try again.");
    }
  };

  const resetForm = () => {
    setFile(null);
    setTitle("");
    setUploadStatus("idle");
    setStatusMessage("");
    setErrorMessage("");
  };

  return (
    <>
      <Modal
        isOpen={isOpen && !isExtractorOpen}
        onClose={() => {
          resetForm();
          onClose();
        }}
        title="Upload Study Material"
        description="Upload lecture notes, previous papers, slides, or lab manuals."
        className="max-w-xl"
      >
        <form onSubmit={handleUpload} className="space-y-4 pt-2">
        {errorMessage && (
          <div className="flex items-center gap-2 rounded-lg bg-red-50 p-3 text-xs text-red-600 dark:bg-red-950/40 dark:text-red-400">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Drag and Drop Zone */}
        {!file ? (
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragOver(true);
            }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={handleFileDrop}
            className={`flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 text-center transition-colors ${
              isDragOver
                ? "border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/20"
                : "border-slate-300 bg-slate-50/50 hover:bg-slate-100/50 dark:border-slate-800 dark:bg-slate-900/30"
            }`}
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
              <Upload className="h-6 w-6" />
            </div>
            <p className="mt-3 text-sm font-semibold text-slate-800 dark:text-slate-200">
              Drag & drop your file here, or{" "}
              <label className="cursor-pointer text-indigo-600 hover:underline dark:text-indigo-400">
                browse
                <input
                  type="file"
                  className="hidden"
                  accept=".pdf,.ppt,.pptx,.doc,.docx,.txt,.png,.jpg,.jpeg"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleFileSelected(e.target.files[0]);
                    }
                  }}
                />
              </label>
            </p>
            <p className="mt-1 text-xs text-slate-400">
              PDF, PPT/PPTX, DOC/DOCX, TXT, or images up to 25MB
            </p>
          </div>
        ) : (
          <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600 text-white">
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 line-clamp-1">
                  {file.name}
                </p>
                <p className="text-xs text-slate-500">{formatBytes(file.size)}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setFile(null)}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200 hover:text-slate-600 dark:hover:bg-slate-800"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Title Input */}
        <Input
          id="material-title"
          label="Document Title"
          placeholder="e.g. Unit 2 Normalization Handout"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        {/* Subject & Unit Selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Select
            id="subject-select"
            label="Subject"
            value={subjectId}
            onChange={(e) => setSubjectId(e.target.value)}
          >
            <option value="">General / Unassigned</option>
            {subjects.map((sub) => (
              <option key={sub.id} value={sub.id}>
                {sub.name}
              </option>
            ))}
          </Select>

          <Select
            id="unit-select"
            label="Unit / Module"
            value={unitId}
            onChange={(e) => setUnitId(e.target.value)}
            disabled={!subjectId || units.length === 0}
          >
            <option value="">Whole Subject / Unassigned</option>
            {units.map((u) => (
              <option key={u.id} value={u.id}>
                Unit {u.unit_number}: {u.title}
              </option>
            ))}
          </Select>
        </div>

        {/* Status display */}
        {uploadStatus !== "idle" && (
          <div className="flex items-center gap-2 rounded-lg bg-indigo-50 p-3 text-xs text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300">
            {uploadStatus === "success" ? (
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            ) : (
              <Upload className="h-4 w-4 animate-bounce text-indigo-600" />
            )}
            <span>{statusMessage}</span>
          </div>
        )}

        <div className="flex items-center justify-end gap-2 pt-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              resetForm();
              onClose();
            }}
            disabled={uploadStatus === "uploading"}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            isLoading={uploadStatus === "uploading"}
            disabled={!file}
          >
            Upload Material
          </Button>
        </div>
      </form>
    </Modal>

    <VTUQuestionExtractorModal
      isOpen={isExtractorOpen}
      onClose={() => {
        setIsExtractorOpen(false);
        setExtractedDoc(null);
        onClose();
      }}
      documentData={extractedDoc}
    />
  </>
  );
}
