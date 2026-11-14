"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertCircle, Sparkles, CheckCircle2 } from "lucide-react";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectedFrom = searchParams.get("redirectedFrom") || "/dashboard";

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [isDemoLoading, setIsDemoLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    try {
      setIsLoading(true);
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || "Invalid login credentials. Please try again.");
      }

      router.push(redirectedFrom);
      router.refresh();
    } catch (err: any) {
      setError(err?.message || "Failed to sign in. Please verify your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    try {
      setIsDemoLoading(true);
      setError("");
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isDemo: true }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to launch demo account.");

      router.push("/dashboard");
      router.refresh();
    } catch (err: any) {
      setError(err?.message || "Could not start demo session.");
    } finally {
      setIsDemoLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* 1-Click Demo Login Banner */}
      <div className="rounded-xl border border-indigo-100 bg-indigo-50/70 p-3.5 dark:border-indigo-900/60 dark:bg-indigo-950/40">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
            <div>
              <p className="text-xs font-semibold text-indigo-900 dark:text-indigo-200">
                Quick Evaluation Mode
              </p>
              <p className="text-[11px] text-indigo-600 dark:text-indigo-400">
                Explore with preloaded subjects & notes.
              </p>
            </div>
          </div>
          <Button
            type="button"
            size="sm"
            onClick={handleDemoLogin}
            isLoading={isDemoLoading}
            className="h-8 text-xs bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            Instant Demo Sign In
          </Button>
        </div>
      </div>

      <div className="relative flex items-center justify-center">
        <div className="w-full border-t border-slate-200 dark:border-slate-800" />
        <span className="absolute bg-white px-3 text-[11px] font-medium uppercase tracking-wider text-slate-400 dark:bg-slate-900">
          Or sign in with email
        </span>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-lg bg-red-50 p-3 text-xs text-red-600 dark:bg-red-950/40 dark:text-red-400">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleLogin} className="space-y-4">
        <Input
          id="login-email"
          type="email"
          label="Email Address"
          placeholder="student@university.edu"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
        />

        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <label
              htmlFor="login-password"
              className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400"
            >
              Password
            </label>
            <Link
              href="/forgot-password"
              className="text-xs font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
            >
              Forgot password?
            </Link>
          </div>
          <input
            id="login-password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            className="flex h-10 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm transition-colors focus-visible:border-indigo-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
          />
        </div>

        <Button type="submit" className="w-full mt-2" isLoading={isLoading}>
          Sign In to Workspace
        </Button>
      </form>

      <p className="text-center text-xs text-slate-500 dark:text-slate-400 pt-1">
        Don&apos;t have an account?{" "}
        <Link
          href="/signup"
          className="font-semibold text-indigo-600 hover:underline dark:text-indigo-400"
        >
          Create one now
        </Link>
      </p>
    </div>
  );
}
