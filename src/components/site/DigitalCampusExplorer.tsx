import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { useId, useState } from "react";
import { AmpersandText } from "@/components/site/AmpersandText";
import { CAMPUS_EXPLORER_LOCATIONS } from "@/lib/digital-campus";
import { cn } from "@/lib/utils";

/**
 * Spatial / technical campus explorer — verified facilities only.
 */
export function DigitalCampusExplorer() {
  const headingId = useId();
  const [activeId, setActiveId] = useState<string | null>(CAMPUS_EXPLORER_LOCATIONS[0]?.id ?? null);
  const active = CAMPUS_EXPLORER_LOCATIONS.find((l) => l.id === activeId);

  return (
    <section
      id="campus-explorer"
      aria-labelledby={headingId}
      className="scroll-mt-28 border-t border-border/70 bg-surface-white"
    >
      <div className="container-page py-12 sm:py-14 lg:py-16">
        <div className="max-w-2xl">
          <p className="font-display text-xs font-semibold tracking-[0.2em] text-brand uppercase">
            Digital Campus
          </p>
          <h2 id={headingId} className="heading-section mt-3 font-display font-extrabold text-navy">
            Campus Explorer
          </h2>
          <p className="mt-3 text-base leading-relaxed text-muted-foreground">
            Navigate verified laboratories, workshops and learning spaces across the Bemina campus.
          </p>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:items-start lg:gap-12">
          <div
            className="relative grid grid-cols-1 gap-2 min-[400px]:grid-cols-2 sm:grid-cols-3 sm:gap-3"
            role="list"
            aria-label="Campus facilities map"
          >
            {/* Soft technical frame */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 -z-10 rounded-2xl border border-dashed border-border/80"
            />
            {CAMPUS_EXPLORER_LOCATIONS.map((loc, i) => {
              const selected = loc.id === activeId;
              return (
                <button
                  key={loc.id}
                  type="button"
                  role="listitem"
                  onMouseEnter={() => setActiveId(loc.id)}
                  onFocus={() => setActiveId(loc.id)}
                  onClick={() => setActiveId(loc.id)}
                  className={cn(
                    "min-h-[5.5rem] rounded-xl border p-3 text-left transition-[border-color,background-color,transform] duration-200 sm:min-h-[6.5rem] sm:p-4",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2",
                    selected
                      ? "border-brand bg-light-blue/80 shadow-soft"
                      : "border-border/70 bg-background/50 hover:border-brand/35 hover:bg-light-blue/40",
                    i === 0 && "sm:col-span-1",
                  )}
                >
                  <span className="font-display text-[0.6875rem] font-bold tracking-[0.14em] text-brand tabular-nums">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="mt-1.5 block min-w-0 hyphens-none font-display text-sm font-bold leading-snug text-navy sm:text-[0.9375rem]">
                    <AmpersandText>{loc.name}</AmpersandText>
                  </span>
                </button>
              );
            })}
          </div>

          <aside
            className="sticky top-28 overflow-hidden rounded-2xl border border-border bg-background"
            aria-live="polite"
          >
            {active?.mediaSrc ? (
              <img
                src={active.mediaSrc}
                alt={active.mediaAlt ?? active.name}
                width={900}
                height={600}
                loading="lazy"
                className="aspect-[16/10] w-full object-cover"
              />
            ) : (
              <div className="aspect-[16/10] w-full bg-light-blue" />
            )}
            <div className="p-5 sm:p-6">
              <h3 className="font-display text-xl font-extrabold text-navy">{active?.name}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {active?.description}
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link
                  to="/campus"
                  hash="explore-campus"
                  className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-brand-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
                >
                  Explore
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
                <Link
                  to="/campus"
                  hash="facilities"
                  className="inline-flex min-h-10 items-center rounded-lg border border-border bg-surface-white px-4 text-sm font-semibold text-navy transition-colors hover:bg-light-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
                >
                  All facilities
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
