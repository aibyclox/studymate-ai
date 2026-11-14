"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { User, GraduationCap, LogOut, CheckCircle2, AlertCircle, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Profile } from "@/types/database";
import { VTU_COLLEGES, VTU_DEPARTMENTS } from "@/lib/vtu-data";

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = React.useState<Profile | null>(null);
  const [email, setEmail] = React.useState("");
  const [fullName, setFullName] = React.useState("");
  const [college, setCollege] = React.useState("");
  const [course, setCourse] = React.useState("B.E. / B.Tech (VTU)");
  const [branch, setBranch] = React.useState("Computer Science & Engineering (CSE)");
  const [currentSemester, setCurrentSemester] = React.useState("5");

  // College dropdown search
  const [collegeSearch, setCollegeSearch] = React.useState("");
  const [isCollegeDropdownOpen, setIsCollegeDropdownOpen] = React.useState(false);

  const [isLoading, setIsLoading] = React.useState(true);
  const [isSaving, setIsSaving] = React.useState(false);
  const [successMessage, setSuccessMessage] = React.useState("");
  const [errorMessage, setErrorMessage] = React.useState("");

  React.useEffect(() => {
    const loadProfile = async () => {
      try {
        setIsLoading(true);
        const res = await fetch("/api/profile");
        if (res.ok) {
          const { data } = await res.json();
          if (data) {
            setProfile(data);
            setEmail(data.email || "");
            setFullName(data.full_name || "");
            setCollege(data.college || VTU_COLLEGES[0].name);
            setCourse(data.course || "B.E. / B.Tech (VTU)");
            setBranch(data.branch || "Computer Science & Engineering (CSE)");
            setCurrentSemester(data.current_semester?.toString() || "5");
          }
        }
      } catch (err) {
        console.error("Failed to load profile:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, []);

  const filteredColleges = React.useMemo(() => {
    if (!collegeSearch.trim()) return VTU_COLLEGES.slice(0, 15);
    const q = collegeSearch.toLowerCase();
    return VTU_COLLEGES.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.code.toLowerCase().includes(q) ||
        c.region.toLowerCase().includes(q)
    );
  }, [collegeSearch]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      setSuccessMessage("");
      setErrorMessage("");

      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: fullName,
          college,
          course,
          branch,
          current_semester: parseInt(currentSemester) || 5,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err?.error || "Failed to update profile");
      }

      setSuccessMessage("Profile and academic settings updated successfully!");
      setTimeout(() => setSuccessMessage(""), 4000);
    } catch (err: any) {
      setErrorMessage(err?.message || "Failed to save profile settings.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
      router.refresh();
    } catch {
      router.push("/login");
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-2xl">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-96 w-full rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          Account & Academic Profile
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Manage your personal details and VTU academic preferences.
        </p>
      </div>

      {successMessage && (
        <div className="flex items-center gap-2 rounded-xl bg-emerald-50 p-4 text-xs font-medium text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="flex items-center gap-2 rounded-xl bg-red-50 p-4 text-xs font-medium text-red-600 dark:bg-red-950/40 dark:text-red-400">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSaveProfile} className="space-y-6">
        {/* Personal Details Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <User className="h-4 w-4 text-indigo-600" />
              Personal Information
            </CardTitle>
            <CardDescription>
              Your student identity in StudyMate AI.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                id="profile-name"
                label="Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  disabled
                  className="flex h-10 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500 cursor-not-allowed dark:border-slate-800 dark:bg-slate-950/50"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Academic Settings Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold flex items-center justify-between">
              <span className="flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-indigo-600" />
                VTU Academic Workspace Settings
              </span>
              <span className="text-[11px] font-normal text-indigo-600 dark:text-indigo-400">
                Affiliated under VTU Belagavi
              </span>
            </CardTitle>
            <CardDescription>
              Select your VTU engineering institution, department, and current semester.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* VTU College Selector */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                VTU College / Institution
              </label>
              <div className="relative">
                <div
                  onClick={() => setIsCollegeDropdownOpen(!isCollegeDropdownOpen)}
                  className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-2.5 cursor-pointer shadow-sm hover:border-indigo-400 dark:border-slate-800 dark:bg-slate-950"
                >
                  <span className="text-xs font-medium text-slate-900 dark:text-slate-100 truncate">
                    {college || "Select VTU College"}
                  </span>
                  <Button type="button" variant="outline" size="sm" className="h-6 text-[10px] px-2">
                    Change
                  </Button>
                </div>

                {isCollegeDropdownOpen && (
                  <div className="absolute left-0 right-0 top-12 z-50 rounded-xl border border-slate-200 bg-white p-3 shadow-2xl dark:border-slate-800 dark:bg-slate-900 animate-in fade-in zoom-in-95">
                    <div className="relative mb-2">
                      <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Search VTU colleges by name, code (e.g. 1RV, BMSCE, DSCE)..."
                        value={collegeSearch}
                        onChange={(e) => setCollegeSearch(e.target.value)}
                        className="w-full rounded-lg border border-slate-200 bg-slate-50 pl-8 pr-3 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 focus-visible:border-indigo-500 focus-visible:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
                        autoFocus
                      />
                    </div>

                    <div className="max-h-56 overflow-y-auto divide-y divide-slate-100 text-xs dark:divide-slate-800">
                      {filteredColleges.map((c) => (
                        <div
                          key={c.code}
                          onClick={() => {
                            setCollege(c.name);
                            setIsCollegeDropdownOpen(false);
                            setCollegeSearch("");
                          }}
                          className="p-2 hover:bg-indigo-50/60 dark:hover:bg-slate-800 cursor-pointer rounded-lg transition-colors flex items-center justify-between"
                        >
                          <div>
                            <span className="font-semibold text-slate-900 dark:text-slate-100 block">
                              {c.name}
                            </span>
                            <span className="text-[10px] text-slate-400">
                              Code: {c.code} • Region: {c.region} ({c.district})
                            </span>
                          </div>
                          <Badge variant="secondary" className="text-[10px]">
                            {c.code}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* VTU Department Select */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                  VTU Department / Program
                </label>
                <select
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  className="flex h-10 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-900 shadow-sm focus-visible:border-indigo-500 focus-visible:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
                >
                  {VTU_DEPARTMENTS.map((dept) => (
                    <option key={dept.id} value={dept.name}>
                      {dept.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Active Semester */}
              <Select
                id="profile-semester"
                label="Active Semester"
                value={currentSemester}
                onChange={(e) => setCurrentSemester(e.target.value)}
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                  <option key={s} value={s.toString()}>
                    Semester {s}
                  </option>
                ))}
              </Select>
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center justify-between pt-2">
          <Button
            type="button"
            variant="ghost"
            onClick={handleSignOut}
            className="text-rose-600 hover:bg-rose-50 hover:text-rose-700 dark:hover:bg-rose-950/30 dark:text-rose-400 gap-2"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </Button>

          <Button type="submit" isLoading={isSaving}>
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
}
