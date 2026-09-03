import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { authSignOut } from "@/server/portal/auth-signout";

/** Revoke refresh tokens globally and clear local + server auth cookies. */
export async function signOutEverywhere() {
  const client = getSupabaseBrowserClient();

  try {
    await authSignOut();
  } catch {
    /* server cookie clear is best-effort when offline */
  }

  const { error } = await client.auth.signOut({ scope: "global" });
  if (error) throw error;
}
