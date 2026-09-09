import { Link, useRouterState } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { getMeaningfulPrevious, locationKey, rememberInternalPath, splitHref } from "@/lib/contextual-return";
import { labelForLocation } from "@/lib/site-trail";
import { cn } from "@/lib/utils";

export function InternalRouteMemory() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const hash = useRouterState({ select: (state) => state.location.hash });

  useEffect(() => {
    rememberInternalPath(pathname, hash);
  }, [pathname, hash]);

  return null;
}

export function ContextualBack({ className }: { className?: string }) {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const hash = useRouterState({ select: (state) => state.location.hash });
  const currentKey = locationKey(pathname, hash);
  const [previous, setPrevious] = useState<string | null>(null);

  useEffect(() => {
    setPrevious(getMeaningfulPrevious(currentKey));
  }, [currentKey]);

  if (!previous) return null;

  const { to, hash: prevHash } = splitHref(previous);
  const previousLabel = labelForLocation(to, prevHash);
  const ariaLabel = `Previous section: ${previousLabel}`;

  return (
    <Link
      to={to as "/"}
      {...(prevHash ? { hash: prevHash } : {})}
      aria-label={ariaLabel}
      title={ariaLabel}
      className={cn("trail-previous group", className)}
    >
      <ChevronLeft className="size-3.5 shrink-0 text-brand" aria-hidden="true" strokeWidth={2.25} />
      <span className="sm:hidden">Previous</span>
      <span className="max-sm:hidden">Previous section</span>
    </Link>
  );
}
