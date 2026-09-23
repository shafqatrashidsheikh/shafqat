import { createFileRoute, Navigate, useNavigate } from "@tanstack/react-router";
import { PortalShell } from "@/components/portal/PortalShell";
import { StudentOnboardingForm } from "@/components/portal/StudentOnboardingForm";
import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/student/onboarding")({
  head: () => ({ meta: [{ title: "Student Profile — GPW Srinagar" }] }),
  component: StudentOnboardingPage,
});

function StudentOnboardingPage() {
  const navigate = useNavigate();
  const { session, profile, loading, signOut, refreshProfile, configured } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-sm text-muted-foreground">Loading…</p>
      </div>
    );
  }

  if (!configured || !session?.access_token || !profile) {
    return <Navigate to="/signup" />;
  }

  if (profile.role !== "student") {
    return <Navigate to="/portal" />;
  }

  if (profile.approval_status === "approved") {
    return <Navigate to="/student" />;
  }

  if (profile.approval_status === "pending_review") {
    return <Navigate to="/student/pending" />;
  }

  return (
    <PortalShell
      profile={profile}
      eyebrow="Student Portal"
      title="Complete your profile"
      subtitle="Select your diploma department and roll number for HOD / staff approval"
      onSignOut={signOut}
    >
      <div className="mx-auto max-w-lg">
        <StudentOnboardingForm
          accessToken={session.access_token}
          profile={profile}
          onSubmitted={async () => {
            await refreshProfile();
            navigate({ to: "/student/pending" });
          }}
        />
      </div>
    </PortalShell>
  );
}
