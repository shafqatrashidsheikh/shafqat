import { ExternalLink } from "lucide-react";
import { JKBOTE_NOTICES_URL, type NoticePriority, type UpdateItem } from "@/lib/updates-data";

const PRIORITY_STYLES: Record<NoticePriority, string> = {
  Urgent: "bg-red/10 text-red ring-1 ring-red/25",
  New: "bg-brand/10 text-brand ring-1 ring-brand/25",
  Important: "bg-light-blue text-navy ring-1 ring-border",
  General: "bg-muted text-muted-foreground",
};

export function UpdateNoticeCard({
  item,
  ariaHidden,
  actionLabel = "View Official Notice →",
}: {
  item: UpdateItem;
  ariaHidden?: boolean;
  actionLabel?: string;
}) {
  const href = item.fileUrl?.trim() || JKBOTE_NOTICES_URL;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      tabIndex={ariaHidden ? -1 : undefined}
      aria-hidden={ariaHidden}
      className="group flex flex-col gap-3 rounded-2xl border border-border bg-surface px-4 py-4 shadow-soft transition-colors hover:border-brand sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:px-5"
    >
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold">
          <span className={`rounded-md px-2 py-0.5 ${PRIORITY_STYLES[item.priority]}`}>
            {item.priority}
          </span>
          <span className="text-brand">{item.category}</span>
          <span className="text-muted-foreground">{item.date}</span>
        </div>
        <h2 className="mt-1.5 font-display text-base font-bold leading-snug text-navy">{item.title}</h2>
        <p className="mt-1 text-xs text-muted-foreground">Official Source: {item.source}</p>
      </div>
      <span className="inline-flex min-h-10 shrink-0 items-center gap-2 rounded-lg border border-border px-4 text-sm font-semibold text-brand transition-colors group-hover:bg-light-blue">
        {actionLabel}
        <ExternalLink className="size-3.5 opacity-70" aria-hidden />
      </span>
    </a>
  );
}
