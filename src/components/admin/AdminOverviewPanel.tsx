import type { AdminOverviewCounts } from "@/server/cda/overview";
import { Button } from "@/components/ui/button";

type AdminOverviewPanelProps = {
  counts: AdminOverviewCounts | null;
  loading: boolean;
  healthError: string | null;
  bootstrapMessage: string | null;
  bootstrapBusy: boolean;
  onBootstrap: () => void;
  onRefresh: () => void;
};

const STAT_ITEMS: { key: keyof AdminOverviewCounts; label: string }[] = [
  { key: "departments", label: "Departments" },
  { key: "programs", label: "Programs / Courses" },
  { key: "notices", label: "Notices" },
  { key: "events", label: "Events" },
  { key: "announcements", label: "Pinned announcements" },
  { key: "gallery", label: "Gallery items" },
  { key: "videos", label: "Videos" },
  { key: "media", label: "Media library" },
  { key: "exploreCards", label: "Explore cards" },
  { key: "pageSections", label: "Page sections" },
  { key: "admissionsSteps", label: "Admission steps" },
];

export function AdminOverviewPanel({
  counts,
  loading,
  healthError,
  bootstrapMessage,
  bootstrapBusy,
  onBootstrap,
  onRefresh,
}: AdminOverviewPanelProps) {
  const isEmpty = counts && counts.departments === 0 && counts.notices === 0;

  return (
    <div className="space-y-6">
      {healthError && (
        <div className="rounded-xl border border-destructive/40 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          <p className="font-semibold">Could not load CMS data</p>
          <p className="mt-1">{healthError}</p>
        </div>
      )}

      {isEmpty && !healthError && (
        <div className="rounded-xl border border-amber-500/40 bg-amber-50 px-4 py-4 text-sm text-amber-950 dark:bg-amber-950/20 dark:text-amber-100">
          <p className="font-semibold">No website content in the database yet</p>
          <p className="mt-1 text-pretty">
            The public site may still show content from built-in fallbacks. Import the actual GPW Srinagar
            content into Supabase so edits here update the live website.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Button type="button" onClick={onBootstrap} disabled={bootstrapBusy}>
              {bootstrapBusy ? "Importing…" : "Import website content"}
            </Button>
            <Button type="button" variant="outline" onClick={onRefresh}>
              Refresh
            </Button>
          </div>
        </div>
      )}

      {bootstrapMessage && (
        <div className="rounded-xl border border-emerald-500/40 bg-emerald-50 px-4 py-3 text-sm text-emerald-950 dark:bg-emerald-950/20 dark:text-emerald-100">
          {bootstrapMessage}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {STAT_ITEMS.map(({ key, label }) => (
          <div
            key={key}
            className="rounded-2xl border border-border bg-card p-5 shadow-soft"
          >
            <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">{label}</p>
            <p className="mt-2 font-display text-3xl font-extrabold text-navy">
              {loading || !counts ? "—" : counts[key]}
            </p>
          </div>
        ))}
      </div>

      {!isEmpty && (
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" onClick={onRefresh}>
            Refresh counts
          </Button>
          <Button type="button" variant="outline" onClick={onBootstrap} disabled={bootstrapBusy}>
            {bootstrapBusy ? "Importing…" : "Re-import missing content"}
          </Button>
        </div>
      )}
    </div>
  );
}
