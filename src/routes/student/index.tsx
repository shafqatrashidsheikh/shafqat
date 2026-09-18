import { createFileRoute, Link, Navigate, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { PortalShell } from "@/components/portal/PortalShell";
import { useAuth } from "@/hooks/useAuth";
import { studentGetAcademicRecord } from "@/server/virtual-office/student-records";

export const Route = createFileRoute("/student/")({
  head: () => ({ meta: [{ title: "Student Portal — GPW Srinagar" }] }),
  component: StudentPortalPage,
});

function StudentPortalPage() {
  const navigate = useNavigate();
  const { session, profile, loading, signOut, configured } = useAuth();
  const handleSignOut = useCallback(async () => {
    await signOut();
    navigate({ to: "/" });
  }, [navigate, signOut]);

  const [academic, setAcademic] = useState<Awaited<ReturnType<typeof studentGetAcademicRecord>> | null>(
    null,
  );
  const [academicError, setAcademicError] = useState<string | null>(null);

  useEffect(() => {
    if (!session?.access_token || profile?.approval_status !== "approved") return;
    void studentGetAcademicRecord({ data: { accessToken: session.access_token } })
      .then(setAcademic)
      .catch((err) => {
        // Tables may not be migrated yet — show quiet empty state
        setAcademicError(err instanceof Error ? err.message : null);
        setAcademic(null);
      });
  }, [session?.access_token, profile?.approval_status]);

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
            <dt className="text-muted-foreground">Semester</dt>
            <dd className="font-semibold text-navy">{profile.semester ?? "—"}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Email</dt>
            <dd className="font-semibold text-navy">{profile.email}</dd>
          </div>
        </dl>
      </div>

      <div className="card-premium mb-6 p-6">
        <h2 className="font-display text-lg font-bold text-navy">Your academic record</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Attendance and marks uploaded by authorised staff. Requirement: {academic?.threshold ?? 75}% attendance.
        </p>
        {academicError && !academic && (
          <p className="mt-3 text-sm text-muted-foreground">
            Academic tables are not available yet. Ask the office to apply the Virtual College Office migration.
          </p>
        )}
        {academic && (
          <div className="mt-4 grid gap-6 lg:grid-cols-2">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-brand">Attendance</h3>
              {academic.attendanceSummary.length === 0 ? (
                <p className="mt-2 text-sm text-muted-foreground">No attendance uploaded yet.</p>
              ) : (
                <ul className="mt-2 space-y-2">
                  {academic.attendanceSummary.map((s) => (
                    <li key={s.subjectId} className="flex justify-between gap-3 border-b border-border/60 py-2 text-sm">
                      <span className="text-navy">{s.name}</span>
                      <span className={s.meetsRequirement ? "text-navy" : "font-semibold text-red"}>
                        {s.percentage}% ({s.present}/{s.total})
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-brand">Marks</h3>
              {academic.marks.length === 0 ? (
                <p className="mt-2 text-sm text-muted-foreground">No marks uploaded yet.</p>
              ) : (
                <ul className="mt-2 space-y-2">
                  {academic.marks.map((m, i) => (
                    <li key={`${m.subject}-${m.examType}-${i}`} className="flex justify-between gap-3 border-b border-border/60 py-2 text-sm">
                      <span className="text-navy">
                        {m.subject} · {m.examType}
                        {m.semester ? ` · Sem ${m.semester}` : ""}
                      </span>
                      <span className="font-semibold text-navy">
                        {m.marks}/{m.maxMarks}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}
      </div>

      <h2 className="mb-4 font-display text-lg font-bold text-navy">Institute resources</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[
          { label: "Notices & Updates", to: "/updates/notices", desc: "Exam schedules, circulars and announcements" },
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
