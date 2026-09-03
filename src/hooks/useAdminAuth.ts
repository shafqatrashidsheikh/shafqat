import { useCallback, useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { signOutEverywhere } from "@/lib/auth/sign-out";
import { isSupabaseConfigured } from "@/lib/env";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

export function useAdminAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setLoading(false);
      return;
    }

    const client = getSupabaseBrowserClient();

    client.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });

    const { data: sub } = client.auth.onAuthStateChange((_event, next) => {
      setSession(next);
      setLoading(false);
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const client = getSupabaseBrowserClient();
    const { data, error } = await client.auth.signInWithPassword({ email, password });
    if (error) throw error;
    setSession(data.session);
    return data.session;
  }, []);

  const signOut = useCallback(async () => {
    await signOutEverywhere();
    setSession(null);
  }, []);

  return {
    session,
    accessToken: session?.access_token ?? null,
    loading,
    signIn,
    signOut,
    configured: isSupabaseConfigured(),
  };
}
