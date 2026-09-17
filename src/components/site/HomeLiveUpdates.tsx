import { Link } from "@tanstack/react-router";
import { ArrowRight, ExternalLink } from "lucide-react";
import { UpdatesFeedScroll } from "@/components/site/UpdatesFeedScroll";
import type { JkboteCachePayload, LiveNotice } from "@/lib/jkbote-live";
import { safeHrefOr } from "@/lib/security/safe-url";
import { JKBOTE_NOTICES_URL } from "@/lib/updates-data";
import { cn } from "@/lib/utils";

type HomeLiveUpdatesProps = {
  liveNotices: JkboteCachePayload | null;
};

function NoticeRow({ notice }: { notice: LiveNotice }) {
  const dateLabel = notice.publishedAt
    ? new Date(notice.publishedAt).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : null;

  return (
    <a
      href={safeHrefOr(notice.url, JKBOTE_NOTICES_URL)}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "group flex gap-3 rounded-lg border border-transparent px-2 py-2.5 transition-colors",
        "hover:border-border hover:bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand",
      )}
    >
      <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-brand" aria-hidden="true" />
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-semibold leading-snug text-navy group-hover:text-brand">
          {notice.title}
        </span>
        <span className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-muted-foreground">
          {notice.category ? <span>{notice.category}</span> : null}
          {dateLabel ? <span>{dateLabel}</span> : null}
          <span className="inline-flex items-center gap-1 font-medium text-brand/80">
            JKBOTE
            <ExternalLink className="size-3" aria-hidden="true" />
          </span>
        </span>
      </span>
    </a>
  );
}

/**
 * Homepage live institutional feed — JKBOTE notices when available.
 * UI stays stable when the official feed is empty or refreshing.
 */
export function HomeLiveUpdates({ liveNotices }: HomeLiveUpdatesProps) {
  const items = liveNotices?.notices?.slice(0, 16) ?? [];

  return (
    <section aria-labelledby="live-updates-heading" className="bg-background section-y">
      <div className="container-page">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-12">
          <div>
            <p className="font-display text-xs font-semibold tracking-[0.2em] text-brand uppercase">
              Official Information
            </p>
            <h2
              id="live-updates-heading"
              className="heading-section mt-3 font-display font-extrabold text-navy"
            >
              Live Updates
            </h2>
            <p className="mt-3 text-base leading-relaxed text-muted-foreground">
              Latest notices and circulars from the Jammu & Kashmir Board of Technical Education
              (JKBOTE), with institute Updates pages for news, events and circulars.
            </p>
            <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold">
              <Link to="/updates/news" className="text-brand hover:text-navy">
                Latest News
              </Link>
              <Link to="/updates/notices" className="text-brand hover:text-navy">
                Notices
              </Link>
              <Link to="/updates/events" className="text-brand hover:text-navy">
                Events
              </Link>
              <Link to="/updates/circulars" className="text-brand hover:text-navy">
                Tenders / Circulars
              </Link>
            </div>
            <Link
              to="/updates/notices"
              className="link-cta group mt-6 inline-flex items-center gap-2 rounded-md text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
            >
              Open Updates
              <ArrowRight
                className="size-4 transition-transform duration-200 group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </Link>
          </div>

          <div className="overflow-hidden rounded-2xl border border-border bg-surface-white">
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <p className="text-xs font-semibold tracking-[0.14em] text-navy uppercase">
                Official feed
              </p>
              <p className="text-[0.6875rem] text-muted-foreground">Source: JKBOTE</p>
            </div>
            {items.length > 0 ? (
              <UpdatesFeedScroll
                items={items}
                getKey={(n) => n.id}
                className="h-[22rem] px-2 py-2 sm:h-[24rem]"
                listClassName="space-y-0.5"
                renderItem={(notice) => <NoticeRow notice={notice} />}
              />
            ) : (
              <div className="flex h-[16rem] flex-col items-center justify-center gap-3 px-6 text-center">
                <p className="text-sm text-muted-foreground">
                  Live JKBOTE notices will appear here when the official feed is available.
                </p>
                <Link
                  to="/updates/notices"
                  className="text-sm font-semibold text-brand hover:text-navy"
                >
                  Browse institute notices
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
