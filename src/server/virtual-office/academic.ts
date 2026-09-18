import { ATTENDANCE_THRESHOLD_PCT } from "@/lib/virtual-office/types";
import type { VoContext } from "@/server/virtual-office/auth";
import { assertDepartmentScope, writeVoAudit } from "@/server/virtual-office/auth";

export type ResolvedDepartment = { id: string; name: string; slug: string };

export async function resolveDepartmentByQuery(
  ctx: VoContext,
  query: string | undefined,
): Promise<ResolvedDepartment | null> {
  if (!query) return null;
  const { data: rows, error } = await ctx.admin
    .from("departments")
    .select("id, name, slug")
    .eq("is_active", true);
  if (error) throw error;
  const q = query.toLowerCase().trim();
  const match =
    rows?.find((d) => d.name.toLowerCase() === q) ||
    rows?.find((d) => d.name.toLowerCase().includes(q) || q.includes(d.name.toLowerCase())) ||
    rows?.find((d) => d.slug.replace(/-/g, " ").includes(q.replace(/&/g, "and")));
  return match ?? null;
}

export async function ensureSubject(
  ctx: VoContext,
  input: { departmentId: string; semester: number; name: string; code?: string },
) {
  assertDepartmentScope(ctx, input.departmentId);
  const name = input.name.trim();
  const { data: existing } = await ctx.admin
    .from("academic_subjects")
    .select("*")
    .eq("department_id", input.departmentId)
    .eq("semester", input.semester)
    .ilike("name", name)
    .maybeSingle();

  if (existing) return existing;

  const { data: created, error } = await ctx.admin
    .from("academic_subjects")
    .insert({
      department_id: input.departmentId,
      semester: input.semester,
      name,
      code: input.code ?? null,
    })
    .select()
    .single();
  if (error) throw error;
  return created;
}

export type AttendanceLine = { rollNumber: string; present: boolean };
export type MarksLine = { rollNumber: string; marks: number };

export function parseAttendanceLines(block: string): AttendanceLine[] {
  const lines = block
    .split(/[\n,;]+/)
    .map((l) => l.trim())
    .filter(Boolean);
  const out: AttendanceLine[] = [];
  for (const line of lines) {
    const m = line.match(/^([A-Za-z0-9\-/]+)\s*[-:=]?\s*(present|absent|p|a|yes|no|1|0)\b/i);
    if (!m?.[1] || !m[2]) continue;
    const flag = (m[2] ?? "").toLowerCase();
    const present = ["present", "p", "yes", "1"].includes(flag);
    out.push({ rollNumber: (m[1] ?? "").trim(), present });
  }
  return out;
}

export function parseMarksLines(block: string): MarksLine[] {
  const lines = block
    .split(/[\n,;]+/)
    .map((l) => l.trim())
    .filter(Boolean);
  const out: MarksLine[] = [];
  for (const line of lines) {
    const m = line.match(/^([A-Za-z0-9\-/]+)\s*[-:=]?\s*(\d+(?:\.\d+)?)\b/);
    if (!m?.[1] || !m[2]) continue;
    out.push({ rollNumber: m[1].trim(), marks: Number(m[2]) });
  }
  return out;
}

async function mapRollsToStudents(
  ctx: VoContext,
  departmentId: string,
  rolls: string[],
  semester?: number,
) {
  let query = ctx.admin
    .from("profiles")
    .select("id, email, full_name, roll_number, semester, department_id")
    .eq("role", "student")
    .eq("approval_status", "approved")
    .eq("department_id", departmentId)
    .in(
      "roll_number",
      rolls.map((r) => r),
    );

  if (semester != null) {
    query = query.or(`semester.eq.${semester},semester.is.null`);
  }

  const { data, error } = await query;
  if (error) throw error;

  const byRoll = new Map(
    (data ?? []).map((s) => [String(s.roll_number).toLowerCase(), s]),
  );
  const matched: Array<{ student: (typeof data)[number]; rollNumber: string }> = [];
  const missing: string[] = [];
  for (const roll of rolls) {
    const s = byRoll.get(roll.toLowerCase());
    if (s) matched.push({ student: s, rollNumber: roll });
    else missing.push(roll);
  }
  return { matched, missing };
}

export async function uploadAttendance(ctx: VoContext, input: {
  departmentQuery: string;
  semester: number;
  subjectName: string;
  sessionDate: string;
  dataBlock: string;
}) {
  const dept = await resolveDepartmentByQuery(ctx, input.departmentQuery);
  if (!dept) {
    return { ok: false as const, needsClarification: true, message: `Department not found for “${input.departmentQuery}”.` };
  }
  assertDepartmentScope(ctx, dept.id);

  const lines = parseAttendanceLines(input.dataBlock);
  if (lines.length === 0) {
    return {
      ok: false as const,
      needsClarification: true,
      message:
        "Could not parse attendance. Use lines like: 21CSE01 present, 21CSE02 absent (or P/A).",
    };
  }

  const subject = await ensureSubject(ctx, {
    departmentId: dept.id,
    semester: input.semester,
    name: input.subjectName,
  });

  const { matched, missing } = await mapRollsToStudents(
    ctx,
    dept.id,
    lines.map((l) => l.rollNumber),
    input.semester,
  );

  if (matched.length === 0) {
    return {
      ok: false as const,
      needsClarification: true,
      message: `No approved students matched these roll numbers in ${dept.name}. Missing: ${missing.join(", ")}`,
      missing,
    };
  }

  const batchId = crypto.randomUUID();
  const presentByRoll = new Map(lines.map((l) => [l.rollNumber.toLowerCase(), l.present]));
  const rows = matched.map(({ student, rollNumber }) => ({
    subject_id: subject.id,
    student_id: student.id,
    session_date: input.sessionDate,
    present: presentByRoll.get(rollNumber.toLowerCase()) ?? false,
    uploaded_by: ctx.userId,
    upload_batch_id: batchId,
  }));

  const { error } = await ctx.admin.from("academic_attendance").upsert(rows, {
    onConflict: "subject_id,student_id,session_date",
  });
  if (error) throw error;

  // Align semester on matched students if null
  for (const { student } of matched) {
    if (student.semester == null) {
      await ctx.admin.from("profiles").update({ semester: input.semester }).eq("id", student.id);
    }
  }

  await writeVoAudit(ctx.admin, {
    officer: "academic_data",
    action: "upload_attendance",
    actorId: ctx.userId,
    entityType: "academic_subject",
    entityId: subject.id,
    summary: `Uploaded attendance for ${subject.name} (${dept.name} sem ${input.semester}) — ${rows.length} rows`,
    payload: {
      batchId,
      sessionDate: input.sessionDate,
      missing,
      count: rows.length,
    },
  });

  const summary = await computeAttendanceSummary(ctx, {
    subjectId: subject.id,
    departmentId: dept.id,
    semester: input.semester,
  });

  return {
    ok: true as const,
    batchId,
    uploaded: rows.length,
    missing,
    subject,
    department: dept,
    summary,
  };
}

export async function uploadMarks(ctx: VoContext, input: {
  departmentQuery: string;
  semester: number;
  subjectName: string;
  examType: "internal" | "external" | "practical" | "assignment" | "other";
  maxMarks: number;
  dataBlock: string;
}) {
  const dept = await resolveDepartmentByQuery(ctx, input.departmentQuery);
  if (!dept) {
    return { ok: false as const, needsClarification: true, message: `Department not found for “${input.departmentQuery}”.` };
  }
  assertDepartmentScope(ctx, dept.id);

  const lines = parseMarksLines(input.dataBlock);
  if (lines.length === 0) {
    return {
      ok: false as const,
      needsClarification: true,
      message: "Could not parse marks. Use lines like: 21CSE01 42, 21CSE02 38",
    };
  }

  const subject = await ensureSubject(ctx, {
    departmentId: dept.id,
    semester: input.semester,
    name: input.subjectName,
  });

  const { matched, missing } = await mapRollsToStudents(
    ctx,
    dept.id,
    lines.map((l) => l.rollNumber),
    input.semester,
  );

  if (matched.length === 0) {
    return {
      ok: false as const,
      needsClarification: true,
      message: `No approved students matched. Missing: ${missing.join(", ")}`,
      missing,
    };
  }

  const batchId = crypto.randomUUID();
  const marksByRoll = new Map(lines.map((l) => [l.rollNumber.toLowerCase(), l.marks]));
  const rows = matched.map(({ student, rollNumber }) => ({
    subject_id: subject.id,
    student_id: student.id,
    exam_type: input.examType,
    marks: marksByRoll.get(rollNumber.toLowerCase())!,
    max_marks: input.maxMarks,
    uploaded_by: ctx.userId,
    upload_batch_id: batchId,
    updated_at: new Date().toISOString(),
  }));

  const { error } = await ctx.admin.from("academic_marks").upsert(rows, {
    onConflict: "subject_id,student_id,exam_type",
  });
  if (error) throw error;

  for (const { student } of matched) {
    if (student.semester == null) {
      await ctx.admin.from("profiles").update({ semester: input.semester }).eq("id", student.id);
    }
  }

  await writeVoAudit(ctx.admin, {
    officer: "academic_data",
    action: "upload_marks",
    actorId: ctx.userId,
    entityType: "academic_subject",
    entityId: subject.id,
    summary: `Uploaded ${input.examType} marks for ${subject.name} (${dept.name} sem ${input.semester}) — ${rows.length} rows`,
    payload: { batchId, missing, count: rows.length, examType: input.examType },
  });

  const summary = await computeMarksSummary(ctx, {
    subjectId: subject.id,
    departmentId: dept.id,
    semester: input.semester,
    examType: input.examType,
  });

  return {
    ok: true as const,
    batchId,
    uploaded: rows.length,
    missing,
    subject,
    department: dept,
    summary,
  };
}

export async function computeAttendanceSummary(
  ctx: VoContext,
  input: { subjectId?: string; departmentId: string; semester: number },
) {
  assertDepartmentScope(ctx, input.departmentId);

  let subjectQuery = ctx.admin
    .from("academic_subjects")
    .select("id, name, semester, department_id")
    .eq("department_id", input.departmentId)
    .eq("semester", input.semester)
    .eq("is_active", true);

  if (input.subjectId) subjectQuery = subjectQuery.eq("id", input.subjectId);

  const { data: subjects, error: subErr } = await subjectQuery;
  if (subErr) throw subErr;
  if (!subjects?.length) {
    return {
      threshold: ATTENDANCE_THRESHOLD_PCT,
      students: [] as Array<{
        studentId: string;
        name: string | null;
        roll: string | null;
        present: number;
        total: number;
        percentage: number;
        meetsRequirement: boolean;
        detentionRisk: boolean;
      }>,
      below75: [] as string[],
      meeting75: [] as string[],
      detentionRisk: [] as string[],
    };
  }

  const subjectIds = subjects.map((s) => s.id);
  const { data: rows, error } = await ctx.admin
    .from("academic_attendance")
    .select("student_id, present, subject_id, profiles:student_id(full_name, roll_number)")
    .in("subject_id", subjectIds);
  if (error) throw error;

  type Agg = {
    studentId: string;
    name: string | null;
    roll: string | null;
    present: number;
    total: number;
  };
  const map = new Map<string, Agg>();
  for (const row of rows ?? []) {
    const profileRaw = row.profiles as
      | { full_name: string | null; roll_number: string | null }
      | { full_name: string | null; roll_number: string | null }[]
      | null;
    const profile = Array.isArray(profileRaw) ? profileRaw[0] : profileRaw;
    const cur = map.get(row.student_id) ?? {
      studentId: row.student_id,
      name: profile?.full_name ?? null,
      roll: profile?.roll_number ?? null,
      present: 0,
      total: 0,
    };
    cur.total += 1;
    if (row.present) cur.present += 1;
    map.set(row.student_id, cur);
  }

  const students = [...map.values()].map((s) => {
    const percentage = s.total === 0 ? 0 : Math.round((s.present / s.total) * 1000) / 10;
    const meetsRequirement = percentage >= ATTENDANCE_THRESHOLD_PCT;
    return {
      ...s,
      percentage,
      meetsRequirement,
      detentionRisk: !meetsRequirement && s.total > 0,
    };
  });

  students.sort((a, b) => a.percentage - b.percentage);

  return {
    threshold: ATTENDANCE_THRESHOLD_PCT,
    subjects: subjects.map((s) => ({ id: s.id, name: s.name })),
    students,
    below75: students.filter((s) => !s.meetsRequirement).map((s) => s.roll ?? s.studentId),
    meeting75: students.filter((s) => s.meetsRequirement).map((s) => s.roll ?? s.studentId),
    detentionRisk: students.filter((s) => s.detentionRisk).map((s) => s.roll ?? s.studentId),
  };
}

export async function computeMarksSummary(
  ctx: VoContext,
  input: {
    subjectId?: string;
    departmentId: string;
    semester: number;
    examType?: string;
  },
) {
  assertDepartmentScope(ctx, input.departmentId);

  let subjectQuery = ctx.admin
    .from("academic_subjects")
    .select("id, name")
    .eq("department_id", input.departmentId)
    .eq("semester", input.semester)
    .eq("is_active", true);
  if (input.subjectId) subjectQuery = subjectQuery.eq("id", input.subjectId);

  const { data: subjects, error: subErr } = await subjectQuery;
  if (subErr) throw subErr;

  const subjectIds = (subjects ?? []).map((s) => s.id);
  if (!subjectIds.length) {
    return {
      bySubject: [],
      highest: null,
      topStudents: [],
      averages: { mean: 0, count: 0 },
    };
  }

  let marksQuery = ctx.admin
    .from("academic_marks")
    .select(
      "marks, max_marks, exam_type, subject_id, student_id, profiles:student_id(full_name, roll_number), academic_subjects:subject_id(name)",
    )
    .in("subject_id", subjectIds);
  if (input.examType) marksQuery = marksQuery.eq("exam_type", input.examType);

  const { data: rows, error } = await marksQuery;
  if (error) throw error;

  type MarkEntry = {
    studentId: string;
    name: string | null;
    roll: string | null;
    marks: number;
    maxMarks: number;
    pct: number;
  };

  const bySubject = new Map<
    string,
    {
      subjectId: string;
      subjectName: string;
      entries: MarkEntry[];
    }
  >();

  for (const row of rows ?? []) {
    const profileRaw = row.profiles as
      | { full_name: string | null; roll_number: string | null }
      | { full_name: string | null; roll_number: string | null }[]
      | null;
    const profile = Array.isArray(profileRaw) ? profileRaw[0] : profileRaw;
    const subjectRaw = row.academic_subjects as { name: string } | { name: string }[] | null;
    const subject = Array.isArray(subjectRaw) ? subjectRaw[0] : subjectRaw;
    const bucket =
      bySubject.get(row.subject_id) ??
      {
        subjectId: row.subject_id,
        subjectName: subject?.name ?? "Subject",
        entries: [] as MarkEntry[],
      };
    const marks = Number(row.marks);
    const maxMarks = Number(row.max_marks) || 100;
    bucket.entries.push({
      studentId: row.student_id,
      name: profile?.full_name ?? null,
      roll: profile?.roll_number ?? null,
      marks,
      maxMarks,
      pct: Math.round((marks / maxMarks) * 1000) / 10,
    });
    bySubject.set(row.subject_id, bucket);
  }

  const subjectSummaries = [...bySubject.values()].map((s) => {
    const vals = s.entries.map((e) => e.marks);
    const avg = vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : 0;
    const highest = s.entries.reduce(
      (best, e) => (!best || e.marks > best.marks ? e : best),
      null as (typeof s.entries)[number] | null,
    );
    return {
      ...s,
      average: Math.round(avg * 10) / 10,
      highest,
      top: [...s.entries].sort((a, b) => b.marks - a.marks).slice(0, 5),
    };
  });

  const allEntries = subjectSummaries.flatMap((s) => s.entries);
  const mean =
    allEntries.length === 0
      ? 0
      : allEntries.reduce((a, e) => a + e.marks, 0) / allEntries.length;
  const highestOverall = allEntries.reduce(
    (best, e) => (!best || e.marks > best.marks ? e : best),
    null as (typeof allEntries)[number] | null,
  );

  return {
    bySubject: subjectSummaries,
    highest: highestOverall,
    topStudents: [...allEntries].sort((a, b) => b.marks - a.marks).slice(0, 10),
    averages: { mean: Math.round(mean * 10) / 10, count: allEntries.length },
  };
}
