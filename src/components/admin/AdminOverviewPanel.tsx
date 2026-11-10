import type { AdminOverviewCounts } from "@/server/cda/overview";
import { PortalStatCard } from "@/components/portal/portal-ui";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type AdminOverviewPanelProps = {
  counts: AdminOverviewCounts | null;
  loading: boolean;
  healthError: string | null;
  bootstrapMessage: string | null;
  bootstrapBusy: boolean;
  admissionsEnabled?: boolean;
  onToggleAdmissions?: (enabled: boolean) => void;
  onBootstrap: () => void;
  onRefresh: () => void;
};

const STAT_ITEMS: { key: keyof AdminOverviewCounts; label: string }[] = [
  { key: "departments", label: "Departments" },
  { key: "programs", label: "Programs" },
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
  admissionsEnabled = true,
  onToggleAdmissions,
  onBootstrap,
  onRefresh,
}: AdminOverviewPanelProps) {
  const isEmpty = counts && counts.departments === 0 && counts.notices === 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-surface-white p-4 sm:p-5 shadow-soft">
        <div className="flex flex-wrap items-center gap-3">
          <span className="font-display text-sm font-bold text-navy">
            Admission Public Status:
          </span>
          <span
            className={cn(
              "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
              admissionsEnabled
                ? "border border-emerald-300 bg-emerald-50 text-emerald-800"
                : "border border-amber-300 bg-amber-50 text-amber-800",
            )}
          >
            {admissionsEnabled ? "ON (Visible to Public)" : "OFF (Hidden from Public)"}
          </span>
          <span className="text-xs text-muted-foreground hidden sm:inline">
            {admissionsEnabled
              ? "Admission option is visible in navigation & public UI"
              : "Admission option is hidden across public UI"}
          </span>
        </div>
        {onToggleAdmissions && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onToggleAdmissions(!admissionsEnabled)}
            className="text-xs font-semibold"
          >
            Turn Admission {admissionsEnabled ? "OFF" : "ON"}
          </Button>
        )}
      </div>
      {healthError && (
        <div className="rounded-xl border border-red/30 bg-red/5 px-4 py-3 text-sm text-red">
          <p className="font-semibold">Could not load CMS data</p>
          <p className="mt-1">{healthError}</p>
        </div>
      )}

      {isEmpty && !healthError && (
        <div className="card-premium border-amber-300/50 bg-amber-50 p-5 text-sm text-amber-950">
          <p className="font-semibold">No website content in the database yet</p>
          <p className="mt-1 text-pretty">
            The public site may still show built-in fallbacks. Import GPW Srinagar content into Supabase so edits here
            update the live website.
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
        <div className="rounded-xl border border-emerald-500/40 bg-emerald-50 px-4 py-3 text-sm text-emerald-950">
          {bootstrapMessage}
        </div>
      )}

      <div>
        <h2 className="font-display text-lg font-bold text-navy">Content overview</h2>
        <p className="mt-1 text-sm text-muted-foreground">Live counts from Supabase CMS tables.</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {STAT_ITEMS.map(({ key, label }) => (
          <PortalStatCard
            key={key}
            label={label}
            value={loading || !counts ? "—" : counts[key]}
          />
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        <Button type="button" variant="outline" size="sm" onClick={onRefresh} disabled={loading}>
          Refresh counts
        </Button>
      </div>
    </div>
  );
}
