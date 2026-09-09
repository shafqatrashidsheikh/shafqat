import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BriefcaseBusiness,
  CircuitBoard,
  FlaskConical,
  Layers,
  Microscope,
  Monitor,
  Plane,
  Shirt,
  type LucideIcon,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { GpwDepartment } from "@/lib/departments-data";
import { DEPARTMENT_LAB_NOTE } from "@/lib/departments-data";
import type { ProgramIcon } from "@/lib/site-data";

const DEPARTMENT_ICONS: Record<ProgramIcon, LucideIcon> = {
  monitor: Monitor,
  "circuit-board": CircuitBoard,
  shirt: Shirt,
  layers: Layers,
  briefcase: BriefcaseBusiness,
  flask: FlaskConical,
  microscope: Microscope,
  plane: Plane,
};

export function DepartmentDetailContent({ department }: { department: GpwDepartment }) {
  const Icon = DEPARTMENT_ICONS[department.icon];

  return (
    <>
      <section className="bg-background">
        <div className="container-page pt-3 pb-6 sm:pt-4 sm:pb-8 md:pt-5 md:pb-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0 max-w-3xl">
              <div className="flex items-start gap-4">
                <span className="inline-flex size-14 shrink-0 items-center justify-center rounded-2xl border border-border/80 bg-light-blue text-brand">
                  <Icon className="size-7" aria-hidden="true" />
                </span>
                <div className="min-w-0">
                  <p className="text-[11px] font-semibold tracking-[0.14em] text-brand uppercase">
                    {department.stream}
                  </p>
                  <h1 className="mt-1 text-balance font-display text-[clamp(1.625rem,4vw+0.75rem,2.75rem)] font-extrabold leading-tight text-navy">
                    {department.name}
                  </h1>
                </div>
              </div>
              <p className="mt-5 text-base leading-relaxed text-muted-foreground">{department.overview}</p>
            </div>

            {department.image ? (
              <div className="w-full shrink-0 overflow-hidden rounded-3xl border border-border shadow-soft lg:max-w-md">
                <img
                  src={department.image.src}
                  alt={department.image.alt}
                  width={1200}
                  height={900}
                  loading="lazy"
                  className="aspect-[4/3] size-full object-cover"
                />
              </div>
            ) : null}
          </div>
        </div>
      </section>

      <section className="section-y">
        <div className="container-page grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,20rem)] lg:gap-10">
          <div className="min-w-0">
            <Accordion type="multiple" defaultValue={["programme", "practical"]} className="w-full">
              <AccordionItem value="programme">
                <AccordionTrigger className="font-display text-base font-bold text-navy hover:no-underline">
                  Programme Information
                </AccordionTrigger>
                <AccordionContent>
                  <dl className="grid gap-4 sm:grid-cols-2">
                    <InfoRow label="Programme" value={department.programType} />
                    <InfoRow label="Duration" value={department.duration} />
                    <InfoRow label="Eligibility" value={department.eligibility} />
                    <InfoRow label="Academic Area" value={department.stream} />
                  </dl>
                  <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                    Admission eligibility and subject requirements are published in the official admission notification
                    for each academic session.
                  </p>
                  <Link
                    to="/admissions"
                    className="btn-primary group mt-6 inline-flex w-full sm:w-auto"
                  >
                    View admission information
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                  </Link>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="practical">
                <AccordionTrigger className="font-display text-base font-bold text-navy hover:no-underline">
                  Practical Learning
                </AccordionTrigger>
                <AccordionContent>
                  <div className="rounded-2xl border border-border bg-light-blue/35 p-5">
                    <div className="flex items-start gap-3">
                      <FlaskConical className="mt-0.5 size-5 shrink-0 text-brand" aria-hidden="true" />
                      <div>
                        <h3 className="font-display text-sm font-bold text-navy">Departmental Laboratories</h3>
                        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{DEPARTMENT_LAB_NOTE}</p>
                      </div>
                    </div>
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                    Practical training is integrated with classroom instruction to develop applied skills relevant to
                    this department&apos;s diploma programme.
                  </p>
                  <Link
                    to="/campus#facilities"
                    className="link-cta group mt-5 inline-flex rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
                  >
                    Campus facilities
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                  </Link>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="career">
                <AccordionTrigger className="font-display text-base font-bold text-navy hover:no-underline">
                  Learning Focus Areas
                </AccordionTrigger>
                <AccordionContent>
                  <ul className="space-y-2 text-sm leading-relaxed text-muted-foreground">
                    {department.careerAreas.map((area) => (
                      <li key={area} className="flex gap-2">
                        <span className="mt-2 size-1.5 shrink-0 rounded-full bg-brand" aria-hidden="true" />
                        <span>{area}</span>
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          <aside className="min-w-0">
            <div className="card-premium sticky top-28 p-6">
              <h2 className="font-display text-base font-bold text-navy">Quick links</h2>
              <ul className="mt-4 space-y-3 text-sm">
                <li>
                  <Link to="/admissions" className="link-underline text-brand hover:text-navy">
                    Admissions &amp; eligibility
                  </Link>
                </li>
                <li>
                  <Link to="/academics#programs" className="link-underline text-brand hover:text-navy">
                    All diploma programmes
                  </Link>
                </li>
                <li>
                  <Link to="/academics#labs-workshops" className="link-underline text-brand hover:text-navy">
                    Laboratories &amp; workshops
                  </Link>
                </li>
                <li>
                  <Link to="/updates/notices" className="link-underline text-brand hover:text-navy">
                    Notices &amp; examination updates
                  </Link>
                </li>
              </ul>
              <Link
                to="/academics#departments"
                className="btn-secondary mt-6 inline-flex w-full justify-center"
              >
                Academic Departments
              </Link>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-surface-white px-4 py-3">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="mt-1 text-sm font-semibold text-navy">{value}</dd>
    </div>
  );
}
