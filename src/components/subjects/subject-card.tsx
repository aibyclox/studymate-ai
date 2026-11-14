"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  FolderArchive,
  Layers,
  MoreVertical,
  Edit2,
  Trash2,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { Subject } from "@/types/database";
import { Card, CardContent } from "@/components/ui/card";

export interface SubjectCardProps {
  subject: Subject;
  onEdit?: (subject: Subject) => void;
  onDelete?: (subject: Subject) => void;
  onExtractQuestions?: (subject: Subject) => void;
}

export function SubjectCard({
  subject,
  onEdit,
  onDelete,
  onExtractQuestions,
}: SubjectCardProps) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = React.useState(false);

  const handleCardClick = () => {
    router.push(`/subjects/${subject.id}`);
  };

  return (
    <Card
      onClick={handleCardClick}
      className="group relative overflow-hidden transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 hover:border-indigo-300 dark:hover:border-indigo-800 cursor-pointer bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800"
    >
      {/* Top Color Accent Line */}
      <div
        className="h-1.5 w-full"
        style={{ backgroundColor: subject.color || "#4f46e5" }}
      />

      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div
              className="flex h-11 w-11 items-center justify-center rounded-xl text-white shadow-sm transition-transform group-hover:scale-105"
              style={{ backgroundColor: subject.color || "#4f46e5" }}
            >
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              {subject.code && (
                <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                  {subject.code}
                </span>
              )}
              <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors dark:text-slate-100 dark:group-hover:text-indigo-400 line-clamp-1">
                {subject.name}
              </h3>
            </div>
          </div>

          {/* Action Menu (if onEdit or onDelete provided) */}
          {(onEdit || onDelete) && (
            <div
              className="relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setMenuOpen(!menuOpen);
                }}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800"
              >
                <MoreVertical className="h-4 w-4" />
              </button>

              {menuOpen && (
                <div
                  className="absolute right-0 top-7 z-20 w-32 rounded-lg border border-slate-200 bg-white py-1 shadow-lg dark:border-slate-800 dark:bg-slate-900"
                  onMouseLeave={() => setMenuOpen(false)}
                >
                  {onEdit && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setMenuOpen(false);
                        onEdit(subject);
                      }}
                      className="flex w-full items-center gap-2 px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                      Edit
                    </button>
                  )}
                  {onDelete && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setMenuOpen(false);
                        onDelete(subject);
                      }}
                      className="flex w-full items-center gap-2 px-3 py-1.5 text-xs text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Delete
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {subject.description && (
          <p className="mt-3 text-xs text-slate-500 line-clamp-2 dark:text-slate-400">
            {subject.description}
          </p>
        )}

        {/* Footer: Units, Materials stats + Interactive VTU PYQs Button */}
        <div className="mt-5 flex items-center justify-between pt-4 border-t border-slate-100 text-xs text-slate-500 dark:border-slate-800/80 dark:text-slate-400">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5" title="Syllabus Units">
              <Layers className="h-3.5 w-3.5 text-slate-400" />
              <span className="font-medium text-slate-700 dark:text-slate-300">
                {subject.units_count ?? 0} Units
              </span>
            </div>
            <div className="flex items-center gap-1.5" title="Study Materials">
              <FolderArchive className="h-3.5 w-3.5 text-slate-400" />
              <span className="font-medium text-slate-700 dark:text-slate-300">
                {subject.documents_count ?? 0} Materials
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Quick VTU PYQs Button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (onExtractQuestions) {
                  onExtractQuestions(subject);
                } else {
                  router.push(`/subjects/${subject.id}`);
                }
              }}
              className="inline-flex items-center gap-1 rounded-md bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700 hover:bg-indigo-100 hover:text-indigo-800 border border-indigo-200/80 transition-all shadow-xs dark:bg-indigo-950/60 dark:text-indigo-300 dark:border-indigo-800"
              title="Generate & View VTU Important Questions & PYQs (2022 Scheme)"
            >
              <Sparkles className="h-3 w-3 text-indigo-600 dark:text-indigo-400" />
              <span>⚡ VTU PYQs</span>
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleCardClick();
              }}
              className="p-1 rounded-md text-slate-400 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Open Subject Details"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
