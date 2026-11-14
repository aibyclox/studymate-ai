import { getAuthenticatedUser } from "@/lib/auth-helper";
import { readDb } from "@/lib/local-db";
import { AppShell } from "@/components/layout/app-shell";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getAuthenticatedUser();

  if (!user) {
    redirect("/login");
  }

  const db = readDb();
  const profile = db.profiles.find((p) => p.id === user.id);

  const userName = profile?.full_name || user.full_name || user.email?.split("@")[0] || "Student";
  const currentSemester = profile?.current_semester || 5;

  return (
    <AppShell userName={userName} currentSemester={currentSemester}>
      {children}
    </AppShell>
  );
}
