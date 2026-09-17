import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowRight,
  Building2,
  Download,
  FileText,
  Megaphone,
  type LucideIcon,
} from "lucide-react";
import { AcademicUnits } from "@/components/site/AcademicUnits";
import { AmpersandText, KeepTogether, NaturalWrap } from "@/components/site/AmpersandText";
import { DepartmentCard } from "@/components/site/DepartmentCard";
import { PageHeader } from "@/components/site/PageHeader";
import { PracticalLearningSection } from "@/components/site/PracticalLearningSection";
import { loadAcademicsData } from "@/lib/loaders/site-pages";
import type { ProgramCategory } from "@/lib/site-data";

export const Route = createFileRoute("/academics")({
  loader: () => loadAcademicsData(),
  head: () => ({
    meta: [
      { title: "Diploma Programmes — GPW Srinagar" },
      {
        name: "description",
        content:
          "Eight three-year diploma programmes at Government Polytechnic for Women, Srinagar (Bemina), affiliated to JKBOTE.",
      },
      { property: "og:title", content: "Diploma Programmes — GPW Srinagar" },
      {
        property: "og:description",
        content:
          "Official diploma programmes at Government Polytechnic for Women, Srinagar.",
      },
      { property: "og:url", content: "/academics" },
    ],
    links: [{ rel: "canonical", href: "/academics" }],
  }),
  component: Academics,
});

const FILTERS = ["All", "Engineering & Technology", "Applied / Health Sciences", "Management & Services"] as const;
type Filter = (typeof FILTERS)[number];

const ACADEMIC_RESOURCES: {
  title: string;
  description: string;
  detail: string;
  cta: string;
  to: "/admissions" | "/updates/notices" | "/campus" | "/downloads";
  icon: LucideIcon;
}[] = [
  {
    title: "Admissions",
    description:
      "Eligibility, application process, important dates and admission guidance for diploma programmes.",
    detail: "Follow the latest JKBOTE admission notification for current rules.",
    cta: "View Admissions",
    to: "/admissions",
    icon: FileText,
  },
  {
    title: "Syllabus & Downloads",
    description:
      "Programme syllabus references, academic calendar links and official institute documents.",
    detail: "Board-prescribed syllabi are linked via JKBOTE until institute PDFs are published.",
    cta: "Open Downloads",
    to: "/downloads",
    icon: Download,
  },
  {
    title: "Notices & Circulars",
    description:
      "Official notices on admissions, examinations, results, scholarships and tenders.",
    detail: "Refer only to officially published notices for the latest information.",
    cta: "View Notices",
    to: "/updates/notices",
    icon: Megaphone,
  },
  {
    title: "Campus & Facilities",
    description:
      "Laboratories, workshops, library and student facilities that support practical diploma training.",
    detail: "Campus infrastructure supports hands-on learning across programmes.",
    cta: "Explore Campus",
    to: "/campus",
    icon: Building2,
  },
];

function Academics() {
  const { academicUnits, departments } = Route.useLoaderData();
  const [filter, setFilter] = useState<Filter>("All");
  const visible =
    filter === "All"
      ? departments
      : departments.filter((d) => d.stream === (filter as ProgramCategory));

  return (
    <>
      <PageHeader
        compact
        crumb="Academics"
        title="Diploma Programmes"
        intro={
          <>
            Government Polytechnic for Women, Srinagar offers{" "}
            <KeepTogether>eight three-year full-time diploma programmes</KeepTogether> affiliated to
            the J&K Board of Technical Education. Each programme is delivered by its teaching
            department through classroom instruction and practical training.
          </>
        }
        introClassName="w-full min-w-0"
      />

      <AcademicUnits items={academicUnits} />

      <section className="section-y !pt-2 md:!pt-3 lg:!pt-4">
        <div className="container-page">
          {/* Single list — programme and department are the same offering at this institute */}
          <div id="programmes" className="scroll-mt-28">
            {/* Legacy hash targets still land on the same list */}
            <div id="programs" className="sr-only" aria-hidden="true" />
            <div id="departments" className="sr-only" aria-hidden="true" />

            <div className="w-full min-w-0" data-motion-from="up">
              <p className="font-display text-xs font-semibold tracking-[0.2em] text-brand uppercase">
                Programmes
              </p>
              <h2 className="heading-section mt-3 hyphens-none font-display font-extrabold text-navy">
                <NaturalWrap phrases={["Eight diploma programmes", "at GPW Srinagar"]} />
              </h2>
              <p className="mt-3 w-full min-w-0 text-sm leading-relaxed text-muted-foreground">
                Browse by stream, then open a programme for overview, learning areas, practical
                training and career pathways.
              </p>
            </div>

            <div role="tablist" aria-label="Programme stream filters" className="mt-8 flex flex-wrap gap-2">
              {FILTERS.map((f) => (
                <button
                  key={f}
                  type="button"
                  role="tab"
                  aria-selected={filter === f}
                  onClick={() => setFilter(f)}
                  className={`min-h-11 whitespace-nowrap rounded-lg border px-3 text-sm font-medium transition-[background-color,border-color,color,transform] duration-200 sm:px-4 lg:px-5 ${
                    filter === f
                      ? "border-brand bg-brand text-primary-foreground"
                      : "border-border bg-surface-white text-navy hover:-translate-y-px hover:bg-light-blue"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>

            {visible.length === 0 ? (
              <p className="mt-16 rounded-2xl border border-dashed border-border bg-surface-white p-12 text-center text-sm text-muted-foreground">
                No programmes match this filter.
              </p>
            ) : (
              <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {visible.map((department) => (
                  <DepartmentCard key={department.slug} department={department} />
                ))}
              </div>
            )}
          </div>

          <PracticalLearningSection />

          <div className="mt-16 sm:mt-20" aria-labelledby="academic-resources-heading">
            <h2 id="academic-resources-heading" className="hyphens-none font-display text-xl font-bold text-navy">
              Academic Resources
            </h2>
            <p className="mt-2 w-full min-w-0 text-sm leading-relaxed text-muted-foreground">
              Useful links for prospective and current students at Government Polytechnic for Women,
              Srinagar.
            </p>
            <div className="mt-6 grid grid-cols-1 gap-3">
              {ACADEMIC_RESOURCES.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.title}
                    to={item.to}
                    aria-label={`${item.cta} at Government Polytechnic for Women, Srinagar`}
                    className="group card-premium flex min-w-0 flex-col gap-4 p-5 transition-[border-color,box-shadow,transform] duration-300 hover:-translate-y-0.5 hover:border-brand/35 hover:shadow-raised sm:flex-row sm:items-center sm:justify-between sm:p-6"
                  >
                    <div className="flex min-w-0 flex-1 gap-4">
                      <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl border border-border/80 bg-light-blue text-brand transition-[background-color,color] duration-300 group-hover:bg-brand group-hover:text-white">
                        <Icon className="size-5" aria-hidden="true" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <h3 className="min-w-0 hyphens-none font-display text-base font-bold text-navy">
                          <AmpersandText>{item.title}</AmpersandText>
                        </h3>
                        <p className="mt-2 w-full text-sm leading-relaxed text-muted-foreground">
                          {item.description} {item.detail}
                        </p>
                      </div>
                    </div>
                    <span className="inline-flex min-h-11 shrink-0 items-center gap-1.5 text-sm font-semibold text-brand transition-colors group-hover:text-navy">
                      <AmpersandText>{item.cta}</AmpersandText>
                      <ArrowRight
                        className="size-4 shrink-0 transition-transform duration-300 group-hover:translate-x-0.5"
                        aria-hidden="true"
                      />
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
