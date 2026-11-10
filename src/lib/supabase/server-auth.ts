import { createServerClient, type SupabaseClient } from "@supabase/ssr";
import { getCookies, setCookie, setResponseHeader } from "@tanstack/react-start/server";
import { env } from "@/lib/env";

/** Cookie-backed Supabase client for SSR auth (OAuth PKCE + sessions). */
export function getSupabaseServerAuthClient(): SupabaseClient {
  return createServerClient(env.supabaseUrl, env.supabaseAnonKey, {
    cookieOptions: {
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    },
    cookies: {
      getAll() {
        return Object.entries(getCookies()).map(([name, value]) => ({ name, value }));
      },
      setAll(cookies, headers) {
        cookies.forEach(({ name, value, options }) => {
          setCookie(name, value, options);
        });

        Object.entries(headers).forEach(([name, value]) => {
          setResponseHeader(name, value);
        });
      },
    },
  });
}
