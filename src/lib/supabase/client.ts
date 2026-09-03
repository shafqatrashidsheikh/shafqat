import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import { env, isSupabaseConfigured } from "@/lib/env";

let browserClient: SupabaseClient | null = null;

/** Browser Supabase client — cookie-backed auth for SSR-safe OAuth PKCE. */
export function getSupabaseBrowserClient(): SupabaseClient {
  if (!isSupabaseConfigured()) {
    throw new Error("Supabase is not configured. Add credentials to .env");
  }
  if (!browserClient) {
    browserClient = createBrowserClient(env.supabaseUrl, env.supabaseAnonKey);
  }
  return browserClient;
}

/** Public read client (browser-safe anon key) */
export function createSupabaseAnonClient(): SupabaseClient {
  return createBrowserClient(env.supabaseUrl, env.supabaseAnonKey);
}
