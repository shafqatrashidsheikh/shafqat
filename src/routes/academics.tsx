import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowRight,
  BriefcaseBusiness,
  Building2,
  FileText,
  Megaphone,
  type LucideIcon,
} from "lucide-react";
import { AcademicUnits } from "@/components/site/AcademicUnits";
import { AmpersandText, KeepTogether, NaturalWrap } from "@/components/site/AmpersandText";
import { DepartmentCard } from "@/components/site/DepartmentCard";
import { PageHeader } from "@/components/site/PageHeader";
import { PracticalLearningSection } from "@/components/site/PracticalLearningSection";
import { departmentDetailPath } from "@/lib/departments-data";
import { loadAcademicsData } from "@/lib/loaders/site-pages";
import type { ProgramCategory } from "@/lib/site-data";

export const Route = createFileRoute("/academics")({
  loader: () => loadAcademicsData(),
  head: () => ({
    meta: [
      { title: "Academic Programs & Departments — GPW Srinagar" },
      {
        name: "description",
        content:
          "Explore diploma programmes and academic departments at Government Polytechnic for Women, Srinagar (Bemina).",
      },
      { property: "og:title", content: "Academic Programs & Departments — GPW Srinagar" },
      {
        property: "og:description",
        content: "Official diploma programmes and departments at Government Polytechnic for Women, Srinagar.",
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
  to: "/admissions" | "/updates/notices" | "/campus" | "/placements";
  icon: LucideIcon;
}[] = [
  {
    title: "Admissions",
    description:
      "Explore diploma admissions, eligibility requirements, application procedures, important notifications and admission-related information for Government Polytechnic for Women, Srinagar.",
    detail:
      "Diploma programmes are generally 3 years in duration, with admission based on the applicable J&K Board of Technical Education admission process and qualifying-examination merit.",
    cta: "View Admissions",
    to: "/admissions",
    icon: FileText,
  },
  {
    title: "Notices & Circulars",
    description:
      "Stay updated with official admission notices, examination schedules, results, selection lists, scholarship notifications, tenders, recruitment notices and other important institute announcements.",
    detail: "Only officially published information should be displayed here.",
    cta: "View Notices",
    to: "/updates/notices",
    icon: Megaphone,
  },
  {
    title: "Campus & Facilities",
    description:
      "Explore the academic and student facilities available at Government Polytechnic for Women, Srinagar, including departmental laboratories, practical training spaces, library resources, hostel facilities and other campus services.",
    detail:
      "The institute provides department-based practical learning facilities supporting its diploma programmes.",
    cta: "Explore Campus",
    to: "/campus",
    icon: Building2,
  },
  {
    title: "Training & Placements",
    description:
      "Support for industrial exposure, practical training, internships, career development and placement-related opportunities helps students prepare for employment and further professional growth.",
    detail:
      "The institute also works toward industry interaction, skill development and career-oriented training opportunities.",
    cta: "Explore Training & Placements",
    to: "/placements",
    icon: BriefcaseBusiness,
  },
];

function Academics() {
  const { programs: programList, academicUnits, departments } = Route.useLoaderData();
  const [filter, setFilter] = useState<Filter>("All");
  const programs =
    filter === "All" ? programList : programList.filter((p) => p.stream === (filter as ProgramCategory));

  return (
    <>
      <PageHeader
        crumb="Academics"
        title={<AmpersandText>Academic Programs & Departments</AmpersandText>}
        titleClassName="max-w-none whitespace-nowrap max-md:whitespace-normal"
        intro={
          <>
            Explore what you can study,{" "}
            <KeepTogether>the academic departments</KeepTogether> that deliver{" "}
            <KeepTogether>each diploma programme</KeepTogether>,{" "}
            <KeepTogether>and the practical learning</KeepTogether>{" "}
            <KeepTogether>that supports hands-on training</KeepTogether>.
          </>
        }
        introClassName="w-full min-w-0"
      />

      <AcademicUnits items={academicUnits} />

      <section className="section-y !pt-8 md:!pt-10 lg:!pt-12">
        <div className="container-page">
          <div id="programs" className="scroll-mt-28">
            <div className="w-full min-w-0" data-motion-from="up">
              <p className="font-display text-xs font-semibold tracking-[0.2em] text-brand uppercase">
                Programs / Courses
              </p>
              <div className="mt-3 h-0.5 w-10 rounded-full bg-brand" />
              <h2 className="heading-section mt-3 hyphens-none font-display font-extrabold text-navy">
                <NaturalWrap phrases={["Diploma programmes", "you can study"]} />
              </h2>
              <p className="mt-3 w-full min-w-0 text-sm leading-relaxed text-muted-foreground">
                Three-year full-time diploma programmes. <KeepTogether>Select a stream</KeepTogether> to browse
                available courses <KeepTogether>and admission requirements</KeepTogether>.
              </p>
            </div>

            <div role="tablist" aria-label="Program filters" className="mt-8 flex flex-wrap gap-2">
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

            {programs.length === 0 ? (
              <p className="mt-16 rounded-2xl border border-dashed border-border bg-surface-white p-12 text-center text-sm text-muted-foreground">
                No programmes match this filter.
              </p>
            ) : (
              <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {programs.map((p) => (
                  <article
                    key={p.slug}
                    className="card-premium flex h-full flex-col p-5 transition-[border-color,transform] duration-300 hover:-translate-y-0.5 hover:border-brand/35 sm:p-6"
                  >
                    <p className="text-[10px] font-semibold tracking-[0.12em] text-brand uppercase sm:text-[11px]">
                      <AmpersandText>{p.stream}</AmpersandText>
                    </p>
                    <h3 className="mt-2 min-w-0 hyphens-none font-display text-base font-bold leading-snug text-navy">
                      <AmpersandText>{p.name}</AmpersandText>
                    </h3>
                    <dl className="mt-4 space-y-2 border-t border-border pt-4 text-xs">
                      <ProgramRow k="Duration" v={p.duration} />
                      <ProgramRow k="Eligibility" v={p.eligibility} />
                      <ProgramRow k="Type" v={p.programType} />
                    </dl>
                    <div className="mt-auto flex flex-col gap-3 pt-5">
                      <Link
                        to="/admissions"
                        className="inline-flex min-h-10 items-center gap-2 text-sm font-semibold text-brand transition-colors hover:text-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
                      >
                        Admission details
                        <ArrowRight className="size-4" aria-hidden="true" />
                      </Link>
                      <Link
                        to={departmentDetailPath(p.slug)}
                        className="text-sm font-medium text-muted-foreground transition-colors hover:text-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
                      >
                        View department →
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>

          <div id="departments" className="scroll-mt-28 mt-16 sm:mt-20">
            <div className="w-full min-w-0" data-motion-from="up">
              <p className="font-display text-xs font-semibold tracking-[0.2em] text-brand uppercase">Departments</p>
              <div className="mt-3 h-0.5 w-10 rounded-full bg-brand" />
              <h2 className="heading-section mt-3 hyphens-none font-display font-extrabold text-navy">
                <NaturalWrap phrases={["Academic departments", "at GPW Srinagar"]} />
              </h2>
              <p className="mt-3 w-full min-w-0 text-sm leading-relaxed text-muted-foreground">
                Each department is responsible for delivering its diploma programme through classroom instruction,
                practical training and departmental learning support.
              </p>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {departments.map((department) => (
                <DepartmentCard key={department.slug} department={department} />
              ))}
            </div>
          </div>

          <PracticalLearningSection />

          <div className="mt-16 sm:mt-20" aria-labelledby="academic-resources-heading">
            <h2 id="academic-resources-heading" className="hyphens-none font-display text-xl font-bold text-navy">
              Academic Resources
            </h2>
            <p className="mt-2 w-full min-w-0 text-sm leading-relaxed text-muted-foreground">
              Useful links for prospective and current students at Government Polytechnic for Women, Srinagar.
            </p>
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {ACADEMIC_RESOURCES.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.title}
                    to={item.to}
                    aria-label={`${item.cta} at Government Polytechnic for Women, Srinagar`}
                    className="group card-premium flex h-full min-w-0 flex-col p-5 transition-[border-color,box-shadow,transform] duration-300 hover:-translate-y-0.5 hover:border-brand/35 hover:shadow-raised sm:p-6"
                  >
                    <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl border border-border/80 bg-light-blue text-brand transition-[background-color,color] duration-300 group-hover:bg-brand group-hover:text-white">
                      <Icon className="size-5" aria-hidden="true" />
                    </span>
                    <h3 className="mt-5 min-w-0 hyphens-none font-display text-base font-bold text-navy">
                      <AmpersandText>{item.title}</AmpersandText>
                    </h3>
                    <div className="mt-2.5 flex-1 space-y-2">
                      <p className="min-w-0 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
                      <p className="min-w-0 text-sm leading-relaxed text-muted-foreground">{item.detail}</p>
                    </div>
                    <span className="mt-6 inline-flex min-h-11 min-w-0 items-center gap-1.5 text-sm font-semibold text-brand transition-colors group-hover:text-navy">
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

function ProgramRow({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex flex-col gap-1 sm:flex-row sm:justify-between sm:gap-4">
      <dt className="shrink-0 text-muted-foreground">{k}</dt>
      <dd className="min-w-0 font-semibold text-navy sm:text-right">{v}</dd>
    </div>
  );
}
