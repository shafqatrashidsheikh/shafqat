import type { UserRole } from "@/lib/auth/roles";
import { env } from "@/lib/env";
import { getSupabaseAdmin, getSupabaseAsUser } from "@/lib/supabase/server";

const VALID_ROLES = ["admin", "editor", "principal", "hod", "staff", "student"] as const;

const PROFILE_SELECT = "*, department:department_id(id, name, slug)";

function resolveRoleFromUser(meta: Record<string, unknown>, email?: string | null): UserRole {
  const metaRole = typeof meta.role === "string" ? meta.role : null;
  if (metaRole && (VALID_ROLES as readonly string[]).includes(metaRole)) {
    return metaRole as UserRole;
  }
  if (email && email.toLowerCase() === env.adminEmail.toLowerCase()) {
    return "admin";
  }
  return "student";
}

function resolveFullName(meta: Record<string, unknown>): string {
  if (typeof meta.full_name === "string" && meta.full_name.trim()) return meta.full_name.trim();
  if (typeof meta.name === "string" && meta.name.trim()) return meta.name.trim();
  return "";
}

async function getAuthUser(accessToken: string) {
  const supabase = getSupabaseAsUser(accessToken);
  const { data, error } = await supabase.auth.getUser(accessToken);
  if (error || !data.user) throw new Error("Invalid session");
  return data.user;
}

/** Load the signed-in user's profile — never downgrades an existing role. */
export async function fetchAuthenticatedProfile(accessToken: string) {
  const user = await getAuthUser(accessToken);
  const admin = getSupabaseAdmin();

  const { data: existing, error: readError } = await admin
    .from("profiles")
    .select(PROFILE_SELECT)
    .eq("id", user.id)
    .maybeSingle();

  if (readError) throw readError;
  if (existing) return existing;

  return ensureUserProfile(accessToken);
}

/** Create a missing profile row only — never overwrite an existing profile. */
export async function ensureUserProfile(accessToken: string) {
  const user = await getAuthUser(accessToken);
  const admin = getSupabaseAdmin();

  const { data: existing, error: readError } = await admin
    .from("profiles")
    .select(PROFILE_SELECT)
    .eq("id", user.id)
    .maybeSingle();

  if (readError) throw readError;
  if (existing) return existing;

  const meta = (user.user_metadata ?? {}) as Record<string, unknown>;
  const role = resolveRoleFromUser(meta, user.email);
  const departmentId =
    typeof meta.department_id === "string" && meta.department_id.length > 0 ? meta.department_id : null;

  const { data: created, error: insertError } = await admin
    .from("profiles")
    .insert({
      id: user.id,
      email: user.email ?? "",
      full_name: resolveFullName(meta),
      role,
      department_id: departmentId,
      approval_status: role === "student" ? "pending_profile" : "n/a",
    })
    .select(PROFILE_SELECT)
    .single();

  if (insertError) throw insertError;
  return created;
}
