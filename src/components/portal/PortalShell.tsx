import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { ContextualBack } from "@/components/site/ContextualBack";
import { Button } from "@/components/ui/button";
import type { UserProfile } from "@/lib/auth/roles";
import { cn } from "@/lib/utils";

type PortalShellProps = {
  profile: UserProfile;
  title: string;
  subtitle?: string;
  onSignOut: () => void;
  children: ReactNode;
  nav?: { label: string; to: string; active?: boolean }[];
};

export function PortalShell({
  profile,
  title,
  subtitle,
  onSignOut,
  children,
  nav = [],
}: PortalShellProps) {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-surface-white">
        <div className="container-page py-4">
          <ContextualBack className="mb-3" />
          <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold tracking-[0.16em] text-brand uppercase">GPW Portal</p>
            <h1 className="font-display text-xl font-extrabold text-navy sm:text-2xl">{title}</h1>
            {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-light-blue px-3 py-1 text-xs font-medium text-navy">
              {profile.full_name || profile.email} · {profile.role.toUpperCase()}
            </span>
            <Button variant="outline" size="sm" onClick={onSignOut}>
              Sign out
            </Button>
          </div>
          </div>
        </div>
        {nav.length > 0 && (
          <div className="container-page flex flex-wrap gap-2 pb-4">
            {nav.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
                  item.active
                    ? "border-brand bg-brand text-white"
                    : "border-border bg-surface-white text-navy hover:bg-light-blue",
                )}
              >
                {item.label}
              </Link>
            ))}
          </div>
        )}
      </header>
      <main className="container-page py-8">{children}</main>
    </div>
  );
}
