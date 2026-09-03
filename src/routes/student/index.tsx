import { createFileRoute, Link, Navigate, useNavigate } from "@tanstack/react-router";
import { useCallback } from "react";
import { PortalShell } from "@/components/portal/PortalShell";
import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/student/")({
  head: () => ({ meta: [{ title: "Student Portal — GPW Srinagar" }] }),
  component: StudentPortalPage,
});

function StudentPortalPage() {
  const navigate = useNavigate();
  const { profile, loading, signOut, configured } = useAuth();
  const handleSignOut = useCallback(async () => {
    await signOut();
    navigate({ to: "/" });
  }, [navigate, signOut]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-sm text-muted-foreground">Loading…</p>
      </div>
    );
  }

  if (!configured || !profile) {
    return <Navigate to="/login" />;
  }

  if (profile.role !== "student") {
    return <Navigate to="/portal" />;
  }

  if (profile.approval_status !== "approved") {
    return <Navigate to={profile.approval_status === "pending_review" ? "/student/pending" : "/student/onboarding"} />;
  }

  return (
    <PortalShell
      profile={profile}
      title="Student Portal"
      subtitle={`Welcome back${profile.department?.name ? ` · ${profile.department.name}` : ""}`}
      onSignOut={handleSignOut}
    >
      <div className="card-premium mb-6 p-6">
        <h2 className="font-display text-lg font-bold text-navy">Your profile</h2>
        <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <dt className="text-muted-foreground">Name</dt>
            <dd className="font-semibold text-navy">{profile.full_name ?? "—"}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Roll number</dt>
            <dd className="font-semibold text-navy">{profile.roll_number ?? "—"}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Department</dt>
            <dd className="font-semibold text-navy">{profile.department?.name ?? "—"}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Email</dt>
            <dd className="font-semibold text-navy">{profile.email}</dd>
          </div>
        </dl>
      </div>

      <h2 className="mb-4 font-display text-lg font-bold text-navy">Institute resources</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[
          { label: "Notices & Updates", to: "/notices", desc: "Exam schedules, circulars and announcements" },
          { label: "Academics", to: "/academics", desc: "Diploma programmes and departments" },
          { label: "Admissions", to: "/admissions", desc: "Admission process and documents" },
          { label: "Campus", to: "/campus", desc: "Labs, workshops and facilities" },
          { label: "Placements", to: "/placements", desc: "Career guidance and opportunities" },
          { label: "Contact", to: "/contact", desc: "Reach the institute office" },
        ].map((item) => (
          <Link key={item.to} to={item.to} className="card-premium block p-6 transition-colors hover:border-brand/40">
            <p className="font-display font-bold text-navy">{item.label}</p>
            <p className="mt-1 text-sm text-muted-foreground">{item.desc}</p>
          </Link>
        ))}
      </div>
    </PortalShell>
  );
}
