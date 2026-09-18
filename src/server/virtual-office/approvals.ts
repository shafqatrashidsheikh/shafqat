import type { VoContext } from "@/server/virtual-office/auth";
import { assertDepartmentScope, writeVoAudit } from "@/server/virtual-office/auth";

export type ApprovalStatusFilter = "pending" | "approved" | "rejected";

const STATUS_MAP: Record<ApprovalStatusFilter, string> = {
  pending: "pending_review",
  approved: "approved",
  rejected: "rejected",
};

export async function listStudentApplications(
  ctx: VoContext,
  status: ApprovalStatusFilter = "pending",
) {
  let query = ctx.admin
    .from("profiles")
    .select(
      "id, email, full_name, roll_number, phone, semester, approval_status, rejection_reason, created_at, reviewed_at, reviewed_by, department_id, departments:department_id(name, slug)",
    )
    .eq("role", "student")
    .eq("approval_status", STATUS_MAP[status])
    .order(status === "pending" ? "created_at" : "reviewed_at", {
      ascending: status === "pending",
    });

  if (ctx.profile.role === "hod" || ctx.profile.role === "staff") {
    if (!ctx.profile.department_id) throw new Error("Your account is not assigned to a department");
    query = query.eq("department_id", ctx.profile.department_id);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}

export async function approveStudentApplication(ctx: VoContext, studentId: string) {
  const { data: student, error: fetchError } = await ctx.admin
    .from("profiles")
    .select("id, email, full_name, roll_number, department_id, approval_status, role")
    .eq("id", studentId)
    .single();

  if (fetchError || !student) throw new Error("Student not found");
  if (student.role !== "student" || student.approval_status !== "pending_review") {
    throw new Error("Student is not pending review");
  }
  assertDepartmentScope(ctx, student.department_id);

  if (student.roll_number) {
    const { data: dup } = await ctx.admin
      .from("profiles")
      .select("id, email")
      .eq("role", "student")
      .eq("approval_status", "approved")
      .ilike("roll_number", student.roll_number)
      .neq("id", studentId)
      .maybeSingle();
    if (dup) {
      throw new Error(
        `Duplicate roll number: an approved student already uses ${student.roll_number} (${dup.email}).`,
      );
    }
  }

  const reviewedAt = new Date().toISOString();
  const { data: row, error } = await ctx.admin
    .from("profiles")
    .update({
      approval_status: "approved",
      reviewed_by: ctx.userId,
      reviewed_at: reviewedAt,
      rejection_reason: null,
    })
    .eq("id", studentId)
    .select()
    .single();
  if (error) throw error;

  await writeVoAudit(ctx.admin, {
    officer: "student_approval",
    action: "approve",
    actorId: ctx.userId,
    entityType: "profile",
    entityId: studentId,
    summary: `Approved student ${student.full_name ?? student.email} (${student.roll_number ?? "no roll"})`,
    payload: { email: student.email, roll_number: student.roll_number, reviewedAt },
  });

  return row;
}

export async function rejectStudentApplication(
  ctx: VoContext,
  studentId: string,
  reason?: string,
) {
  const { data: student, error: fetchError } = await ctx.admin
    .from("profiles")
    .select("id, email, full_name, roll_number, department_id, approval_status, role")
    .eq("id", studentId)
    .single();

  if (fetchError || !student) throw new Error("Student not found");
  if (student.role !== "student" || student.approval_status !== "pending_review") {
    throw new Error("Student is not pending review");
  }
  assertDepartmentScope(ctx, student.department_id);

  const reviewedAt = new Date().toISOString();
  const rejection_reason = reason?.trim() || "Application not approved";
  const { data: row, error } = await ctx.admin
    .from("profiles")
    .update({
      approval_status: "rejected",
      rejection_reason,
      reviewed_by: ctx.userId,
      reviewed_at: reviewedAt,
    })
    .eq("id", studentId)
    .select()
    .single();
  if (error) throw error;

  await writeVoAudit(ctx.admin, {
    officer: "student_approval",
    action: "reject",
    actorId: ctx.userId,
    entityType: "profile",
    entityId: studentId,
    summary: `Rejected student ${student.full_name ?? student.email}: ${rejection_reason}`,
    payload: { email: student.email, rejection_reason, reviewedAt },
  });

  return row;
}

export async function getApprovalQueueCounts(ctx: VoContext) {
  const statuses = ["pending_review", "approved", "rejected"] as const;
  const counts = { pending: 0, approved: 0, rejected: 0 };

  for (const status of statuses) {
    let query = ctx.admin
      .from("profiles")
      .select("id", { count: "exact", head: true })
      .eq("role", "student")
      .eq("approval_status", status);

    if (ctx.profile.role === "hod" || ctx.profile.role === "staff") {
      if (!ctx.profile.department_id) continue;
      query = query.eq("department_id", ctx.profile.department_id);
    }

    const { count, error } = await query;
    if (error) throw error;
    if (status === "pending_review") counts.pending = count ?? 0;
    else if (status === "approved") counts.approved = count ?? 0;
    else counts.rejected = count ?? 0;
  }

  return counts;
}
