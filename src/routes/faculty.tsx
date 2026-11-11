import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Award,
  Briefcase,
  Building2,
  Compass,
  GraduationCap,
  Laptop,
  Layers,
  LayoutGrid,
  Mail,
  Phone,
  Shirt,
  Users,
  Utensils,
} from "lucide-react";
import collegeHeroWinter from "@/assets/college-hero-winter.jpg";
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

/**
 * All departments arranged in the exact user-specified order:
 * 1. Food Technology
 * 2. Travel & Tourism
 * 3. Garment Technology
 * 4. Textile Technology
 * 5. OMCA
 * 6. Computer Engineering
 */
const ALL_DEPARTMENT_FACULTIES: readonly DepartmentFacultyStaff[] = [
  FOOD_TECH_FACULTY_STAFF,
  TRAVEL_TOURISM_FACULTY_STAFF,
  GARMENT_FACULTY_STAFF,
  TEXTILE_FACULTY_STAFF,
  OMCA_FACULTY_STAFF,
  COMPUTER_ENGINEERING_FACULTY_STAFF,
];

const DEPARTMENT_TABS = [
  { id: "all", label: "All Departments", icon: LayoutGrid },
  { id: "food-technology", label: "Food Technology", icon: Utensils },
  { id: "travel-tourism", label: "Travel & Tourism", icon: Compass },
  { id: "garment-technology", label: "Garment Technology", icon: Shirt },
  { id: "textile-technology", label: "Textile Technology", icon: Layers },
  { id: "office-management-computer-applications", label: "OMCA", icon: Briefcase },
  { id: "computer-engineering", label: "Computer Engineering", icon: Laptop },
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
      {/* 1. Hero Section with Snow-Covered College Campus Background */}
      <section className="relative overflow-hidden border-b border-border/50">
        {/* Actual College Campus Winter/Snow Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-700"
          style={{
            backgroundImage: `url(${collegeHeroWinter})`,
            backgroundPosition: "center 35%",
          }}
          aria-hidden="true"
        />

        {/* Subtle white/light-blue overlay for pristine readability and academic blue identity */}
        <div
          className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/90 to-light-blue/80 backdrop-blur-[1.5px]"
          aria-hidden="true"
        />

        <div className="container-page relative z-10 py-10 sm:py-12 md:py-16">
          <div className="max-w-3xl space-y-4">
            {/* Breadcrumb */}
            <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Link to="/" className="hover:text-navy transition-colors">
                Home
              </Link>
              <span>/</span>
              <span className="font-semibold text-brand">Faculty &amp; Staff Directory</span>
            </nav>

            {/* Academic illustration badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-brand/25 bg-white/90 px-3.5 py-1 text-xs font-semibold text-brand shadow-2xs backdrop-blur-xs">
              <GraduationCap className="size-4 text-brand" aria-hidden="true" />
              <span>Government Polytechnic for Women, Srinagar</span>
            </div>

            {/* Main Heading */}
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold text-navy tracking-tight leading-tight">
              Faculty &amp; Staff Directory
            </h1>

            {/* Short professional description */}
            <p className="text-sm sm:text-base md:text-lg leading-relaxed text-slate-700">
              Department leadership, verified teaching faculty, demonstrators, and technical workshop
              staff supporting 3-year diploma engineering and vocational programmes under JKBOTE
              curriculum.
            </p>

            {/* Academic Highlights */}
            <div className="flex flex-wrap items-center gap-2.5 pt-1 text-xs font-medium text-slate-700">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/85 px-3 py-1 border border-border/60 shadow-2xs">
                <Building2 className="size-3.5 text-brand" />
                <span>6 Academic Departments</span>
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/85 px-3 py-1 border border-border/60 shadow-2xs">
                <Award className="size-3.5 text-brand" />
                <span>Verified JKBOTE Curriculum</span>
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/85 px-3 py-1 border border-border/60 shadow-2xs">
                <Users className="size-3.5 text-brand" />
                <span>Practical &amp; Technical Mentorship</span>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Main Directory Content */}
      <section className="bg-background">
        <div className="container-page space-y-10 pt-6 pb-12 md:space-y-12 md:pt-8 md:pb-16">
          {/* Department Navigation Buttons */}
          <section aria-labelledby="department-navigation-heading" className="space-y-3">
            <div className="text-center sm:text-left">
              <h2 id="department-navigation-heading" className="sr-only">
                Department Navigation
              </h2>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Select Department to View Faculty &amp; Staff
              </p>
            </div>

            {/* Horizontally scrollable on mobile, centered flex-wrap on desktop */}
            <div
              role="tablist"
              aria-label="Department faculty filters"
              className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 sm:flex-wrap sm:justify-start no-scrollbar"
            >
              {DEPARTMENT_TABS.map((tab) => {
                const isActive = activeTab === tab.id;
                const TabIcon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => setActiveTab(tab.id)}
                    className={`min-h-11 shrink-0 whitespace-nowrap rounded-full px-4 sm:px-5 py-2.5 text-xs sm:text-sm font-semibold transition-all duration-200 inline-flex items-center gap-2 ${
                      isActive
                        ? "bg-[#0B1E36] text-white shadow-md border border-[#0B1E36] scale-[1.02]"
                        : "bg-white text-navy border border-border/70 hover:bg-light-blue/60 hover:text-brand shadow-xs hover:border-brand/30"
                    }`}
                  >
                    <TabIcon
                      className={`size-4 ${isActive ? "text-white" : "text-brand"}`}
                      aria-hidden="true"
                    />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Department Faculty Rosters */}
          <div className="space-y-16">
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

          {/* Institute Leadership */}
          <section aria-labelledby="faculty-leadership" data-motion-from="up">
            <h2
              id="faculty-leadership"
              className="font-display text-[1.25rem] font-extrabold text-navy md:text-[1.375rem]"
            >
              Institute Leadership
            </h2>
            <article className="mt-4 overflow-hidden rounded-2xl border border-border/60 bg-white shadow-xs hover:shadow-sm transition-all sm:flex sm:items-stretch">
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
              <div className="flex min-w-0 flex-1 flex-col justify-center p-6 sm:p-7">
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-light-blue px-3 py-0.5 text-xs font-semibold text-brand">
                    Principal
                  </span>
                </div>
                <h3 className="mt-2 font-display text-xl sm:text-2xl font-bold text-navy">
                  {FACULTY_LEADERSHIP.name}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">{FACULTY_LEADERSHIP.institute}</p>
                <p className="mt-3 text-sm leading-relaxed text-slate-700">
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
              Academic &amp; Technical Staffing
            </h2>
            <ul className="mt-4 grid gap-4 sm:grid-cols-3">
              {FACULTY_ROLE_GROUPS.map((group) => (
                <li key={group.title} className="rounded-2xl border border-border/60 bg-white p-5 shadow-xs">
                  <h3 className="font-display text-base font-bold text-navy">{group.title}</h3>
                  <p className="mt-2 text-xs sm:text-sm leading-relaxed text-slate-600">{group.body}</p>
                </li>
              ))}
            </ul>
          </section>

          {/* Additional departments info */}
          {activeTab === "all" ? (
            <div className="rounded-2xl border border-border/60 bg-white p-6 sm:p-7 shadow-xs">
              <div className="flex items-start gap-4">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-light-blue text-brand border border-brand/20">
                  <Building2 className="size-5" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="font-display text-base font-bold text-navy sm:text-lg">
                    Other Diploma Programmes &amp; Academic Liaison
                  </h3>
                  <p className="mt-1 text-xs sm:text-sm leading-relaxed text-slate-600">
                    Faculty allocations and academic coordinators for Electronics &amp; Communication
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

          {/* Institute Office Contact Card */}
          <section aria-labelledby="faculty-office" className="rounded-2xl border border-border/60 bg-white p-6 sm:p-7 shadow-xs" data-motion-from="up">
            <h2 id="faculty-office" className="font-display text-base font-bold text-navy sm:text-lg">
              Institute Office &amp; Verification
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
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
