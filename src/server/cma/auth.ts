import { getSupabaseAsUser } from "@/lib/supabase/server";

export class AuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuthError";
  }
}

/** Verify admin session from access token (used by CMA mutations) */
export async function requireAdmin(accessToken: string) {
  if (!accessToken) throw new AuthError("Not authenticated");

  const supabase = getSupabaseAsUser(accessToken);
  const { data: userData, error: userError } = await supabase.auth.getUser(accessToken);
  if (userError || !userData.user) throw new AuthError("Invalid session");

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role, email")
    .eq("id", userData.user.id)
    .maybeSingle();

  if (profileError || !profile || !["admin", "editor", "principal"].includes(profile.role)) {
    throw new AuthError("Admin access required");
  }

  return { supabase, user: userData.user, profile };
}
