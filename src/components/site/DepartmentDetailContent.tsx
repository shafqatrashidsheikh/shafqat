import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Award,
  BookOpen,
  ClipboardList,
  Clock3,
  FlaskConical,
  GraduationCap,
  Users,
} from "lucide-react";
import type { ReactNode } from "react";
import type { GpwDepartment } from "@/lib/departments-data";
import {
  PROGRAMME_ADMISSION_NOTE,
  PROGRAMME_CAREER_DISCLAIMER,
} from "@/lib/departments-data";

/** Matches campus facility / admissions info cards already used site-wide */
const FACT_CARD =
  "flex min-h-0 min-w-0 flex-col justify-center rounded-xl border border-border bg-card px-3.5 py-3 shadow-soft sm:px-4 sm:py-3.5";

/** Reuses site-wide card-premium (same as academics / homepage cards) */
const CONTENT_CARD = "card-premium p-4 sm:p-5";

export function DepartmentDetailContent({ department }: { department: GpwDepartment }) {
  const learningAreas =
    department.learningAreas?.length > 0 ? department.learningAreas : department.careerAreas;
  const careerPathways =
    department.careerPathways?.length > 0 ? department.careerPathways : department.careerAreas;
  const practicalPoints =
    department.practicalPoints?.length > 0
      ? department.practicalPoints
      : department.practicalLearning
        ? [department.practicalLearning]
        : [];

  const facts = [
    { label: "Duration", value: department.duration, icon: Clock3 },
    { label: "Intake", value: department.intake, icon: Users },
    { label: "Study Mode", value: department.studyMode, icon: BookOpen },
    { label: "Award", value: department.award, icon: Award },
    { label: "Eligibility", value: department.eligibility, icon: ClipboardList },
    {
      label: "Academic Authority",
      value: department.academicAuthority,
      icon: GraduationCap,
    },
  ] as const;

  return (
    <div className="leading-[1.55]">
      <section className="bg-background">
        <div className="container-page min-w-0 overflow-x-clip pt-5 pb-4 sm:pt-6 sm:pb-5 md:pt-7 md:pb-5">
          <p className="text-[11px] font-semibold tracking-[0.14em] text-brand uppercase">
            {department.stream}
          </p>
          <h1 className="mt-2 text-balance font-display text-[clamp(1.625rem,3.8vw+0.6rem,2.5rem)] font-extrabold leading-[1.15] text-navy">
            {department.name}
          </h1>

          <p className="mt-3.5 w-full text-[0.9375rem] leading-[1.7] text-muted-foreground sm:mt-4 sm:text-base">
            {department.heroIntro}
          </p>

          <dl className="mt-4 grid grid-cols-1 gap-2.5 sm:mt-5 sm:grid-cols-3 sm:gap-3">
            <div className={FACT_CARD}>
              <dt className="text-xs text-muted-foreground">Duration</dt>
              <dd className="mt-1 text-sm font-bold text-navy">{department.duration}</dd>
            </div>
            <div className={FACT_CARD}>
              <dt className="text-xs text-muted-foreground">Intake</dt>
              <dd className="mt-1 text-sm font-bold text-navy">{department.intake}</dd>
            </div>
            <div className={FACT_CARD}>
              <dt className="text-xs text-muted-foreground">Mode</dt>
              <dd className="mt-1 text-sm font-bold text-navy">{department.studyMode}</dd>
            </div>
          </dl>

          <div className="mt-4 flex w-full flex-col items-stretch justify-center gap-3 sm:mt-5 sm:flex-row sm:flex-wrap sm:items-center">
            <Link to="/admissions" className="btn-primary w-full sm:w-auto">
              Admission Information
            </Link>
            <Link to="/academics" hash="programs" className="btn-primary w-full sm:w-auto">
              View All Programmes
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-background">
        <div className="container-page min-w-0 space-y-7 pt-3 pb-8 md:space-y-8 md:pt-4 md:pb-10">
          <section aria-labelledby="programme-overview-heading">
            <SectionHeading id="programme-overview-heading">Programme Overview</SectionHeading>
            <p className="mt-3 w-full text-sm leading-[1.7] text-muted-foreground sm:text-[0.95rem]">
              {department.overview}
            </p>
          </section>

          <section aria-labelledby="learning-areas-heading">
            <SectionHeading id="learning-areas-heading">What Students Learn</SectionHeading>
            <p className="mt-2 text-sm text-muted-foreground">
              Core learning areas covered in this diploma programme:
            </p>
            <ul className="mt-4 grid gap-3">
              {learningAreas.map((area) => (
                <li key={area} className={CONTENT_CARD}>
                  <div className="flex gap-2.5 text-sm leading-snug text-navy">
                    <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-brand" aria-hidden="true" />
                    <span className="font-medium">{area}</span>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="practical-learning-heading">
            <SectionHeading id="practical-learning-heading">Practical Learning</SectionHeading>
            <div className={`mt-4 ${CONTENT_CARD}`}>
              <div className="flex items-start gap-3">
                <FlaskConical className="mt-0.5 size-5 shrink-0 text-brand" aria-hidden="true" />
                <ul className="min-w-0 space-y-2.5 text-sm leading-relaxed text-muted-foreground">
                  {practicalPoints.map((point) => (
                    <li key={point} className="flex gap-2">
                      <span className="mt-2 size-1.5 shrink-0 rounded-full bg-brand" aria-hidden="true" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          <section aria-labelledby="career-pathways-heading">
            <SectionHeading id="career-pathways-heading">Career Pathways</SectionHeading>
            <p className="mt-2 text-sm text-muted-foreground">Career pathways may include:</p>
            <ul className="mt-4 grid gap-3">
              {careerPathways.map((path) => (
                <li key={path} className={CONTENT_CARD}>
                  <div className="flex gap-2.5 text-sm leading-snug text-navy">
                    <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-brand" aria-hidden="true" />
                    <span className="font-medium">{path}</span>
                  </div>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
              {PROGRAMME_CAREER_DISCLAIMER}
            </p>
          </section>

          <section aria-labelledby="programme-facts-heading">
            <SectionHeading id="programme-facts-heading">Programme Facts</SectionHeading>
            <dl className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {facts.map((fact) => {
                const FactIcon = fact.icon;
                return (
                  <div key={fact.label} className={FACT_CARD}>
                    <dt className="flex items-center gap-2 text-xs text-muted-foreground">
                      <FactIcon className="size-3.5 shrink-0 text-brand" aria-hidden="true" />
                      {fact.label}
                    </dt>
                    <dd className="mt-1 text-sm font-bold leading-snug text-navy">{fact.value}</dd>
                  </div>
                );
              })}
            </dl>
          </section>

          <section
            aria-labelledby="admission-note-heading"
            className="rounded-2xl border border-border bg-card p-5 shadow-soft sm:p-6"
          >
            <h2
              id="admission-note-heading"
              className="font-display text-base font-bold text-navy sm:text-lg"
            >
              Admission Note
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {PROGRAMME_ADMISSION_NOTE}
            </p>
            <div className="mt-5 flex w-full flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link to="/admissions" className="btn-primary group w-full sm:w-auto">
                View Admission Information
                <ArrowRight
                  className="size-4 transition-transform group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </Link>
              <Link to="/downloads" className="btn-secondary w-full sm:w-auto">
                Syllabus &amp; Downloads
              </Link>
            </div>
          </section>
        </div>
      </section>
    </div>
  );
}

function SectionHeading({ id, children }: { id: string; children: ReactNode }) {
  return (
    <h2 id={id} className="font-display text-[1.25rem] font-extrabold text-navy md:text-[1.375rem]">
      {children}
    </h2>
  );
}
