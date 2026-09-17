import { useCallback, useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import type { UserProfile } from "@/lib/auth/roles";
import { isSupabaseConfigured } from "@/lib/env";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { signOutEverywhere } from "@/lib/auth/sign-out";
import { portalFetchProfile } from "@/server/portal/mutations";

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [profileError, setProfileError] = useState<string | null>(null);

  const fetchProfile = useCallback(async (accessToken: string) => {
    setProfileError(null);

    try {
      const row = (await portalFetchProfile({ data: { accessToken } })) as UserProfile;
      setProfile(row);
      return row;
    } catch (ensureError) {
      const message =
        ensureError instanceof Error
          ? ensureError.message
          : "Could not load your account profile. Contact the institute administrator.";
      setProfileError(message);
      setProfile(null);
      return null;
    }
  }, []);

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setLoading(false);
      return;
    }

    const client = getSupabaseBrowserClient();

    client.auth
      .getSession()
      .then(async ({ data }) => {
        setSession(data.session);
        if (data.session?.access_token) {
          try {
            await fetchProfile(data.session.access_token);
          } catch {
            setProfile(null);
          }
        }
      })
      .catch(() => {
        setSession(null);
        setProfile(null);
      })
      .finally(() => {
        setLoading(false);
      });

    const { data: sub } = client.auth.onAuthStateChange(async (_event, next) => {
      setSession(next);
      try {
        if (next?.access_token) {
          await fetchProfile(next.access_token);
        } else {
          setProfile(null);
          setProfileError(null);
        }
      } catch {
        setProfile(null);
      } finally {
        setLoading(false);
      }
    });

    return () => sub.subscription.unsubscribe();
  }, [fetchProfile]);

  const signInWithPassword = useCallback(
    async (email: string, password: string) => {
      const client = getSupabaseBrowserClient();
      const { data, error } = await client.auth.signInWithPassword({ email, password });
      if (error) throw error;
      setSession(data.session);
      if (!data.session?.access_token) throw new Error("Sign in succeeded but no session was returned");

      const row = await fetchProfile(data.session.access_token);
      if (!row) {
        throw new Error(
          "Signed in successfully, but your staff profile could not be loaded. Ask the principal to verify your account role in Supabase.",
        );
      }
      return { session: data.session, profile: row };
    },
    [fetchProfile],
  );

  const signInWithOtp = useCallback(async (email: string) => {
    const client = getSupabaseBrowserClient();
    // OTP code flow (verifyOtp) — do not pass emailRedirectTo.
    // A production/preview origin that is not in Supabase Redirect URLs
    // causes "Error sending magic link email" even when SMTP is configured.
    const { error } = await client.auth.signInWithOtp({
      email: email.trim().toLowerCase(),
      options: {
        shouldCreateUser: true,
      },
    });
    if (error) {
      const detail = error.message?.trim() || "Unknown auth error";
      const lower = detail.toLowerCase();
      if (
        lower.includes("error sending") ||
        lower.includes("magic link") ||
        (lower.includes("email") && lower.includes("send"))
      ) {
        throw new Error(
          `${detail} — Check Supabase → Authentication → Logs for the mailer failure. Confirm SMTP credentials work, and that Authentication → Email Templates → Magic Link / Confirm signup includes {{ .Token }} for the 6-digit code. Redirect URLs are not required for OTP codes.`,
        );
      }
      if (lower.includes("rate") || lower.includes("security")) {
        throw new Error(`${detail} — Wait a minute and try again, or use Google sign-in.`);
      }
      throw new Error(detail);
    }
  }, []);

  const verifyOtp = useCallback(
    async (email: string, token: string) => {
      const client = getSupabaseBrowserClient();
      const { data, error } = await client.auth.verifyOtp({
        email: email.trim().toLowerCase(),
        token: token.trim(),
        type: "email",
      });
      if (error) throw error;
      setSession(data.session);
      if (!data.session?.access_token) {
        throw new Error("Verification succeeded but no session was returned. Try signing in again.");
      }
      const row = await fetchProfile(data.session.access_token);
      if (!row) {
        throw new Error(
          "Signed in, but your student profile could not be created. Contact the institute administrator.",
        );
      }
      return data.session;
    },
    [fetchProfile],
  );

  const signInWithGoogle = useCallback(async () => {
    const client = getSupabaseBrowserClient();
    const redirectTo = `${window.location.origin}/auth/callback`;
    const { error } = await client.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo,
        queryParams: {
          access_type: "offline",
          prompt: "select_account",
        },
        scopes: "email profile",
      },
    });
    if (error) throw error;
  }, []);

  const signOut = useCallback(async () => {
    await signOutEverywhere();
    setSession(null);
    setProfile(null);
    setProfileError(null);
  }, []);

  const refreshProfile = useCallback(async () => {
    if (!session?.access_token) return null;
    return fetchProfile(session.access_token);
  }, [session?.access_token, fetchProfile]);

  return {
    session,
    profile,
    profileError,
    accessToken: session?.access_token ?? null,
    loading,
    configured: isSupabaseConfigured(),
    signInWithPassword,
    signInWithOtp,
    verifyOtp,
    signInWithGoogle,
    signOut,
    refreshProfile,
  };
}
