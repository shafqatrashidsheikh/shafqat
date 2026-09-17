import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { AmpersandText } from "@/components/site/AmpersandText";
import type { CampusFacility } from "@/lib/campus-data";

/** Same pace as diploma programmes rail — px per second */
const FACILITIES_MARQUEE_PX_PER_SEC = 40;

export type FacilityRailItem = CampusFacility;

/** Homepage / campus facilities — programme-style cards, continuous horizontal scroll. */
export function HomeFacilitiesRail({ facilities }: { facilities: FacilityRailItem[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    setReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  useEffect(() => {
    if (reducedMotion) return;

    const track = trackRef.current;
    if (!track) return;

    const syncMarqueeSpeed = () => {
      const loopDistance = track.scrollWidth / 2;
      if (loopDistance <= 0) return;
      const seconds = loopDistance / FACILITIES_MARQUEE_PX_PER_SEC;
      track.style.setProperty("--explore-marquee-duration", `${seconds.toFixed(2)}s`);
    };

    syncMarqueeSpeed();
    const ro = new ResizeObserver(syncMarqueeSpeed);
    ro.observe(track);
    window.addEventListener("load", syncMarqueeSpeed);

    return () => {
      ro.disconnect();
      window.removeEventListener("load", syncMarqueeSpeed);
    };
  }, [reducedMotion]);

  const loopFacilities = [...facilities, ...facilities];

  return (
    <div className="min-w-0">
      {reducedMotion ? (
        <div
          role="region"
          aria-label="Campus facilities — horizontally scrollable list"
          tabIndex={0}
          className="explore-scroll mt-8 gap-5 pb-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-4"
        >
          {facilities.map((facility) => (
            <FacilityCard key={facility.name} facility={facility} />
          ))}
        </div>
      ) : (
        <div
          role="region"
          aria-label="Campus facilities — continuously scrolling list"
          className="explore-marquee-viewport mt-8 w-full max-w-full min-w-0"
        >
          <div ref={trackRef} className="explore-marquee-track">
            {loopFacilities.map((facility, index) => (
              <FacilityCard
                key={`${facility.name}-${index}`}
                facility={facility}
                ariaHidden={index >= facilities.length}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function FacilityCard({
  facility,
  ariaHidden,
}: {
  facility: FacilityRailItem;
  ariaHidden?: boolean;
}) {
  const href = facility.href ?? "/campus#facilities";

  return (
    <article
      aria-hidden={ariaHidden}
      className="card-premium group flex w-[min(88vw,20rem)] shrink-0 flex-col p-5 transition-[border-color,box-shadow,transform] duration-300 hover:-translate-y-0.5 hover:border-brand/40 hover:shadow-raised sm:w-[19.5rem] sm:p-6 lg:w-[21rem]"
    >
      <p className="text-[11px] font-semibold tracking-[0.14em] text-brand uppercase">
        {facility.category}
      </p>
      <h3 className="mt-2 min-w-0 hyphens-none font-display text-lg font-bold leading-snug text-navy">
        <AmpersandText>{facility.name}</AmpersandText>
      </h3>
      <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-muted-foreground">
        {facility.description}
      </p>
      <p className="mt-4 w-fit rounded-md border border-border bg-background px-2.5 py-1 text-xs font-medium text-muted-foreground">
        Bemina campus
      </p>
      <Link
        to={href}
        draggable={false}
        tabIndex={ariaHidden ? -1 : undefined}
        className="link-cta mt-5 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
        aria-label={`Explore ${facility.name}`}
      >
        Explore
        <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
      </Link>
    </article>
  );
}
