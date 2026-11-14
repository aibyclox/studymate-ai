"use client";

import * as React from "react";
import Link from "next/link";
import {
  BookOpen,
  FolderArchive,
  Layers,
  GraduationCap,
  Plus,
  Upload,
  ArrowRight,
  FileText,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { SubjectCard } from "@/components/subjects/subject-card";
import { SubjectModal } from "@/components/subjects/subject-modal";
import { UploadModal } from "@/components/materials/upload-modal";
import { VTUQuestionExtractorModal } from "@/components/materials/vtu-question-extractor-modal";
import { Subject, DocumentItem, Profile } from "@/types/database";
import { formatBytes, formatTimeAgo } from "@/lib/utils";
import { InstallPwaButton } from "@/components/pwa/install-button";

export default function DashboardPage() {
  const [profile, setProfile] = React.useState<Profile | null>(null);
  const [subjects, setSubjects] = React.useState<Subject[]>([]);
  const [recentDocuments, setRecentDocuments] = React.useState<DocumentItem[]>([]);
  const [totalUnitsCount, setTotalUnitsCount] = React.useState(0);
  const [isLoading, setIsLoading] = React.useState(true);

  // Modals
  const [isSubjectModalOpen, setIsSubjectModalOpen] = React.useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = React.useState(false);
  const [selectedSubjectForQuestions, setSelectedSubjectForQuestions] = React.useState<Subject | null>(null);

  const loadDashboardData = React.useCallback(async () => {
    try {
      setIsLoading(true);

      // 1. Fetch Profile
      const profileRes = await fetch("/api/profile");
      if (profileRes.ok) {
        const { data } = await profileRes.json();
        if (data) setProfile(data);
      }

      // 2. Fetch Subjects (enriched with units_count and documents_count)
      const subjectsRes = await fetch("/api/subjects");
      if (subjectsRes.ok) {
        const { data } = await subjectsRes.json();
        if (data) {
          setSubjects(data);
          const totalUnits = data.reduce(
            (acc: number, s: Subject) => acc + (s.units_count || 0),
            0
          );
          setTotalUnitsCount(totalUnits);
        }
      }

      // 3. Fetch Materials
      const materialsRes = await fetch("/api/materials");
      if (materialsRes.ok) {
        const { data } = await materialsRes.json();
        if (data) {
          setRecentDocuments(data.slice(0, 5));
        }
      }
    } catch (err) {
      console.error("Failed to load dashboard data:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  const handleCreateSubject = async (data: {
    name: string;
    code?: string;
    description?: string;
    color: string;
  }) => {
    const res = await fetch("/api/subjects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err?.error || "Failed to create subject");
    }
    await loadDashboardData();
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const displayName = profile?.full_name || "Student";
  const currentSemester = profile?.current_semester || 5;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-24 w-full rounded-xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="h-64 lg:col-span-2 rounded-xl" />
          <Skeleton className="h-64 rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            {getGreeting()}, {displayName} 👋
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {profile?.college
              ? `${profile.college} • ${profile.course || ""} ${profile.branch ? `(${profile.branch})` : ""}`
              : "Welcome to your personal StudyMate AI workspace."}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsSubjectModalOpen(true)}
            className="gap-1.5"
          >
            <Plus className="h-4 w-4" />
            <span>Add Subject</span>
          </Button>
          <Button
            size="sm"
            onClick={() => setIsUploadModalOpen(true)}
            className="gap-1.5"
          >
            <Upload className="h-4 w-4" />
            <span>Upload Material</span>
          </Button>
        </div>
      </div>

      {/* PWA Install Banner */}
      <InstallPwaButton variant="banner" />

      {/* Aggregate Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 flex items-center gap-3.5">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
            <GraduationCap className="h-6 w-6" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-medium">Semester</div>
            <div className="text-xl font-bold text-slate-900 dark:text-slate-100">
              Semester {currentSemester}
            </div>
          </div>
        </Card>

        <Card className="p-4 flex items-center gap-3.5">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-950/60 dark:text-purple-400">
            <BookOpen className="h-6 w-6" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-medium">Subjects</div>
            <div className="text-xl font-bold text-slate-900 dark:text-slate-100">
              {subjects.length}
            </div>
          </div>
        </Card>

        <Card className="p-4 flex items-center gap-3.5">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
            <Layers className="h-6 w-6" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-medium">Syllabus Units</div>
            <div className="text-xl font-bold text-slate-900 dark:text-slate-100">
              {totalUnitsCount}
            </div>
          </div>
        </Card>

        <Card className="p-4 flex items-center gap-3.5">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
            <FolderArchive className="h-6 w-6" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-medium">Study Files</div>
            <div className="text-xl font-bold text-slate-900 dark:text-slate-100">
              {recentDocuments.length > 0
                ? subjects.reduce((acc, s) => acc + (s.documents_count || 0), 0)
                : 0}
            </div>
          </div>
        </Card>
      </div>

      {/* Main Grid: Subjects Overview & Recent Materials */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Subjects Grid (2 Cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-indigo-600" />
              <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                Current Semester Subjects
              </h2>
            </div>
            <Link
              href="/subjects"
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 flex items-center gap-1"
            >
              <span>View all</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {subjects.length === 0 ? (
            <EmptyState
              icon={BookOpen}
              title="No subjects created yet"
              description="Create your first subject to start organizing syllabus modules, lecture notes, and papers."
              actionLabel="Add Subject"
              onAction={() => setIsSubjectModalOpen(true)}
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {subjects.slice(0, 4).map((sub) => (
                <SubjectCard
                  key={sub.id}
                  subject={sub}
                  onExtractQuestions={(s) => setSelectedSubjectForQuestions(s)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Recent Materials (1 Col) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FolderArchive className="h-4 w-4 text-indigo-600" />
              <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                Recent Materials
              </h2>
            </div>
            <Link
              href="/materials"
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 flex items-center gap-1"
            >
              <span>View library</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {recentDocuments.length === 0 ? (
            <EmptyState
              icon={Upload}
              title="No materials uploaded"
              description="Upload PDF notes, slides, or question papers to build your study library."
              actionLabel="Upload Material"
              onAction={() => setIsUploadModalOpen(true)}
            />
          ) : (
            <div className="rounded-xl border border-slate-200 bg-white divide-y divide-slate-100 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:divide-slate-800">
              {recentDocuments.map((doc) => (
                <div
                  key={doc.id}
                  className="p-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors dark:hover:bg-slate-800/50"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 shrink-0 dark:bg-indigo-950/60 dark:text-indigo-400">
                      <FileText className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                        {doc.title}
                      </p>
                      <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                        <span>{formatBytes(doc.file_size)}</span>
                        <span>•</span>
                        <span className="flex items-center gap-0.5">
                          <Clock className="h-2.5 w-2.5" />
                          {formatTimeAgo(doc.created_at)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <Link href="/materials">
                    <Button variant="ghost" size="sm" className="h-7 text-xs px-2">
                      Open
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <SubjectModal
        isOpen={isSubjectModalOpen}
        onClose={() => setIsSubjectModalOpen(false)}
        onSave={handleCreateSubject}
      />

      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUploadComplete={loadDashboardData}
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
