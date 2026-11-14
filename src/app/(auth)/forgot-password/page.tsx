"use client";

import * as React from "react";
import Link from "next/link";
import { GraduationCap, ArrowLeft, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";

export default function ForgotPasswordPage() {
  const [email, setEmail] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [isSent, setIsSent] = React.useState(false);
  const [error, setError] = React.useState("");

  const supabase = createClient();

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError("Please enter your registered email address.");
      return;
    }

    try {
      setIsLoading(true);
      setError("");
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(
        email.trim(),
        {
          redirectTo: `${window.location.origin}/reset-password`,
        }
      );

      if (resetError) throw resetError;
      setIsSent(true);
    } catch (err: any) {
      setError(err?.message || "Failed to send reset link.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-6 bg-slate-50 dark:bg-slate-950">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white">
              <GraduationCap className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              StudyMate<span className="text-indigo-600"> AI</span>
            </span>
          </Link>
          <h1 className="mt-4 text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Reset your password
          </h1>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Enter your email to receive a password reset link.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xl dark:border-slate-800 dark:bg-slate-900">
          {isSent ? (
            <div className="text-center space-y-4">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                Check your inbox
              </h2>
              <p className="text-xs text-slate-500 leading-relaxed">
                We sent a password recovery link to{" "}
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  {email}
                </span>
                .
              </p>
              <Link href="/login" className="block pt-2">
                <Button variant="outline" className="w-full">
                  Return to Sign In
                </Button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleReset} className="space-y-4">
              {error && (
                <div className="flex items-center gap-2 rounded-lg bg-red-50 p-3 text-xs text-red-600 dark:bg-red-950/40 dark:text-red-400">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <Input
                id="reset-email"
                type="email"
                label="Registered Email"
                placeholder="student@university.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <Button type="submit" className="w-full mt-2" isLoading={isLoading}>
                Send Reset Link
              </Button>

              <div className="text-center pt-2">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:underline dark:text-indigo-400"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  Back to Sign In
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

