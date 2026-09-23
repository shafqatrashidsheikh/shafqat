import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { env } from "@/lib/env";

/** Server-side anon client for public CDA reads */
export function getSupabaseServer(): SupabaseClient {
  return createClient(env.supabaseUrl, env.supabaseAnonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

/** Server-side service role — CMA mutations after auth verification */
export function getSupabaseAdmin(): SupabaseClient {
  return createClient(env.supabaseUrl, env.supabaseServiceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

/**
 * User-scoped server client from a verified access token.
 * Uses the accessToken option so PostgREST always receives the JWT (auth.uid() / RLS).
 * Do not rely on only setting Authorization in global headers — that often leaves RLS as anon.
 */
export function getSupabaseAsUser(accessToken: string): SupabaseClient {
  return createClient(env.supabaseUrl, env.supabaseAnonKey, {
    accessToken: async () => accessToken,
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });
}
