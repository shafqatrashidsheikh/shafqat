import { Link, useNavigate } from "@tanstack/react-router";
import { LogIn, UserPlus } from "lucide-react";
import type { ReactElement } from "react";
import { HEADER_PILL } from "@/components/site/HeaderCtaPills";
import { useAuth } from "@/hooks/useAuth";
import { getPostAuthPath } from "@/lib/auth/redirects";
import { cn } from "@/lib/utils";

type HeaderAuthButtonsProps = {
  className?: string | undefined;
  onNavigate?: (() => void) | undefined;
  variant?: "desktop" | "mobile" | undefined;
};

export function HeaderAuthButtons({
  className,
  onNavigate,
  variant = "desktop",
}: HeaderAuthButtonsProps): ReactElement {
  const navigate = useNavigate();
  const { session, profile, loading, signOut } = useAuth();

  const goTo = (to: "/login" | "/signup" | string) => {
    onNavigate?.();
    navigate({ to });
  };

  // Mobile drawer variant: tactile, full-width, high-contrast action buttons
  if (variant === "mobile") {
    if (!loading && session && profile) {
      const portalPath = getPostAuthPath(profile.role, profile.approval_status);
      return (
        <div className={cn("flex w-full flex-col gap-2", className)}>
          <button
            type="button"
            onClick={() => goTo(portalPath)}
            className="flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-sm font-bold text-white shadow-xs transition-colors hover:bg-brand-deep active:scale-[0.99] cursor-pointer"
          >
            <span>Open Student Portal</span>
            <span aria-hidden="true">→</span>
          </button>
          <button
            type="button"
            onClick={() => {
              onNavigate?.();
              void signOut().then(() => navigate({ to: "/" }));
            }}
            className="flex min-h-10 w-full items-center justify-center gap-2 rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-2 text-xs font-semibold text-destructive hover:bg-destructive/15 transition-colors cursor-pointer"
          >
            Sign out
          </button>
        </div>
      );
    }

    return (
      <div className={cn("grid w-full grid-cols-2 gap-2", className)}>
        <button
          type="button"
          onClick={() => goTo("/login")}
          className="flex min-h-11 items-center justify-center gap-1.5 rounded-xl border border-border bg-surface-white px-3 py-2.5 text-sm font-bold text-navy shadow-xs transition-colors hover:bg-light-blue active:scale-[0.99] cursor-pointer"
        >
          <LogIn className="size-4 shrink-0 text-brand" aria-hidden="true" />
          <span>Login</span>
        </button>
        <button
          type="button"
          onClick={() => goTo("/signup")}
          className="flex min-h-11 items-center justify-center gap-1.5 rounded-xl bg-brand px-3 py-2.5 text-sm font-bold text-white shadow-xs transition-colors hover:bg-brand-deep active:scale-[0.99] cursor-pointer"
        >
          <UserPlus className="size-4 shrink-0 text-white" aria-hidden="true" />
          <span>Sign up</span>
        </button>
      </div>
    );
  }

  // Desktop header variant
  if (!loading && session && profile) {
    const portalPath = getPostAuthPath(profile.role, profile.approval_status);
    return (
      <div className={cn("flex shrink-0 flex-nowrap items-center gap-2 xl:gap-3 2xl:gap-3.5", className)}>
        <button type="button" onClick={() => goTo(portalPath)} className={HEADER_PILL}>
          Portal
        </button>
        <button
          type="button"
          onClick={() => {
            onNavigate?.();
            void signOut().then(() => navigate({ to: "/" }));
          }}
          className={HEADER_PILL}
        >
          Sign out
        </button>
      </div>
    );
  }

  return (
    <div className={cn("flex shrink-0 flex-nowrap items-center gap-2 xl:gap-3 2xl:gap-3.5", className)}>
      <button type="button" onClick={() => goTo("/login")} className={HEADER_PILL}>
        Login
      </button>
      <button type="button" onClick={() => goTo("/signup")} className={HEADER_PILL}>
        Sign up
      </button>
      <Link to="/login" className="sr-only">
        Login
      </Link>
      <Link to="/signup" className="sr-only">
        Sign up
      </Link>
    </div>
  );
}
