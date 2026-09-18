import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { ATTENDANCE_THRESHOLD_PCT } from "@/lib/virtual-office/types";
import { requirePortalUser } from "@/server/portal/auth";

const tokenSchema = z.object({ accessToken: z.string().min(1) });

/** Approved students only — own attendance and marks */
export const studentGetAcademicRecord = createServerFn({ method: "GET" })
  .validator(tokenSchema)
  .handler(async ({ data }) => {
    const ctx = await requirePortalUser(data.accessToken, ["student"]);
    if (ctx.profile.approval_status !== "approved") {
      throw new Error("Student account is not approved yet");
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
      attendanceSummary,
      marks: (marks ?? []).map((m) => {
        const subRaw = m.academic_subjects as
          | { name: string; semester: number }
          | { name: string; semester: number }[]
          | null;
        const sub = Array.isArray(subRaw) ? subRaw[0] : subRaw;
        return {
          subject: sub?.name ?? "Subject",
          semester: sub?.semester ?? null,
          examType: m.exam_type,
          marks: Number(m.marks),
          maxMarks: Number(m.max_marks),
        };
      }),
    };
  });
