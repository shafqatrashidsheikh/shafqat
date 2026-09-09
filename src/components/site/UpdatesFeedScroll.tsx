import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Calm vertical ticker — px per second (institutional, readable pace) */
const UPDATES_SCROLL_PX_PER_SEC = 28;

type UpdatesFeedScrollProps<T> = {
  items: T[];
  getKey: (item: T) => string;
  renderItem: (item: T, ariaHidden?: boolean) => ReactNode;
  className?: string;
  listClassName?: string;
  /** Minimum items before auto-scroll can start (default 2) */
  minItems?: number;
};

/**
 * Infinite upward auto-scroll for Updates feeds.
 * Duplicates the list for a seamless loop; pauses on hover / focus-within.
 * Falls back to a static overflow list when reduced motion or content fits.
 */
export function UpdatesFeedScroll<T>({
  items,
  getKey,
  renderItem,
  className,
  listClassName = "space-y-2.5",
  minItems = 2,
}: UpdatesFeedScrollProps<T>) {
  const [reducedMotion, setReducedMotion] = useState(false);
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  const itemSignature = items.map(getKey).join("|");

  useEffect(() => {
    setShouldAnimate(false);
  }, [itemSignature]);

  useEffect(() => {
    if (reducedMotion || items.length < minItems) {
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
      const seconds = Math.min(110, Math.max(36, loopDistance / UPDATES_SCROLL_PX_PER_SEC));
      track.style.setProperty("--notices-vertical-duration", `${seconds.toFixed(2)}s`);
    };

    sync();
    const ro = new ResizeObserver(sync);
    ro.observe(viewport);
    ro.observe(track);
    return () => ro.disconnect();
  }, [itemSignature, items.length, reducedMotion, shouldAnimate, minItems]);

  if (items.length === 0) return null;

  const showTicker = !reducedMotion && items.length >= minItems;
  const rows = shouldAnimate ? [...items, ...items] : items;

  const list = (
    <ul className={listClassName}>
      {rows.map((item, index) => {
        const hidden = shouldAnimate && index >= items.length;
        return (
          <li key={`${getKey(item)}-${index}`}>
            {renderItem(item, hidden || undefined)}
          </li>
        );
      })}
    </ul>
  );

  if (!showTicker) {
    return (
      <div className={cn("max-h-[min(32rem,70vh)] overflow-y-auto", className)}>{list}</div>
    );
  }

  return (
    <div
      ref={viewportRef}
      className={cn(
        "notices-vertical-viewport",
        shouldAnimate && "is-animating",
        className,
      )}
      aria-live={shouldAnimate ? "off" : "polite"}
    >
      <div ref={trackRef} className={cn(shouldAnimate && "notices-vertical-track")}>
        {list}
      </div>
    </div>
  );
}
