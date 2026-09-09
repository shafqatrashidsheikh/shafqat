import { createFileRoute, Link, Navigate } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageNavigation } from "@/components/site/PageNavigation";
import { isCmsRole } from "@/lib/auth/roles";
import { getPostAuthPath } from "@/lib/auth/redirects";
import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/admin/login")({
  head: () => ({ meta: [{ title: "Admin Login — GPW Srinagar" }] }),
  component: AdminLoginPage,
});

function AdminLoginPage() {
  const { session, profile, loading, signInWithPassword, signOut, configured } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  if (!loading && session?.access_token && profile && isCmsRole(profile.role)) {
    return <Navigate to="/admin" />;
  }

  if (!loading && session?.access_token && profile && !isCmsRole(profile.role)) {
    return <Navigate to={getPostAuthPath(profile.role, profile.approval_status)} />;
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!configured) {
      setError("Supabase is not configured.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const result = await signInWithPassword(email, password);
      if (!isCmsRole(result.profile.role)) {
        setError("This account does not have CMS admin access. Use /login for staff or student access.");
        await signOut();
        return;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-10">
      <div className="flex w-full max-w-md flex-col items-start gap-4">
        <PageNavigation />
        <div className="card-premium w-full p-8">
        <p className="text-xs font-semibold tracking-[0.16em] text-brand uppercase">CMA</p>
        <h1 className="mt-2 font-display text-2xl font-extrabold text-navy">Admin sign in</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Sign in with your CMS admin, editor, or principal account to manage site content.
        </p>

        {!configured && (
          <p className="mt-4 rounded-lg border border-border bg-light-blue p-3 text-sm text-navy">
            Supabase is not configured. Copy <code className="text-brand">.env.example</code> to{" "}
            <code className="text-brand">.env</code> and add your project credentials.
          </p>
        )}

        <form className="mt-6 space-y-4" onSubmit={onSubmit}>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              autoComplete="username"
              className="mt-1.5"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              className="mt-1.5"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="text-sm text-red">{error}</p>}
          <Button type="submit" className="w-full" disabled={busy}>
            Sign in
          </Button>
        </form>

        <Button asChild variant="link" className="mt-4 px-0">
          <Link to="/login">Staff / student login</Link>
        </Button>
      </div>
      </div>
    </div>
  );
}
