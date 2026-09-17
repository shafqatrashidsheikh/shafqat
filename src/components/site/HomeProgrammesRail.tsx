import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { AmpersandText } from "@/components/site/AmpersandText";
import { departmentDetailPath } from "@/lib/departments-data";

export type ProgrammeRailItem = {
  name: string;
  categoryLabel: string;
  duration: string;
  overview: string;
  slug: string;
};

/** Steady institutional carousel speed — px per second (target band: 35–50) */
const PROGRAMMES_MARQUEE_PX_PER_SEC = 40;

/** Homepage academics rail — official diploma programmes scrolling continuously. */
export function HomeProgrammesRail({ programmes }: { programmes: ProgrammeRailItem[] }) {
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
      const seconds = loopDistance / PROGRAMMES_MARQUEE_PX_PER_SEC;
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

  const loopProgrammes = [...programmes, ...programmes];

  return (
    <section
      aria-labelledby="home-programmes-heading"
      className="section-misty overflow-x-clip section-y !pt-0"
    >
      <div className="container-page min-w-0">
        <div data-motion-from="up">
          <p className="font-display text-xs font-semibold tracking-[0.2em] text-brand uppercase">
            Academics
          </p>
          <h2
            id="home-programmes-heading"
            className="heading-section mt-3 font-display font-extrabold text-navy"
          >
            Diploma Programmes
          </h2>
          <p className="mt-3 w-full min-w-0 text-base leading-relaxed text-muted-foreground">
            Eight three-year diploma programmes affiliated to the J&amp;K Board of Technical
            Education, delivered through classroom teaching and practical training.
          </p>
        </div>

        {reducedMotion ? (
          <div
            role="region"
            aria-label="Diploma programmes — horizontally scrollable list"
            tabIndex={0}
            className="explore-scroll mt-8 gap-5 pb-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-4"
          >
            {programmes.map((programme) => (
              <ProgrammeCard key={programme.slug} programme={programme} />
            ))}
          </div>
        ) : (
          <div
            role="region"
            aria-label="Diploma programmes — continuously scrolling list"
            className="explore-marquee-viewport mt-8 w-full max-w-full min-w-0"
          >
            <div ref={trackRef} className="explore-marquee-track">
              {loopProgrammes.map((programme, index) => (
                <ProgrammeCard
                  key={`${programme.slug}-${index}`}
                  programme={programme}
                  ariaHidden={index >= programmes.length}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function ProgrammeCard({
  programme,
  ariaHidden,
}: {
  programme: ProgrammeRailItem;
  ariaHidden?: boolean;
}) {
  return (
    <article
      aria-hidden={ariaHidden}
      className="card-premium group flex w-[min(82%,20rem)] shrink-0 flex-col p-5 transition-[border-color,box-shadow,transform] duration-300 hover:-translate-y-0.5 hover:border-brand/40 hover:shadow-raised sm:w-[19.5rem] sm:p-6 lg:w-[21rem]"
    >
      <p className="text-[11px] font-semibold tracking-[0.14em] text-brand uppercase">
        {programme.categoryLabel}
      </p>
      <h3 className="mt-2 min-w-0 hyphens-none font-display text-lg font-bold leading-snug text-navy">
        <AmpersandText>{programme.name}</AmpersandText>
      </h3>
      <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-muted-foreground">
        {programme.overview}
      </p>
      <p className="mt-4 w-fit rounded-md border border-border bg-background px-2.5 py-1 text-xs font-medium text-muted-foreground">
        {programme.duration}
      </p>
      <Link
        to={departmentDetailPath(programme.slug)}
        draggable={false}
        tabIndex={ariaHidden ? -1 : undefined}
        className="link-cta mt-5 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
        aria-label={`Explore ${programme.name}`}
      >
        Explore
        <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
      </Link>
    </article>
  );
}
