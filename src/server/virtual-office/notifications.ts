import { canManageAcademicData } from "@/lib/auth/roles";
import type { VoContext } from "@/server/virtual-office/auth";
import { assertDepartmentScope, writeVoAudit } from "@/server/virtual-office/auth";
import { resolveDepartmentByQuery } from "@/server/virtual-office/academic";
import { isStudentEmailConfigured, sendStudentEmail } from "@/server/virtual-office/email";

function assertNotifyAccess(ctx: VoContext) {
  if (!canManageAcademicData(ctx.profile.role)) {
    throw new Error("Notification Officer requires staff, HOD, principal, or admin");
  }
}

export async function prepareNotification(
  ctx: VoContext,
  input: {
    subject: string;
    body: string;
    departmentQuery?: string;
    semester?: number;
    autoQueue?: boolean;
  },
) {
  assertNotifyAccess(ctx);

  let departmentId: string | null = null;
  let departmentName: string | null = null;

  if (input.departmentQuery) {
    const dept = await resolveDepartmentByQuery(ctx, input.departmentQuery);
    if (!dept) {
      return {
        ok: false as const,
        needsClarification: true,
        message: `Department not found for “${input.departmentQuery}”.`,
      };
    }
    assertDepartmentScope(ctx, dept.id);
    departmentId = dept.id;
    departmentName = dept.name;
  } else if (ctx.profile.role === "hod" || ctx.profile.role === "staff") {
    assertDepartmentScope(ctx, ctx.profile.department_id);
    departmentId = ctx.profile.department_id;
  }

  let query = ctx.admin
    .from("profiles")
    .select("id, email, full_name, roll_number, semester, department_id")
    .eq("role", "student")
    .eq("approval_status", "approved");

  if (departmentId) query = query.eq("department_id", departmentId);
  if (input.semester != null) {
    query = query.or(`semester.eq.${input.semester},semester.is.null`);
  }

  const { data: students, error } = await query;
  if (error) throw error;

  // Prefer exact semester match; include null-semester only when no exact peers exist for that roll set
  let recipients = students ?? [];
  if (input.semester != null) {
    const exact = recipients.filter((s) => s.semester === input.semester);
    if (exact.length > 0) recipients = exact;
  }

  if (recipients.length === 0) {
    return {
      ok: false as const,
      needsClarification: true,
      message: `No approved students found for ${departmentName ?? "selected audience"}${input.semester ? ` semester ${input.semester}` : ""}.`,
    };
  }

  const audience = {
    department_id: departmentId,
    department_name: departmentName,
    semester: input.semester ?? null,
  };

  const status = input.autoQueue ? "queued" : "pending_review";

  const { data: notification, error: nErr } = await ctx.admin
    .from("vo_notifications")
    .insert({
      status,
      subject: input.subject,
      body: input.body,
      audience,
      recipient_count: recipients.length,
      created_by: ctx.userId,
    })
    .select()
    .single();
  if (nErr) throw nErr;

  const recipientRows = recipients.map((s) => ({
    notification_id: notification.id,
    student_id: s.id,
    email: s.email,
    status: "pending" as const,
  }));

  const { error: rErr } = await ctx.admin.from("vo_notification_recipients").insert(recipientRows);
  if (rErr) throw rErr;

  await writeVoAudit(ctx.admin, {
    officer: "student_notification",
    action: "prepare",
    actorId: ctx.userId,
    entityType: "vo_notification",
    entityId: notification.id,
    summary: `Prepared notification “${input.subject}” for ${recipients.length} students`,
    payload: { audience, emailConfigured: isStudentEmailConfigured() },
  });

  return {
    ok: true as const,
    notification,
    recipientCount: recipients.length,
    emailConfigured: isStudentEmailConfigured(),
    previewRecipients: recipients.slice(0, 8).map((s) => ({
      name: s.full_name,
      email: s.email,
      roll: s.roll_number,
      semester: s.semester,
    })),
  };
}

export async function reviewAndSendNotification(ctx: VoContext, notificationId: string) {
  assertNotifyAccess(ctx);

  const { data: notification, error } = await ctx.admin
    .from("vo_notifications")
    .select("*")
    .eq("id", notificationId)
    .single();
  if (error || !notification) throw new Error("Notification not found");
  if (!["pending_review", "queued", "failed"].includes(notification.status)) {
    throw new Error(`Cannot send notification in status “${notification.status}”`);
  }

  const { data: recipients, error: rErr } = await ctx.admin
    .from("vo_notification_recipients")
    .select("*")
    .eq("notification_id", notificationId)
    .in("status", ["pending", "failed"]);
  if (rErr) throw rErr;

  if (!isStudentEmailConfigured()) {
    await ctx.admin
      .from("vo_notifications")
      .update({
        status: "failed",
        error_message:
          "RESEND_API_KEY not configured. Notification retained for history; no emails were sent.",
        reviewed_by: ctx.userId,
        reviewed_at: new Date().toISOString(),
      })
      .eq("id", notificationId);

    await writeVoAudit(ctx.admin, {
      officer: "student_notification",
      action: "send_blocked_unconfigured",
      actorId: ctx.userId,
      entityType: "vo_notification",
      entityId: notificationId,
      summary: "Send blocked — email provider not configured",
    });

    return {
      ok: false as const,
      message:
        "Email provider not configured. Set RESEND_API_KEY (and optionally VO_EMAIL_FROM) on the server, then retry send.",
      notificationId,
    };
  }

  let sent = 0;
  let failed = 0;

  for (const recipient of recipients ?? []) {
    const result = await sendStudentEmail({
      to: recipient.email,
      subject: notification.subject,
      body: notification.body,
    });
    const now = new Date().toISOString();
    if (result.ok) {
      sent += 1;
      await ctx.admin
        .from("vo_notification_recipients")
        .update({ status: "sent", sent_at: now, error_message: null })
        .eq("id", recipient.id);
    } else {
      failed += 1;
      await ctx.admin
        .from("vo_notification_recipients")
        .update({ status: "failed", error_message: result.error ?? "send failed" })
        .eq("id", recipient.id);
    }
  }

  const finalStatus = failed === 0 ? "sent" : sent === 0 ? "failed" : "sent";
  const now = new Date().toISOString();
  await ctx.admin
    .from("vo_notifications")
    .update({
      status: finalStatus,
      sent_at: now,
      reviewed_by: ctx.userId,
      reviewed_at: now,
      error_message: failed > 0 ? `${failed} recipient(s) failed` : null,
    })
    .eq("id", notificationId);

  await writeVoAudit(ctx.admin, {
    officer: "student_notification",
    action: "send",
    actorId: ctx.userId,
    entityType: "vo_notification",
    entityId: notificationId,
    summary: `Sent notification “${notification.subject}” — ${sent} sent, ${failed} failed`,
    payload: { sent, failed },
  });

  return { ok: true as const, sent, failed, notificationId };
}

export async function cancelNotification(ctx: VoContext, notificationId: string) {
  assertNotifyAccess(ctx);
  const { data, error } = await ctx.admin
    .from("vo_notifications")
    .update({ status: "cancelled" })
    .eq("id", notificationId)
    .in("status", ["pending_review", "queued"])
    .select()
    .single();
  if (error) throw error;
  await writeVoAudit(ctx.admin, {
    officer: "student_notification",
    action: "cancel",
    actorId: ctx.userId,
    entityType: "vo_notification",
    entityId: notificationId,
    summary: `Cancelled notification ${notificationId}`,
  });
  return data;
}

export async function listNotifications(ctx: VoContext, limit = 30) {
  assertNotifyAccess(ctx);
  let query = ctx.admin
    .from("vo_notifications")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);

  // HOD/staff: filter by audience department when set
  const { data, error } = await query;
  if (error) throw error;

  if (ctx.profile.role === "hod" || ctx.profile.role === "staff") {
    return (data ?? []).filter((n) => {
      const aud = n.audience as { department_id?: string | null };
      return !aud?.department_id || aud.department_id === ctx.profile.department_id;
    });
  }
  return data ?? [];
}
