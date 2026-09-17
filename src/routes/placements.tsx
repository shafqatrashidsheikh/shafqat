import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BriefcaseBusiness,
  ClipboardList,
  Factory,
  GraduationCap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { PageHeader } from "@/components/site/PageHeader";
import { getStaticPageSections } from "@/lib/site-content";
import { fetchPageSections } from "@/server/cda/content";

const PLACEMENT_FOCUS: {
  title: string;
  body: string;
  icon: LucideIcon;
}[] = [
  {
    title: "Training & Guidance",
    body: "Skill-oriented preparation, communication practice, resume support and interview readiness for diploma students.",
    icon: ClipboardList,
  },
  {
    title: "Internships & Industrial Training",
    body: "Programme-related internship and industrial training exposure arranged in line with diploma requirements and available opportunities.",
    icon: BriefcaseBusiness,
  },
  {
    title: "Career Counselling",
    body: "Guidance on career pathways, further study options and professional preparation through the Training & Placement Cell.",
    icon: GraduationCap,
  },
  {
    title: "Industry Interaction",
    body: "Expert lectures, industrial visits and institute–industry interaction to connect classroom learning with workplace practice.",
    icon: Factory,
  },
] as const;

const SUPPORT_POINTS = [
  "Supports diploma students across the institute’s eight programmes",
  "Facilitates industrial training, internships and skill-development activities",
  "Coordinates placement-related guidance and employer interaction when opportunities arise",
  "Encourages professional readiness through counselling and preparatory sessions",
] as const;

export const Route = createFileRoute("/placements")({
  loader: async () => {
    try {
      const sections = await fetchPageSections({ data: {} });
      const map = Object.fromEntries(sections.map((s) => [s.section_key, s]));
      return { sections: { ...getStaticPageSections(), ...map } };
    } catch {
      return { sections: getStaticPageSections() };
    }
  },
  head: () => ({
    meta: [
      { title: "Training & Placements — GPW Srinagar" },
      {
        name: "description",
        content:
          "Training & Placement Cell at Government Polytechnic for Women, Srinagar — industrial training, internships, career counselling and placement-related support.",
      },
      { property: "og:title", content: "Training & Placements — GPW Srinagar" },
      {
        property: "og:description",
        content:
          "Industrial training, internships, career counselling and placement-related guidance for diploma students.",
      },
      { property: "og:url", content: "/placements" },
    ],
    links: [{ rel: "canonical", href: "/placements" }],
  }),
  component: Placements,
});

function Placements() {
  const { sections } = Route.useLoaderData();
  const blurb = sections.placement_blurb;

  return (
    <>
      <PageHeader
        compact
        crumb="Placements"
        title={blurb?.title ?? "Training & Placement Cell"}
        intro={
          blurb?.body ??
          "The Training & Placement Cell supports diploma students with industrial training, internships, career counselling and placement-related guidance at Government Polytechnic for Women, Srinagar."
        }
      />

      <section className="bg-background">
        <div className="container-page space-y-8 pt-2 pb-8 md:space-y-10 md:pt-2.5 md:pb-10">
          <section aria-labelledby="placement-overview-heading" className="max-w-3xl">
            <h2
              id="placement-overview-heading"
              className="font-display text-[1.25rem] font-extrabold text-navy md:text-[1.375rem]"
            >
              Overview
            </h2>
            <p className="mt-3 text-sm leading-[1.7] text-muted-foreground sm:text-[0.95rem]">
              The Training & Placement Cell works to connect academic learning with workplace
              readiness. It supports students through skill preparation, industrial exposure,
              counselling and coordination of training or recruitment-related opportunities as they
              become available.
            </p>
            <ul className="mt-5 space-y-2.5">
              {SUPPORT_POINTS.map((point) => (
                <li key={point} className="flex gap-2.5 text-sm leading-relaxed text-muted-foreground">
                  <span className="mt-2 size-1.5 shrink-0 rounded-full bg-brand" aria-hidden="true" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="placement-focus-heading">
            <h2
              id="placement-focus-heading"
              className="font-display text-[1.25rem] font-extrabold text-navy md:text-[1.375rem]"
            >
              Areas of Support
            </h2>
            <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
              Key ways the Training & Placement Cell assists students during and after their diploma
              studies:
            </p>
            <ul className="mt-6 grid gap-4 sm:grid-cols-2">
              {PLACEMENT_FOCUS.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.title} className="card-premium flex h-full flex-col p-5 sm:p-6">
                    <span className="inline-flex size-11 items-center justify-center rounded-xl bg-light-blue text-brand">
                      <Icon className="size-5" aria-hidden="true" />
                    </span>
                    <h3 className="mt-4 font-display text-base font-bold text-navy">{item.title}</h3>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                      {item.body}
                    </p>
                  </li>
                );
              })}
            </ul>
          </section>

          <section
            aria-labelledby="placement-note-heading"
            className="rounded-2xl border border-border bg-card p-5 shadow-soft sm:p-6"
          >
            <h2
              id="placement-note-heading"
              className="font-display text-base font-bold text-navy sm:text-lg"
            >
              Important Note
            </h2>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">
              Training, internship and placement opportunities vary by programme, academic year and
              prevailing market conditions. The institute does not publish fixed placement
              percentages or salary figures on this page. For current opportunities and guidance,
              contact the institute.
            </p>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link to="/contact" className="btn-primary group w-full sm:w-auto">
                Contact the Institute
                <ArrowRight
                  className="size-4 transition-transform group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </Link>
              <Link to="/academics" hash="programs" className="btn-secondary w-full sm:w-auto">
                View Diploma Programmes
              </Link>
            </div>
          </section>
        </div>
      </section>
    </>
  );
}
