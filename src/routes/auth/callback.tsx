import { createFileRoute, Link, Navigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { ContextualBack } from "@/components/site/ContextualBack";
import { getPostAuthPath } from "@/lib/auth/redirects";
import { useAuth } from "@/hooks/useAuth";
import { completeOAuthCallback } from "@/server/portal/auth-callback";

const callbackSearchSchema = z.object({
  code: z.string().optional(),
  error: z.string().optional(),
  error_description: z.string().optional(),
});

export const Route = createFileRoute("/auth/callback")({
  validateSearch: callbackSearchSchema,
  loaderDeps: ({ search }) => search,
  loader: async ({ deps: search }) => {
    if (!search.code && !search.error && !search.error_description) {
      return { ok: false as const, error: "No authorization response from Google" };
    }

    try {
      await completeOAuthCallback({ data: search });
      return { ok: true as const, error: null };
    } catch (err) {
      return {
        ok: false as const,
        error: err instanceof Error ? err.message : "Authentication failed",
      };
    }
  },
  head: () => ({ meta: [{ title: "Signing in… — GPW Srinagar" }] }),
  component: AuthCallbackPage,
});

function AuthCallbackPage() {
  const { profile, loading, refreshProfile } = useAuth();
  const loaderData = Route.useLoaderData();
  const [ready, setReady] = useState(false);
  const [profileLoaded, setProfileLoaded] = useState(false);

  useEffect(() => {
    if (!loaderData.ok) {
      setReady(true);
      return;
    }

    void refreshProfile()
      .catch(() => undefined)
      .finally(() => {
        setProfileLoaded(true);
        setReady(true);
      });
  }, [loaderData.ok, refreshProfile]);

  if (!ready || (loaderData.ok && loading && !profileLoaded)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-sm text-muted-foreground">Completing Google sign in…</p>
      </div>
    );
  }

  if (!loaderData.ok || loaderData.error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="flex w-full max-w-md flex-col items-start gap-4">
          <ContextualBack />
          <div className="card-premium w-full p-8 text-center">
          <p className="text-sm text-red">{loaderData.error ?? "Authentication failed"}</p>
          <Link to="/login" className="mt-4 inline-block text-sm font-semibold text-brand">
            Sign in
          </Link>
          </div>
        </div>
      </div>
    );
  }

  if (profile) {
    return <Navigate to={getPostAuthPath(profile.role, profile.approval_status)} />;
  }

  return <Navigate to="/login" />;
}
