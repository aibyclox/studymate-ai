"use client";

import * as React from "react";
import { GraduationCap, Upload, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InstallPwaButton } from "@/components/pwa/install-button";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export interface TopbarProps {
  userName?: string;
  currentSemester?: number;
  onUploadClick?: () => void;
}

export function Topbar({
  userName = "Student",
  currentSemester = 1,
  onUploadClick,
}: TopbarProps) {
  return (
    <header className="sticky top-0 z-20 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/80 px-4 sm:px-6 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/80">
      {/* Mobile Brand / Desktop Title */}
      <div className="flex items-center gap-3">
        <div className="flex md:hidden h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white">
          <GraduationCap className="h-4 w-4" />
        </div>
        <div>
          <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            Semester {currentSemester}
          </span>
          <span className="hidden sm:inline-block ml-2 text-xs text-slate-400">
            • Academic Session 2026–27
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        <InstallPwaButton variant="topbar" />

        {onUploadClick && (
          <Button
            size="sm"
            onClick={onUploadClick}
            className="flex items-center gap-2"
          >
            <Upload className="h-4 w-4" />
            <span className="hidden sm:inline">Upload Material</span>
          </Button>
        )}

        {/* Dark/Light Mode Toggle */}
        <ThemeToggle />

        {/* User Badge */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 font-semibold text-xs text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
            {userName.charAt(0).toUpperCase()}
          </div>
          <span className="hidden md:inline-block text-xs font-medium text-slate-700 dark:text-slate-300">
            {userName}
          </span>
        </div>
      </div>
    </header>
  );
}

