import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { KeepTogether } from "@/components/site/AmpersandText";
import { EXPLORE_CARDS, type ExploreCard } from "@/lib/explore-data";
import { cn } from "@/lib/utils";

function FeatureCard({
  card,
  ariaHidden,
}: {
  card: ExploreCard;
  ariaHidden?: boolean;
}) {
  const content = (
    <>
      <div
        className={cn(
          "relative min-h-[220px] overflow-hidden sm:min-h-[260px]",
          card.imagePosition === "left" ? "order-1" : "order-2 sm:order-2",
        )}
      >
        <img
          src={card.image}
          alt={card.imageAlt}
          width={640}
          height={480}
          loading={card.priority ? "eager" : "lazy"}
          fetchPriority={card.priority ? "high" : "auto"}
          decoding="async"
          className="size-full max-w-none object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02]"
        />
      </div>
      <div
        className={cn(
          "flex flex-col justify-center p-6 sm:p-8",
          card.imagePosition === "left" ? "order-2" : "order-1 sm:order-1",
        )}
      >
        <p className="text-[11px] font-semibold tracking-[0.16em] text-brand uppercase">
          {card.category}
        </p>
        <h3 className="mt-3 font-display text-xl font-extrabold text-navy sm:text-2xl">{card.title}</h3>
        <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted-foreground">{card.description}</p>
        <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-brand transition-transform duration-200 group-hover:translate-x-1">
          {card.cta}
          <ArrowRight className="size-4" aria-hidden="true" />
        </span>
      </div>
    </>
  );

  return (
    <article
      className="group w-[min(100%,420px)] shrink-0 sm:w-[min(72%,560px)] lg:w-[min(46%,580px)]"
      aria-hidden={ariaHidden}
    >
      <Link
        to={card.href}
        draggable={false}
        tabIndex={ariaHidden ? -1 : undefined}
        className={cn(
          "grid h-full min-h-[320px] overflow-hidden rounded-[20px] border border-border bg-surface-white shadow-soft sm:min-h-[360px]",
          "transition-[transform,box-shadow,border-color] duration-200 ease-out hover:-translate-y-0.5 hover:border-brand/30 hover:shadow-raised",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2",
          card.imagePosition === "left" ? "md:grid-cols-[42%_1fr]" : "md:grid-cols-[1fr_42%]",
        )}
      >
        {content}
      </Link>
    </article>
  );
}

/** Steady institutional carousel speed — px per second (target band: 35–50) */
const EXPLORE_MARQUEE_PX_PER_SEC = 42;

export function ExploreGPWSrinagar({ cards = EXPLORE_CARDS }: { cards?: ExploreCard[] }) {
  const [headerVisible, setHeaderVisible] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setReducedMotion(reduced);

    const header = document.getElementById("explore-gpw-heading");
    if (!header) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) setHeaderVisible(true);
      },
      { threshold: 0.2 },
    );
    observer.observe(header);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (reducedMotion) return;

    const track = trackRef.current;
    if (!track) return;

    const syncMarqueeSpeed = () => {
      const loopDistance = track.scrollWidth / 2;
      if (loopDistance <= 0) return;
      const seconds = loopDistance / EXPLORE_MARQUEE_PX_PER_SEC;
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

  const loopCards = [...cards, ...cards];

  return (
    <section
      aria-labelledby="explore-gpw-heading"
      className="section-misty overflow-x-clip section-y !pt-0"
    >
      <div className="container-page min-w-0">
        <div
          className={cn(
            "w-full min-w-0 transition-[opacity,transform] duration-[620ms] ease-[cubic-bezier(0.22,0.61,0.36,1)] motion-reduce:transition-none",
            headerVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0",
          )}
          data-motion="off"
        >
          <div className="h-0.5 w-16 rounded-full bg-brand" />
          <h2
            id="explore-gpw-heading"
            className="heading-section mt-5 font-display font-extrabold text-navy"
          >
            Explore GPW Srinagar
          </h2>
          <p className="mt-4 w-full min-w-0 hyphens-none text-base leading-relaxed text-muted-foreground lg:whitespace-nowrap">
            A focused path through academics, campus life, admissions and careers at{" "}
            <KeepTogether>GPW Srinagar.</KeepTogether>
          </p>
        </div>

        {reducedMotion ? (
          <div
            role="region"
            aria-label="Explore GPW Srinagar — horizontally scrollable cards"
            className="explore-scroll relative mt-10 gap-6 pb-2"
          >
            {cards.map((card) => (
              <FeatureCard key={card.id} card={card} />
            ))}
          </div>
        ) : (
          <div
            role="region"
            aria-label="Explore GPW Srinagar — continuously scrolling cards"
            className="explore-marquee-viewport relative mt-10 w-full max-w-full min-w-0"
          >
            <div ref={trackRef} className="explore-marquee-track">
              {loopCards.map((card, index) => (
                <FeatureCard
                  key={`${card.id}-${index}`}
                  card={card}
                  ariaHidden={index >= cards.length}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
