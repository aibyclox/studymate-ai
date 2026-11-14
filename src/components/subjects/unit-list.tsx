"use client";

import * as React from "react";
import { Unit, DocumentItem } from "@/types/database";
import { Layers, FileText, Upload, MoreVertical, Edit2, Trash2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatBytes, formatDate } from "@/lib/utils";

export interface UnitListProps {
  units: Unit[];
  documents: DocumentItem[];
  onAddUnit: () => void;
  onEditUnit: (unit: Unit) => void;
  onDeleteUnit: (unit: Unit) => void;
  onUploadForUnit: (unitId: string) => void;
  onExtractQuestions?: (doc: DocumentItem, unit: Unit) => void;
}

export function UnitList({
  units,
  documents,
  onAddUnit,
  onEditUnit,
  onDeleteUnit,
  onUploadForUnit,
  onExtractQuestions,
}: UnitListProps) {
  const [activeMenuUnitId, setActiveMenuUnitId] = React.useState<string | null>(null);

  if (units.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center dark:border-slate-800">
        <Layers className="mx-auto h-8 w-8 text-slate-400" />
        <h4 className="mt-3 text-sm font-semibold text-slate-900 dark:text-slate-100">
          No units created yet
        </h4>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          Break down your syllabus into units to organize notes and question papers.
        </p>
        <div className="mt-4">
          <Button size="sm" onClick={onAddUnit}>
            Add First Unit
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {units.map((unit) => {
        const unitDocs = documents.filter((d) => d.unit_id === unit.id);

        return (
          <div
            key={unit.id}
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900"
          >
            {/* Unit Header */}
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="flex h-6 items-center justify-center rounded-md bg-indigo-50 px-2 text-xs font-bold text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300">
                    Unit {unit.unit_number}
                  </span>
                  <h4 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                    {unit.title}
                  </h4>
                </div>
                {unit.description && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                    {unit.description}
                  </p>
                )}
              </div>

              {/* Unit Controls */}
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onUploadForUnit(unit.id)}
                  className="h-8 gap-1.5 text-xs"
                >
                  <Upload className="h-3.5 w-3.5" />
                  Upload Note
                </Button>

                <div className="relative">
                  <button
                    onClick={() =>
                      setActiveMenuUnitId(
                        activeMenuUnitId === unit.id ? null : unit.id
                      )
                    }
                    className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </button>

                  {activeMenuUnitId === unit.id && (
                    <div
                      className="absolute right-0 top-8 z-20 w-32 rounded-lg border border-slate-200 bg-white py-1 shadow-lg dark:border-slate-800 dark:bg-slate-900"
                      onMouseLeave={() => setActiveMenuUnitId(null)}
                    >
                      <button
                        onClick={() => {
                          setActiveMenuUnitId(null);
                          onEditUnit(unit);
                        }}
                        className="flex w-full items-center gap-2 px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                        Edit Unit
                      </button>
                      <button
                        onClick={() => {
                          setActiveMenuUnitId(null);
                          onDeleteUnit(unit);
                        }}
                        className="flex w-full items-center gap-2 px-3 py-1.5 text-xs text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Delete Unit
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Materials in this Unit */}
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80">
              {unitDocs.length === 0 ? (
                <p className="text-xs italic text-slate-400">
                  No materials uploaded to this unit yet.
                </p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {unitDocs.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50/70 px-3 py-2 text-xs transition-colors hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-950/50 dark:hover:bg-slate-900"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <FileText className="h-3.5 w-3.5 text-indigo-500 shrink-0" />
                        <span className="font-medium text-slate-700 dark:text-slate-300 truncate">
                          {doc.title || doc.file_name}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0 ml-2">
                        {onExtractQuestions && (
                          <button
                            type="button"
                            onClick={() => onExtractQuestions(doc, unit)}
                            className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-semibold text-purple-600 bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/50 dark:text-purple-400 transition-colors"
                            title="View VTU PYQs & Important Questions"
                          >
                            <Sparkles className="h-3 w-3" />
                            <span>VTU PYQs</span>
                          </button>
                        )}
                        <span className="text-[10px] text-slate-400">
                          {formatBytes(doc.file_size)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

