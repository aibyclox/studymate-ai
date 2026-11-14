"use client";

import * as React from "react";
import { Sidebar } from "./sidebar";
import { BottomNav } from "./bottom-nav";
import { Topbar } from "./topbar";
import { UploadModal } from "@/components/materials/upload-modal";

export interface AppShellProps {
  children: React.ReactNode;
  userName?: string;
  currentSemester?: number;
}

export function AppShell({
  children,
  userName = "Student",
  currentSemester = 1,
}: AppShellProps) {
  const [isUploadOpen, setIsUploadOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-900 antialiased dark:bg-slate-950 dark:text-slate-100">
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex flex-col md:pl-64">
        <Topbar
          userName={userName}
          currentSemester={currentSemester}
          onUploadClick={() => setIsUploadOpen(true)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-24 md:pb-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>

      {/* Mobile Navigation */}
      <BottomNav />

      {/* Global Upload Modal */}
      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onUploadComplete={() => {
          setIsUploadOpen(false);
          // Trigger page reload or router refresh
          window.location.reload();
        }}
      />
    </div>
  );
}

