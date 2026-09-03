import { createFileRoute, Navigate, useNavigate } from "@tanstack/react-router";
import { PortalDashboard } from "@/components/portal/PortalDashboard";
import { useAuth } from "@/hooks/useAuth";
import { getPostAuthPath } from "@/lib/auth/redirects";
import { useCallback } from "react";

export const Route = createFileRoute("/portal/")({
  head: () => ({ meta: [{ title: "Portal — GPW Srinagar" }] }),
  component: PortalPage,
});

function PortalPage() {
  const navigate = useNavigate();
  const { session, profile, loading, signOut, configured } = useAuth();
  const handleSignOut = useCallback(async () => {
    await signOut();
    navigate({ to: "/" });
  }, [navigate, signOut]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-sm text-muted-foreground">Loading portal…</p>
      </div>
    );
  }

  if (!configured || !session?.access_token || !profile) {
    return <Navigate to="/login" />;
  }

  if (profile.role === "student") {
    return <Navigate to={getPostAuthPath(profile.role, profile.approval_status)} />;
  }

  if (profile.role === "admin" || profile.role === "editor") {
    return <Navigate to="/admin" />;
  }

  if (!["principal", "hod", "staff"].includes(profile.role)) {
    return <Navigate to="/login" />;
  }

  return (
    <PortalDashboard
      accessToken={session.access_token}
      profile={profile}
      onSignOut={handleSignOut}
    />
  );
}
