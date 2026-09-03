import { createFileRoute, Navigate } from "@tanstack/react-router";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { isCmsRole } from "@/lib/auth/roles";
import { getPostAuthPath } from "@/lib/auth/redirects";
import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/admin/")({
  head: () => ({ meta: [{ title: "Admin Panel — GPW Srinagar" }] }),
  component: AdminPage,
});

function AdminPage() {
  const { session, profile, loading, signOut, configured } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-sm text-muted-foreground">Loading admin session…</p>
      </div>
    );
  }

  if (!configured || !session?.access_token || !profile) {
    return <Navigate to="/admin/login" />;
  }

  if (!isCmsRole(profile.role)) {
    return <Navigate to={getPostAuthPath(profile.role, profile.approval_status)} />;
  }

  return <AdminDashboard accessToken={session.access_token} onSignOut={signOut} />;
}
