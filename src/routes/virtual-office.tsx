import { createFileRoute, Navigate, useNavigate } from "@tanstack/react-router";
import { useCallback } from "react";
import { VirtualOfficeDashboard } from "@/components/virtual-office/VirtualOfficeDashboard";
import { useAuth } from "@/hooks/useAuth";
import { canAccessVirtualOffice } from "@/lib/auth/roles";
import { getPostAuthPath } from "@/lib/auth/redirects";

export const Route = createFileRoute("/virtual-office")({
  head: () => ({ meta: [{ title: "Virtual College Office — GPW Srinagar" }] }),
  component: VirtualOfficePage,
});

function VirtualOfficePage() {
  const navigate = useNavigate();
  const { session, profile, loading, signOut, configured } = useAuth();
  const handleSignOut = useCallback(async () => {
    await signOut();
    navigate({ to: "/" });
  }, [navigate, signOut]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-sm text-muted-foreground">Loading Virtual College Office…</p>
      </div>
    );
  }

  if (!configured || !session?.access_token || !profile) {
    return <Navigate to="/login" />;
  }

  if (profile.role === "student") {
    return <Navigate to={getPostAuthPath(profile.role, profile.approval_status)} />;
  }

  if (!canAccessVirtualOffice(profile.role)) {
    return <Navigate to="/login" />;
  }

  return (
    <VirtualOfficeDashboard
      accessToken={session.access_token}
      profile={profile}
      onSignOut={handleSignOut}
    />
  );
}
