import type { ReactNode } from "react";

/**
 * Stable outlet wrapper — do NOT remount on pathname change.
 * Remounting via key={pathname} unmounts the current page before the
 * destination is ready and causes a Home/previous-page flash.
 *
 * No opacity animation here: fill-mode animations can leave the page
 * invisible after refresh if hydration is interrupted.
 */
export function RouteTransition({ children }: { children: ReactNode }) {
  return <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-x-clip">{children}</div>;
}
