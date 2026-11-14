"use client";

import * as React from "react";
import { GraduationCap, Sparkles } from "lucide-react";

export function WelcomeSplash() {
  const [isVisible, setIsVisible] = React.useState(true);
  const [isFading, setIsFading] = React.useState(false);
  const [phase, setPhase] = React.useState(0);

  React.useEffect(() => {
    // Sequence of animations on app / website launch
    const t1 = setTimeout(() => setPhase(1), 100); // Icon bounce & glow
    const t2 = setTimeout(() => setPhase(2), 350); // Text slide up
    const t3 = setTimeout(() => setPhase(3), 650); // Subtitle & status badge
    const t4 = setTimeout(() => {
      setIsFading(true);
    }, 1900); // Start fade-out after ~1.9s
    const t5 = setTimeout(() => {
      setIsVisible(false);
    }, 2500); // Remove from DOM

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div
      onClick={() => {
        setIsFading(true);
        setTimeout(() => setIsVisible(false), 500);
      }}
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950 text-white transition-all duration-700 select-none cursor-pointer overflow-hidden ${
        isFading ? "opacity-0 scale-105 pointer-events-none" : "opacity-100 scale-100"
      }`}
      style={{
        backgroundImage:
          "radial-gradient(circle at 50% 40%, rgba(99, 102, 241, 0.18) 0%, rgba(15, 23, 42, 0.95) 70%, #030712 100%)",
      }}
    >
      {/* Ambient background particles/glows */}
      <div className="absolute -top-32 -left-32 w-80 h-80 rounded-full bg-indigo-600/20 blur-[100px] pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-80 h-80 rounded-full bg-purple-600/20 blur-[100px] pointer-events-none" />

      {/* Main Content Container */}
      <div className="relative flex flex-col items-center px-6 text-center max-w-sm">
        
        {/* Animated App Icon with glowing pulse halo */}
        <div
          className={`relative mb-6 transition-all duration-700 ease-out ${
            phase >= 1
              ? "opacity-100 scale-100 translate-y-0"
              : "opacity-0 scale-75 translate-y-4"
          }`}
        >
          {/* Pulsing ring */}
          <div className="absolute -inset-3 rounded-3xl bg-gradient-to-tr from-indigo-500/30 to-purple-500/30 blur-md animate-splash-glow" />
          
          <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-600 text-white shadow-2xl shadow-indigo-500/50 ring-2 ring-indigo-400/40 animate-subtle-float">
            <GraduationCap className="h-10 w-10 text-white drop-shadow-md" />
            <Sparkles className="absolute -top-1.5 -right-1.5 h-5 w-5 text-amber-300 animate-pulse" />
          </div>
        </div>

        {/* Brand Name Animation */}
        <div
          className={`transition-all duration-700 ease-out ${
            phase >= 2
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-4"
          }`}
        >
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white flex items-center justify-center gap-1.5">
            <span>StudyMate</span>
            <span className="animate-text-shimmer font-black text-transparent bg-clip-text">
              AI
            </span>
          </h1>
        </div>

        {/* Tagline / Subtitle */}
        <div
          className={`mt-2.5 transition-all duration-700 ease-out ${
            phase >= 3
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-3"
          }`}
        >
          <div className="inline-flex items-center gap-1.5 rounded-full border border-indigo-500/30 bg-indigo-950/60 px-3 py-1 text-[11px] font-medium text-indigo-300 tracking-wide backdrop-blur-xs">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
            <span>VTU Academic & Exam Assistant</span>
          </div>

          <p className="mt-3 text-xs text-slate-400 font-light tracking-wide max-w-xs">
            Personalized syllabus units, important questions & AI tutoring
          </p>
        </div>

        {/* Sleek Progress / Loading Indicator */}
        <div className="mt-8 w-36 h-1 bg-slate-800 rounded-full overflow-hidden">
          <div
            className={`h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-1500 ease-out ${
              phase >= 2 ? "w-full" : "w-0"
            }`}
          />
        </div>

        <p className="mt-4 text-[10px] text-slate-500 font-mono tracking-widest uppercase">
          Initializing Workspace...
        </p>
      </div>
    </div>
  );
}

