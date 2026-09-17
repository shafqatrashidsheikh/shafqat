import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { INDUSTRY_CAREER_PILLARS } from "@/lib/digital-campus";

/**
 * Industry + career section — verified Training & Placement Cell themes only.
 */
export function IndustryCareerSection() {
  return (
    <section aria-labelledby="industry-career-heading" className="border-t border-border/70 bg-surface-white">
      <div className="container-page py-12 sm:py-14 lg:py-16">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="font-display text-xs font-semibold tracking-[0.2em] text-brand uppercase">
              Pathways
            </p>
            <h2
              id="industry-career-heading"
              className="heading-section mt-3 font-display font-extrabold text-navy"
            >
              Industry & Career
            </h2>
            <p className="mt-3 text-base leading-relaxed text-muted-foreground">
              The Training & Placement Cell supports skill preparation, industrial exposure, career
              counselling and placement-related guidance for diploma students.
            </p>
          </div>
          <Link
            to="/placements"
            className="link-cta group inline-flex w-fit items-center gap-2 rounded-md text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
          >
            Placement & careers
            <ArrowRight
              className="size-4 transition-transform duration-200 group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </Link>
        </div>

        <ul className="mt-10 grid gap-0 border-t border-border sm:grid-cols-2 lg:grid-cols-3">
          {INDUSTRY_CAREER_PILLARS.map((pillar) => (
            <li
              key={pillar.title}
              className="border-b border-border px-0 py-6 sm:border-r sm:px-6 sm:odd:pl-0 lg:[&:nth-child(3n)]:border-r-0"
            >
              <h3 className="font-display text-base font-extrabold text-navy">{pillar.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{pillar.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
