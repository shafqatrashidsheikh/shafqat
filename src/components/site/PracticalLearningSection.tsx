import { Link } from "@tanstack/react-router";
import { ArrowRight, FlaskConical } from "lucide-react";
import { AmpersandText } from "@/components/site/AmpersandText";
import { DEPARTMENT_LAB_NOTE } from "@/lib/departments-data";

/** Short practical-learning note — full lab/facility list lives on Campus (no duplicate split). */
export function PracticalLearningSection() {
  return (
    <section id="labs-workshops" className="scroll-mt-28 mt-16 sm:mt-20" aria-labelledby="labs-workshops-heading">
      <div className="w-full min-w-0" data-motion-from="up">
        <p className="font-display text-xs font-semibold tracking-[0.2em] text-brand uppercase">
          Practical Learning
        </p>
        <h2 id="labs-workshops-heading" className="heading-section mt-3 hyphens-none font-display font-extrabold text-navy">
          <AmpersandText>Laboratories & Workshops</AmpersandText>
        </h2>
        <p className="mt-3 w-full min-w-0 text-sm leading-relaxed text-muted-foreground">
          Hands-on training is built into each diploma programme through departmental laboratories and
          workshop practice at the Bemina campus.
        </p>
      </div>

      <article className="card-premium mt-8 flex flex-col gap-5 p-6 sm:flex-row sm:items-start sm:p-7">
        <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl bg-light-blue text-brand">
          <FlaskConical className="size-5" aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="min-w-0 text-sm leading-relaxed text-muted-foreground">{DEPARTMENT_LAB_NOTE}</p>
          <p className="mt-3 min-w-0 text-sm leading-relaxed text-muted-foreground">
            For the full list of laboratories, workshops, library and campus services, see Campus &amp;
            Facilities.
          </p>
          <Link
            to="/campus"
            hash="facilities"
            className="link-cta group mt-5 inline-flex w-fit items-center gap-1.5 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
          >
            View campus laboratories &amp; facilities
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
          </Link>
        </div>
      </article>
    </section>
  );
}
