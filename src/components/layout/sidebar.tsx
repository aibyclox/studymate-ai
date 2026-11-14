"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  FolderArchive,
  User,
  GraduationCap,
  Sparkles,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { InstallPwaButton } from "@/components/pwa/install-button";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Subjects", href: "/subjects", icon: BookOpen },
  { name: "Materials", href: "/materials", icon: FolderArchive },
  { name: "Profile", href: "/profile", icon: User },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
      router.refresh();
    } catch (err) {
      router.push("/login");
    }
  };

  return (
    <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 z-30 border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
      {/* Brand Header */}
      <div className="flex h-16 items-center gap-3 px-6 border-b border-slate-100 dark:border-slate-900">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-sm shadow-indigo-200 dark:shadow-none">
          <GraduationCap className="h-5 w-5" />
        </div>
        <div>
          <span className="font-bold tracking-tight text-slate-900 dark:text-slate-100">
            StudyMate<span className="text-indigo-600"> AI</span>
          </span>
          <span className="block text-[10px] uppercase font-semibold tracking-wider text-slate-400">
            Phase 1 Foundation
          </span>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex flex-1 flex-col justify-between p-4">
        <nav className="space-y-1">
          {navigation.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(item.href));
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-indigo-50 text-indigo-700 font-semibold dark:bg-indigo-950/60 dark:text-indigo-300"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-slate-200"
                )}
              >
                <Icon
                  className={cn(
                    "h-4 w-4",
                    isActive ? "text-indigo-600 dark:text-indigo-400" : "text-slate-400"
                  )}
                />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Phase Info & Sign Out */}
        <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-900">
          <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-900/50">
            <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Workspace Ready</span>
            </div>
            <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              Materials, Subjects, & Profile are fully active.
            </p>
          </div>

          <InstallPwaButton variant="sidebar" />

          <button
            onClick={handleSignOut}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-red-50 hover:text-red-600 transition-colors dark:text-slate-400 dark:hover:bg-red-950/30 dark:hover:text-red-400"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>
      </div>
    </aside>
  );
}
