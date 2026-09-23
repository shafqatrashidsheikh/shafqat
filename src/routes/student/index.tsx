import { createFileRoute, Link, Navigate, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { PortalShell } from "@/components/portal/PortalShell";
import { PortalSection, PortalStatCard } from "@/components/portal/portal-ui";
import { useAuth } from "@/hooks/useAuth";
import {
  studentGetAcademicRecord,
  type StudentAcademicRecord,
} from "@/server/virtual-office/student-records";
import { AmpersandText } from "@/components/site/AmpersandText";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/student/")({
  head: () => ({ meta: [{ title: "Student Portal — GPW Srinagar" }] }),
  component: StudentPortalPage,
});

const EXAM_ROWS = [
  { key: "internal", label: "Sessional I / Internal" },
  { key: "other", label: "Sessional II" },
  { key: "practical", label: "Practical" },
  { key: "external", label: "External / Board" },
  { key: "assignment", label: "Assignment" },
] as const;

function examLabel(type: string) {
  return EXAM_ROWS.find((r) => r.key === type)?.label ?? type;
}

function StudentPortalPage() {
  const navigate = useNavigate();
  const { session, profile, loading, signOut, configured } = useAuth();
  const handleSignOut = useCallback(async () => {
    await signOut();
    navigate({ to: "/" });
  }, [navigate, signOut]);

  const [academic, setAcademic] = useState<StudentAcademicRecord | null>(null);
  const [academicError, setAcademicError] = useState<string | null>(null);

  useEffect(() => {
    if (!session?.access_token || profile?.approval_status !== "approved") return;
    void studentGetAcademicRecord({ data: { accessToken: session.access_token } })
      .then(setAcademic)
      .catch((err) => {
        setAcademicError(err instanceof Error ? err.message : null);
        setAcademic(null);
      });
  }, [session?.access_token, profile?.approval_status]);

  const subjectRecords = useMemo(() => {
    if (!academic) return [];

    const byId = new Map<
      string,
      {
        id: string;
        name: string;
        code: string | null;
        semester: number | null;
        attendance: StudentAcademicRecord["attendanceSummary"][number] | null;
        marksByType: Map<string, { marks: number; maxMarks: number }>;
      }
    >();

    for (const s of academic.subjects) {
      byId.set(s.id, {
        id: s.id,
        name: s.name,
        code: s.code,
        semester: s.semester,
        attendance: null,
        marksByType: new Map(),
      });
    }

    for (const a of academic.attendanceSummary) {
      const cur = byId.get(a.subjectId) ?? {
        id: a.subjectId,
        name: a.name,
        code: null,
        semester: null,
        attendance: null,
        marksByType: new Map(),
      };
      cur.attendance = a;
      byId.set(a.subjectId, cur);
    }

    for (const m of academic.marks) {
      const cur = byId.get(m.subjectId) ?? {
        id: m.subjectId,
        name: m.subject,
        code: null,
        semester: m.semester,
        attendance: null,
        marksByType: new Map(),
      };
      cur.marksByType.set(m.examType, { marks: m.marks, maxMarks: m.maxMarks });
      byId.set(m.subjectId, cur);
    }

    return [...byId.values()].sort((a, b) => a.name.localeCompare(b.name));
  }, [academic]);

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
    return (
      <Navigate to={profile.approval_status === "pending_review" ? "/student/pending" : "/student/onboarding"} />
    );
  }

  const belowThreshold =
    academic?.attendanceSummary.filter((s) => !s.meetsRequirement).length ?? 0;
  const threshold = academic?.threshold ?? 75;

  return (
    <PortalShell
      profile={profile}
      variant="page"
      eyebrow={null}
      title="Student Portal"
      subtitle={`Welcome back${profile.department?.name ? ` · ${profile.department.name}` : ""}`}
      onSignOut={handleSignOut}
    >
      <div className="mb-6 grid gap-3 sm:grid-cols-3">
        <PortalStatCard label="Department" value={profile.department?.name ?? "—"} />
        <PortalStatCard label="Semester" value={profile.semester ?? "—"} />
        <PortalStatCard
          label="Attendance alert"
          value={academic ? belowThreshold : "—"}
          hint={
            academic
              ? belowThreshold > 0
                ? `Subjects below ${threshold}%`
                : `All subjects meet ${threshold}%`
              : "Academic record loading"
          }
        />
      </div>

      <PortalSection title="Your profile" className="mb-6">
        <div className="card-premium p-5 sm:p-6">
          <dl className="grid gap-4 text-sm sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Name</dt>
              <dd className="mt-1 font-semibold text-navy">{profile.full_name ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Roll number
              </dt>
              <dd className="mt-1 font-semibold text-navy">{profile.roll_number ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Email</dt>
              <dd className="mt-1 break-all font-semibold text-navy">{profile.email}</dd>
            </div>
            {profile.phone ? (
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Phone</dt>
                <dd className="mt-1 font-semibold text-navy">{profile.phone}</dd>
              </div>
            ) : null}
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Department
              </dt>
              <dd className="mt-1 font-semibold text-navy">{profile.department?.name ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Semester
              </dt>
              <dd className="mt-1 font-semibold text-navy">{profile.semester ?? "—"}</dd>
            </div>
          </dl>
        </div>
      </PortalSection>

      <PortalSection
        title="Academic record"
        description={`Attendance, syllabus coverage and marks uploaded by authorised staff. Minimum attendance: ${threshold}%.`}
        className="mb-6"
      >
        <div className="card-premium overflow-hidden">
          {academicError && !academic ? (
            <p className="p-5 text-sm text-muted-foreground sm:p-6">
              Academic tables are not available yet. Ask the office to apply the Virtual College Office
              migration.
            </p>
          ) : !academic ? (
            <p className="p-5 text-sm text-muted-foreground sm:p-6">Loading academic record…</p>
          ) : subjectRecords.length === 0 ? (
            <div className="space-y-0 divide-y divide-border">
              <AcademicBlock title="1. Attendance">
                <p className="text-sm text-muted-foreground">No attendance uploaded yet.</p>
              </AcademicBlock>
              <AcademicBlock title="2. Syllabus covered">
                <p className="text-sm text-muted-foreground">
                  No subjects listed for your department and semester yet.
                </p>
              </AcademicBlock>
              <AcademicBlock title="3. Marks — Sessional I &amp; II">
                <p className="text-sm text-muted-foreground">No marks uploaded yet.</p>
              </AcademicBlock>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {/* 1. Attendance */}
              <AcademicBlock title="1. Attendance">
                <ul className="divide-y divide-border/70">
                  {subjectRecords.map((s) => {
                    const a = s.attendance;
                    return (
                      <li key={`att-${s.id}`} className="flex items-start justify-between gap-3 py-2.5 text-sm">
                        <span className="min-w-0 text-navy">
                          <AmpersandText>{s.name}</AmpersandText>
                          {s.code ? (
                            <span className="mt-0.5 block text-xs text-muted-foreground">{s.code}</span>
                          ) : null}
                        </span>
                        {a ? (
                          <span
                            className={cn(
                              "shrink-0 tabular-nums",
                              a.meetsRequirement ? "font-medium text-navy" : "font-semibold text-red",
                            )}
                          >
                            {a.percentage}%{" "}
                            <span className="text-muted-foreground">
                              ({a.present}/{a.total})
                            </span>
                          </span>
                        ) : (
                          <span className="shrink-0 text-muted-foreground">Not uploaded</span>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </AcademicBlock>

              {/* 2. Syllabus */}
              <AcademicBlock
                title="2. Syllabus covered"
                hint="Topic coverage is updated when department staff upload it."
              >
                <ul className="divide-y divide-border/70">
                  {subjectRecords.map((s) => (
                    <li key={`syl-${s.id}`} className="flex items-start justify-between gap-3 py-2.5 text-sm">
                      <span className="min-w-0 text-navy">
                        <AmpersandText>{s.name}</AmpersandText>
                      </span>
                      <span className="shrink-0 text-muted-foreground">Awaiting upload</span>
                    </li>
                  ))}
                </ul>
              </AcademicBlock>

              {/* 3. Marks */}
              <AcademicBlock
                title="3. Marks — Sessional I &amp; II"
                hint="Internal / other assessments map to sessional columns when staff upload them."
              >
                <div className="space-y-4">
                  {subjectRecords.map((s) => (
                    <div key={`mk-${s.id}`} className="rounded-lg border border-border/80 bg-background/60 p-3 sm:p-4">
                      <p className="font-display text-sm font-bold text-navy">
                        <AmpersandText>{s.name}</AmpersandText>
                      </p>
                      <ul className="mt-2 divide-y divide-border/60">
                        {EXAM_ROWS.map((row) => {
                          const entry = s.marksByType.get(row.key);
                          return (
                            <li
                              key={row.key}
                              className="flex items-center justify-between gap-3 py-2 text-sm"
                            >
                              <span className="text-muted-foreground">{row.label}</span>
                              {entry ? (
                                <span className="font-semibold tabular-nums text-navy">
                                  {entry.marks}/{entry.maxMarks}
                                </span>
                              ) : (
                                <span className="text-muted-foreground">—</span>
                              )}
                            </li>
                          );
                        })}
                        {[...s.marksByType.entries()]
                          .filter(([type]) => !EXAM_ROWS.some((r) => r.key === type))
                          .map(([type, entry]) => (
                            <li
                              key={type}
                              className="flex items-center justify-between gap-3 py-2 text-sm"
                            >
                              <span className="text-muted-foreground">{examLabel(type)}</span>
                              <span className="font-semibold tabular-nums text-navy">
                                {entry.marks}/{entry.maxMarks}
                              </span>
                            </li>
                          ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </AcademicBlock>
            </div>
          )}
        </div>
      </PortalSection>

      <PortalSection
        title="Student resources"
        description="Official institute pages useful during your diploma."
      >
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { label: "Notices & Updates", to: "/updates/notices", desc: "Exam schedules, circulars and announcements" },
            { label: "Examination", to: "/examination", desc: "Date sheets, forms and results" },
            { label: "Downloads", to: "/downloads", desc: "Syllabus and institute documents" },
            { label: "Library", to: "/library", desc: "Reading hall and learning resources" },
            { label: "Hostel", to: "/hostel", desc: "Allotment and hostel enquiry" },
            { label: "Placements", to: "/placements", desc: "Training, internships and career guidance" },
            { label: "Student Welfare", to: "/student-welfare", desc: "Support and anti-ragging information" },
            { label: "Contact", to: "/contact", desc: "Reach the institute office" },
          ].map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="card-premium flex h-full flex-col p-4 transition-colors hover:border-brand/40 sm:p-5"
            >
              <p className="font-display font-bold text-navy">
                <AmpersandText>{item.label}</AmpersandText>
              </p>
              <p className="mt-1 text-sm text-muted-foreground">{item.desc}</p>
            </Link>
          ))}
        </div>
      </PortalSection>
    </PortalShell>
  );
}

function AcademicBlock({
  title,
  hint,
  children,
}: {
  title: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div className="p-5 sm:p-6">
      <h3 className="font-display text-sm font-bold text-navy sm:text-base">{title}</h3>
      {hint ? <p className="mt-1 text-xs text-muted-foreground">{hint}</p> : null}
      <div className="mt-3">{children}</div>
    </div>
  );
}
