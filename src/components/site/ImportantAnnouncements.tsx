import { Link } from "@tanstack/react-router";
import { ArrowRight, Megaphone } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { ANNOUNCEMENTS, UTILITY_STRIP } from "@/lib/site-data";
import { cn } from "@/lib/utils";

const NOTICE_QUICK_LINKS_FALLBACK = UTILITY_STRIP.filter((link) => link.label !== "Contact");

/** Calm vertical ticker — px per second (institutional, readable pace) */
const ANNOUNCEMENT_SCROLL_PX_PER_SEC = 26;

type AnnouncementItem = { tag: string; date: string; title: string };

function AnnouncementRow({
  item,
  ariaHidden,
}: {
  item: AnnouncementItem;
  ariaHidden?: boolean;
}) {
  return (
    <Link
      to="/notices"
      tabIndex={ariaHidden ? -1 : undefined}
      aria-hidden={ariaHidden}
      className="group flex flex-col gap-2 px-5 py-4 transition-[background-color,color] duration-200 ease-out hover:bg-light-blue/50 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:px-6"
    >
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="rounded-md bg-light-blue px-2 py-0.5 font-semibold text-navy">
            {item.tag}
          </span>
          <time className="text-muted-foreground">{item.date}</time>
        </div>
        <p className="mt-1.5 font-display text-sm font-bold text-navy transition-colors group-hover:text-brand sm:text-base">
          {item.title}
        </p>
      </div>
      <span className="link-cta shrink-0 text-sm opacity-80 group-hover:opacity-100">
        Read
        <ArrowRight className="size-3.5" />
      </span>
    </Link>
  );
}

function AnnouncementList({
  items,
  duplicateForLoop,
  ariaHiddenFrom,
}: {
  items: AnnouncementItem[];
  duplicateForLoop?: boolean;
  ariaHiddenFrom?: number;
}) {
  const list = duplicateForLoop ? [...items, ...items] : items;

  return (
    <ul className="announcement-scroll divide-y divide-border">
      {list.map((item, index) => (
        <li key={`${item.title}-${index}`}>
          <AnnouncementRow
            item={item}
            ariaHidden={ariaHiddenFrom !== undefined && index >= ariaHiddenFrom}
          />
        </li>
      ))}
    </ul>
  );
}

type QuickLink = { label: string; to: string };

/** IITD-style Important Announcements board */
export function ImportantAnnouncements({
  items,
  quickLinks,
}: {
  items?: AnnouncementItem[];
  quickLinks?: QuickLink[];
}) {
  const list = items && items.length > 0 ? items : ANNOUNCEMENTS;
  const noticeQuickLinks =
    quickLinks && quickLinks.length > 0
      ? quickLinks.filter((link) => link.label !== "Contact")
      : NOTICE_QUICK_LINKS_FALLBACK;
  const [reducedMotion, setReducedMotion] = useState(false);
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setReducedMotion(reduced);
  }, []);

  useEffect(() => {
    if (reducedMotion || list.length < 2) {
      setShouldAnimate(false);
      return;
    }

    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!viewport || !track) return;

    const syncScrollSpeed = () => {
      const viewportHeight = viewport.clientHeight;
      const listEl = track.firstElementChild as HTMLElement | null;
      const contentHeight = listEl?.scrollHeight ?? track.scrollHeight;

      if (!shouldAnimate) {
        if (contentHeight > viewportHeight + 8) {
          setShouldAnimate(true);
        }
        return;
      }

      const loopDistance = track.scrollHeight / 2;
      const seconds = Math.min(90, Math.max(24, loopDistance / ANNOUNCEMENT_SCROLL_PX_PER_SEC));
      track.style.setProperty("--announcement-vertical-duration", `${seconds.toFixed(2)}s`);
    };

    syncScrollSpeed();
    const ro = new ResizeObserver(syncScrollSpeed);
    ro.observe(viewport);
    ro.observe(track);
    window.addEventListener("load", syncScrollSpeed);

    return () => {
      ro.disconnect();
      window.removeEventListener("load", syncScrollSpeed);
    };
  }, [list, reducedMotion, shouldAnimate]);

  const showTicker = !reducedMotion && list.length >= 2;

  return (
    <section aria-label="Important announcements" className="section-misty">
      <div className="container-page pb-10 lg:pb-12">
        <div className="overflow-hidden rounded-2xl border border-border bg-surface-white shadow-soft" data-motion-from="up">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-light-blue/70 px-4 py-4 sm:px-6">
            <div className="flex items-center gap-2.5">
              <span className="grid size-8 place-items-center rounded-full bg-brand/10 text-brand">
                <Megaphone className="size-4" aria-hidden="true" />
              </span>
              <div>
                <h2 className="font-display text-base font-extrabold text-navy sm:text-lg">
                  Important Announcements
                </h2>
                <p className="text-xs text-muted-foreground">Official notices and circulars</p>
                <nav
                  aria-label="Notice quick links"
                  className="mt-2 flex flex-wrap items-center gap-x-1 gap-y-1 text-xs"
                >
                  {noticeQuickLinks.map((link, i) => (
                    <span key={link.label} className="inline-flex items-center">
                      {i > 0 && (
                        <span className="mx-1.5 text-border" aria-hidden="true">
                          ·
                        </span>
                      )}
                      <Link
                        to={link.to}
                        className="font-medium text-brand transition-colors duration-150 hover:text-navy"
                      >
                        {link.label}
                      </Link>
                    </span>
                  ))}
                </nav>
              </div>
            </div>
            <Link to="/notices" className="link-cta shrink-0 text-sm">
              View all
              <ArrowRight className="size-4" />
            </Link>
          </div>

          <div
            ref={viewportRef}
            id="announcement-list"
            className={cn(
              showTicker
                ? cn("announcement-vertical-viewport", shouldAnimate && "is-animating")
                : "announcement-scroll max-h-[17.5rem] overflow-y-auto",
            )}
            aria-live={shouldAnimate ? "off" : undefined}
          >
            {showTicker ? (
              <div
                ref={trackRef}
                className={cn(shouldAnimate && "announcement-vertical-track")}
              >
                <AnnouncementList
                  items={list}
                  duplicateForLoop={shouldAnimate}
                  ariaHiddenFrom={shouldAnimate ? list.length : undefined}
                />
              </div>
            ) : (
              <AnnouncementList items={list} />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
