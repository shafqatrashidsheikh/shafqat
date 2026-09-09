import { createFileRoute, Link, Navigate } from "@tanstack/react-router";
import { useState } from "react";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Label } from "@/components/ui/label";
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";
import { PageNavigation } from "@/components/site/PageNavigation";
import { getPostAuthPath } from "@/lib/auth/redirects";
import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/signup")({
  head: () => ({ meta: [{ title: "Student Sign Up — GPW Srinagar" }] }),
  component: SignupPage,
});

function SignupPage() {
  const { session, profile, loading, configured, signInWithOtp, verifyOtp, signInWithGoogle } = useAuth();
  const [email, setEmail] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  if (!loading && session && profile) {
    return <Navigate to={getPostAuthPath(profile.role, profile.approval_status)} />;
  }

  const onSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!configured) {
      setError("Supabase is not configured. Add credentials to .env or Vercel environment variables.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      await signInWithOtp(email);
      setOtpSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not send verification code");
    } finally {
      setBusy(false);
    }
  };

  const onVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await verifyOtp(email, otp);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid code");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-10">
      <div className="flex w-full max-w-md flex-col items-start gap-4">
        <PageNavigation />
        <div className="card-premium w-full p-8">
        <p className="text-xs font-semibold tracking-[0.16em] text-brand uppercase">Student Portal</p>
        <h1 className="mt-2 font-display text-2xl font-extrabold text-navy">Create your account</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Sign up with your email or Google. After verification, complete your student profile for department approval.
        </p>

        {!configured && (
          <p className="mt-4 rounded-lg border border-border bg-light-blue p-3 text-sm text-navy">
            Supabase is not configured. Add credentials to <code className="text-brand">.env</code>.
          </p>
        )}

        <div className="mt-6">
          <GoogleSignInButton
            label="Sign up with Google"
            disabled={busy}
            onClick={async () => {
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
            }}
          />
        </div>

        <div className="relative my-6 py-2">
          <div className="absolute inset-x-0 top-1/2 h-px bg-border" />
          <p className="relative mx-auto w-fit bg-surface-white px-3 text-xs text-muted-foreground">or use email</p>
        </div>

        {!otpSent ? (
          <form className="space-y-4" onSubmit={onSendOtp}>
            <div>
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                type="email"
                className="mt-1.5"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={busy}>
              Send verification code
            </Button>
          </form>
        ) : (
          <form className="space-y-4" onSubmit={onVerifyOtp}>
            <p className="text-sm text-muted-foreground">
              Enter the code sent to <strong>{email}</strong>
            </p>
            <InputOTP maxLength={6} pattern={REGEXP_ONLY_DIGITS} value={otp} onChange={setOtp}>
              <InputOTPGroup className="justify-center">
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <InputOTPSlot key={i} index={i} />
                ))}
              </InputOTPGroup>
            </InputOTP>
            <Button type="submit" className="w-full" disabled={busy || otp.length < 6}>
              Verify & continue
            </Button>
          </form>
        )}

        {error && <p className="mt-4 text-sm text-red">{error}</p>}

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already registered?{" "}
          <Link to="/login" className="font-semibold text-brand hover:text-navy">
            Sign in
          </Link>
        </p>
      </div>
      </div>
    </div>
  );
}
