import { useCallback, useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { VoOfficerId } from "@/lib/virtual-office/types";
import {
  voApproveStudent,
  voAttendanceSummary,
  voCancelNotification,
  voCancelWebsiteDraft,
  voConfirmWebsiteDraft,
  voListApprovals,
  voListNotifications,
  voListWebsiteDrafts,
  voMarksSummary,
  voPrepareNotification,
  voRejectStudent,
  voRevertWebsiteDraft,
  voSendNotification,
  voUploadAttendance,
  voUploadMarks,
} from "@/server/virtual-office/mutations";

type ApprovalRow = {
  id: string;
  email: string;
  full_name: string | null;
  roll_number: string | null;
  created_at: string;
  reviewed_at: string | null;
  rejection_reason: string | null;
  departments: { name?: string } | { name?: string }[] | null;
};

type DraftRow = {
  id: string;
  status: string;
  preview_summary: string;
  instruction: string;
  created_at: string;
};

type NotificationRow = {
  id: string;
  subject: string;
  status: string;
  recipient_count: number;
  created_at: string;
};

export function OfficerResultSheet({
  officerId,
  accessToken,
  summary,
  result,
  onClose,
  onChanged,
}: {
  officerId: VoOfficerId;
  accessToken: string;
  summary: string | null;
  result: unknown;
  onClose: () => void;
  onChanged: () => Promise<void>;
}) {
  return (
    <div className="vo-result-sheet" role="dialog" aria-modal="true" onClick={onClose}>
      <div
        className="vo-result-sheet__panel"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-3 flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand">Officer result</p>
            <h2 className="font-display text-lg font-bold text-navy">View result</h2>
            {summary ? <p className="mt-1 text-sm text-muted-foreground">{summary}</p> : null}
          </div>
          <Button type="button" variant="outline" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>

        {result != null ? (
          <pre className="mb-4 max-h-40 overflow-auto rounded-lg border border-border bg-background p-3 text-xs text-navy/90">
            {JSON.stringify(result, null, 2)}
          </pre>
        ) : null}

        {officerId === "student_approval" && (
          <ApprovalOfficer accessToken={accessToken} onChanged={onChanged} />
        )}
        {officerId === "academic_data" && (
          <AcademicOfficer accessToken={accessToken} onChanged={onChanged} />
        )}
        {officerId === "website_management" && (
          <WebsiteOfficer accessToken={accessToken} onChanged={onChanged} />
        )}
        {officerId === "student_notification" && (
          <NotificationOfficer accessToken={accessToken} onChanged={onChanged} />
        )}
      </div>
    </div>
  );
}

function ApprovalOfficer({
  accessToken,
  onChanged,
}: {
  accessToken: string;
  onChanged: () => Promise<void>;
}) {
  const [status, setStatus] = useState<"pending" | "approved" | "rejected">("pending");
  const [rows, setRows] = useState<ApprovalRow[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rejectId, setRejectId] = useState<string | null>(null);
  const [reason, setReason] = useState("");

  const load = useCallback(async () => {
    setError(null);
    try {
      const res = await voListApprovals({ data: { accessToken, status } });
      setRows((res.rows as ApprovalRow[]) ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load queue");
    }
  }, [accessToken, status]);

  useEffect(() => {
    void load();
  }, [load]);

  const act = async (id: string, action: "approve" | "reject") => {
    setBusy(true);
    setError(null);
    try {
      if (action === "approve") {
        await voApproveStudent({ data: { accessToken, studentId: id } });
      } else {
        await voRejectStudent({
          data: { accessToken, studentId: id, rejection_reason: reason.trim() || undefined },
        });
        setRejectId(null);
        setReason("");
      }
      await load();
      await onChanged();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Action failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <section>
      <h3 className="font-display text-base font-bold text-navy">Approval queue</h3>
      <div className="mt-3 flex flex-wrap gap-2">
        {(["pending", "approved", "rejected"] as const).map((s) => (
          <Button key={s} size="sm" variant={status === s ? "default" : "outline"} onClick={() => setStatus(s)}>
            {s}
          </Button>
        ))}
      </div>
      {error && <p className="mt-3 text-sm text-red">{error}</p>}
      <ul className="mt-3 space-y-3">
        {rows.length === 0 && <li className="text-sm text-muted-foreground">No {status} applications.</li>}
        {rows.map((row) => {
          const deptRaw = row.departments;
          const dept = Array.isArray(deptRaw) ? deptRaw[0] : deptRaw;
          return (
            <li key={row.id} className="rounded-xl border border-border/80 p-3">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-navy">{row.full_name ?? "Unnamed"}</p>
                  <p className="text-sm text-muted-foreground">
                    {row.email} · Roll {row.roll_number ?? "—"} · {dept?.name ?? "No dept"}
                  </p>
                </div>
                {status === "pending" && (
                  <div className="flex flex-wrap gap-2">
                    <Button size="sm" disabled={busy} onClick={() => void act(row.id, "approve")}>
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={busy}
                      onClick={() => setRejectId(rejectId === row.id ? null : row.id)}
                    >
                      Reject
                    </Button>
                  </div>
                )}
              </div>
              {rejectId === row.id && (
                <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                  <Input value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Rejection reason" />
                  <Button size="sm" variant="destructive" disabled={busy} onClick={() => void act(row.id, "reject")}>
                    Confirm reject
                  </Button>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function AcademicOfficer({
  accessToken,
  onChanged,
}: {
  accessToken: string;
  onChanged: () => Promise<void>;
}) {
  const [mode, setMode] = useState<"attendance" | "marks">("attendance");
  const [departmentQuery, setDepartmentQuery] = useState("Computer Engineering");
  const [semester, setSemester] = useState("2");
  const [subjectName, setSubjectName] = useState("");
  const [dataBlock, setDataBlock] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [summary, setSummary] = useState<unknown>(null);
  const [busy, setBusy] = useState(false);

  const upload = async () => {
    setBusy(true);
    setMessage(null);
    try {
      const sem = Number(semester);
      if (mode === "attendance") {
        const res = await voUploadAttendance({
          data: { accessToken, departmentQuery, semester: sem, subjectName, dataBlock },
        });
        setMessage(res.ok ? `Uploaded ${res.uploaded} row(s).` : res.message);
        setSummary(res.ok ? res.summary : null);
      } else {
        const res = await voUploadMarks({
          data: {
            accessToken,
            departmentQuery,
            semester: sem,
            subjectName,
            dataBlock,
            examType: "internal",
          },
        });
        setMessage(res.ok ? `Uploaded ${res.uploaded} row(s).` : res.message);
        setSummary(res.ok ? res.summary : null);
      }
      await onChanged();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setBusy(false);
    }
  };

  const loadSummary = async () => {
    setBusy(true);
    try {
      const sem = Number(semester);
      if (mode === "attendance") {
        setSummary(
          await voAttendanceSummary({
            data: { accessToken, departmentQuery, semester: sem, subjectName: subjectName || undefined },
          }),
        );
      } else {
        setSummary(
          await voMarksSummary({
            data: { accessToken, departmentQuery, semester: sem, subjectName: subjectName || undefined },
          }),
        );
      }
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Summary failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <section>
      <h3 className="font-display text-base font-bold text-navy">Academic tools</h3>
      <div className="mt-3 flex gap-2">
        <Button size="sm" variant={mode === "attendance" ? "default" : "outline"} onClick={() => setMode("attendance")}>
          Attendance
        </Button>
        <Button size="sm" variant={mode === "marks" ? "default" : "outline"} onClick={() => setMode("marks")}>
          Marks
        </Button>
      </div>
      <div className="mt-3 grid gap-3 sm:grid-cols-3">
        <div>
          <Label>Department</Label>
          <Input value={departmentQuery} onChange={(e) => setDepartmentQuery(e.target.value)} />
        </div>
        <div>
          <Label>Semester</Label>
          <Input value={semester} onChange={(e) => setSemester(e.target.value)} />
        </div>
        <div>
          <Label>Subject</Label>
          <Input value={subjectName} onChange={(e) => setSubjectName(e.target.value)} />
        </div>
      </div>
      <div className="mt-3">
        <Label>Data rows</Label>
        <Textarea className="mt-1" rows={4} value={dataBlock} onChange={(e) => setDataBlock(e.target.value)} />
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <Button disabled={busy} onClick={() => void upload()}>
          Upload
        </Button>
        <Button variant="outline" disabled={busy} onClick={() => void loadSummary()}>
          Show summary
        </Button>
      </div>
      {message && <p className="mt-3 text-sm text-navy">{message}</p>}
      {summary != null && (
        <pre className="mt-3 max-h-56 overflow-auto rounded-lg border border-border bg-background p-3 text-xs">
          {JSON.stringify(summary, null, 2)}
        </pre>
      )}
    </section>
  );
}

function WebsiteOfficer({
  accessToken,
  onChanged,
}: {
  accessToken: string;
  onChanged: () => Promise<void>;
}) {
  const [drafts, setDrafts] = useState<DraftRow[]>([]);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const rows = await voListWebsiteDrafts({ data: { accessToken } });
      setDrafts((rows as DraftRow[]) ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load drafts");
    }
  }, [accessToken]);

  useEffect(() => {
    void load();
  }, [load]);

  const act = async (id: string, action: "confirm" | "cancel" | "revert") => {
    setError(null);
    try {
      if (action === "confirm") await voConfirmWebsiteDraft({ data: { accessToken, draftId: id } });
      if (action === "cancel") await voCancelWebsiteDraft({ data: { accessToken, draftId: id } });
      if (action === "revert") await voRevertWebsiteDraft({ data: { accessToken, draftId: id } });
      await load();
      await onChanged();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Action failed");
    }
  };

  return (
    <section>
      <h3 className="font-display text-base font-bold text-navy">Website drafts</h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Confirm drafts before they go live.{" "}
        <Link to="/admin" className="font-medium text-brand underline-offset-2 hover:underline">
          Open CMS
        </Link>
      </p>
      {error && <p className="mt-3 text-sm text-red">{error}</p>}
      <ul className="mt-3 space-y-3">
        {drafts.length === 0 && <li className="text-sm text-muted-foreground">No drafts yet.</li>}
        {drafts.map((d) => (
          <li key={d.id} className="rounded-xl border border-border/80 p-3">
            <p className="font-semibold text-navy">{d.preview_summary}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              {d.status} · {d.created_at ? new Date(d.created_at).toLocaleString() : ""}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {d.status === "pending_confirm" && (
                <>
                  <Button size="sm" onClick={() => void act(d.id, "confirm")}>
                    Confirm & apply
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => void act(d.id, "cancel")}>
                    Cancel
                  </Button>
                </>
              )}
              {d.status === "applied" && (
                <Button size="sm" variant="outline" onClick={() => void act(d.id, "revert")}>
                  Undo / revert
                </Button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

function NotificationOfficer({
  accessToken,
  onChanged,
}: {
  accessToken: string;
  onChanged: () => Promise<void>;
}) {
  const [items, setItems] = useState<NotificationRow[]>([]);
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [departmentQuery, setDepartmentQuery] = useState("");
  const [semester, setSemester] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    const rows = await voListNotifications({ data: { accessToken } });
    setItems((rows as NotificationRow[]) ?? []);
  }, [accessToken]);

  useEffect(() => {
    void load().catch((err) => setMessage(err instanceof Error ? err.message : "Load failed"));
  }, [load]);

  const prepare = async () => {
    setBusy(true);
    setMessage(null);
    try {
      const res = await voPrepareNotification({
        data: {
          accessToken,
          subject,
          body,
          departmentQuery: departmentQuery || undefined,
          semester: semester ? Number(semester) : undefined,
        },
      });
      setMessage(res.ok ? `Prepared for ${res.recipientCount} students.` : res.message);
      await load();
      await onChanged();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Prepare failed");
    } finally {
      setBusy(false);
    }
  };

  const send = async (id: string) => {
    setBusy(true);
    try {
      const res = await voSendNotification({ data: { accessToken, notificationId: id } });
      setMessage(res.ok ? `Sent ${res.sent}, failed ${res.failed}.` : res.message);
      await load();
      await onChanged();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Send failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <section>
      <h3 className="font-display text-base font-bold text-navy">Notifications</h3>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <div>
          <Label>Department</Label>
          <Input value={departmentQuery} onChange={(e) => setDepartmentQuery(e.target.value)} />
        </div>
        <div>
          <Label>Semester</Label>
          <Input value={semester} onChange={(e) => setSemester(e.target.value)} />
        </div>
      </div>
      <div className="mt-3">
        <Label>Subject</Label>
        <Input value={subject} onChange={(e) => setSubject(e.target.value)} />
      </div>
      <div className="mt-3">
        <Label>Body</Label>
        <Textarea rows={3} value={body} onChange={(e) => setBody(e.target.value)} />
      </div>
      <Button className="mt-3" disabled={busy || !subject.trim() || !body.trim()} onClick={() => void prepare()}>
        Prepare for review
      </Button>
      {message && <p className="mt-3 text-sm text-navy">{message}</p>}
      <ul className="mt-4 space-y-3">
        {items.map((n) => (
          <li key={n.id} className="rounded-xl border border-border/80 p-3">
            <p className="font-semibold text-navy">{n.subject}</p>
            <p className="text-xs text-muted-foreground">
              {n.status} · {n.recipient_count} recipients
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {["pending_review", "queued", "failed"].includes(n.status) && (
                <Button size="sm" disabled={busy} onClick={() => void send(n.id)}>
                  Review & send
                </Button>
              )}
              {["pending_review", "queued"].includes(n.status) && (
                <Button
                  size="sm"
                  variant="outline"
                  disabled={busy}
                  onClick={() =>
                    void voCancelNotification({ data: { accessToken, notificationId: n.id } }).then(load)
                  }
                >
                  Cancel
                </Button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
