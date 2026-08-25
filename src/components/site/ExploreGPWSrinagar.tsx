import { Link } from "@tanstack/react-router";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { EXPLORE_CARDS, type ExploreCard } from "@/lib/explore-data";
import { cn } from "@/lib/utils";

function FeatureCard({
  card,
  index,
  visible,
}: {
  card: ExploreCard;
  index: number;
  visible: boolean;
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
          className="size-full max-w-none object-cover transition-transform duration-300 ease-out group-hover:scale-[1.03]"
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
        <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-brand transition-transform duration-300 group-hover:translate-x-1">
          {card.cta}
          <ArrowRight className="size-4" aria-hidden="true" />
        </span>
      </div>
    </>
  );

  return (
    <article
      className={cn(
        "group w-[min(100%,420px)] shrink-0 snap-start sm:w-[min(72%,560px)] lg:w-[min(46%,580px)]",
        "transition-all duration-700 ease-out motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none",
        visible ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0",
      )}
      style={{ transitionDelay: visible ? `${120 + index * 70}ms` : "0ms" }}
    >
      <Link
        to={card.href}
        draggable={false}
        className={cn(
          "grid h-full min-h-[320px] overflow-hidden rounded-2xl border border-border bg-card shadow-soft sm:min-h-[360px]",
          "transition-all duration-300 ease-out hover:-translate-y-1 hover:border-brand hover:bg-light-blue hover:shadow-raised",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2",
          card.imagePosition === "left" ? "sm:grid-cols-[42%_1fr]" : "sm:grid-cols-[1fr_42%]",
        )}
      >
        {content}
      </Link>
    </article>
  );
}

export function ExploreGPWSrinagar() {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const dragState = useRef({ active: false, startX: 0, scrollLeft: 0, moved: false });
  const [visible, setVisible] = useState(false);
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) setVisible(true);
      },
      { threshold: 0.15 },
    );
    observer.observe(el);

    return () => observer.disconnect();
  }, []);

  const scrollByCard = (direction: -1 | 1) => {
    const el = scrollerRef.current;
    if (!el) return;
    const card = el.querySelector("article");
    const gap = 24;
    const distance = (card?.clientWidth ?? 560) + gap;
    el.scrollBy({ left: direction * distance, behavior: "smooth" });
  };

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    const el = scrollerRef.current;
    if (!el || event.pointerType === "touch") return;
    dragState.current = {
      active: true,
      startX: event.pageX,
      scrollLeft: el.scrollLeft,
      moved: false,
    };
    setDragging(true);
    el.setPointerCapture(event.pointerId);
  };

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const el = scrollerRef.current;
    const drag = dragState.current;
    if (!el || !drag.active) return;
    const delta = event.pageX - drag.startX;
    if (Math.abs(delta) > 4) drag.moved = true;
    el.scrollLeft = drag.scrollLeft - delta;
  };

  const endDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    const el = scrollerRef.current;
    if (!el || !dragState.current.active) return;
    dragState.current.active = false;
    setDragging(false);
    el.releasePointerCapture(event.pointerId);
  };

  const onClickCapture = (event: React.MouseEvent) => {
    if (dragState.current.moved) {
      event.preventDefault();
      event.stopPropagation();
      dragState.current.moved = false;
    }
  };

  return (
    <section
      aria-labelledby="explore-gpw-heading"
      className="overflow-x-clip py-16 lg:py-20"
    >
      <div className="container-page min-w-0">
        <div
          className={cn(
            "max-w-3xl transition-all duration-700 ease-out motion-reduce:transition-none",
            visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0",
          )}
        >
          <div className="h-0.5 w-16 rounded-full bg-brand" />
          <h2
            id="explore-gpw-heading"
            className="mt-5 font-display text-3xl font-extrabold text-navy lg:text-4xl"
          >
            Explore GPW Srinagar
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">
            Discover our academic programs, departments, campus facilities, student opportunities and
            the journey beyond the classroom.
          </p>
        </div>

        <div className="relative mt-10 w-full max-w-full min-w-0 overflow-hidden">
          <div
            ref={scrollerRef}
            role="region"
            aria-label="Explore GPW Srinagar — horizontally scrollable cards"
            tabIndex={0}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={endDrag}
            onPointerLeave={endDrag}
            onClickCapture={onClickCapture}
            className={cn(
              "explore-scroll gap-6 pb-2",
              dragging ? "cursor-grabbing select-none" : "cursor-grab sm:cursor-grab",
            )}
          >
            {EXPLORE_CARDS.map((card, index) => (
              <FeatureCard key={card.id} card={card} index={index} visible={visible} />
            ))}
          </div>

          <div className="mt-8 flex items-center gap-3 sm:gap-4">
            <div className="h-px min-w-0 flex-1 rounded-full bg-border" aria-hidden="true" />

            <div className="flex shrink-0 items-center gap-2">
              <button
                type="button"
                aria-label="Scroll explore cards left"
                onClick={() => scrollByCard(-1)}
                className="grid size-9 place-items-center rounded-lg border border-border bg-card text-navy shadow-soft transition-colors hover:border-brand/40 hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand sm:size-10"
              >
                <ChevronLeft className="size-4 sm:size-5" />
              </button>
              <button
                type="button"
                aria-label="Scroll explore cards right"
                onClick={() => scrollByCard(1)}
                className="grid size-9 place-items-center rounded-lg border border-border bg-card text-navy shadow-soft transition-colors hover:border-brand/40 hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand sm:size-10"
              >
                <ChevronRight className="size-4 sm:size-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
