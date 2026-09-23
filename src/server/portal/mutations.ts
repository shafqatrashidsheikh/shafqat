import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { canInviteRole, type UserRole } from "@/lib/auth/roles";
import {
  ensurePortalDepartmentsSeeded,
  listOfficialPortalDepartments,
} from "@/server/portal/departments";
import { ensureUserProfile, fetchAuthenticatedProfile } from "@/server/portal/profile";
import { requirePortalUser } from "@/server/portal/auth";

const tokenSchema = z.object({ accessToken: z.string().min(1) });

/** Create or repair a missing profile row for an authenticated user */
export const portalEnsureProfile = createServerFn({ method: "POST" })
  .validator(tokenSchema)
  .handler(async ({ data }) => ensureUserProfile(data.accessToken));

/** Load profile for the signed-in user (safe server-side read) */
export const portalFetchProfile = createServerFn({ method: "POST" })
  .validator(tokenSchema)
  .handler(async ({ data }) => fetchAuthenticatedProfile(data.accessToken));

// ---------------------------------------------------------------------------
// Profile
// ---------------------------------------------------------------------------
export const portalGetProfile = createServerFn({ method: "POST" })
  .validator(tokenSchema)
  .handler(async ({ data }) => {
    const ctx = await requirePortalUser(data.accessToken, [
      "admin",
      "editor",
      "principal",
      "hod",
      "staff",
      "student",
    ]);
    const { data: profile, error } = await ctx.supabase
      .from("profiles")
      .select("*, departments:department_id(id, name, slug)")
      .eq("id", ctx.userId)
      .single();
    if (error) throw error;
    return profile;
  });

/** Official GPW departments for onboarding / invite dropdowns (POST keeps accessToken reliable). */
export const portalListDepartments = createServerFn({ method: "POST" })
  .validator(tokenSchema)
  .handler(async ({ data }) => {
    await requirePortalUser(data.accessToken, [
      "admin",
      "editor",
      "principal",
      "hod",
      "staff",
      "student",
    ]);

    try {
      return await listOfficialPortalDepartments();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Department sync failed";
      throw new Error(`Could not load departments: ${message}`);
    }
  });

// ---------------------------------------------------------------------------
// Student onboarding
// ---------------------------------------------------------------------------
const studentProfileSchema = tokenSchema.extend({
  payload: z.object({
    full_name: z.string().min(2),
    roll_number: z.string().min(1),
    department_id: z.string().uuid(),
    phone: z.string().optional(),
  }),
});

export const portalSubmitStudentProfile = createServerFn({ method: "POST" })
  .validator(studentProfileSchema)
  .handler(async ({ data }) => {
    const ctx = await requirePortalUser(data.accessToken, ["student"]);
    if (!["pending_profile", "rejected"].includes(ctx.profile.approval_status)) {
      throw new Error("Profile has already been submitted");
    }

    const roll = data.payload.roll_number.trim();
    const { data: dup } = await ctx.admin
      .from("profiles")
      .select("id, email")
      .eq("role", "student")
      .in("approval_status", ["pending_review", "approved"])
      .ilike("roll_number", roll)
      .neq("id", ctx.userId)
      .maybeSingle();
    if (dup) {
      throw new Error(
        `Roll number ${roll} is already registered. Contact your department if this is an error.`,
      );
    }

    const { data: row, error } = await ctx.admin
      .from("profiles")
      .update({
        full_name: data.payload.full_name,
        roll_number: roll,
        department_id: data.payload.department_id,
        phone: data.payload.phone ?? null,
        approval_status: "pending_review",
        rejection_reason: null,
        reviewed_by: null,
        reviewed_at: null,
      })
      .eq("id", ctx.userId)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return row;
  });

// ---------------------------------------------------------------------------
// Pending student approvals
// ---------------------------------------------------------------------------
export const portalListPendingStudents = createServerFn({ method: "POST" })
  .validator(tokenSchema)
  .handler(async ({ data }) => {
    const ctx = await requirePortalUser(data.accessToken, ["principal", "admin", "hod", "staff"]);

    let query = ctx.admin
      .from("profiles")
      .select("id, email, full_name, roll_number, phone, approval_status, created_at, department_id, departments:department_id(name)")
      .eq("role", "student")
      .eq("approval_status", "pending_review")
      .order("created_at", { ascending: true });

    if (ctx.profile.role === "hod" || ctx.profile.role === "staff") {
      if (!ctx.profile.department_id) throw new Error("Your account is not assigned to a department");
      query = query.eq("department_id", ctx.profile.department_id);
    }

    const { data: rows, error } = await query;
    if (error) throw new Error(error.message);
    return rows ?? [];
  });

const reviewSchema = tokenSchema.extend({
  studentId: z.string().uuid(),
  rejection_reason: z.string().optional(),
});

export const portalApproveStudent = createServerFn({ method: "POST" })
  .validator(reviewSchema)
  .handler(async ({ data }) => {
    const ctx = await requirePortalUser(data.accessToken, ["principal", "admin", "hod", "staff"]);

    const { data: student, error: fetchError } = await ctx.admin
      .from("profiles")
      .select("id, department_id, approval_status, role, email, full_name, roll_number")
      .eq("id", data.studentId)
      .single();

    if (fetchError || !student) throw new Error("Student not found");
    if (student.role !== "student" || student.approval_status !== "pending_review") {
      throw new Error("Student is not pending review");
    }

    if (
      (ctx.profile.role === "hod" || ctx.profile.role === "staff") &&
      student.department_id !== ctx.profile.department_id
    ) {
      throw new Error("You can only approve students in your department");
    }

    if (student.roll_number) {
      const { data: dup } = await ctx.admin
        .from("profiles")
        .select("id, email")
        .eq("role", "student")
        .eq("approval_status", "approved")
        .ilike("roll_number", student.roll_number)
        .neq("id", data.studentId)
        .maybeSingle();
      if (dup) {
        throw new Error(
          `Duplicate roll number: approved student already uses ${student.roll_number} (${dup.email}).`,
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
      .eq("id", data.studentId)
      .select()
      .single();

    if (error) throw new Error(error.message);

    const { error: auditError } = await ctx.admin.from("vo_audit_log").insert({
      officer: "student_approval",
      action: "approve",
      actor_id: ctx.userId,
      entity_type: "profile",
      entity_id: data.studentId,
      summary: `Approved student via portal (${student.full_name ?? student.email ?? data.studentId})`,
      payload: { reviewedAt, source: "portal" },
    });
    if (auditError) {
      console.warn("[portalApproveStudent] audit log unavailable:", auditError.message);
    }

    return row;
  });

export const portalRejectStudent = createServerFn({ method: "POST" })
  .validator(reviewSchema)
  .handler(async ({ data }) => {
    const ctx = await requirePortalUser(data.accessToken, ["principal", "admin", "hod", "staff"]);

    const { data: student, error: fetchError } = await ctx.admin
      .from("profiles")
      .select("id, department_id, approval_status, role, email, full_name, roll_number")
      .eq("id", data.studentId)
      .single();

    if (fetchError || !student) throw new Error("Student not found");
    if (student.role !== "student" || student.approval_status !== "pending_review") {
      throw new Error("Student is not pending review");
    }

    if (
      (ctx.profile.role === "hod" || ctx.profile.role === "staff") &&
      student.department_id !== ctx.profile.department_id
    ) {
      throw new Error("You can only reject students in your department");
    }

    const reviewedAt = new Date().toISOString();
    const rejection_reason = data.rejection_reason ?? "Application not approved";
    const { data: row, error } = await ctx.admin
      .from("profiles")
      .update({
        approval_status: "rejected",
        rejection_reason,
        reviewed_by: ctx.userId,
        reviewed_at: reviewedAt,
      })
      .eq("id", data.studentId)
      .select()
      .single();

    if (error) throw new Error(error.message);

    const { error: auditError } = await ctx.admin.from("vo_audit_log").insert({
      officer: "student_approval",
      action: "reject",
      actor_id: ctx.userId,
      entity_type: "profile",
      entity_id: data.studentId,
      summary: `Rejected student via portal: ${rejection_reason}`,
      payload: { reviewedAt, source: "portal", rejection_reason },
    });
    if (auditError) {
      console.warn("[portalRejectStudent] audit log unavailable:", auditError.message);
    }

    return row;
  });

// ---------------------------------------------------------------------------
// User management (Principal / HOD)
// ---------------------------------------------------------------------------
const inviteSchema = tokenSchema.extend({
  payload: z.object({
    email: z.string().email(),
    full_name: z.string().min(2),
    role: z.enum(["hod", "staff"]),
    department_id: z.string().uuid(),
    password: z.string().min(8, "Password must be at least 8 characters"),
  }),
});

export const portalInviteUser = createServerFn({ method: "POST" })
  .validator(inviteSchema)
  .handler(async ({ data }) => {
    const ctx = await requirePortalUser(data.accessToken, ["principal", "admin", "hod"]);

    const targetRole = data.payload.role as UserRole;
    if (!canInviteRole(ctx.profile.role as UserRole, targetRole)) {
      throw new Error(`You cannot create ${targetRole} accounts`);
    }

    if (ctx.profile.role === "hod" && data.payload.department_id !== ctx.profile.department_id) {
      throw new Error("You can only add staff to your own department");
    }

    const { data: existingProfile } = await ctx.admin
      .from("profiles")
      .select("id")
      .eq("email", data.payload.email)
      .maybeSingle();

    if (existingProfile) throw new Error("A user with this email already exists");

    await ensurePortalDepartmentsSeeded();

    if (targetRole === "hod") {
      const { data: existingHod, error: hodCheckError } = await ctx.admin
        .from("profiles")
        .select("id, full_name")
        .eq("role", "hod")
        .eq("department_id", data.payload.department_id)
        .maybeSingle();

      if (hodCheckError) throw hodCheckError;
      if (existingHod) {
        throw new Error(
          `This department already has an HOD (${existingHod.full_name ?? "assigned"}). Only one HOD per department is allowed.`,
        );
      }
    }

    const syncProfile = async (userId: string, email: string) => {
      const profilePayload = {
        id: userId,
        email,
        full_name: data.payload.full_name,
        role: data.payload.role,
        department_id: data.payload.department_id,
        approval_status: "n/a" as const,
      };

      const { data: existing, error: readError } = await ctx.admin
        .from("profiles")
        .select("id")
        .eq("id", userId)
        .maybeSingle();

      if (readError) throw readError;

      if (existing) {
        const { error: updateError } = await ctx.admin.from("profiles").update(profilePayload).eq("id", userId);
        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await ctx.admin.from("profiles").insert(profilePayload);
        if (insertError) throw insertError;
      }

      if (targetRole === "hod") {
        await ctx.admin
          .from("departments")
          .update({ head_name: data.payload.full_name })
          .eq("id", data.payload.department_id);
      }
    };

    const { data: created, error: createError } = await ctx.admin.auth.admin.createUser({
      email: data.payload.email,
      password: data.payload.password,
      email_confirm: true,
      user_metadata: {
        full_name: data.payload.full_name,
      },
      /* Role lives in app metadata — the signup trigger refuses to read a role
         from user metadata, which visitors can set themselves. */
      app_metadata: {
        role: data.payload.role,
        department_id: data.payload.department_id,
      },
    });
    if (createError) {
      if (createError.message.toLowerCase().includes("already")) {
        throw new Error("A user with this email already exists");
      }
      throw createError;
    }

    await syncProfile(created.user.id, created.user.email ?? data.payload.email);

    return { ok: true, userId: created.user.id, method: "password" as const };
  });

export const portalListDepartmentUsers = createServerFn({ method: "POST" })
  .validator(tokenSchema)
  .handler(async ({ data }) => {
    const ctx = await requirePortalUser(data.accessToken, ["principal", "admin", "hod"]);

    let query = ctx.admin
      .from("profiles")
      .select("id, email, full_name, role, department_id, created_at, departments:department_id(name)")
      .in("role", ["hod", "staff"])
      .order("created_at", { ascending: false });

    if (ctx.profile.role === "hod") {
      if (!ctx.profile.department_id) throw new Error("Your account is not assigned to a department");
      query = query.eq("department_id", ctx.profile.department_id).eq("role", "staff");
    }

    const { data: rows, error } = await query;
    if (error) throw new Error(error.message);
    return rows ?? [];
  });

export const portalListHods = createServerFn({ method: "POST" })
  .validator(tokenSchema)
  .handler(async ({ data }) => {
    const ctx = await requirePortalUser(data.accessToken, ["principal", "admin"]);

    const { data: rows, error } = await ctx.admin
      .from("profiles")
      .select("id, email, full_name, role, department_id, created_at, departments:department_id(name)")
      .eq("role", "hod")
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    return rows ?? [];
  });
