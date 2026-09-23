import { createFileRoute, Link, Navigate, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { AuthPageShell } from "@/components/portal/portal-ui";
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { UserRole } from "@/lib/auth/roles";
import { getPostAuthPath, isStaffPortalLoginRole } from "@/lib/auth/redirects";
import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Login — GPW Srinagar Portal" }] }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const {
    session,
    profile,
    profileError,
    loading,
    configured,
    signInWithPassword,
    signInWithOtp,
    verifyOtp,
    signInWithGoogle,
    signOut,
  } = useAuth();

  const [staffEmail, setStaffEmail] = useState("");
  const [staffPassword, setStaffPassword] = useState("");
  const [studentEmail, setStudentEmail] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [activeTab, setActiveTab] = useState<"student" | "staff">("student");

  useEffect(() => {
    if (loading || !session || !profile) return;

    if (activeTab === "staff" && profile.role === "student") {
      setError("This is a student account. Please use the Student tab to sign in.");
      void signOut();
      return;
    }

    navigate({ to: getPostAuthPath(profile.role, profile.approval_status) });
  }, [loading, session, profile, activeTab, navigate, signOut]);

  if (!loading && session && profile && activeTab === "student" && profile.role === "student") {
    return <Navigate to={getPostAuthPath(profile.role, profile.approval_status)} />;
  }

  if (!loading && session && profile && activeTab === "staff" && isStaffPortalLoginRole(profile.role as UserRole)) {
    return <Navigate to={getPostAuthPath(profile.role, profile.approval_status)} />;
  }

  const onStaffLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!configured) {
      setError("Supabase is not configured. Add credentials to .env or Vercel environment variables.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const result = await signInWithPassword(staffEmail, staffPassword);
      if (result.profile.role === "student") {
        setError("This is a student account. Use the Student tab instead.");
        await signOut();
        return;
      }
      navigate({ to: getPostAuthPath(result.profile.role, result.profile.approval_status) });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setBusy(false);
    }
  };

  const onSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!configured) {
      setError("Supabase is not configured. Add credentials to .env or Vercel environment variables.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      await signInWithOtp(studentEmail);
      setOtpSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not send OTP");
    } finally {
      setBusy(false);
    }
  };

  const onVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await verifyOtp(studentEmail, otp);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid OTP");
    } finally {
      setBusy(false);
    }
  };

  const onGoogle = async () => {
    if (!configured) {
      setError("Supabase is not configured. Add credentials to .env or Vercel environment variables.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      await signInWithGoogle();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Google sign-in failed");
      setBusy(false);
    }
  };

  return (
    <AuthPageShell
      eyebrow="GPWS Portal"
      title="Sign in"
      description={
        <>
          <p>Students sign in with Google or email OTP.</p>
          <p className="whitespace-nowrap">
            Principal, HODs, staff &amp; CMS Admin use email and password.
          </p>
        </>
      }
      footer={
        activeTab === "student" ? (
          <p className="text-muted-foreground">
            New student?{" "}
            <Link to="/signup" className="font-semibold text-brand hover:text-navy">
              Create account
            </Link>
          </p>
        ) : null
      }
    >
      {!configured && (
        <p className="mb-4 rounded-lg border border-border bg-light-blue p-3 text-sm text-navy">
          Supabase is not configured. Add credentials to <code className="text-brand">.env</code>.
        </p>
      )}

      <Tabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as "student" | "staff")}
      >
        <TabsList className="grid h-10 w-full grid-cols-2 gap-0 p-1">
          <TabsTrigger
            value="student"
            className="h-full w-full border border-transparent data-[state=active]:border-brand data-[state=active]:bg-background data-[state=active]:shadow-none"
          >
            Student
          </TabsTrigger>
          <TabsTrigger
            value="staff"
            className="h-full w-full border border-transparent data-[state=active]:border-brand data-[state=active]:bg-background data-[state=active]:shadow-none"
          >
            Officials
          </TabsTrigger>
        </TabsList>

        <TabsContent value="student" className="mt-5 space-y-3.5">
          <GoogleSignInButton disabled={busy} onClick={onGoogle} />

          <p className="pt-0.5 text-center text-xs text-muted-foreground">Or continue with email</p>

          {!otpSent ? (
            <form className="space-y-3.5" onSubmit={onSendOtp}>
              <Input
                id="student_email"
                type="email"
                aria-label="Email"
                className="h-11"
                value={studentEmail}
                onChange={(e) => setStudentEmail(e.target.value)}
                required
              />
              <Button type="submit" className="h-11 w-full" disabled={busy}>
                Send login code
              </Button>
            </form>
          ) : (
            <form className="space-y-3.5" onSubmit={onVerifyOtp}>
              <p className="text-center text-sm text-muted-foreground">
                Enter the 6-digit code sent to <strong className="text-navy">{studentEmail}</strong>
              </p>
              <InputOTP maxLength={6} pattern={REGEXP_ONLY_DIGITS} value={otp} onChange={setOtp}>
                <InputOTPGroup className="justify-center">
                  {[0, 1, 2, 3, 4, 5].map((i) => (
                    <InputOTPSlot key={i} index={i} />
                  ))}
                </InputOTPGroup>
              </InputOTP>
              <Button type="submit" className="h-11 w-full" disabled={busy || otp.length < 6}>
                Verify & sign in
              </Button>
              <Button type="button" variant="ghost" className="h-11 w-full" onClick={() => setOtpSent(false)}>
                Use a different email
              </Button>
            </form>
          )}
        </TabsContent>

        <TabsContent value="staff" className="mt-5 space-y-3.5">
          <form className="space-y-3.5" onSubmit={onStaffLogin}>
            <div>
              <Label htmlFor="staff_email">Email</Label>
              <Input
                id="staff_email"
                type="email"
                autoComplete="username"
                className="mt-1.5 h-11"
                value={staffEmail}
                onChange={(e) => setStaffEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="staff_password">Password</Label>
              <Input
                id="staff_password"
                type="password"
                autoComplete="current-password"
                className="mt-1.5 h-11"
                value={staffPassword}
                onChange={(e) => setStaffPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="h-11 w-full" disabled={busy}>
              Sign in
            </Button>
          </form>
          <p className="pt-0.5 text-center text-xs text-muted-foreground">
            Sign in with the account for your assigned role.
          </p>
        </TabsContent>
      </Tabs>

      {(error || profileError) && (
        <p className="mt-4 text-center text-sm text-red">{error ?? profileError}</p>
      )}
    </AuthPageShell>
  );
}
