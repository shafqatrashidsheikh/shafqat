import { createServerFn } from "@tanstack/react-start";
import { getSupabaseServerAuthClient } from "@/lib/supabase/server-auth";

/** Server-side sign out — clears SSR auth cookies and revokes refresh tokens. */
export const authSignOut = createServerFn({ method: "POST" }).handler(async () => {
  const supabase = getSupabaseServerAuthClient();
  const { error } = await supabase.auth.signOut({ scope: "global" });
  if (error) throw error;
  return { ok: true as const };
});
