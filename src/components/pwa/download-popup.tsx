"use client";

import * as React from "react";
import {
  Download,
  Smartphone,
  Share,
  PlusSquare,
  CheckCircle2,
  X,
  Sparkles,
  Zap,
  BookOpen,
  Monitor,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

export function DownloadPopup() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [deferredPrompt, setDeferredPrompt] = React.useState<BeforeInstallPromptEvent | null>(null);
  const [isStandalone, setIsStandalone] = React.useState(false);
  const [isIos, setIsIos] = React.useState(false);
  const [isAndroid, setIsAndroid] = React.useState(false);
  const [installedSuccess, setInstalledSuccess] = React.useState(false);
  const [showIosGuide, setShowIosGuide] = React.useState(false);

  React.useEffect(() => {
    // Check if running in standalone mode (already installed)
    const standaloneMode =
      window.matchMedia("(display-mode: standalone)").matches ||
      (navigator as any).standalone === true;

    if (standaloneMode) {
      setIsStandalone(true);
      return;
    }

    // Detect platform
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isApple = /iphone|ipad|ipod/.test(userAgent);
    const isAndroidDevice = /android/.test(userAgent);
    setIsIos(isApple);
    setIsAndroid(isAndroidDevice);

    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setDeferredPrompt(null);
      setIsStandalone(true);
      setInstalledSuccess(true);
      setTimeout(() => {
        setIsOpen(false);
      }, 2000);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);
    window.addEventListener("appinstalled", handleAppInstalled);

    // Custom event to allow any button to open this popup
    const handleOpenTrigger = () => {
      setIsOpen(true);
    };
    window.addEventListener("open-studymate-download", handleOpenTrigger);

    // Check if dismissed in this session
    const hasDismissed = sessionStorage.getItem("studymate_download_dismissed");
    if (!hasDismissed && !standaloneMode) {
      // Auto-trigger the download popup after 1.5 seconds!
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 1500);
      return () => clearTimeout(timer);
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
      window.removeEventListener("appinstalled", handleAppInstalled);
      window.removeEventListener("open-studymate-download", handleOpenTrigger);
    };
  }, []);

  const handleDismiss = () => {
    sessionStorage.setItem("studymate_download_dismissed", "true");
    setIsOpen(false);
  };

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      try {
        await deferredPrompt.prompt();
        const choice = await deferredPrompt.userChoice;
        if (choice.outcome === "accepted") {
          setInstalledSuccess(true);
          setDeferredPrompt(null);
          setTimeout(() => setIsOpen(false), 2500);
        }
      } catch (err) {
        console.error("Installation prompt error:", err);
      }
    } else if (isIos) {
      setShowIosGuide(true);
    } else {
      // Browser didn't provide beforeinstallprompt
      setShowIosGuide(false);
    }
  };

  if (isStandalone || !isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 animate-in zoom-in-95 duration-200">
        
        {/* Decorative Top Accent Banner */}
        <div className="h-3 w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

        {/* Close Button */}
        <button
          onClick={handleDismiss}
          className="absolute right-4 top-5 rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="p-6 sm:p-8">
          {/* Header with App Logo */}
          <div className="flex items-center gap-4 mb-5">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-500 text-white shadow-lg shadow-indigo-300 dark:shadow-none ring-4 ring-indigo-50 dark:ring-indigo-950/50">
              <Smartphone className="h-7 w-7" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-2.5 py-0.5 text-[11px] font-bold text-indigo-700 dark:bg-indigo-950/70 dark:text-indigo-300 mb-1">
                <Sparkles className="h-3 w-3" />
                <span>PWA Native App</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                Download StudyMate AI
              </h2>
            </div>
          </div>

          {installedSuccess ? (
            <div className="rounded-2xl bg-emerald-50 p-6 text-center dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 my-4">
              <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-600 dark:text-emerald-400 mb-2 animate-bounce" />
              <h3 className="text-lg font-bold text-emerald-800 dark:text-emerald-200">
                App Installed Successfully!
              </h3>
              <p className="text-xs text-emerald-600 dark:text-emerald-300 mt-1">
                StudyMate AI is now installed on your device. You can open it anytime from your home screen or desktop!
              </p>
            </div>
          ) : showIosGuide ? (
            /* iOS Safari Step-by-Step Instructions */
            <div className="space-y-4 my-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                How to install on iPhone & iPad (Safari):
              </p>

              <div className="space-y-2.5 text-xs text-slate-700 dark:text-slate-300">
                <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-800/50">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-600 font-bold text-white">
                    1
                  </span>
                  <div>
                    <span className="font-semibold text-slate-900 dark:text-slate-100">Tap the Share Icon</span>
                    <p className="text-slate-500 mt-0.5 flex items-center gap-1">
                      Tap <Share className="inline h-3.5 w-3.5 text-indigo-600" /> located at the bottom of Safari.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-800/50">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-600 font-bold text-white">
                    2
                  </span>
                  <div>
                    <span className="font-semibold text-slate-900 dark:text-slate-100">Tap &quot;Add to Home Screen&quot;</span>
                    <p className="text-slate-500 mt-0.5 flex items-center gap-1">
                      Scroll down and tap <PlusSquare className="inline h-3.5 w-3.5 text-indigo-600" />
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-800/50">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-600 font-bold text-white">
                    3
                  </span>
                  <div>
                    <span className="font-semibold text-slate-900 dark:text-slate-100">Tap &quot;Add&quot;</span>
                    <p className="text-slate-500 mt-0.5">
                      Confirm in the top-right corner to place StudyMate on your home screen!
                    </p>
                  </div>
                </div>
              </div>

              <Button
                onClick={() => setShowIosGuide(false)}
                variant="outline"
                className="w-full mt-3 text-xs"
              >
                Back to Details
              </Button>
            </div>
          ) : (
            <>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Install StudyMate AI directly on your device. Enjoy a lightning-fast native experience without browser toolbars.
              </p>

              {/* Feature Highlights */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 my-5">
                <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-800/40">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 mb-2">
                    <Zap className="h-4 w-4" />
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">Instant Launch</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    One tap from home screen or dock
                  </p>
                </div>

                <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-800/40">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 mb-2">
                    <BookOpen className="h-4 w-4" />
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">VTU Questions</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Offline syllabus units & PYQs
                  </p>
                </div>

                <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-800/40">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 mb-2">
                    <Monitor className="h-4 w-4" />
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">Full-Screen</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    No URL bars or distractions
                  </p>
                </div>
              </div>

              {/* Platform Note */}
              <div className="text-xs text-slate-500 dark:text-slate-400 mb-5 flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>
                  {isIos
                    ? "Compatible with iOS Safari (iPhone / iPad)"
                    : isAndroid
                    ? "Compatible with Android Chrome & Samsung Internet"
                    : "Compatible with Windows, Mac, and Chromebook"}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-2.5">
                <Button
                  onClick={handleInstallClick}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 shadow-md shadow-indigo-200 dark:shadow-none gap-2 text-sm"
                >
                  <Download className="h-4 w-4" />
                  {isIos ? "Install on iPhone / iPad" : "Download & Install App"}
                </Button>
                <Button
                  variant="ghost"
                  onClick={handleDismiss}
                  className="text-slate-500 hover:text-slate-700 dark:text-slate-400 text-xs sm:w-auto"
                >
                  Continue in Browser
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

