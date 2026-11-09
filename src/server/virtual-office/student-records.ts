import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { ATTENDANCE_THRESHOLD_PCT } from "@/lib/virtual-office/types";
import { requirePortalUser } from "@/server/portal/auth";

const tokenSchema = z.object({ accessToken: z.string().min(1) });

export type StudentAcademicRecord = {
  threshold: number;
  subjects: {
    id: string;
    name: string;
    code: string | null;
    semester: number;
  }[];
  attendanceSummary: {
    subjectId: string;
    name: string;
    present: number;
    total: number;
    percentage: number;
    meetsRequirement: boolean;
  }[];
  marks: {
    subjectId: string;
    subject: string;
    semester: number | null;
    examType: string;
    marks: number;
    maxMarks: number;
  }[];
};

/** Approved students only — own attendance, marks, and semester subjects */
export const studentGetAcademicRecord = createServerFn({ method: "GET" })
  .validator(tokenSchema)
  .handler(async ({ data }): Promise<StudentAcademicRecord> => {
    const ctx = await requirePortalUser(data.accessToken, ["student"]);
    if (ctx.profile.approval_status !== "approved") {
      throw new Error("Student account is not approved yet");
    }

    const departmentId = ctx.profile.department_id;
    const semester = ("semester" in ctx.profile ? (ctx.profile as { semester?: unknown }).semester : null) ?? null;

    let subjects: StudentAcademicRecord["subjects"] = [];
    if (departmentId) {
      let subjectQuery = ctx.supabase
        .from("academic_subjects")
        .select("id, name, code, semester")
        .eq("department_id", departmentId)
        .eq("is_active", true)
        .order("name", { ascending: true });
      if (semester != null) {
        subjectQuery = subjectQuery.eq("semester", semester);
      }
      const { data: subjectRows, error: sErr } = await subjectQuery;
      if (sErr) throw sErr;
      subjects = (subjectRows ?? []).map((s) => ({
        id: s.id as string,
        name: s.name as string,
        code: (s.code as string | null) ?? null,
        semester: Number(s.semester),
      }));
    }

    const { data: attendance, error: aErr } = await ctx.supabase
      .from("academic_attendance")
      .select(
        "present, session_date, subject_id, academic_subjects:subject_id(name, semester, department_id)",
      )
      .eq("student_id", ctx.userId)
      .order("session_date", { ascending: false });
    if (aErr) throw aErr;

    const { data: marks, error: mErr } = await ctx.supabase
      .from("academic_marks")
      .select(
        "marks, max_marks, exam_type, subject_id, academic_subjects:subject_id(name, semester)",
      )
      .eq("student_id", ctx.userId)
      .order("updated_at", { ascending: false });
    if (mErr) throw mErr;

    const bySubject = new Map<string, { name: string; present: number; total: number }>();
    for (const row of attendance ?? []) {
      const subRaw = row.academic_subjects as
        | { name: string; semester?: number; department_id?: string }
        | { name: string; semester?: number; department_id?: string }[]
        | null;
      const sub = Array.isArray(subRaw) ? subRaw[0] : subRaw;
      const key = row.subject_id as string;
      const cur = bySubject.get(key) ?? {
        name: sub?.name ?? "Subject",
        present: 0,
        total: 0,
      };
      cur.total += 1;
      if (row.present) cur.present += 1;
      bySubject.set(key, cur);
    }

    const attendanceSummary = [...bySubject.entries()].map(([subjectId, s]) => {
      const percentage = s.total === 0 ? 0 : Math.round((s.present / s.total) * 1000) / 10;
      return {
        subjectId,
        name: s.name,
        present: s.present,
        total: s.total,
        percentage,
        meetsRequirement: percentage >= ATTENDANCE_THRESHOLD_PCT,
      };
    });

    return {
      threshold: ATTENDANCE_THRESHOLD_PCT,
      subjects,
      attendanceSummary,
      marks: (marks ?? []).map((m) => {
        const subRaw = m.academic_subjects as
          | { name: string; semester: number }
          | { name: string; semester: number }[]
          | null;
        const sub = Array.isArray(subRaw) ? subRaw[0] : subRaw;
        return {
          subjectId: m.subject_id as string,
          subject: sub?.name ?? "Subject",
          semester: sub?.semester ?? null,
          examType: m.exam_type as string,
          marks: Number(m.marks),
          maxMarks: Number(m.max_marks),
        };
      }),
    };
  });
