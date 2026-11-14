"use client";

import * as React from "react";
import { DocumentItem } from "@/types/database";
import { FileText, Download, Trash2, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatBytes, formatDate } from "@/lib/utils";

export interface MaterialTableProps {
  materials: DocumentItem[];
  onDelete?: (material: DocumentItem) => void;
  onExtractQuestions?: (material: DocumentItem) => void;
}

export function MaterialTable({ materials, onDelete, onExtractQuestions }: MaterialTableProps) {
  const handleDownload = (material: DocumentItem) => {
    window.open(`/api/materials/${material.id}/download`, "_blank");
  };

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
      <table className="w-full text-left text-xs">
        <thead className="border-b border-slate-200 bg-slate-50/75 text-slate-500 uppercase tracking-wider font-semibold dark:border-slate-800 dark:bg-slate-950/50 dark:text-slate-400">
          <tr>
            <th className="px-4 py-3">Document Title</th>
            <th className="px-4 py-3">Subject</th>
            <th className="px-4 py-3">Unit</th>
            <th className="px-4 py-3">Size</th>
            <th className="px-4 py-3">Uploaded</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
          {materials.map((m) => (
            <tr
              key={m.id}
              className="hover:bg-slate-50/75 transition-colors dark:hover:bg-slate-800/40"
            >
              <td className="px-4 py-3">
                <div className="flex items-center gap-2.5">
                  <FileText className="h-4 w-4 text-indigo-500 shrink-0" />
                  <div>
                    <span className="font-semibold text-slate-900 dark:text-slate-100 block">
                      {m.title}
                    </span>
                    <span className="text-[10px] text-slate-400">{m.file_name}</span>
                  </div>
                </div>
              </td>
              <td className="px-4 py-3">
                {m.subject_name ? (
                  <Badge variant="secondary" className="text-[10px]">
                    {m.subject_name}
                  </Badge>
                ) : (
                  <span className="text-slate-400">—</span>
                )}
              </td>
              <td className="px-4 py-3">
                {m.unit_number ? (
                  <Badge variant="default" className="text-[10px]">
                    Unit {m.unit_number}
                  </Badge>
                ) : (
                  <span className="text-slate-400">—</span>
                )}
              </td>
              <td className="px-4 py-3 text-slate-500 dark:text-slate-400">
                {formatBytes(m.file_size)}
              </td>
              <td className="px-4 py-3 text-slate-500 dark:text-slate-400">
                {formatDate(m.created_at)}
              </td>
              <td className="px-4 py-3 text-right">
                <div className="flex items-center justify-end gap-2">
                  {onExtractQuestions && (
                    <button
                      onClick={() => onExtractQuestions(m)}
                      className="inline-flex items-center gap-1 rounded px-2 py-0.5 text-[11px] font-semibold text-purple-600 bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/40 dark:text-purple-400 dark:hover:bg-purple-900/50 transition-colors"
                      title="Extract VTU Important Questions & PYQs"
                    >
                      <Sparkles className="h-3 w-3" />
                      <span>VTU PYQs</span>
                    </button>
                  )}
                  <button
                    onClick={() => handleDownload(m)}
                    className="rounded p-1 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                    title="Download File"
                  >
                    <Download className="h-4 w-4" />
                  </button>
                  {onDelete && (
                    <button
                      onClick={() => onDelete(m)}
                      className="rounded p-1 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
                      title="Delete File"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
