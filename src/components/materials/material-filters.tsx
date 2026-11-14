"use client";

import * as React from "react";
import { Search, LayoutGrid, List, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Subject } from "@/types/database";

export interface MaterialFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedSubjectId: string;
  onSubjectChange: (subjectId: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  viewMode: "grid" | "table";
  onViewModeChange: (mode: "grid" | "table") => void;
  subjects: Subject[];
}

export function MaterialFilters({
  searchQuery,
  onSearchChange,
  selectedSubjectId,
  onSubjectChange,
  selectedCategory,
  onCategoryChange,
  viewMode,
  onViewModeChange,
  subjects,
}: MaterialFiltersProps) {
  const categories = [
    { id: "all", label: "All Types" },
    { id: "pdf", label: "PDFs" },
    { id: "document", label: "Docs" },
    { id: "presentation", label: "Slides" },
    { id: "image", label: "Images" },
  ];

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex flex-col sm:flex-row items-center gap-3">
        {/* Search Field */}
        <div className="relative w-full sm:flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search materials by title or filename..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="flex h-9 w-full rounded-lg border border-slate-200 bg-slate-50/50 pl-9 pr-3 text-xs text-slate-900 placeholder:text-slate-400 focus-visible:border-indigo-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
          />
        </div>

        {/* Subject Filter */}
        <div className="w-full sm:w-48">
          <select
            value={selectedSubjectId}
            onChange={(e) => onSubjectChange(e.target.value)}
            className="flex h-9 w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3 text-xs text-slate-900 focus-visible:border-indigo-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
          >
            <option value="all">All Subjects</option>
            {subjects.map((sub) => (
              <option key={sub.id} value={sub.id}>
                {sub.name}
              </option>
            ))}
          </select>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-1 rounded-lg border border-slate-200 p-1 dark:border-slate-800 self-end sm:self-auto">
          <button
            onClick={() => onViewModeChange("grid")}
            className={`rounded p-1.5 transition-colors ${
              viewMode === "grid"
                ? "bg-slate-100 text-indigo-600 dark:bg-slate-800 dark:text-indigo-400"
                : "text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
            }`}
            title="Grid View"
          >
            <LayoutGrid className="h-4 w-4" />
          </button>
          <button
            onClick={() => onViewModeChange("table")}
            className={`rounded p-1.5 transition-colors ${
              viewMode === "table"
                ? "bg-slate-100 text-indigo-600 dark:bg-slate-800 dark:text-indigo-400"
                : "text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
            }`}
            title="Table View"
          >
            <List className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pt-1 text-xs">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onCategoryChange(cat.id)}
            className={`whitespace-nowrap rounded-lg px-2.5 py-1 text-xs font-medium transition-colors ${
              selectedCategory === cat.id
                ? "bg-indigo-600 text-white shadow-sm"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>
    </div>
  );
}

