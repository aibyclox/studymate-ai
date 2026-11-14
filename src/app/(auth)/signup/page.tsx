import { SignupForm } from "@/components/auth/signup-form";
import { GraduationCap } from "lucide-react";
import Link from "next/link";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export default function SignupPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-6 bg-slate-50 dark:bg-slate-950 relative">
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>
      <div className="w-full max-w-md">
        {/* Brand */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-300 dark:shadow-none">
              <GraduationCap className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              StudyMate<span className="text-indigo-600"> AI</span>
            </span>
          </Link>
          <h1 className="mt-4 text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Create your student account
          </h1>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Start organizing your semester notes and prepare for exams.
          </p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xl dark:border-slate-800 dark:bg-slate-900">
          <SignupForm />
        </div>
      </div>
    </div>
  );
}

