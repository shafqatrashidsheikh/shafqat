import { Link, useRouterState } from "@tanstack/react-router";
import { ExternalLink, Megaphone } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import {
  JKBOTE_CLIENT_POLL_MS,
  type JkboteCachePayload,
  type LiveNotice,
} from "@/lib/jkbote-live";

const SCROLL_PX_PER_SEC = 24;

/** Live JKBOTE ticker — Updates section only (not homepage / rest of site) */
function isUpdatesPath(pathname: string) {
  return pathname === "/updates" || pathname.startsWith("/updates/");
}

function TickerRow({ notice, ariaHidden }: { notice: LiveNotice; ariaHidden?: boolean }) {
  return (
    <a
      href={notice.url}
      target="_blank"
      rel="noopener noreferrer"
      tabIndex={ariaHidden ? -1 : undefined}
      aria-hidden={ariaHidden}
      className="group flex min-h-[3.25rem] items-start gap-3 border-b border-border/70 px-1 py-2.5 transition-colors hover:bg-light-blue/40"
    >
      <div className="mt-0.5 flex w-[4.75rem] shrink-0 flex-col gap-1">
        {notice.isNew ? (
          <span className="inline-flex w-fit rounded-md bg-brand/10 px-1.5 py-0.5 text-[10px] font-bold tracking-wide text-brand uppercase ring-1 ring-brand/25">
            New
          </span>
        ) : (
          <span className="inline-flex w-fit rounded-md bg-muted px-1.5 py-0.5 text-[10px] font-semibold text-muted-foreground">
            {notice.category}
          </span>
        )}
        <time className="text-[10px] font-medium text-muted-foreground">{notice.date}</time>
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-display text-sm font-bold leading-snug text-navy transition-colors group-hover:text-brand">
          {notice.title}
        </p>
        <p className="mt-0.5 text-[11px] text-muted-foreground">Official Source: JKBOTE</p>
      </div>
      <ExternalLink
        className="mt-1 size-3.5 shrink-0 text-brand/60 opacity-0 transition-opacity group-hover:opacity-100"
        aria-hidden
      />
    </a>
  );
}

export function LiveUpdatesTicker({
  initial,
  className,
}: {
  initial?: JkboteCachePayload | null;
  className?: string;
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const onUpdates = isUpdatesPath(pathname);
  const [payload, setPayload] = useState<JkboteCachePayload | null>(initial ?? null);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  useEffect(() => {
    if (!onUpdates) return;

    let cancelled = false;

    async function load(force = false) {
      try {
        const res = await fetch(`/api/jkbote-notices?limit=20${force ? "&refresh=1" : ""}`, {
          headers: { Accept: "application/json" },
        });
        if (!res.ok) return;
        const data = (await res.json()) as JkboteCachePayload;
        if (!cancelled && Array.isArray(data.notices)) {
          setPayload(data);
        }
      } catch {
        // Keep last good payload / SSR initial
      }
    }

    if (!initial?.notices?.length) {
      void load(false);
    }

    const timer = window.setInterval(() => void load(true), JKBOTE_CLIENT_POLL_MS);
    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, [initial, onUpdates]);

  const notices = payload?.notices ?? [];

  useEffect(() => {
    setShouldAnimate(false);
  }, [notices.length, payload?.fetchedAt]);

  useEffect(() => {
    if (!onUpdates || reducedMotion || notices.length < 2) {
      setShouldAnimate(false);
      return;
    }

    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!viewport || !track) return;

    const sync = () => {
      const viewportHeight = viewport.clientHeight;
      const listEl = track.firstElementChild as HTMLElement | null;
      const contentHeight = listEl?.scrollHeight ?? track.scrollHeight;

      if (!shouldAnimate) {
        if (contentHeight > viewportHeight + 8) setShouldAnimate(true);
        return;
      }

      const loopDistance = track.scrollHeight / 2;
      const seconds = Math.min(100, Math.max(32, loopDistance / SCROLL_PX_PER_SEC));
      track.style.setProperty("--live-updates-duration", `${seconds.toFixed(2)}s`);
    };

    sync();
    const ro = new ResizeObserver(sync);
    ro.observe(viewport);
    ro.observe(track);
    return () => ro.disconnect();
  }, [notices, reducedMotion, shouldAnimate, onUpdates]);

  if (!onUpdates || notices.length === 0) return null;

  const showTicker = !reducedMotion && notices.length >= 2;
  const rows = shouldAnimate ? [...notices, ...notices] : notices;

  return (
    <section
      aria-label="Latest official updates from JKBOTE"
      className={cn("bg-background", className)}
    >
      <div className="container-page py-3 sm:py-3.5">
        <div className="overflow-hidden rounded-2xl border border-border bg-surface-white shadow-soft">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border bg-light-blue/60 px-4 py-2.5 sm:px-5">
            <div className="flex min-w-0 items-center gap-2.5">
              <span className="grid size-7 place-items-center rounded-full bg-brand/10 text-brand">
                <Megaphone className="size-3.5" aria-hidden />
              </span>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="font-display text-sm font-extrabold text-navy sm:text-base">
                    Latest Updates
                  </h2>
                  <span className="inline-flex items-center gap-1 rounded-full bg-brand/10 px-2 py-0.5 text-[10px] font-bold tracking-wide text-brand uppercase">
                    <span className="size-1.5 animate-pulse rounded-full bg-brand" aria-hidden />
                    Live
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Official JKBOTE notices · auto-refreshed
                </p>
              </div>
            </div>
            <Link to="/updates/news" className="link-cta shrink-0 text-xs sm:text-sm">
              View all
            </Link>
          </div>

          <div
            ref={viewportRef}
            className={cn(
              "live-updates-viewport px-4 sm:px-5",
              showTicker && shouldAnimate && "is-animating",
              !showTicker && "max-h-[14rem] overflow-y-auto",
            )}
            aria-live={shouldAnimate ? "off" : "polite"}
          >
            {showTicker ? (
              <div ref={trackRef} className={cn(shouldAnimate && "live-updates-track")}>
                <div>
                  {rows.map((notice, index) => (
                    <TickerRow
                      key={`${notice.id}-${index}`}
                      notice={notice}
                      ariaHidden={shouldAnimate && index >= notices.length}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <div>
                {notices.map((notice) => (
                  <TickerRow key={notice.id} notice={notice} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
