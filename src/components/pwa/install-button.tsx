"use client";

import * as React from "react";
import { Download, Smartphone, Share, PlusSquare, CheckCircle2, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

export function InstallPwaButton({
  variant = "topbar",
  className = "",
}: {
  variant?: "topbar" | "sidebar" | "banner";
  className?: string;
}) {
  const [deferredPrompt, setDeferredPrompt] = React.useState<BeforeInstallPromptEvent | null>(null);
  const [isStandalone, setIsStandalone] = React.useState(false);
  const [isIos, setIsIos] = React.useState(false);
  const [showModal, setShowModal] = React.useState(false);
  const [installedSuccessfully, setInstalledSuccessfully] = React.useState(false);

  React.useEffect(() => {
    // Check if already in standalone / installed mode
    if (
      window.matchMedia("(display-mode: standalone)").matches ||
      (navigator as any).standalone === true
    ) {
      setIsStandalone(true);
    }

    // Check if iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isAppleDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIos(isAppleDevice);

    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setDeferredPrompt(null);
      setIsStandalone(true);
      setInstalledSuccessfully(true);
      setShowModal(false);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === "accepted") {
        setDeferredPrompt(null);
        setInstalledSuccessfully(true);
      }
    } else {
      // Trigger the rich DownloadPopup modal
      window.dispatchEvent(new CustomEvent("open-studymate-download"));
      setShowModal(true);
    }
  };

  if (isStandalone) {
    return null; // Already installed and running as standalone app
  }

  return (
    <>
      {variant === "topbar" && (
        <Button
          size="sm"
          variant="outline"
          onClick={handleInstallClick}
          className={`flex items-center gap-1.5 border-indigo-200 bg-indigo-50/70 text-indigo-700 hover:bg-indigo-100 dark:border-indigo-900/60 dark:bg-indigo-950/40 dark:text-indigo-300 dark:hover:bg-indigo-900/60 font-medium shadow-sm transition-all ${className}`}
        >
          <Smartphone className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
          <span className="hidden sm:inline">Download App</span>
          <span className="sm:hidden">Install</span>
        </Button>
      )}

      {variant === "sidebar" && (
        <button
          onClick={handleInstallClick}
          className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold bg-gradient-to-r from-indigo-50 to-indigo-100/60 text-indigo-700 hover:from-indigo-100 hover:to-indigo-200/80 transition-all border border-indigo-200/80 dark:border-indigo-900/50 dark:from-indigo-950/40 dark:to-indigo-900/20 dark:text-indigo-300 dark:hover:bg-indigo-900/40 shadow-xs ${className}`}
        >
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-indigo-600 text-white shadow-xs">
            <Download className="h-4 w-4" />
          </div>
          <div className="text-left">
            <span className="block leading-none">Download App</span>
            <span className="text-[10px] text-indigo-500/90 dark:text-indigo-400/80 font-normal">
              Install to Phone / Desktop
            </span>
          </div>
        </button>
      )}

      {variant === "banner" && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 sm:p-4 rounded-xl border border-indigo-100 bg-gradient-to-r from-indigo-50/80 via-white to-indigo-50/40 dark:border-indigo-900/50 dark:from-indigo-950/40 dark:via-slate-900 dark:to-indigo-950/20 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-200 dark:shadow-none">
              <Smartphone className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Install StudyMate AI on your Device
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Access your VTU syllabus, important questions, and offline notes instantly without typing URLs.
              </p>
            </div>
          </div>
          <Button
            size="sm"
            onClick={handleInstallClick}
            className="w-full sm:w-auto shrink-0 bg-indigo-600 text-white hover:bg-indigo-700 font-semibold shadow-sm"
          >
            <Download className="h-4 w-4 mr-1.5" />
            Install App Now
          </Button>
        </div>
      )}

      {/* Instructional Modal for iOS Safari / Unsupported prompt */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-900 border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-150">
            <button
              onClick={() => setShowModal(false)}
              className="absolute right-4 top-4 rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md">
                <Smartphone className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  Install StudyMate AI
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {isIos ? "Add to your iPhone / iPad Home Screen" : "Download to your device"}
                </p>
              </div>
            </div>

            {isIos ? (
              <div className="space-y-3.5 text-sm text-slate-700 dark:text-slate-300">
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  To install on Apple iOS Safari:
                </p>
                <div className="flex items-start gap-3 rounded-lg border border-slate-100 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-800/50">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white">
                    1
                  </span>
                  <div>
                    <span className="font-semibold text-slate-900 dark:text-slate-100">Tap the Share button</span>
                    <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                      Located at the bottom Safari bar: <Share className="inline h-3.5 w-3.5 text-indigo-600" />
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-lg border border-slate-100 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-800/50">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white">
                    2
                  </span>
                  <div>
                    <span className="font-semibold text-slate-900 dark:text-slate-100">Select &quot;Add to Home Screen&quot;</span>
                    <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                      Scroll down in the share sheet and tap <PlusSquare className="inline h-3.5 w-3.5 text-indigo-600" />
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-lg border border-slate-100 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-800/50">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white">
                    3
                  </span>
                  <div>
                    <span className="font-semibold text-slate-900 dark:text-slate-100">Tap &quot;Add&quot; in the top-right corner</span>
                    <p className="text-xs text-slate-500 mt-0.5">
                      The StudyMate app icon will appear on your home screen!
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-3.5 text-sm text-slate-700 dark:text-slate-300">
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  You can install this app directly in your browser:
                </p>
                <div className="rounded-lg border border-slate-100 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-800/50">
                  <p className="font-medium text-slate-900 dark:text-slate-100 text-xs">
                    🖥️ <strong>On Desktop (Chrome / Edge / Brave):</strong>
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Click the <strong>Install icon (💻/⊕)</strong> on the right side of the URL address bar, or click the browser menu (⋮) → <strong>Install StudyMate AI</strong>.
                  </p>
                </div>
                <div className="rounded-lg border border-slate-100 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-800/50">
                  <p className="font-medium text-slate-900 dark:text-slate-100 text-xs">
                    📱 <strong>On Android (Chrome / Firefox):</strong>
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Tap the <strong>three dots (⋮)</strong> in the top-right corner → tap <strong>&quot;Install app&quot;</strong> or <strong>&quot;Add to Home screen&quot;</strong>.
                  </p>
                </div>
              </div>
            )}

            <Button
              className="mt-5 w-full bg-indigo-600 text-white hover:bg-indigo-700"
              onClick={() => setShowModal(false)}
            >
              Got it
            </Button>
          </div>
        </div>
      )}
    </>
  );
}

