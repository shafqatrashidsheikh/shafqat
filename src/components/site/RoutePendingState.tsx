/**
 * Minimal in-route pending UI — never the Home page.
 * Used while destination loaders resolve during client navigations.
 */
export function RoutePendingState() {
  return (
    <div
      className="flex min-h-[50vh] w-full min-w-0 items-center justify-center overflow-x-clip bg-background px-4 py-16"
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label="Loading page"
    >
      <div className="flex flex-col items-center gap-3 text-center">
        <span
          className="size-8 rounded-full border-2 border-border border-t-brand motion-safe:animate-spin"
          aria-hidden="true"
        />
        <p className="font-display text-sm font-semibold tracking-wide text-navy">Loading…</p>
      </div>
    </div>
  );
}
