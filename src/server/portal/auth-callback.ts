import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { getSupabaseServerAuthClient } from "@/lib/supabase/server-auth";
import { ensureUserProfile } from "@/server/portal/profile";

const callbackSchema = z.object({
  code: z.string().optional(),
  error: z.string().optional(),
  error_description: z.string().optional(),
});

export const completeOAuthCallback = createServerFn({ method: "GET" })
  .validator(callbackSchema)
  .handler(async ({ data }) => {
    if (data.error || data.error_description) {
      throw new Error(data.error_description ?? data.error ?? "Google sign-in was cancelled");
    }

    if (!data.code) {
      throw new Error("Missing authorization code from Google");
    }

    const supabase = getSupabaseServerAuthClient();
    const { data: existing, error: sessionError } = await supabase.auth.getSession();
    if (sessionError) throw sessionError;

    let accessToken = existing.session?.access_token ?? null;

    if (!accessToken) {
      const { data: exchanged, error } = await supabase.auth.exchangeCodeForSession(data.code);
      if (error) throw error;
      accessToken = exchanged.session?.access_token ?? null;
    }

    if (!accessToken) {
      throw new Error("No session returned from Google sign-in");
    }

    await ensureUserProfile(accessToken);

    return { ok: true as const };
  });
