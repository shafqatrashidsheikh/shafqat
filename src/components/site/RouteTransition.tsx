import { useRouterState } from "@tanstack/react-router";
import type { ReactNode } from "react";

/** Subtle fade/slide when the pathname changes — no artificial delay */
export function RouteTransition({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div key={pathname} className="route-enter">
      {children}
    </div>
  );
}
