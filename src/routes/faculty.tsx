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
 * All departments arranged in the user-specified order:
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

      {/* Main Page Content Body */}
      <section className="bg-background">
        <div className="container-page space-y-12 pt-8 pb-14 md:space-y-14 md:pt-10 md:pb-16">
          {/* 2. Faculty and Staff Section (immediately after Hero Section) */}
          <section aria-labelledby="faculty-roles" data-motion-from="up" className="space-y-4">
            <div className="flex flex-col gap-1">
              <p className="text-xs font-semibold uppercase tracking-wider text-brand">
                Academic Staffing Structure
              </p>
              <h2
                id="faculty-roles"
                className="font-display text-2xl sm:text-3xl font-extrabold text-navy tracking-tight"
              >
                Faculty &amp; Staff
              </h2>
              <p className="text-sm text-slate-700 leading-relaxed max-w-2xl">
                Official academic teaching personnel, laboratory demonstrators, workshop instructors,
                and administrative support services of Government Polytechnic for Women, Srinagar.
              </p>
            </div>

            <ul className="grid gap-4 sm:grid-cols-3">
              {FACULTY_ROLE_GROUPS.map((group) => (
                <li
                  key={group.title}
                  className="rounded-2xl border border-border/60 bg-white p-5 sm:p-6 shadow-xs hover:shadow-sm transition-all"
                >
                  <div className="flex size-10 items-center justify-center rounded-xl bg-light-blue text-brand border border-brand/20 mb-3">
                    {group.title.toLowerCase().includes("teaching") ? (
                      <GraduationCap className="size-5" />
                    ) : group.title.toLowerCase().includes("technical") ? (
                      <Building2 className="size-5" />
                    ) : (
                      <Users className="size-5" />
                    )}
                  </div>
                  <h3 className="font-display text-base sm:text-lg font-bold text-navy">{group.title}</h3>
                  <p className="mt-2 text-xs sm:text-sm leading-relaxed text-slate-800 font-medium">
                    {group.body}
                  </p>
                </li>
              ))}
            </ul>
          </section>

          {/* 3. Principal / Leadership Section (immediately after Faculty and Staff) */}
          <section aria-labelledby="principal-leadership-heading" data-motion-from="up" className="space-y-3">
            {/* Header Strip matching the Department Section design */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0B1E36] via-[#102A4C] to-[#0B1E36] text-white p-4 sm:p-5 shadow-sm border border-[#0B1E36]">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="flex size-12 sm:size-13 shrink-0 items-center justify-center rounded-xl bg-white/10 text-white border border-white/15 shadow-inner">
                    <GraduationCap className="size-6 text-white" aria-hidden="true" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-semibold tracking-wider uppercase text-light-blue/80">
                        Institutional Leadership
                      </span>
                    </div>
                    <h3
                      id="principal-leadership-heading"
                      className="font-display text-xl sm:text-2xl font-bold text-white tracking-tight truncate"
                    >
                      Principal &amp; Head of Institute
                    </h3>
                  </div>
                </div>

                <Link
                  to="/principal-message"
                  className="inline-flex items-center gap-2 rounded-xl bg-white/10 hover:bg-white text-white hover:text-navy px-4 py-2 text-xs sm:text-sm font-semibold transition-all border border-white/20 shadow-xs self-start sm:self-auto shrink-0"
                >
                  <span>Read Principal&apos;s Message</span>
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </div>
            </div>

            {/* Principal Information Card matching Department HOD Card design */}
            <div className="rounded-2xl border border-border/60 bg-white p-6 sm:p-7 shadow-xs hover:shadow-sm transition-all duration-200">
              <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-5 min-w-0">
                  <img
                    src={FACULTY_LEADERSHIP.portrait}
                    alt={FACULTY_LEADERSHIP.portraitAlt}
                    width={88}
                    height={88}
                    className="size-20 sm:size-22 shrink-0 rounded-2xl object-cover object-top border border-border/60 shadow-xs"
                    loading="lazy"
                  />

                  <div className="min-w-0 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="font-display text-xl sm:text-2xl font-bold text-navy">
                        {FACULTY_LEADERSHIP.name}
                      </h4>
                      <span className="inline-flex items-center rounded-full bg-[#0B1E36] text-white px-3 py-0.5 text-xs font-semibold shadow-2xs">
                        {FACULTY_LEADERSHIP.role}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm font-semibold text-brand">
                      {FACULTY_LEADERSHIP.institute}
                    </p>
                    <p className="text-xs sm:text-sm leading-relaxed text-slate-800 font-medium max-w-2xl">
                      {FACULTY_LEADERSHIP.note}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2.5 pt-1 md:pt-0 shrink-0">
                  <Link
                    to="/principal-message"
                    className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-slate-50 px-4 py-2 text-xs sm:text-sm font-semibold text-navy transition-all hover:border-brand/40 hover:bg-light-blue/50 hover:text-brand"
                    title="Read Principal's Message"
                  >
                    <span>Read Full Message</span>
                    <ArrowRight className="size-3.5 text-brand" aria-hidden="true" />
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {/* 4. Departments Section (starts after Principal Section) */}
          <section aria-labelledby="department-directory-heading" className="space-y-8" data-motion-from="up">
            <div className="space-y-3">
              <div className="text-center sm:text-left">
                <h2
                  id="department-directory-heading"
                  className="font-display text-2xl sm:text-3xl font-extrabold text-navy tracking-tight"
                >
                  Academic Departments
                </h2>
                <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Select Department to View Faculty &amp; Staff
                </p>
              </div>

              {/* Department Navigation Buttons (horizontally scrollable on mobile, flex-wrap on desktop) */}
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
            </div>

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
                    <p className="mt-1 text-xs sm:text-sm leading-relaxed text-slate-800 font-medium">
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
              <p className="mt-2 text-sm leading-relaxed text-slate-800 font-medium">
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
          </section>
        </div>
      </section>
    </>
  );
}
