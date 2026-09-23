import { createFileRoute, Link, Navigate } from "@tanstack/react-router";
import { useState } from "react";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { AuthPageShell } from "@/components/portal/portal-ui";
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { getPostAuthPath } from "@/lib/auth/redirects";
import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/signup")({
  head: () => ({ meta: [{ title: "Student Sign Up — GPW Srinagar" }] }),
  component: SignupPage,
});

function SignupPage() {
  const {
    session,
    profile,
    profileError,
    loading,
    configured,
    signInWithOtp,
    verifyOtp,
    signInWithGoogle,
    signOut,
  } = useAuth();
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
      setOtp("");
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
    <AuthPageShell
      eyebrow="Student Portal"
      title="Create your account"
      description={
        <>
          <p>Register as a diploma student at GPW Srinagar.</p>
          <p>After verification, complete your profile for department approval.</p>
        </>
      }
      footer={
        <p className="text-muted-foreground">
          Already registered?{" "}
          <Link to="/login" className="font-semibold text-brand hover:text-navy">
            Sign in
          </Link>
        </p>
      }
    >
      {!configured && (
        <p className="mb-4 rounded-lg border border-border bg-light-blue p-3 text-sm text-navy">
          Supabase is not configured. Add credentials to <code className="text-brand">.env</code>.
        </p>
      )}

      {session && !profile && (profileError || error) && (
        <div className="mb-4 rounded-lg border border-red/30 bg-red/5 p-3 text-sm text-red">
          <p>{profileError ?? error}</p>
          <button
            type="button"
            className="mt-2 font-semibold text-brand underline"
            onClick={() => void signOut()}
          >
            Sign out and try again
          </button>
        </div>
      )}

      <div className="space-y-3.5">
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

        <p className="pt-0.5 text-center text-xs text-muted-foreground">Or continue with email</p>

        {!otpSent ? (
          <form className="space-y-3.5" onSubmit={onSendOtp}>
            <Input
              id="email"
              type="email"
              aria-label="Email"
              className="h-11"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
            <Button type="submit" className="h-11 w-full" disabled={busy}>
              Send verification code
            </Button>
          </form>
        ) : (
          <form className="space-y-3.5" onSubmit={onVerifyOtp}>
            <p className="text-center text-sm text-muted-foreground">
              Enter the code sent to <strong className="text-navy">{email}</strong>
            </p>
            <InputOTP maxLength={6} pattern={REGEXP_ONLY_DIGITS} value={otp} onChange={setOtp}>
              <InputOTPGroup className="justify-center">
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <InputOTPSlot key={i} index={i} />
                ))}
              </InputOTPGroup>
            </InputOTP>
            <Button type="submit" className="h-11 w-full" disabled={busy || otp.length < 6}>
              Verify & continue
            </Button>
            <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
              <button
                type="button"
                className="font-medium text-brand hover:text-navy disabled:opacity-50"
                disabled={busy}
                onClick={() => {
                  setOtpSent(false);
                  setOtp("");
                  setError(null);
                }}
              >
                Change email
              </button>
              <button
                type="button"
                className="font-medium text-brand hover:text-navy disabled:opacity-50"
                disabled={busy}
                onClick={async () => {
                  setBusy(true);
                  setError(null);
                  try {
                    await signInWithOtp(email);
                    setOtp("");
                  } catch (err) {
                    setError(err instanceof Error ? err.message : "Could not resend code");
                  } finally {
                    setBusy(false);
                  }
                }}
              >
                Resend code
              </button>
            </div>
          </form>
        )}
      </div>

      {error && !(session && !profile) && <p className="mt-4 text-center text-sm text-red">{error}</p>}
    </AuthPageShell>
  );
}
