import type { UserRole } from "@/lib/auth/roles";
import { canAccessVirtualOffice } from "@/lib/auth/roles";
import { getSupabaseAdmin, getSupabaseAsUser } from "@/lib/supabase/server";
import { AuthError } from "@/server/cma/auth";
import type { VoOfficerId } from "@/lib/virtual-office/types";

export type VoContext = {
  supabase: ReturnType<typeof getSupabaseAsUser>;
  admin: ReturnType<typeof getSupabaseAdmin>;
  userId: string;
  profile: {
    id: string;
    email: string;
    full_name: string | null;
    role: UserRole;
    department_id: string | null;
    approval_status: string;
  };
};

export async function requireVirtualOfficeUser(accessToken: string): Promise<VoContext> {
  if (!accessToken) throw new AuthError("Not authenticated");

  const admin = getSupabaseAdmin();
  const { data: userData, error: userError } = await admin.auth.getUser(accessToken);
  if (userError || !userData.user) throw new AuthError("Invalid session");

  const { data: profile, error: profileError } = await admin
    .from("profiles")
    .select("id, email, full_name, role, department_id, approval_status")
    .eq("id", userData.user.id)
    .maybeSingle();

  if (profileError) throw new AuthError(`Profile lookup failed: ${profileError.message}`);
  if (!profile) throw new AuthError("Profile not found");
  if (!canAccessVirtualOffice(profile.role as UserRole)) {
    throw new AuthError("Virtual College Office access requires staff, HOD, principal, or admin");
  }

  return {
    supabase: getSupabaseAsUser(accessToken),
    admin,
    userId: userData.user.id,
    profile: profile as VoContext["profile"],
  };
}

export function assertDepartmentScope(
  ctx: VoContext,
  targetDepartmentId: string | null | undefined,
) {
  if (ctx.profile.role === "hod" || ctx.profile.role === "staff") {
    if (!ctx.profile.department_id) {
      throw new AuthError("Your account is not assigned to a department");
    }
    if (targetDepartmentId && targetDepartmentId !== ctx.profile.department_id) {
      throw new AuthError("You can only manage records in your own department");
    }
  }
}

export async function writeVoAudit(
  admin: ReturnType<typeof getSupabaseAdmin>,
  input: {
    officer: VoOfficerId;
    action: string;
    actorId: string;
    summary: string;
    entityType?: string;
    entityId?: string;
    payload?: Record<string, unknown>;
  },
) {
  const { error } = await admin.from("vo_audit_log").insert({
    officer: input.officer,
    action: input.action,
    actor_id: input.actorId,
    entity_type: input.entityType ?? null,
    entity_id: input.entityId ?? null,
    summary: input.summary,
    payload: input.payload ?? {},
  });
  if (error) {
    console.error("[vo_audit_log]", error.message);
    throw new Error(`Failed to write audit log: ${error.message}`);
  }
}
