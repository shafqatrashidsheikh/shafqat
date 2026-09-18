import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { canManageWebsiteContent, canManageAcademicData } from "@/lib/auth/roles";
import { parseVirtualOfficeCommand } from "@/lib/virtual-office/command-parser";
import { VO_OFFICERS, type VoOfficerCard } from "@/lib/virtual-office/types";
import {
  requireVirtualOfficeUser,
  writeVoAudit,
} from "@/server/virtual-office/auth";
import {
  approveStudentApplication,
  getApprovalQueueCounts,
  listStudentApplications,
  rejectStudentApplication,
} from "@/server/virtual-office/approvals";
import {
  computeAttendanceSummary,
  computeMarksSummary,
  resolveDepartmentByQuery,
  uploadAttendance,
  uploadMarks,
} from "@/server/virtual-office/academic";
import {
  cancelWebsiteDraft,
  confirmWebsiteDraft,
  createWebsiteDraft,
  listWebsiteDrafts,
  revertWebsiteDraft,
} from "@/server/virtual-office/website";
import {
  cancelNotification,
  listNotifications,
  prepareNotification,
  reviewAndSendNotification,
} from "@/server/virtual-office/notifications";
import { isStudentEmailConfigured } from "@/server/virtual-office/email";

const tokenSchema = z.object({ accessToken: z.string().min(1) });

export const voGetOverview = createServerFn({ method: "GET" })
  .validator(tokenSchema)
  .handler(async ({ data }) => {
    const ctx = await requireVirtualOfficeUser(data.accessToken);
    const counts = await getApprovalQueueCounts(ctx);

    const { data: recentAudit, error: auditErr } = await ctx.admin
      .from("vo_audit_log")
      .select("officer, action, summary, created_at")
      .order("created_at", { ascending: false })
      .limit(12);
    if (auditErr) {
      console.warn("[voGetOverview] audit unavailable — apply Virtual Office migration:", auditErr.message);
    }

    const { count: pendingDraftCount } = canManageWebsiteContent(ctx.profile.role)
      ? await ctx.admin
          .from("vo_content_drafts")
          .select("id", { count: "exact", head: true })
          .eq("status", "pending_confirm")
      : { count: 0 };

    const { count: pendingNotices } = await ctx.admin
      .from("vo_notifications")
      .select("id", { count: "exact", head: true })
      .eq("status", "pending_review");

    const latestByOfficer = (officer: string) =>
      recentAudit?.find((a) => a.officer === officer)?.summary ?? "No recent activity";

    const officers: VoOfficerCard[] = VO_OFFICERS.map((base) => {
      if (base.id === "student_approval") {
        return {
          ...base,
          statusLabel: counts.pending > 0 ? `${counts.pending} pending` : "Queue clear",
          statusTone: counts.pending > 0 ? "attention" : "ready",
          recentActivity: latestByOfficer("student_approval"),
          counts,
        };
      }
      if (base.id === "academic_data") {
        return {
          ...base,
          statusLabel: canManageAcademicData(ctx.profile.role) ? "Ready for upload" : "No access",
          statusTone: "ready",
          recentActivity: latestByOfficer("academic_data"),
        };
      }
      if (base.id === "website_management") {
        const draftCount = pendingDraftCount ?? 0;
        const allowed = canManageWebsiteContent(ctx.profile.role);
        return {
          ...base,
          statusLabel: !allowed
            ? "Admin/principal only"
            : draftCount > 0
              ? `${draftCount} awaiting confirm`
              : "Ready",
          statusTone: !allowed ? "idle" : draftCount > 0 ? "attention" : "ready",
          recentActivity: latestByOfficer("website_management"),
        };
      }
      return {
        ...base,
        statusLabel:
          (pendingNotices ?? 0) > 0
            ? `${pendingNotices} awaiting review`
            : isStudentEmailConfigured()
              ? "Ready"
              : "Email not configured",
        statusTone: (pendingNotices ?? 0) > 0 ? "attention" : "ready",
        recentActivity: latestByOfficer("student_notification"),
      };
    });

    return {
      officers,
      recentAudit: recentAudit ?? [],
      emailConfigured: isStudentEmailConfigured(),
      role: ctx.profile.role,
      canWebsite: canManageWebsiteContent(ctx.profile.role),
      canAcademic: canManageAcademicData(ctx.profile.role),
    };
  });

export const voListApprovals = createServerFn({ method: "GET" })
  .validator(
    tokenSchema.extend({
      status: z.enum(["pending", "approved", "rejected"]).default("pending"),
    }),
  )
  .handler(async ({ data }) => {
    const ctx = await requireVirtualOfficeUser(data.accessToken);
    const rows = await listStudentApplications(ctx, data.status);
    return { rows, status: data.status };
  });

export const voApproveStudent = createServerFn({ method: "POST" })
  .validator(tokenSchema.extend({ studentId: z.string().uuid() }))
  .handler(async ({ data }) => {
    const ctx = await requireVirtualOfficeUser(data.accessToken);
    return approveStudentApplication(ctx, data.studentId);
  });

export const voRejectStudent = createServerFn({ method: "POST" })
  .validator(
    tokenSchema.extend({
      studentId: z.string().uuid(),
      rejection_reason: z.string().optional(),
    }),
  )
  .handler(async ({ data }) => {
    const ctx = await requireVirtualOfficeUser(data.accessToken);
    return rejectStudentApplication(ctx, data.studentId, data.rejection_reason);
  });

export const voUploadAttendance = createServerFn({ method: "POST" })
  .validator(
    tokenSchema.extend({
      departmentQuery: z.string().min(2),
      semester: z.number().int().min(1).max(6),
      subjectName: z.string().min(2),
      sessionDate: z.string().optional(),
      dataBlock: z.string().min(3),
    }),
  )
  .handler(async ({ data }) => {
    const ctx = await requireVirtualOfficeUser(data.accessToken);
    return uploadAttendance(ctx, {
      departmentQuery: data.departmentQuery,
      semester: data.semester,
      subjectName: data.subjectName,
      sessionDate: data.sessionDate ?? new Date().toISOString().slice(0, 10),
      dataBlock: data.dataBlock,
    });
  });

export const voUploadMarks = createServerFn({ method: "POST" })
  .validator(
    tokenSchema.extend({
      departmentQuery: z.string().min(2),
      semester: z.number().int().min(1).max(6),
      subjectName: z.string().min(2),
      examType: z
        .enum(["internal", "external", "practical", "assignment", "other"])
        .default("internal"),
      maxMarks: z.number().positive().default(100),
      dataBlock: z.string().min(3),
    }),
  )
  .handler(async ({ data }) => {
    const ctx = await requireVirtualOfficeUser(data.accessToken);
    return uploadMarks(ctx, {
      departmentQuery: data.departmentQuery,
      semester: data.semester,
      subjectName: data.subjectName,
      examType: data.examType,
      maxMarks: data.maxMarks,
      dataBlock: data.dataBlock,
    });
  });

export const voAttendanceSummary = createServerFn({ method: "GET" })
  .validator(
    tokenSchema.extend({
      departmentQuery: z.string().min(2),
      semester: z.number().int().min(1).max(6),
      subjectName: z.string().optional(),
    }),
  )
  .handler(async ({ data }) => {
    const ctx = await requireVirtualOfficeUser(data.accessToken);
    const dept = await resolveDepartmentByQuery(ctx, data.departmentQuery);
    if (!dept) throw new Error(`Department not found: ${data.departmentQuery}`);
    let subjectId: string | undefined;
    if (data.subjectName) {
      const { data: sub } = await ctx.admin
        .from("academic_subjects")
        .select("id")
        .eq("department_id", dept.id)
        .eq("semester", data.semester)
        .ilike("name", data.subjectName)
        .maybeSingle();
      subjectId = sub?.id;
    }
    return computeAttendanceSummary(ctx, {
      departmentId: dept.id,
      semester: data.semester,
      ...(subjectId ? { subjectId } : {}),
    });
  });

export const voMarksSummary = createServerFn({ method: "GET" })
  .validator(
    tokenSchema.extend({
      departmentQuery: z.string().min(2),
      semester: z.number().int().min(1).max(6),
      subjectName: z.string().optional(),
      examType: z.string().optional(),
    }),
  )
  .handler(async ({ data }) => {
    const ctx = await requireVirtualOfficeUser(data.accessToken);
    const dept = await resolveDepartmentByQuery(ctx, data.departmentQuery);
    if (!dept) throw new Error(`Department not found: ${data.departmentQuery}`);
    let subjectId: string | undefined;
    if (data.subjectName) {
      const { data: sub } = await ctx.admin
        .from("academic_subjects")
        .select("id")
        .eq("department_id", dept.id)
        .eq("semester", data.semester)
        .ilike("name", data.subjectName)
        .maybeSingle();
      subjectId = sub?.id;
    }
    return computeMarksSummary(ctx, {
      departmentId: dept.id,
      semester: data.semester,
      ...(subjectId ? { subjectId } : {}),
      ...(data.examType ? { examType: data.examType } : {}),
    });
  });

export const voListWebsiteDrafts = createServerFn({ method: "GET" })
  .validator(tokenSchema)
  .handler(async ({ data }) => {
    const ctx = await requireVirtualOfficeUser(data.accessToken);
    return listWebsiteDrafts(ctx);
  });

export const voConfirmWebsiteDraft = createServerFn({ method: "POST" })
  .validator(tokenSchema.extend({ draftId: z.string().uuid() }))
  .handler(async ({ data }) => {
    const ctx = await requireVirtualOfficeUser(data.accessToken);
    return confirmWebsiteDraft(ctx, data.draftId);
  });

export const voRevertWebsiteDraft = createServerFn({ method: "POST" })
  .validator(tokenSchema.extend({ draftId: z.string().uuid() }))
  .handler(async ({ data }) => {
    const ctx = await requireVirtualOfficeUser(data.accessToken);
    return revertWebsiteDraft(ctx, data.draftId);
  });

export const voCancelWebsiteDraft = createServerFn({ method: "POST" })
  .validator(tokenSchema.extend({ draftId: z.string().uuid() }))
  .handler(async ({ data }) => {
    const ctx = await requireVirtualOfficeUser(data.accessToken);
    return cancelWebsiteDraft(ctx, data.draftId);
  });

export const voPrepareNotification = createServerFn({ method: "POST" })
  .validator(
    tokenSchema.extend({
      subject: z.string().min(3),
      body: z.string().min(3),
      departmentQuery: z.string().optional(),
      semester: z.number().int().min(1).max(6).optional(),
    }),
  )
  .handler(async ({ data }) => {
    const ctx = await requireVirtualOfficeUser(data.accessToken);
    return prepareNotification(ctx, {
      subject: data.subject,
      body: data.body,
      ...(data.departmentQuery ? { departmentQuery: data.departmentQuery } : {}),
      ...(data.semester != null ? { semester: data.semester } : {}),
    });
  });

export const voSendNotification = createServerFn({ method: "POST" })
  .validator(tokenSchema.extend({ notificationId: z.string().uuid() }))
  .handler(async ({ data }) => {
    const ctx = await requireVirtualOfficeUser(data.accessToken);
    return reviewAndSendNotification(ctx, data.notificationId);
  });

export const voCancelNotification = createServerFn({ method: "POST" })
  .validator(tokenSchema.extend({ notificationId: z.string().uuid() }))
  .handler(async ({ data }) => {
    const ctx = await requireVirtualOfficeUser(data.accessToken);
    return cancelNotification(ctx, data.notificationId);
  });

export const voListNotifications = createServerFn({ method: "GET" })
  .validator(tokenSchema)
  .handler(async ({ data }) => {
    const ctx = await requireVirtualOfficeUser(data.accessToken);
    return listNotifications(ctx);
  });

export const voRunCommand = createServerFn({ method: "POST" })
  .validator(tokenSchema.extend({ command: z.string().min(1).max(4000) }))
  .handler(async ({ data }) => {
    const ctx = await requireVirtualOfficeUser(data.accessToken);
    const parsed = parseVirtualOfficeCommand(data.command);

    await writeVoAudit(ctx.admin, {
      officer: parsed.officer ?? "student_approval",
      action: "command",
      actorId: ctx.userId,
      summary: `Command: ${parsed.summary}`,
      payload: { command: data.command, parsed },
    });

    if (parsed.intent === "unknown" || parsed.intent === "clarify") {
      return { parsed, result: null, message: parsed.clarification ?? parsed.summary };
    }

    if (parsed.officer === "student_approval") {
      if (
        parsed.intent === "list_approvals_by_status" ||
        parsed.intent === "list_pending_approvals"
      ) {
        const status = parsed.statusFilter ?? "pending";
        const rows = await listStudentApplications(ctx, status);
        return {
          parsed,
          result: { type: "approvals", status, rows },
          message: `${rows.length} ${status} application(s).`,
        };
      }
      return {
        parsed,
        result: { type: "open_officer", officer: "student_approval" },
        message: parsed.clarification ?? "Open Student Approval Officer to complete this action.",
      };
    }

    if (parsed.officer === "academic_data") {
      if (parsed.intent === "upload_attendance") {
        if (!parsed.departmentQuery || !parsed.semester || !parsed.subjectQuery || !parsed.rawDataBlock) {
          return { parsed, result: null, message: parsed.clarification ?? "Need department, semester, subject, and data." };
        }
        const result = await uploadAttendance(ctx, {
          departmentQuery: parsed.departmentQuery,
          semester: parsed.semester,
          subjectName: parsed.subjectQuery,
          sessionDate: new Date().toISOString().slice(0, 10),
          dataBlock: parsed.rawDataBlock,
        });
        return {
          parsed,
          result: { type: "attendance_upload", ...result },
          message: result.ok
            ? `Uploaded ${result.uploaded} attendance row(s).`
            : result.message,
        };
      }
      if (parsed.intent === "upload_marks") {
        if (!parsed.departmentQuery || !parsed.semester || !parsed.subjectQuery || !parsed.rawDataBlock) {
          return { parsed, result: null, message: parsed.clarification ?? "Need department, semester, subject, and marks data." };
        }
        const result = await uploadMarks(ctx, {
          departmentQuery: parsed.departmentQuery,
          semester: parsed.semester,
          subjectName: parsed.subjectQuery,
          examType: parsed.examType ?? "internal",
          maxMarks: 100,
          dataBlock: parsed.rawDataBlock,
        });
        return {
          parsed,
          result: { type: "marks_upload", ...result },
          message: result.ok ? `Uploaded ${result.uploaded} marks row(s).` : result.message,
        };
      }
      if (parsed.intent === "show_attendance_summary" && parsed.departmentQuery && parsed.semester) {
        const dept = await resolveDepartmentByQuery(ctx, parsed.departmentQuery);
        if (!dept) return { parsed, result: null, message: "Department not found." };
        const summary = await computeAttendanceSummary(ctx, {
          departmentId: dept.id,
          semester: parsed.semester,
        });
        return {
          parsed,
          result: { type: "attendance_summary", department: dept, summary },
          message: `Attendance summary for ${dept.name} semester ${parsed.semester}.`,
        };
      }
      if (parsed.intent === "show_marks_summary" && parsed.departmentQuery && parsed.semester) {
        const dept = await resolveDepartmentByQuery(ctx, parsed.departmentQuery);
        if (!dept) return { parsed, result: null, message: "Department not found." };
        const summary = await computeMarksSummary(ctx, {
          departmentId: dept.id,
          semester: parsed.semester,
        });
        return {
          parsed,
          result: { type: "marks_summary", department: dept, summary },
          message: `Marks summary for ${dept.name} semester ${parsed.semester}.`,
        };
      }
      return {
        parsed,
        result: { type: "open_officer", officer: "academic_data" },
        message: parsed.clarification ?? "Open Academic Data Officer.",
      };
    }

    if (parsed.officer === "website_management") {
      if (!canManageWebsiteContent(ctx.profile.role)) {
        return {
          parsed,
          result: null,
          message: "Website Management Officer requires admin or principal access.",
        };
      }
      const draftResult = await createWebsiteDraft(ctx, {
        instruction: data.command,
        intent: parsed.intent,
        ...(parsed.pageHint ? { pageHint: parsed.pageHint } : {}),
        ...(parsed.sectionHint ? { sectionHint: parsed.sectionHint } : {}),
        ...(parsed.newText ? { newText: parsed.newText } : {}),
        ...(parsed.noticeTitle ? { noticeTitle: parsed.noticeTitle } : {}),
      });
      return {
        parsed,
        result: { type: "website_draft", ...draftResult },
        message: draftResult.ok
          ? `Preview ready — confirm before applying: ${draftResult.draft.preview_summary}`
          : draftResult.message,
      };
    }

    if (parsed.officer === "student_notification") {
      const subject =
        parsed.departmentQuery && parsed.semester
          ? `${parsed.departmentQuery} — Semester ${parsed.semester} update`
          : "Important update from GPW Srinagar";
      const body =
        parsed.newText?.trim() ||
        data.command.trim() ||
        "Please check the student portal for details.";
      const prepared = await prepareNotification(ctx, {
        subject,
        body,
        ...(parsed.departmentQuery ? { departmentQuery: parsed.departmentQuery } : {}),
        ...(parsed.semester != null ? { semester: parsed.semester } : {}),
      });
      return {
        parsed,
        result: { type: "notification_draft", ...prepared },
        message: prepared.ok
          ? `Notification prepared for ${prepared.recipientCount} student(s). Review before sending.`
          : prepared.message,
      };
    }

    return { parsed, result: null, message: parsed.clarification ?? "Unhandled command." };
  });
