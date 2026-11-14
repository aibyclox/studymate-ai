import Link from "next/link";
import {
  GraduationCap,
  ArrowRight,
  BookOpen,
  FolderArchive,
  Layers,
  Sparkles,
  ShieldCheck,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 selection:bg-indigo-500 selection:text-white">
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/80 px-6 py-4 backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-950/80">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm shadow-indigo-300 dark:shadow-none">
              <GraduationCap className="h-5 w-5" />
            </div>
            <span className="text-lg font-bold tracking-tight">
              StudyMate<span className="text-indigo-600"> AI</span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link href="/login">
              <Button variant="ghost" size="sm">
                Sign In
              </Button>
            </Link>
            <Link href="/signup">
              <Button size="sm" className="gap-1.5">
                <span>Start Studying Free</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative px-6 pt-20 pb-24 sm:pt-28 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50/70 px-3.5 py-1 text-xs font-semibold text-indigo-700 dark:border-indigo-900/60 dark:bg-indigo-950/40 dark:text-indigo-300 mb-6">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Phase 1 Academic Workspace Active</span>
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl text-slate-900 dark:text-white leading-[1.15]">
            Your Notes. Your AI Tutor.{" "}
            <span className="bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 bg-clip-text text-transparent">
              Your Exam Strategy.
            </span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto">
            Upload your study materials, organize them by Semester, Subject, and Unit,
            and build the ultimate personal study repository for semester exam excellence.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/signup" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto gap-2 text-base px-7">
                <span>Start Studying Free</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/login" className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="w-full sm:w-auto text-base">
                Sign In to Workspace
              </Button>
            </Link>
          </div>

          {/* Feature Highlights Banner */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-1.5">
              <CheckCircle className="h-4 w-4 text-emerald-500" />
              <span>Multi-semester hierarchy</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle className="h-4 w-4 text-emerald-500" />
              <span>PDF, DOCX & PPTX storage</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle className="h-4 w-4 text-emerald-500" />
              <span>Encrypted user isolation</span>
            </div>
          </div>
        </div>

        {/* Dashboard Preview Graphic */}
        <div className="mt-16 mx-auto max-w-5xl rounded-2xl border border-slate-200 bg-white p-3 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
          <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-6 sm:p-8 dark:border-slate-800 dark:bg-slate-950/70">
            <div className="flex items-center justify-between pb-6 border-b border-slate-200 dark:border-slate-800">
              <div>
                <span className="text-xs uppercase font-bold tracking-wider text-indigo-600 dark:text-indigo-400">
                  Academic Overview
                </span>
                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-1">
                  Semester 5 Workspace
                </h3>
              </div>
              <div className="flex gap-2">
                <div className="h-3 w-3 rounded-full bg-slate-300 dark:bg-slate-700" />
                <div className="h-3 w-3 rounded-full bg-slate-300 dark:bg-slate-700" />
                <div className="h-3 w-3 rounded-full bg-indigo-500" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
              <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <BookOpen className="h-5 w-5 text-indigo-600 mb-2" />
                <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">5</div>
                <div className="text-xs text-slate-500">Enrolled Subjects</div>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <Layers className="h-5 w-5 text-indigo-600 mb-2" />
                <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">25</div>
                <div className="text-xs text-slate-500">Syllabus Units</div>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <FolderArchive className="h-5 w-5 text-indigo-600 mb-2" />
                <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">100%</div>
                <div className="text-xs text-slate-500">Secure Storage with RLS</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3-Step Flow Section */}
      <section className="border-t border-slate-200 bg-white py-20 px-6 lg:px-8 dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto max-w-6xl">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
              Built for How Students Actually Study
            </h2>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              No more searching through cluttered WhatsApp groups, random Google Drive links, or loose PDF handouts.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="rounded-xl border border-slate-200 p-6 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-950/50">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600 text-white font-bold text-sm mb-4">
                1
              </div>
              <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                1. Upload Everything
              </h3>
              <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Drag and drop PDF notes, slides, previous-year question papers, lab manuals, and handwritten photo notes up to 25MB.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 p-6 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-950/50">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600 text-white font-bold text-sm mb-4">
                2
              </div>
              <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                2. Structure by Syllabus
              </h3>
              <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Automatically organize materials in an intuitive academic tree: Semester → Subject → Unit → Document.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 p-6 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-950/50">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600 text-white font-bold text-sm mb-4">
                3
              </div>
              <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                3. Prepare Confidently
              </h3>
              <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Retrieve materials instantly with real-time search, filters, and clean preview before exam day.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 py-8 px-6 text-center text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400">
        <p>© 2026 StudyMate AI. Built for college & university students.</p>
      </footer>
    </div>
  );
}

