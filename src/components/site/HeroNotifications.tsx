import { Link } from "@tanstack/react-router";
import { Bell, Search, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AmpersandText } from "@/components/site/AmpersandText";
import { toCleanNoticeUrl, UPDATE_ITEMS } from "@/lib/updates-data";
import type { LiveNotice } from "@/lib/jkbote-live";
import { cn } from "@/lib/utils";

const SCROLL_PX_PER_SEC = 24;

export type NotificationItem = {
  tag: string;
  date: string;
  title: string;
  href?: string;
  isNew?: boolean;
};

type NoticeRowItem = {
  id: string;
  title: string;
  tag: string;
  date: string;
  publishedAt?: string;
  href: string;
  isExternal: boolean;
  badge?: "LIVE" | "NEW";
};

function determineBadge(
  title: string,
  isNew?: boolean,
  publishedAt?: string,
): "LIVE" | "NEW" | undefined {
  const isOnlineActive =
    /online\s*(examination|registration|admission|application)?\s*form|apply online|portal active|live link|portal open/i.test(
      title,
    );

  if (isOnlineActive && isNew) {
    return "LIVE";
  }

  if (isNew) {
    return "NEW";
  }

  // If published in the last 7 days, mark as NEW even if not explicitly flagged
  if (publishedAt) {
    const pubMs = Date.parse(publishedAt);
    if (!Number.isNaN(pubMs)) {
      const daysOld = (Date.now() - pubMs) / (1000 * 60 * 60 * 24);
      if (daysOld <= 7) return "NEW";
    }
  }

  return undefined; // "simply" - no badge
}

export type AdminNoticeItem = {
  id: string;
  title: string;
  tag: string;
  date: string;
  publishedAt?: string;
  href: string;
  priority?: string;
  isNew?: boolean;
  isPinned?: boolean;
};

function buildHeroNotices(
  liveNotices?: LiveNotice[] | null,
  adminNotices?: AdminNoticeItem[] | null,
  fallbackItems?: NotificationItem[],
): NoticeRowItem[] {
  // 1. Admin notices created in Admin Panel
  const adminRows: NoticeRowItem[] = (adminNotices ?? []).map((notice) => {
    const badge = determineBadge(notice.title, notice.isNew, notice.publishedAt);
    return {
      id: `admin-${notice.id}`,
      title: notice.title,
      tag: notice.tag || "Notice",
      date: notice.date,
      publishedAt: notice.publishedAt,
      href: notice.href,
      isExternal: notice.href.startsWith("http"),
      badge: notice.isPinned ? "LIVE" : badge,
    };
  });

  // 2. Official live JKBOTE notices
  const liveRows: NoticeRowItem[] = (liveNotices ?? []).map((notice) => {
    const badge = determineBadge(notice.title, notice.isNew, notice.publishedAt);
    return {
      id: notice.id,
      title: notice.title,
      tag: notice.category,
      date: notice.date,
      publishedAt: notice.publishedAt,
      href: notice.url,
      isExternal: notice.url.startsWith("http"),
      badge,
    };
  });

  // 3. Fallback verified UPDATE_ITEMS
  const staticRows: NoticeRowItem[] = UPDATE_ITEMS.map((item) => {
    const isOnlineActive =
      /online\s*(examination|registration|admission|application)?\s*form|apply online/i.test(
        item.title,
      );
    const badge: "LIVE" | "NEW" | undefined =
      isOnlineActive && item.priority === "New"
        ? "LIVE"
        : item.priority === "New"
          ? "NEW"
          : undefined;

    return {
      id: item.id,
      title: item.title,
      tag: item.category,
      date: item.date,
      publishedAt: item.publishedAt,
      href: item.fileUrl,
      isExternal: item.fileUrl.startsWith("http"),
      badge,
    };
  });

  const fallbackRows: NoticeRowItem[] = (fallbackItems ?? []).map((item, index) => ({
    id: `fallback-${index}`,
    title: item.title,
    tag: item.tag,
    date: item.date,
    href: item.href ?? "/updates/notices",
    isExternal: (item.href ?? "").startsWith("http"),
    badge: item.isNew ? "NEW" : undefined,
  }));

  // Merge in priority order: Admin notices first, then JKBOTE live, then fallbacks
  const combined = [...adminRows, ...liveRows, ...staticRows, ...fallbackRows];

  // Strict deduplication by normalized title to prevent ANY duplicate notices
  const seen = new Set<string>();
  const deduped: NoticeRowItem[] = [];
  for (const item of combined) {
    const key = item.title.trim().toLowerCase().replace(/\s+/g, " ");
    if (seen.has(key)) continue;
    seen.add(key);
    deduped.push(item);
  }

  // Sorting:
  // 1. LIVE notices first
  // 2. NEW notices second
  // 3. Regular notices in newest date order
  return deduped.sort((a, b) => {
    const aWeight = a.badge === "LIVE" ? 2 : a.badge === "NEW" ? 1 : 0;
    const bWeight = b.badge === "LIVE" ? 2 : b.badge === "NEW" ? 1 : 0;
    if (bWeight !== aWeight) return bWeight - aWeight;

    const dateA = a.publishedAt ? Date.parse(a.publishedAt) : 0;
    const dateB = b.publishedAt ? Date.parse(b.publishedAt) : 0;
    return dateB - dateA;
  });
}

export function HeroNotifications({
  liveNotices,
  items,
  className,
}: {
  liveNotices?: LiveNotice[] | null;
  items?: NotificationItem[];
  className?: string;
}) {
  const [activeNotices, setActiveNotices] = useState<LiveNotice[] | null>(
    liveNotices ?? null,
  );
  const [adminNotices, setAdminNotices] = useState<AdminNoticeItem[] | null>(null);

  // Sync if prop updates
  useEffect(() => {
    if (liveNotices?.length) {
      setActiveNotices(liveNotices);
    }
  }, [liveNotices]);

  // Client-side auto-update directly from live-notices API (Admin + JKBOTE sync)
  useEffect(() => {
    let cancelled = false;

    async function fetchNotices(refresh = false) {
      try {
        const res = await fetch(
          `/api/latest-notices${refresh ? "?refresh=1" : ""}`,
          { headers: { Accept: "application/json" } },
        );
        if (!res.ok) return;
        const data = (await res.json()) as {
          ok?: boolean;
          adminNotices?: AdminNoticeItem[];
          liveNotices?: LiveNotice[];
        };
        if (!cancelled && data.ok) {
          if (Array.isArray(data.adminNotices)) {
            setAdminNotices(data.adminNotices);
          }
          if (Array.isArray(data.liveNotices) && data.liveNotices.length > 0) {
            setActiveNotices(data.liveNotices);
          }
        }
      } catch {
        // keep current notices on error
      }
    }

    void fetchNotices(false);
    const pollInterval = window.setInterval(() => {
      void fetchNotices(true);
    }, 2 * 60 * 1000);

    return () => {
      cancelled = true;
      window.clearInterval(pollInterval);
    };
  }, []);

  const list = useMemo(
    () => buildHeroNotices(activeNotices, adminNotices, items),
    [activeNotices, adminNotices, items],
  );
  const [reducedMotion, setReducedMotion] = useState(false);
  const [shouldAnimate, setShouldAnimate] = useState(true);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const isSearching = searchQuery.trim().length > 0;
  const isSearchingRef = useRef(false);
  isSearchingRef.current = isSearching;

  const filteredList = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return list;
    return list.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.tag.toLowerCase().includes(q) ||
        item.date.toLowerCase().includes(q),
    );
  }, [list, searchQuery]);

  const rows = isSearching ? filteredList : list;

  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const firstListRef = useRef<HTMLUListElement>(null);

  // Subpixel floating accumulator for 60fps/120fps buttery smooth scroll without micro-stutters
  const scrollPosRef = useRef(0);

  // Interactive user control refs — smooth without sudden jumps
  const isHoveredRef = useRef(false);
  const isUserInteractingRef = useRef(false);
  const resumeTimeoutRef = useRef<number | null>(null);
  const lastTimestampRef = useRef<number | null>(null);
  const rafIdRef = useRef<number | null>(null);

  // Pause auto-scroll when user interacts, resume smoothly 2.5s after they stop
  const markUserInteracting = useCallback(() => {
    isUserInteractingRef.current = true;
    if (viewportRef.current) {
      scrollPosRef.current = viewportRef.current.scrollTop;
    }
    if (resumeTimeoutRef.current) {
      window.clearTimeout(resumeTimeoutRef.current);
    }
    resumeTimeoutRef.current = window.setTimeout(() => {
      if (viewportRef.current) {
        scrollPosRef.current = viewportRef.current.scrollTop;
      }
      isUserInteractingRef.current = false;
    }, 2500);
  }, []);

  useEffect(() => {
    // Blur any active element immediately on mount
    if (
      document.activeElement instanceof HTMLElement &&
      viewportRef.current?.contains(document.activeElement)
    ) {
      document.activeElement.blur();
    }

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setReducedMotion(reduced);
    if (reduced || list.length < 2) {
      setShouldAnimate(false);
      return;
    }
    setShouldAnimate(true);

    // Continuous subpixel-smooth auto-scroll loop with endless wrap from bottom to top
    // Notice 1 to end, followed immediately by notice 1 without ever rewinding or snapping back.
    const step = (now: number) => {
      if (lastTimestampRef.current === null) {
        lastTimestampRef.current = now;
      }
      const dt = Math.min((now - lastTimestampRef.current) / 1000, 0.05);
      lastTimestampRef.current = now;

      const vp = viewportRef.current;
      const firstList = firstListRef.current;

      if (
        vp &&
        firstList &&
        !isSearchingRef.current &&
        !isHoveredRef.current &&
        !isUserInteractingRef.current
      ) {
        const cycleHeight = firstList.offsetHeight;
        if (cycleHeight > 0) {
          scrollPosRef.current += SCROLL_PX_PER_SEC * dt;
          if (scrollPosRef.current >= cycleHeight) {
            // Endless seamless wrap: when the first cycle ends, notice #1 of the cloned
            // track is right at the top. Subtracting cycleHeight resets scrollTop to the
            // original notice 1 completely invisibly — ZERO jump, ZERO rewind, 100% smooth.
            scrollPosRef.current -= cycleHeight;
          }
          vp.scrollTop = scrollPosRef.current;
        }
      }

      rafIdRef.current = requestAnimationFrame(step);
    };

    rafIdRef.current = requestAnimationFrame(step);

    const onVisibilityChange = () => {
      lastTimestampRef.current = null;
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", onVisibilityChange);
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
      if (resumeTimeoutRef.current) {
        window.clearTimeout(resumeTimeoutRef.current);
      }
    };
  }, [list]);

  const handleItemClick = (e: React.MouseEvent) => {
    (e.currentTarget as HTMLElement).blur();
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  };

  const onScroll = () => {
    if (viewportRef.current && (isUserInteractingRef.current || isHoveredRef.current)) {
      const cycleHeight = firstListRef.current?.offsetHeight ?? 0;
      if (cycleHeight > 0 && !isSearchingRef.current) {
        let pos = viewportRef.current.scrollTop;
        if (pos >= cycleHeight * 2) {
          pos = pos % cycleHeight;
          viewportRef.current.scrollTop = pos;
        }
        scrollPosRef.current = pos;
      } else {
        scrollPosRef.current = viewportRef.current.scrollTop;
      }
    }
  };

  const onWheel = () => {
    markUserInteracting();
  };

  const onTouchStart = () => {
    markUserInteracting();
  };

  const onTouchMove = () => {
    markUserInteracting();
  };

  const onTouchEnd = () => {
    markUserInteracting();
  };

  const onMouseEnter = () => {
    isHoveredRef.current = true;
    if (viewportRef.current) {
      scrollPosRef.current = viewportRef.current.scrollTop;
    }
  };

  const onMouseLeave = () => {
    isHoveredRef.current = false;
    markUserInteracting();
  };

  const renderNoticeItem = (item: NoticeRowItem, index: number, isClone: boolean) => {
    const content = (
      <>
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {item.badge === "LIVE" ? (
            <span className="rounded bg-emerald-600 px-1.5 py-0.5 text-[10px] font-extrabold tracking-wider text-white uppercase">
              LIVE
            </span>
          ) : item.badge === "NEW" ? (
            <span className="rounded bg-red-600 px-1.5 py-0.5 text-[10px] font-extrabold tracking-wider text-white uppercase">
              NEW
            </span>
          ) : null}
          <span className="rounded-md bg-light-blue px-2 py-0.5 font-semibold text-navy">
            {item.tag}
          </span>
          <time className="text-muted-foreground">{item.date}</time>
        </div>
        <p className="font-display text-sm font-semibold leading-snug text-navy transition-colors group-hover:text-brand">
          <AmpersandText>{item.title}</AmpersandText>
        </p>
      </>
    );

    return (
      <li key={`${item.id}-${index}${isClone ? "-clone" : ""}`}>
        {item.isExternal ? (
          <a
            href={toCleanNoticeUrl(item.href)}
            target="_blank"
            rel="noopener noreferrer"
            tabIndex={isClone ? -1 : undefined}
            onClick={handleItemClick}
            className="group flex w-full flex-col items-start gap-1 rounded-xl p-2.5 text-left transition-colors duration-150 hover:bg-light-blue/40 cursor-pointer"
          >
            {content}
          </a>
        ) : (
          <Link
            to={item.href}
            tabIndex={isClone ? -1 : undefined}
            onClick={handleItemClick}
            className="group flex flex-col gap-1 rounded-xl p-2.5 transition-colors duration-150 hover:bg-light-blue/40"
          >
            {content}
          </Link>
        )}
      </li>
    );
  };

  return (
    <div
      className={cn(
        "flex h-full w-full flex-col overflow-hidden bg-transparent",
        className,
      )}
    >
      {/* Header — clean with in-place live search capability */}
      <div className="flex shrink-0 items-center justify-between gap-2 sm:gap-3 pb-2.5 sm:pb-3 min-h-[2.25rem]">
        {searchOpen ? (
          <div className="flex w-full items-center gap-2">
            <div className="relative flex flex-1 items-center rounded-full border border-border/90 bg-surface-white px-3 py-1.5 transition-colors focus-within:border-brand shadow-none">
              <Search className="size-4 shrink-0 text-muted-foreground mr-2 pointer-events-none" aria-hidden="true" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Escape") {
                    if (searchQuery) {
                      setSearchQuery("");
                    } else {
                      setSearchOpen(false);
                    }
                  }
                }}
                placeholder="Search notifications..."
                className="w-full min-w-0 bg-transparent text-xs sm:text-sm text-navy placeholder:text-muted-foreground/80 focus:outline-none"
                autoFocus
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    searchInputRef.current?.focus();
                  }}
                  className="rounded-full p-0.5 text-muted-foreground hover:bg-muted hover:text-navy transition-colors shrink-0"
                  aria-label="Clear search"
                  title="Clear"
                >
                  <X className="size-3.5" />
                </button>
              )}
            </div>
            <button
              type="button"
              onClick={() => {
                setSearchOpen(false);
                setSearchQuery("");
              }}
              className="text-xs sm:text-sm font-semibold text-muted-foreground hover:text-navy px-1.5 py-1 transition-colors shrink-0"
              aria-label="Cancel search"
            >
              Cancel
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
              <Bell className="size-4 shrink-0 text-brand" aria-hidden="true" />
              <h2 className="font-display text-sm min-[380px]:text-base sm:text-lg font-extrabold text-navy truncate">
                Latest Notifications
              </h2>
            </div>
            <button
              type="button"
              onClick={() => {
                setSearchOpen(true);
                setTimeout(() => searchInputRef.current?.focus(), 50);
              }}
              aria-label="Search notifications"
              title="Search notifications"
              className="group inline-flex size-8 shrink-0 items-center justify-center rounded-lg text-navy/70 transition-colors hover:bg-light-blue hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
            >
              <Search className="size-4.5 transition-transform group-hover:scale-110" aria-hidden="true" />
            </button>
          </>
        )}
      </div>

      {isSearching && filteredList.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center p-6 text-center">
          <Search className="size-6 text-muted-foreground/40 mb-2" />
          <p className="text-xs sm:text-sm font-semibold text-navy">No notifications found</p>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            No notices matching &ldquo;{searchQuery}&rdquo;
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery("");
              searchInputRef.current?.focus();
            }}
            className="mt-2.5 rounded-lg bg-light-blue px-2.5 py-1 text-xs font-semibold text-brand hover:bg-light-blue/80 transition-colors"
          >
            Clear search
          </button>
        </div>
      ) : (
        /* Vertical scrolling list — natural native scroll (wheel, touch, trackpad) + calm auto-scroll */
        <div
          ref={viewportRef}
          onScroll={onScroll}
          onWheel={onWheel}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          className="announcement-vertical-viewport hero-notifications-viewport before:!hidden after:!hidden flex-1 min-h-0 cursor-default select-text overflow-y-auto"
          aria-label="Latest notifications list"
        >
          <div ref={trackRef}>
            <ul ref={firstListRef} className="space-y-1.5 pb-1.5">
              {rows.map((item, index) => renderNoticeItem(item, index, false))}
            </ul>
            {!isSearching && rows.length > 1 && (
              <ul aria-hidden="true" className="space-y-1.5 pb-1.5">
                {rows.map((item, index) => renderNoticeItem(item, index, true))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
