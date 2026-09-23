import { getSupabaseAdmin } from "@/lib/supabase/server";
import { invalidateAssistantKnowledgeCache } from "@/server/assistant/knowledge-cache";

export class AuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuthError";
  }
}

/**
 * Verify CMS session, then return the service-role client for reads/writes.
 * Role is checked against profiles first; RLS is not relied on for CMA (JWT-as-user was unreliable).
 */
export async function requireAdmin(accessToken: string) {
  if (!accessToken) throw new AuthError("Not authenticated");

  const admin = getSupabaseAdmin();
  const { data: userData, error: userError } = await admin.auth.getUser(accessToken);
  if (userError || !userData.user) throw new AuthError("Invalid session");

  const { data: profile, error: profileError } = await admin
    .from("profiles")
    .select("role, email")
    .eq("id", userData.user.id)
    .maybeSingle();

  if (profileError || !profile || !["admin", "editor", "principal"].includes(profile.role)) {
    throw new AuthError("Admin access required");
  }

  return { supabase: admin, user: userData.user, profile };
}

/**
 * Same as requireAdmin, then clears assistant knowledge cache.
 * Use in CMS write handlers so website updates reach the assistant immediately.
 */
export async function requireAdminWrite(accessToken: string) {
  const session = await requireAdmin(accessToken);
  invalidateAssistantKnowledgeCache();
  return session;
}
