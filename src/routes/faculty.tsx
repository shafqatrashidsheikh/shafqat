import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Building2, Mail, Phone, Users } from "lucide-react";
import { AmpersandText, NaturalWrap } from "@/components/site/AmpersandText";
import { PageHeader } from "@/components/site/PageHeader";
import { DepartmentFacultyStaffSection } from "@/components/site/DepartmentFacultyStaff";
import {
  COMPUTER_ENGINEERING_FACULTY_STAFF,
  FOOD_TECH_FACULTY_STAFF,
  GARMENT_FACULTY_STAFF,
  OMCA_FACULTY_STAFF,
  TEXTILE_FACULTY_STAFF,
  TRAVEL_TOURISM_FACULTY_STAFF,
  type DepartmentFacultyStaff,
} from "@/lib/department-faculty-data";
import { departmentDetailPath } from "@/lib/departments-data";
import { FACULTY_LEADERSHIP, FACULTY_ROLE_GROUPS } from "@/lib/faculty-data";
import { INSTITUTE } from "@/lib/site-data";

export const Route = createFileRoute("/faculty")({
  head: () => ({
    meta: [
      { title: "Faculty & Staff Directory — GPW Srinagar" },
      {
        name: "description",
        content: `Official faculty directory, department leadership and verified staff contacts for ${INSTITUTE.name}, Bemina.`,
      },
      { property: "og:title", content: "Faculty & Staff Directory — GPW Srinagar" },
      { property: "og:url", content: "/faculty" },
    ],
    links: [{ rel: "canonical", href: "/faculty" }],
  }),
  component: FacultyPage,
});

const ALL_DEPARTMENT_FACULTIES: readonly DepartmentFacultyStaff[] = [
  COMPUTER_ENGINEERING_FACULTY_STAFF,
  OMCA_FACULTY_STAFF,
  TEXTILE_FACULTY_STAFF,
  GARMENT_FACULTY_STAFF,
  TRAVEL_TOURISM_FACULTY_STAFF,
  FOOD_TECH_FACULTY_STAFF,
];

const DEPARTMENT_TABS = [
  { id: "all", label: "All Departments" },
  { id: "computer-engineering", label: "Computer Engineering" },
  { id: "office-management-computer-applications", label: "OMCA" },
  { id: "textile-technology", label: "Textile Technology" },
  { id: "garment-technology", label: "Garment Technology" },
  { id: "travel-tourism", label: "Travel & Tourism" },
  { id: "food-technology", label: "Food Technology" },
] as const;

type DepartmentTabId = (typeof DEPARTMENT_TABS)[number]["id"];

function FacultyPage() {
  const [activeTab, setActiveTab] = useState<DepartmentTabId>("all");

  const visibleDepartments =
    activeTab === "all"
      ? ALL_DEPARTMENT_FACULTIES
      : ALL_DEPARTMENT_FACULTIES.filter((d) => d.departmentSlug === activeTab);

  return (
    <>
      <PageHeader
        compact
        crumb="Faculty & Staff"
        title={<AmpersandText>Faculty & Staff Directory</AmpersandText>}
        titleClassName="max-w-none"
        introClassName="mt-3 w-full min-w-0 max-w-none text-base leading-relaxed text-muted-foreground md:mt-3.5"
        intro={
          <NaturalWrap
            phrases={[
              "Department heads, verified teaching faculty, demonstrators and technical staff",
              "supporting diploma engineering programmes at GPW Srinagar.",
            ]}
          />
        }
      />

      <section className="bg-background">
        <div className="container-page space-y-10 pt-2 pb-8 md:space-y-12 md:pt-4 md:pb-12">
          {/* Institute Leadership */}
          <section aria-labelledby="faculty-leadership" data-motion-from="up">
            <h2
              id="faculty-leadership"
              className="font-display text-[1.25rem] font-extrabold text-navy md:text-[1.375rem]"
            >
              Institute Leadership
            </h2>
            <article className="card-premium mt-5 overflow-hidden sm:flex sm:items-stretch">
              <div className="sm:w-[220px] sm:shrink-0">
                <img
                  src={FACULTY_LEADERSHIP.portrait}
                  alt={FACULTY_LEADERSHIP.portraitAlt}
                  width={400}
                  height={480}
                  className="aspect-[5/6] h-full w-full object-cover object-top sm:aspect-auto sm:min-h-[250px]"
                  loading="lazy"
                />
              </div>
              <div className="flex min-w-0 flex-1 flex-col justify-center p-5 sm:p-7">
                <p className="text-[11px] font-semibold tracking-[0.14em] text-brand uppercase">
                  Principal
                </p>
                <h3 className="mt-1 font-display text-xl font-bold text-navy sm:text-2xl">
                  {FACULTY_LEADERSHIP.name}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">{FACULTY_LEADERSHIP.institute}</p>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {FACULTY_LEADERSHIP.note}
                </p>
                <Link to="/principal-message" className="link-cta mt-5 w-fit">
                  <span>Read Principal&apos;s message</span>
                  <ArrowRight className="size-4" />
                </Link>
              </div>
            </article>
          </section>

          {/* Role Groups Overview */}
          <section aria-labelledby="faculty-roles" data-motion-from="up">
            <h2
              id="faculty-roles"
              className="font-display text-[1.25rem] font-extrabold text-navy md:text-[1.375rem]"
            >
              Academic & Technical Staffing
            </h2>
            <ul className="mt-5 grid gap-4 sm:grid-cols-3">
              {FACULTY_ROLE_GROUPS.map((group) => (
                <li key={group.title} className="card-premium p-5">
                  <h3 className="font-display text-base font-bold text-navy">{group.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{group.body}</p>
                </li>
              ))}
            </ul>
          </section>

          {/* Department Faculty Directory */}
          <section aria-labelledby="department-directory-heading" className="space-y-6" data-motion-from="up">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between border-b border-border/40 pb-5">
              <div>
                <p className="font-display text-xs font-semibold tracking-[0.2em] text-brand uppercase">
                  Academic Departments
                </p>
                <h2
                  id="department-directory-heading"
                  className="mt-2 font-display text-[1.35rem] font-extrabold text-navy md:text-[1.6rem]"
                >
                  Faculty & Staff by Department
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Select a department to view its Head of Department, faculty members, qualifications,
                  specialisations and laboratory staff.
                </p>
              </div>
            </div>

            {/* Department Filter Tabs */}
            <div
              role="tablist"
              aria-label="Department faculty filters"
              className="flex flex-wrap gap-2 pt-1"
            >
              {DEPARTMENT_TABS.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => setActiveTab(tab.id)}
                    className={`min-h-10 whitespace-nowrap rounded-xl border px-4 py-2 text-xs sm:text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? "border-brand bg-brand text-primary-foreground shadow-xs"
                        : "border-border/40 bg-surface/70 text-navy hover:border-brand/30 hover:bg-light-blue/40"
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Department Faculty Rosters */}
            <div className="space-y-16 pt-6">
              {visibleDepartments.map((deptData) => (
                <div
                  key={deptData.departmentSlug}
                  className="space-y-8 pb-16 border-b border-border/40 last:border-b-0 last:pb-0"
                >
                  <DepartmentFacultyStaffSection
                    data={deptData}
                    idPrefix={`dept-${deptData.departmentSlug}`}
                    showProgrammeLink
                  />
                </div>
              ))}
            </div>

            {/* Additional departments info */}
            {activeTab === "all" ? (
              <div className="rounded-2xl border border-border/40 bg-surface/80 p-6 sm:p-7 transition-all duration-200">
                <div className="flex items-start gap-4">
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-light-blue text-brand">
                    <Building2 className="size-5" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="font-display text-base font-bold text-navy sm:text-lg">
                      Other Diploma Programmes & Liaison
                    </h3>
                    <p className="mt-1 text-xs sm:text-sm leading-relaxed text-muted-foreground">
                      Faculty allocations and academic coordinators for Electronics & Communication
                      Engineering and Medical Laboratory Technology are published under the direct
                      supervision of the Institute Academic Office and JKBOTE intake guidelines.
                    </p>
                    <div className="mt-4 flex flex-wrap gap-3">
                      <Link
                        to={departmentDetailPath("electronics-communication-engineering")}
                        className="link-cta text-xs sm:text-sm"
                      >
                        ECE Programme Details
                        <ArrowRight className="size-3.5" />
                      </Link>
                      <Link
                        to={departmentDetailPath("medical-laboratory-technology")}
                        className="link-cta text-xs sm:text-sm"
                      >
                        MLT Programme Details
                        <ArrowRight className="size-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}
          </section>

          {/* Institute Office Contact Card */}
          <section aria-labelledby="faculty-office" className="card-premium p-5 sm:p-6" data-motion-from="up">
            <h2 id="faculty-office" className="font-display text-base font-bold text-navy sm:text-lg">
              Institute Office & Verification
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              For official correspondence, verification of faculty credentials, or department inquiries,
              please reach out to the institute administrative office.
            </p>
            <ul className="mt-4 space-y-2 text-sm">
              <li className="flex items-center gap-2 text-navy">
                <Phone className="size-4 shrink-0 text-brand" aria-hidden="true" />
                <a href={`tel:${INSTITUTE.phone.replace(/-/g, "")}`} className="hover:text-brand font-medium">
                  {INSTITUTE.phone}
                </a>
              </li>
              <li className="flex items-center gap-2 text-navy">
                <Mail className="size-4 shrink-0 text-brand" aria-hidden="true" />
                <a href={`mailto:${INSTITUTE.email}`} className="hover:text-brand font-medium">
                  {INSTITUTE.email}
                </a>
              </li>
            </ul>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link to="/contact" className="btn-primary w-full sm:w-auto">
                <span>Contact Office</span>
                <ArrowRight className="size-4" />
              </Link>
              <Link to="/academics" className="btn-secondary w-full sm:w-auto">
                Explore Diploma Programmes
              </Link>
            </div>
          </section>
        </div>
      </section>
    </>
  );
}
