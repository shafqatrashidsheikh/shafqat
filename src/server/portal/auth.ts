import type { UserRole } from "@/lib/auth/roles";
import { getSupabaseAdmin, getSupabaseAsUser } from "@/lib/supabase/server";
import { AuthError } from "@/server/cma/auth";

export type PortalContext = {
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

export async function requirePortalUser(
  accessToken: string,
  allowedRoles: UserRole[],
): Promise<PortalContext> {
  if (!accessToken) throw new AuthError("Not authenticated");

  const admin = getSupabaseAdmin();
  // Verify JWT via admin Auth API (user client with accessToken option cannot use auth.getUser)
  const { data: userData, error: userError } = await admin.auth.getUser(accessToken);
  if (userError || !userData.user) throw new AuthError("Invalid session");

  const { data: profile, error: profileError } = await admin
    .from("profiles")
    .select("id, email, full_name, role, department_id, approval_status")
    .eq("id", userData.user.id)
    .maybeSingle();

  if (profileError) throw new AuthError(`Profile lookup failed: ${profileError.message}`);
  if (!profile) throw new AuthError("Profile not found");
  if (!allowedRoles.includes(profile.role as UserRole)) {
    throw new AuthError("You do not have permission for this action");
  }

  return {
    supabase: getSupabaseAsUser(accessToken),
    admin,
    userId: userData.user.id,
    profile: profile as PortalContext["profile"],
  };
}
