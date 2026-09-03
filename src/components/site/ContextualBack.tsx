import { Link, useRouter, useRouterState } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";
import { useEffect, type MouseEvent } from "react";
import {
  getPreviousInternalPath,
  pathsEqual,
  rememberInternalPath,
  resolveContextualReturn,
  splitHref,
} from "@/lib/contextual-return";
import { cn } from "@/lib/utils";

type ContextualBackProps = {
  label?: string;
  fallback?: string;
  shortLabel?: string;
  className?: string;
};

export function InternalRouteMemory() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });

  useEffect(() => {
    rememberInternalPath(pathname);
  }, [pathname]);

  return null;
}

export function ContextualBack({
  label,
  fallback,
  shortLabel,
  className,
}: ContextualBackProps) {
  const router = useRouter();
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const resolved = resolveContextualReturn(pathname);

  if (!resolved && !label && !fallback) return null;

  const href = fallback ?? resolved?.to ?? "/";
  const fullLabel = label ?? resolved?.label ?? "Home";
  const compactLabel = shortLabel ?? resolved?.shortLabel ?? fullLabel;
  const { to, hash } = splitHref(href);
  const ariaLabel = `Return to ${fullLabel}`;

  const onClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (event.defaultPrevented) return;
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

    const previous = getPreviousInternalPath();
    if (previous && pathsEqual(previous, to)) {
      event.preventDefault();
      router.history.back();
    }
  };

  return (
    <Link
      to={to as "/"}
      {...(hash ? { hash } : {})}
      onClick={onClick}
      aria-label={ariaLabel}
      title={ariaLabel}
      activeOptions={{ exact: true }}
      className={cn("contextual-return group min-w-0", className)}
    >
      <ChevronLeft className="size-3.5 shrink-0 text-brand" aria-hidden="true" strokeWidth={2.25} />
      <span className="min-w-0 truncate sm:hidden">{compactLabel}</span>
      <span className="min-w-0 truncate max-sm:hidden">{fullLabel}</span>
    </Link>
  );
}
