import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PortalShell } from "@/components/portal/PortalShell";
import { PortalActionTabs, PortalSection, PortalStatCard } from "@/components/portal/portal-ui";
import { UserManagementPanel } from "@/components/portal/UserManagementPanel";
import type { UserProfile } from "@/lib/auth/roles";
import { canManageUsers } from "@/lib/auth/roles";
import {
  portalApproveStudent,
  portalListDepartments,
  portalListHods,
  portalListPendingStudents,
  portalRejectStudent,
} from "@/server/portal/mutations";

function portalErrorMessage(err: unknown): string {
  if (err instanceof Error && err.message) return err.message;
  if (typeof err === "string" && err.trim()) return err;
  if (err && typeof err === "object") {
    const o = err as { message?: unknown; data?: unknown };
    if (typeof o.message === "string" && o.message.trim()) return o.message;
    if (typeof o.data === "string" && o.data.trim()) return o.data;
  }
  return "Failed to load portal data";
}

type Department = { id: string; name: string; slug: string };

type PendingStudent = {
  id: string;
  email: string;
  full_name: string | null;
  roll_number: string | null;
  phone: string | null;
  created_at: string;
  departments: { name: string } | null;
};

type PortalUser = {
  id: string;
  email: string;
  full_name: string | null;
  role: string;
  department_id: string | null;
  created_at: string;
  departments: { name: string } | null;
};

export function PortalDashboard({
  accessToken,
  profile,
  onSignOut,
}: {
  accessToken: string;
  profile: UserProfile;
  onSignOut: () => void;
}) {
  const [pending, setPending] = useState<PendingStudent[]>([]);
  const [hods, setHods] = useState<PortalUser[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [tab, setTab] = useState<"approvals" | "users" | "departments">("approvals");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  const canApprove =
    profile.role === "principal" || profile.role === "admin" || profile.role === "hod" || profile.role === "staff";
  const canManage = canManageUsers(profile.role);
  const isPrincipal = profile.role === "principal";
  const isHod = profile.role === "hod";
  const isStaff = profile.role === "staff";
  const missingDepartment = (isHod || isStaff) && !profile.department_id;

  const loadData = async () => {
    setError(null);
    setLoading(true);
    try {
      const deptRows = (await portalListDepartments({ data: { accessToken } })) as Department[];
      setDepartments(deptRows);

      if (canApprove && !missingDepartment) {
        const rows = await portalListPendingStudents({ data: { accessToken } });
        setPending(rows as PendingStudent[]);
      }

      if (isPrincipal) {
        const hodRows = await portalListHods({ data: { accessToken } });
        setHods(hodRows as PortalUser[]);
      }
    } catch (err) {
      setError(portalErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
  }, [accessToken, profile.role, profile.department_id]);

  const handleApprove = async (studentId: string) => {
    setBusy(true);
    setError(null);
    setMessage(null);
    try {
      await portalApproveStudent({ data: { accessToken, studentId } });
      setMessage("Student approved — they can now access the student portal.");
      await loadData();
    } catch (err) {
      setError(portalErrorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  const handleReject = async (studentId: string) => {
    setBusy(true);
    setError(null);
    setMessage(null);
    try {
      await portalRejectStudent({
        data: { accessToken, studentId, rejection_reason: rejectReason.trim() || undefined },
      });
      setMessage("Student application rejected.");
      setRejectingId(null);
      setRejectReason("");
      await loadData();
    } catch (err) {
      setError(portalErrorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  const departmentLabel =
    profile.department?.name ?? departments.find((d) => d.id === profile.department_id)?.name;

  const title = isPrincipal
    ? "Institutional Portal"
    : isHod
      ? "Department Portal"
      : "Staff Portal";

  const subtitle = isPrincipal
    ? "Manage departments, HODs, staff, and student approvals"
    : isHod
      ? `Review students and staff${departmentLabel ? ` · ${departmentLabel}` : ""}`
      : `Approve department students${departmentLabel ? ` · ${departmentLabel}` : ""}`;

  const tabItems = [
    ...(canApprove
      ? [
          {
            key: "approvals",
            label: `Student approvals (${pending.length})`,
            active: tab === "approvals",
            onClick: () => setTab("approvals"),
          },
        ]
      : []),
    ...(canManage
      ? [
          {
            key: "users",
            label: isHod ? "Department staff" : "Manage users",
            active: tab === "users",
            onClick: () => setTab("users"),
          },
        ]
      : []),
    ...(isPrincipal
      ? [
          {
            key: "departments",
            label: `Departments (${departments.length})`,
            active: tab === "departments",
            onClick: () => setTab("departments"),
          },
        ]
      : []),
    { key: "vo", label: "Virtual College Office", href: "/virtual-office" },
    ...(isPrincipal || profile.role === "admin" || profile.role === "editor"
      ? [{ key: "cms", label: "CMS Admin", href: "/admin" }]
      : []),
  ];

  return (
    <PortalShell
      profile={profile}
      title={title}
      subtitle={subtitle}
      onSignOut={onSignOut}
    >
      <PortalActionTabs items={tabItems} />

      {(isPrincipal || isHod || isStaff) && (
        <div className="mb-6 grid gap-3 sm:grid-cols-3">
          {isPrincipal ? (
            <>
              <PortalStatCard label="Departments" value={loading ? "—" : departments.length} />
              <PortalStatCard label="HODs assigned" value={loading ? "—" : hods.length} />
              <PortalStatCard label="Pending students" value={loading ? "—" : pending.length} />
            </>
          ) : (
            <>
              <PortalStatCard
                label="Your department"
                value={departmentLabel ?? "Unassigned"}
                hint={missingDepartment ? "Ask the principal to assign a department" : undefined}
              />
              <PortalStatCard label="Pending approvals" value={loading ? "—" : pending.length} />
              <PortalStatCard label="Your role" value={profile.role.toUpperCase()} />
            </>
          )}
        </div>
      )}

      {missingDepartment && (
        <div className="mb-6 rounded-lg border border-amber-300/60 bg-amber-50 p-4 text-sm text-amber-950">
          Your account is not linked to a department yet. Ask the principal to assign your department, then refresh
          this page.
        </div>
      )}

      {message && <p className="mb-4 rounded-lg bg-light-blue p-3 text-sm text-navy">{message}</p>}
      {error && <p className="mb-4 rounded-lg border border-red/30 bg-red/5 p-3 text-sm text-red">{error}</p>}

      {loading ? (
        <p className="text-sm text-muted-foreground">Loading portal data…</p>
      ) : (
        <>
          {tab === "approvals" && canApprove && (
            <PortalSection
              title="Pending student registrations"
              description={
                isPrincipal
                  ? "Institute-wide applications awaiting HOD or staff review."
                  : "Students in your department waiting for approval."
              }
            >
              {missingDepartment ? (
                <p className="text-sm text-muted-foreground">Assign a department to your account to review students.</p>
              ) : pending.length === 0 ? (
                <div className="card-premium p-6">
                  <p className="text-sm text-muted-foreground">No students awaiting approval in your scope.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pending.map((student) => (
                    <div
                      key={student.id}
                      className="card-premium flex flex-col gap-4 p-5 sm:flex-row sm:items-start sm:justify-between"
                    >
                      <div>
                        <p className="font-display font-bold text-navy">
                          {student.full_name ?? "Unnamed student"}
                        </p>
                        <p className="mt-1 text-sm text-muted-foreground">{student.email}</p>
                        <dl className="mt-3 grid gap-1 text-sm sm:grid-cols-2">
                          <div>
                            <dt className="text-muted-foreground">Roll number</dt>
                            <dd className="font-medium text-navy">{student.roll_number ?? "—"}</dd>
                          </div>
                          <div>
                            <dt className="text-muted-foreground">Department</dt>
                            <dd className="font-medium text-navy">{student.departments?.name ?? "—"}</dd>
                          </div>
                          {student.phone ? (
                            <div>
                              <dt className="text-muted-foreground">Phone</dt>
                              <dd className="font-medium text-navy">{student.phone}</dd>
                            </div>
                          ) : null}
                        </dl>
                      </div>
                      <div className="flex w-full flex-col gap-2 sm:w-auto sm:min-w-[220px]">
                        {rejectingId === student.id ? (
                          <>
                            <Label htmlFor={`reject-${student.id}`}>Rejection reason (optional)</Label>
                            <Textarea
                              id={`reject-${student.id}`}
                              value={rejectReason}
                              onChange={(e) => setRejectReason(e.target.value)}
                              rows={3}
                            />
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                disabled={busy}
                                onClick={() => handleReject(student.id)}
                              >
                                Confirm reject
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => {
                                  setRejectingId(null);
                                  setRejectReason("");
                                }}
                              >
                                Cancel
                              </Button>
                            </div>
                          </>
                        ) : (
                          <div className="flex flex-wrap gap-2">
                            <Button size="sm" disabled={busy} onClick={() => handleApprove(student.id)}>
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              disabled={busy}
                              onClick={() => setRejectingId(student.id)}
                            >
                              Reject
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </PortalSection>
          )}

          {tab === "users" && canManage && (
            <UserManagementPanel
              accessToken={accessToken}
              actorRole={profile.role === "hod" ? "hod" : "principal"}
              actorDepartmentId={profile.department_id}
            />
          )}

          {tab === "departments" && isPrincipal && (
            <PortalSection
              title="GPW diploma departments"
              description="Linked to student onboarding and HOD assignments. Assign one HOD per department from Manage users."
            >
              <div className="grid gap-3 sm:grid-cols-2">
                {departments.map((department) => {
                  const hod = hods.find((user) => user.department_id === department.id);
                  return (
                    <div key={department.id} className="card-premium p-4">
                      <p className="font-display font-bold text-navy">{department.name}</p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        HOD: {hod?.full_name ?? "Not assigned yet"}
                      </p>
                    </div>
                  );
                })}
              </div>
            </PortalSection>
          )}
        </>
      )}
    </PortalShell>
  );
}
