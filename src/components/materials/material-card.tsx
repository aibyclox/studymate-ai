"use client";

import * as React from "react";
import { DocumentItem } from "@/types/database";
import {
  FileText,
  FileSpreadsheet,
  Image as ImageIcon,
  File,
  Download,
  Trash2,
  MoreVertical,
  Sparkles,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatBytes, getFileCategory } from "@/lib/utils";

export interface MaterialCardProps {
  material: DocumentItem;
  onDelete?: (material: DocumentItem) => void;
  onExtractQuestions?: (material: DocumentItem) => void;
}

export function MaterialCard({ material, onDelete, onExtractQuestions }: MaterialCardProps) {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const category = getFileCategory(material.file_name, material.file_type);

  const getIcon = () => {
    switch (category) {
      case "pdf":
        return <FileText className="h-6 w-6 text-red-500" />;
      case "presentation":
        return <FileSpreadsheet className="h-6 w-6 text-amber-500" />;
      case "document":
        return <FileText className="h-6 w-6 text-blue-500" />;
      case "image":
        return <ImageIcon className="h-6 w-6 text-emerald-500" />;
      default:
        return <File className="h-6 w-6 text-slate-500" />;
    }
  };

  const handleDownload = () => {
    window.open(`/api/materials/${material.id}/download`, "_blank");
  };

  return (
    <Card className="group relative flex flex-col justify-between overflow-hidden transition-all duration-200 hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700">
      <CardContent className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Header row: Icon & Actions */}
          <div className="flex items-start justify-between">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-50 border border-slate-100 dark:border-slate-800 dark:bg-slate-900">
              {getIcon()}
            </div>

            <div className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800"
              >
                <MoreVertical className="h-4 w-4" />
              </button>

              {menuOpen && (
                <div
                  className="absolute right-0 top-7 z-20 w-32 rounded-lg border border-slate-200 bg-white py-1 shadow-lg dark:border-slate-800 dark:bg-slate-900"
                  onMouseLeave={() => setMenuOpen(false)}
                >
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      handleDownload();
                    }}
                    className="flex w-full items-center gap-2 px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"
                  >
                    <Download className="h-3.5 w-3.5" />
                    Download
                  </button>
                  {onDelete && (
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        onDelete(material);
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
          </div>

          {/* Title & Metadata */}
          <div className="mt-3.5">
            <h4
              title={material.title}
              className="text-sm font-semibold text-slate-900 dark:text-slate-100 line-clamp-1 group-hover:text-indigo-600 transition-colors"
            >
              {material.title}
            </h4>
            <p className="mt-0.5 text-xs text-slate-400 truncate">
              {material.file_name}
            </p>
          </div>

          {/* Tags */}
          <div className="mt-3 flex flex-wrap gap-1.5">
            {material.subject_name && (
              <Badge
                variant="secondary"
                className="text-[10px]"
                style={{
                  borderLeftColor: material.subject_color || "#4f46e5",
                  borderLeftWidth: "3px",
                }}
              >
                {material.subject_name}
              </Badge>
            )}
            {material.unit_number && (
              <Badge variant="default" className="text-[10px]">
                Unit {material.unit_number}
              </Badge>
            )}
          </div>
        </div>

        {/* Footer info, Extraction Trigger & Download */}
        <div className="mt-5 flex items-center justify-between pt-3 border-t border-slate-100 text-[11px] text-slate-400 dark:border-slate-800/80">
          <span>{formatBytes(material.file_size)}</span>

          <div className="flex items-center gap-2.5">
            {onExtractQuestions && (
              <button
                onClick={() => onExtractQuestions(material)}
                className="flex items-center gap-1 font-semibold text-purple-600 hover:text-purple-700 dark:text-purple-400 transition-colors"
                title="Extract VTU Important Questions & PYQs"
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>VTU PYQs</span>
              </button>
            )}

            <button
              onClick={handleDownload}
              className="flex items-center gap-1 font-medium text-slate-600 hover:text-indigo-600 dark:text-slate-300 dark:hover:text-indigo-400 transition-colors"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Download</span>
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
