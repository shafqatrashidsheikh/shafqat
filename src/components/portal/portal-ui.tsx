import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

/** Stat tile used on portal / CMS overview grids */
export function PortalStatCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: ReactNode;
  hint?: string;
}) {
  return (
    <div className="card-premium p-4 sm:p-5">
      <p className="text-xs font-semibold uppercase tracking-wide text-brand">{label}</p>
      <p className="mt-1 font-display text-2xl font-extrabold text-navy sm:text-3xl">{value}</p>
      {hint ? <p className="mt-1 text-xs text-muted-foreground">{hint}</p> : null}
    </div>
  );
}

/** Section heading + optional supporting line */
export function PortalSection({
  title,
  description,
  children,
  className,
}: {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("space-y-4", className)}>
      <div>
        <h2 className="font-display text-lg font-bold text-navy">{title}</h2>
        {description ? <p className="mt-1 text-sm text-muted-foreground">{description}</p> : null}
      </div>
      {children}
    </section>
  );
}

/** Official auth layout for login / signup / CMS login */
export function AuthPageShell({
  eyebrow,
  title,
  description,
  children,
  footer,
}: {
  eyebrow: string;
  title: string;
  description?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-6 sm:py-8">
      <div className="w-full max-w-lg">
        <div className="card-premium w-full min-w-0 px-6 py-7 sm:px-8 sm:py-8">
          <div className="text-center">
            <p className="text-xs font-semibold tracking-[0.16em] text-brand uppercase">{eyebrow}</p>
            <h1 className="mt-2 font-display text-2xl font-extrabold text-navy sm:text-[1.75rem]">
              {title}
            </h1>
            {description ? (
              <div className="mt-3 space-y-1 text-[13px] leading-relaxed text-muted-foreground sm:text-sm">
                {description}
              </div>
            ) : null}
          </div>
          <div className="mt-6">{children}</div>
          {footer ? <div className="mt-6 text-center text-sm">{footer}</div> : null}
        </div>
      </div>
    </div>
  );
}

/** Pill-style action tabs (matches Institutional Portal) */
export function PortalActionTabs({
  items,
}: {
  items: {
    key: string;
    label: string;
    active?: boolean;
    onClick?: () => void;
    href?: string;
  }[];
}) {
  return (
    <div className="mb-6 flex flex-wrap gap-2">
      {items.map((item) => {
        const className = cn(
          "inline-flex h-9 items-center justify-center rounded-md border px-3 text-sm font-medium transition-colors",
          item.active
            ? "border-transparent bg-brand text-white hover:bg-brand/90"
            : "border-border bg-surface-white text-navy hover:bg-light-blue",
        );

        if (item.href) {
          return (
            <Link key={item.key} to={item.href} className={className}>
              {item.label}
            </Link>
          );
        }

        return (
          <button key={item.key} type="button" className={className} onClick={item.onClick}>
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
