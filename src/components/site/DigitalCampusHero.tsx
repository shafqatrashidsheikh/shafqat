import { Link } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import type { CSSProperties } from "react";
import { ApplyOnlineButton } from "@/components/site/ApplyOnlineButton";
import { CAMPUS_IMAGES } from "@/lib/campus-images";
import { INSTITUTE } from "@/lib/site-data";
import { cn } from "@/lib/utils";

/**
 * Signature digital hero — editorial typography + subtle technical depth.
 * Uses real campus media as atmosphere, not a static full-bleed photo hero.
 */
export function DigitalCampusHero({
  admissionsEnabled = true,
}: {
  admissionsEnabled?: boolean;
} = {}) {
  return (
    <section
      aria-labelledby="digital-campus-hero-heading"
      className="relative overflow-hidden bg-background"
    >
      {/* Technical depth grid — subtle, non-decorative */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "linear-gradient(to right, color-mix(in oklab, var(--border) 55%, transparent) 1px, transparent 1px), linear-gradient(to bottom, color-mix(in oklab, var(--border) 55%, transparent) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
          maskImage: "radial-gradient(ellipse 80% 70% at 30% 40%, black 20%, transparent 75%)",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 top-8 hidden h-[min(70vh,36rem)] w-[min(48vw,28rem)] overflow-hidden rounded-bl-[2.5rem] border border-border/70 bg-surface-white/40 lg:block"
      >
        <img
          src={CAMPUS_IMAGES.buildingLawn}
          alt=""
          width={819}
          height={717}
          className="size-full object-cover opacity-90 motion-safe:animate-in motion-safe:fade-in motion-safe:duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-l from-transparent via-background/20 to-background/80" />
      </div>

      <div className="container-page relative grid min-h-[min(88svh,52rem)] grid-cols-1 items-end gap-10 pb-12 pt-8 sm:pb-16 sm:pt-10 lg:grid-cols-12 lg:items-center lg:gap-8 lg:pb-20 lg:pt-14">
        <div className="min-w-0 lg:col-span-7">
          <p
            className="reveal font-display text-[0.6875rem] font-semibold tracking-[0.22em] text-brand uppercase sm:text-xs"
            style={{ "--reveal-delay": "40ms" } as CSSProperties}
          >
            Established {INSTITUTE.established}
          </p>
          <p
            className="reveal mt-3 font-brand text-[clamp(1.125rem,2.2vw+0.55rem,1.75rem)] font-extrabold leading-snug text-navy"
            style={{ "--reveal-delay": "90ms" } as CSSProperties}
          >
            {INSTITUTE.name}
          </p>

          <h1
            id="digital-campus-hero-heading"
            className="reveal mt-6 max-w-[18ch] font-display text-[clamp(2.125rem,5.5vw+0.5rem,4.25rem)] font-extrabold leading-[1.05] tracking-tight text-navy text-balance"
            style={{ "--reveal-delay": "140ms" } as CSSProperties}
          >
            Technical Education. Skills. Confidence. Futures.
          </h1>

          <p
            className="reveal mt-5 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg"
            style={{ "--reveal-delay": "200ms" } as CSSProperties}
          >
            A government women-focused technical diploma institute in Bemina, Srinagar —
            building practical skills, industry readiness and career confidence since{" "}
            {INSTITUTE.established}.
          </p>

          <div
            className="reveal mt-8 flex flex-wrap items-center gap-3"
            style={{ "--reveal-delay": "260ms" } as CSSProperties}
          >
            <Link
              to="/campus"
              hash="explore-campus"
              className={cn(
                "inline-flex min-h-11 items-center gap-2 rounded-lg bg-primary px-5 text-sm font-semibold text-primary-foreground",
                "transition-[background-color,transform] duration-200 hover:bg-brand-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2",
              )}
            >
              Explore Campus
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
            <Link
              to="/academics"
              hash="programs"
              className={cn(
                "inline-flex min-h-11 items-center gap-2 rounded-lg border border-border bg-surface-white px-5 text-sm font-semibold text-navy",
                "transition-colors duration-200 hover:border-brand/40 hover:bg-light-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2",
              )}
            >
              Explore Programmes
              <ArrowUpRight className="size-4" aria-hidden="true" />
            </Link>
            {admissionsEnabled && (
              <ApplyOnlineButton
                prefetch={false}
                className="ml-0 text-sm font-semibold text-brand underline-offset-4 transition-colors hover:text-navy hover:underline sm:ml-2"
              >
                Apply for admission
              </ApplyOnlineButton>
            )}
          </div>
        </div>

        <aside
          className="reveal relative min-w-0 lg:col-span-5"
          style={{ "--reveal-delay": "220ms" } as CSSProperties}
          aria-label="Campus atmosphere"
        >
          <div className="relative overflow-hidden rounded-2xl border border-border bg-surface-white shadow-soft lg:hidden">
            <img
              src={CAMPUS_IMAGES.winterGate}
              alt="Entrance of Government Polytechnic for Women, Srinagar"
              width={1024}
              height={682}
              fetchPriority="high"
              className="aspect-[16/11] w-full object-cover"
            />
          </div>
          <div className="hidden lg:block">
            <div className="absolute -left-6 top-10 w-[min(100%,18rem)] overflow-hidden rounded-xl border border-border bg-surface-white shadow-raised">
              <img
                src={CAMPUS_IMAGES.computerLabStudents}
                alt="Students in a computer laboratory at GPW Srinagar"
                width={640}
                height={480}
                loading="eager"
                className="aspect-[4/3] w-full object-cover"
              />
            </div>
            <div className="ml-auto w-[min(100%,17rem)] overflow-hidden rounded-xl border border-border bg-surface-white shadow-soft">
              <img
                src={CAMPUS_IMAGES.smartClassroomStudents}
                alt="Students in a smart classroom at GPW Srinagar"
                width={640}
                height={480}
                loading="lazy"
                className="aspect-[5/4] w-full object-cover"
              />
            </div>
            <p className="mt-4 text-right text-xs font-medium tracking-wide text-muted-foreground">
              Bemina campus · Real institute photography
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
}
