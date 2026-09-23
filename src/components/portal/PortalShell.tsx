import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import type { UserProfile } from "@/lib/auth/roles";
import { cn } from "@/lib/utils";

type PortalShellProps = {
  profile: UserProfile;
  title: string;
  subtitle?: string;
  /** Omit or pass null to hide the eyebrow (avoids duplicate titles). */
  eyebrow?: string | null;
  /** `page` matches public site headers (no white strip). Default keeps institutional portal chrome. */
  variant?: "portal" | "page";
  onSignOut: () => void;
  children: ReactNode;
  actions?: ReactNode;
  nav?: { label: string; to: string; active?: boolean }[];
};

export function PortalShell({
  profile,
  title,
  subtitle,
  eyebrow = "GPW Portal",
  variant = "portal",
  onSignOut,
  children,
  actions,
  nav = [],
}: PortalShellProps) {
  const displayName = profile.full_name?.trim() || profile.email;
  const showEyebrow = Boolean(eyebrow && eyebrow.trim() && eyebrow.trim().toLowerCase() !== title.trim().toLowerCase());
  const isPage = variant === "page";

  return (
    <div className="min-h-screen bg-background">
      <header className={cn(isPage ? "bg-background" : "border-b border-border bg-surface-white")}>
        <div className={cn("container-page", isPage ? "pt-3 pb-2 sm:pt-4 sm:pb-3" : "py-4")}>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="min-w-0 max-w-2xl">
              {showEyebrow ? (
                <p className="text-xs font-semibold tracking-[0.16em] text-brand uppercase">{eyebrow}</p>
              ) : null}
              <h1
                className={cn(
                  "font-display font-extrabold text-navy",
                  isPage
                    ? "text-[clamp(1.5rem,3.5vw+0.65rem,2.25rem)] leading-tight"
                    : cn("text-xl sm:text-2xl", showEyebrow && "mt-1"),
                )}
              >
                {title}
              </h1>
              {subtitle ? (
                <p className={cn("text-sm text-muted-foreground", isPage ? "mt-2.5 sm:mt-3" : "mt-1")}>
                  {subtitle}
                </p>
              ) : null}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {actions}
              <span className="rounded-full bg-light-blue px-3 py-1 text-xs font-medium text-navy">
                {displayName} · {profile.role.toUpperCase()}
              </span>
              <Button variant="outline" size="sm" onClick={onSignOut}>
                Sign out
              </Button>
            </div>
          </div>
        </div>
        {nav.length > 0 ? (
          <div className={cn("container-page flex flex-wrap gap-2", isPage ? "pb-3" : "pb-4")}>
            {nav.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "rounded-md border px-3 py-1.5 text-sm font-medium transition-colors",
                  item.active
                    ? "border-transparent bg-brand text-white"
                    : "border-border bg-surface-white text-navy hover:bg-light-blue",
                )}
              >
                {item.label}
              </Link>
            ))}
          </div>
        ) : null}
      </header>
      <main className={cn("container-page", isPage ? "pb-8 pt-2 sm:pb-10 sm:pt-3" : "py-6 sm:py-8")}>
        {children}
      </main>
    </div>
  );
}
