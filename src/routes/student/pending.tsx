import { createFileRoute, Link, Navigate } from "@tanstack/react-router";
import { PortalShell } from "@/components/portal/PortalShell";
import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/student/pending")({
  head: () => ({ meta: [{ title: "Pending Approval — GPW Srinagar" }] }),
  component: StudentPendingPage,
});

function StudentPendingPage() {
  const { profile, loading, signOut, configured } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-sm text-muted-foreground">Loading…</p>
      </div>
    );
  }

  if (!configured || !profile) {
    return <Navigate to="/login" />;
  }

  if (profile.role !== "student") {
    return <Navigate to="/portal" />;
  }

  if (profile.approval_status === "approved") {
    return <Navigate to="/student" />;
  }

  if (profile.approval_status === "pending_profile" || profile.approval_status === "rejected") {
    return <Navigate to="/student/onboarding" />;
  }

  return (
    <PortalShell
      profile={profile}
      title="Application under review"
      subtitle="Your department HOD or staff will verify your details"
      onSignOut={signOut}
    >
      <div className="card-premium mx-auto max-w-lg p-8 text-center">
        <p className="font-display text-lg font-bold text-navy">Thank you, {profile.full_name}</p>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Your registration has been submitted to{" "}
          <strong className="text-navy">{profile.department?.name ?? "your department"}</strong> for approval. You
          will be able to access the student portal once a HOD or staff member approves your account.
        </p>
        <dl className="mx-auto mt-6 max-w-sm space-y-3 text-left text-sm">
          <div className="flex justify-between gap-4 border-b border-border pb-2">
            <dt className="text-muted-foreground">Roll number</dt>
            <dd className="font-semibold text-navy">{profile.roll_number ?? "—"}</dd>
          </div>
          <div className="flex justify-between gap-4 border-b border-border pb-2">
            <dt className="text-muted-foreground">Department</dt>
            <dd className="font-semibold text-navy">{profile.department?.name ?? "—"}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-muted-foreground">Status</dt>
            <dd className="font-semibold text-brand">Pending review</dd>
          </div>
        </dl>
        <Link to="/" className="link-cta mt-6 inline-flex">
          Return to website
        </Link>
      </div>
    </PortalShell>
  );
}
