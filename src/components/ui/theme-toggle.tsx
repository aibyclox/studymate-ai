"use client";

import * as React from "react";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle({ className = "" }: { className?: string }) {
  const [isDark, setIsDark] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    const isCurrentlyDark = document.documentElement.classList.contains("dark");
    setIsDark(isCurrentlyDark);
  }, []);

  const toggleTheme = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);

    if (nextDark) {
      document.documentElement.classList.add("dark");
      try {
        localStorage.setItem("studymate_theme", "dark");
      } catch (e) {}
    } else {
      document.documentElement.classList.remove("dark");
      try {
        localStorage.setItem("studymate_theme", "light");
      } catch (e) {}
    }
  };

  if (!mounted) {
    return (
      <div className={`h-9 w-9 rounded-xl border border-slate-200 bg-white/50 p-2 dark:border-slate-800 dark:bg-slate-900/50 ${className}`} />
    );
  }

  return (
    <button
      onClick={toggleTheme}
      type="button"
      className={`group relative flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white/80 p-2 text-slate-700 shadow-xs transition-all hover:border-slate-300 hover:bg-slate-100 hover:text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 active:scale-95 dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-300 dark:hover:border-slate-700 dark:hover:bg-slate-800 dark:hover:text-white ${className}`}
      title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
      aria-label="Toggle theme"
    >
      {isDark ? (
        <Sun className="h-4 w-4 text-amber-400 transition-transform duration-300 group-hover:rotate-45" />
      ) : (
        <Moon className="h-4 w-4 text-indigo-600 transition-transform duration-300 group-hover:-rotate-12" />
      )}
    </button>
  );
}

