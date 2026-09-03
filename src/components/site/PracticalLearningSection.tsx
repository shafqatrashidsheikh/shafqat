import { Link } from "@tanstack/react-router";
import { ArrowRight, FlaskConical, Wrench } from "lucide-react";
import { AmpersandText, KeepTogether } from "@/components/site/AmpersandText";
import { DEPARTMENT_LAB_NOTE, WORKSHOPS_SECTION } from "@/lib/departments-data";

export function PracticalLearningSection() {
  return (
    <section id="labs-workshops" className="scroll-mt-28 mt-16 sm:mt-20" aria-labelledby="labs-workshops-heading">
      <div className="w-full min-w-0" data-motion-from="up">
        <p className="font-display text-xs font-semibold tracking-[0.2em] text-brand uppercase">
          Practical Learning
        </p>
        <div className="mt-3 h-0.5 w-10 rounded-full bg-brand" />
        <h2 id="labs-workshops-heading" className="heading-section mt-3 hyphens-none font-display font-extrabold text-navy">
          <AmpersandText>Laboratories & Workshops</AmpersandText>
        </h2>
        <p className="mt-3 w-full min-w-0 text-sm leading-relaxed text-muted-foreground">
          Departmental laboratories and workshop-based training support{" "}
          <KeepTogether>hands-on learning</KeepTogether> across diploma programmes.
        </p>
      </div>

      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        <article className="card-premium flex h-full flex-col p-6 sm:p-7">
          <span className="inline-flex size-11 items-center justify-center rounded-xl bg-light-blue text-brand">
            <FlaskConical className="size-5" aria-hidden="true" />
          </span>
          <h3 className="mt-5 min-w-0 hyphens-none font-display text-lg font-bold text-navy">
            Departmental Laboratories
          </h3>
          <p className="mt-3 min-w-0 flex-1 text-sm leading-relaxed text-muted-foreground">{DEPARTMENT_LAB_NOTE}</p>
          <p className="mt-4 min-w-0 text-sm leading-relaxed text-muted-foreground">
            Each department provides practical learning aligned with its diploma programme. For campus-wide facility
            information, visit the Campus page.
          </p>
          <Link
            to="/campus#facilities"
            className="link-cta group mt-6 w-fit rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
          >
            View campus facilities
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
          </Link>
        </article>

        <article className="card-premium flex h-full flex-col p-6 sm:p-7">
          <span className="inline-flex size-11 items-center justify-center rounded-xl bg-light-blue text-brand">
            <Wrench className="size-5" aria-hidden="true" />
          </span>
          <h3 className="mt-5 min-w-0 hyphens-none font-display text-lg font-bold text-navy">
            <AmpersandText>{WORKSHOPS_SECTION.title}</AmpersandText>
          </h3>
          <p className="mt-3 min-w-0 flex-1 text-sm leading-relaxed text-muted-foreground">
            {WORKSHOPS_SECTION.description}
          </p>
          <p className="mt-4 min-w-0 text-sm leading-relaxed text-muted-foreground">
            Workshop-cum-classroom infrastructure supports applied training alongside classroom instruction at the
            institute.
          </p>
          <Link
            to="/campus#facilities"
            className="link-cta group mt-6 w-fit rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
          >
            Explore campus infrastructure
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
          </Link>
        </article>
      </div>
    </section>
  );
}
