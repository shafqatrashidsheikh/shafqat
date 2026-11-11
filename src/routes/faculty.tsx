import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Award,
  Building2,
  ChefHat,
  Code,
  GraduationCap,
  Layers,
  LayoutGrid,
  Mail,
  Monitor,
  Phone,
  Plane,
  Shirt,
  Users,
  ArrowRight,
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
  { id: "food-technology", label: "Food Technology", icon: ChefHat },
  { id: "travel-tourism", label: "Travel & Tourism", icon: Plane },
  { id: "garment-technology", label: "Garment Technology", icon: Shirt },
  { id: "textile-technology", label: "Textile Technology", icon: Layers },
  { id: "office-management-computer-applications", label: "OMCA", icon: Monitor },
  { id: "computer-engineering", label: "Computer Engineering", icon: Code },
  { id: "all", label: "All Departments", icon: LayoutGrid },
] as const;

type DepartmentTabId = (typeof DEPARTMENT_TABS)[number]["id"];

function FacultyPage() {
  // Food Technology is active by default matching reference screenshot
  const [activeTab, setActiveTab] = useState<DepartmentTabId>("food-technology");

  const visibleDepartments =
    activeTab === "all"
      ? ALL_DEPARTMENT_FACULTIES
      : ALL_DEPARTMENT_FACULTIES.filter((d) => d.departmentSlug === activeTab);

  return (
    <>
      {/* 1. Hero Section matching the exact reference screenshot styling */}
      <section className="relative overflow-hidden border-b border-border/50 bg-[#F4F8FC]">
        {/* Actual College Campus Winter/Snow Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40 transition-transform duration-700"
          style={{
            backgroundImage: `url(${collegeHeroWinter})`,
            backgroundPosition: "center 30%",
          }}
          aria-hidden="true"
        />

        {/* Soft white/light-blue overlay */}
        <div
          className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/90 to-light-blue/70 backdrop-blur-[1px]"
          aria-hidden="true"
        />

        <div className="container-page relative z-10 py-10 sm:py-12 md:py-14">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            {/* Left: Illustration + Title + Subtitle */}
            <div className="flex items-start gap-4 sm:gap-5 max-w-2xl">
              {/* Academic illustration badge */}
              <div className="size-14 sm:size-16 shrink-0 rounded-2xl bg-gradient-to-br from-[#0B1E36] to-[#1E3A8A] text-white flex items-center justify-center shadow-sm">
                <GraduationCap className="size-8 sm:size-9 text-white" aria-hidden="true" />
              </div>

              <div>
                <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#0B1E36] tracking-tight">
                  Faculty &amp; Staff{" "}
                  <span className="text-purple-600 font-serif italic">Directory</span>
                </h1>

                {/* Purple underline accent bar */}
                <div className="w-16 h-1 bg-purple-600 rounded-full mt-2 mb-3" aria-hidden="true" />

                <p className="text-sm sm:text-base italic text-slate-700 font-serif leading-relaxed">
                  Our dedicated faculty and staff are the backbone of our institution, committed to
                  excellence in education and innovation.
                </p>
              </div>
            </div>

            {/* Right: Script Motto matching reference image */}
            <div className="hidden lg:flex flex-col items-end justify-center self-center shrink-0">
              <span className="font-serif italic text-2xl xl:text-3xl font-normal text-[#0B1E36]/80 tracking-wide select-none">
                Learn • Innovate • Excel
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Main Directory Content */}
      <section className="bg-[#F8FAFC] py-8 sm:py-10 md:py-12">
        <div className="container-page space-y-8 sm:space-y-10">
          {/* Department Navigation Tabs matching reference screenshot */}
          <section aria-labelledby="department-navigation-heading">
            <h2 id="department-navigation-heading" className="sr-only">
              Department Navigation
            </h2>

            <div
              role="tablist"
              aria-label="Department faculty navigation"
              className="flex items-center gap-2 sm:gap-2.5 overflow-x-auto pb-2 sm:pb-0 sm:flex-wrap sm:justify-center no-scrollbar"
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
                    className={`min-h-11 shrink-0 whitespace-nowrap rounded-full px-4 sm:px-5 py-2.5 text-xs sm:text-sm font-bold transition-all duration-200 inline-flex items-center gap-2 ${
                      isActive
                        ? "bg-[#0B1E36] text-white shadow-md border border-[#0B1E36]"
                        : "bg-white text-navy border border-slate-200/90 hover:bg-slate-50 hover:text-brand shadow-xs"
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

          {/* Dynamic Department Faculty Rosters */}
          <div className="space-y-12">
            {visibleDepartments.map((deptData) => (
              <DepartmentFacultyStaffSection
                key={deptData.departmentSlug}
                data={deptData}
                idPrefix={`dept-${deptData.departmentSlug}`}
                showProgrammeLink
              />
            ))}
          </div>

          {/* Bottom Accent Banner matching reference screenshot */}
          <div className="rounded-2xl bg-[#0B1E36] py-3.5 px-6 text-center shadow-xs">
            <p className="font-serif italic text-sm sm:text-base md:text-lg text-white/95 tracking-wide">
              Empowering Women Through Technical Education
            </p>
          </div>

          {/* Institute Leadership (Principal) */}
          <section aria-labelledby="faculty-leadership" className="pt-6" data-motion-from="up">
            <div className="flex items-center justify-between border-b border-slate-200/70 pb-3 mb-5">
              <h2
                id="faculty-leadership"
                className="font-display text-[1.25rem] font-extrabold text-[#0B1E36] md:text-[1.375rem]"
              >
                Institute Leadership
              </h2>
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Administrative Head
              </span>
            </div>

            <article className="overflow-hidden rounded-3xl border border-slate-200/90 bg-white shadow-xs hover:shadow-sm transition-all sm:flex sm:items-stretch">
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
                  <span className="rounded-full bg-purple-100 text-purple-700 px-3 py-0.5 text-xs font-semibold shadow-2xs">
                    Principal
                  </span>
                </div>
                <h3 className="mt-2 font-display text-xl sm:text-2xl font-bold text-[#0B1E36]">
                  {FACULTY_LEADERSHIP.name}
                </h3>
                <p className="mt-1 text-sm font-medium text-slate-700">{FACULTY_LEADERSHIP.institute}</p>
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
              className="font-display text-[1.25rem] font-extrabold text-[#0B1E36] md:text-[1.375rem] border-b border-slate-200/70 pb-3 mb-5"
            >
              Academic &amp; Technical Staffing Structure
            </h2>
            <ul className="grid gap-4 sm:grid-cols-3">
              {FACULTY_ROLE_GROUPS.map((group) => (
                <li key={group.title} className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs">
                  <h3 className="font-display text-base font-bold text-[#0B1E36]">{group.title}</h3>
                  <p className="mt-2 text-xs sm:text-sm leading-relaxed text-slate-700">{group.body}</p>
                </li>
              ))}
            </ul>
          </section>

          {/* Other Diploma Programmes & Academic Office Verification */}
          <section aria-labelledby="faculty-office" className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-7 shadow-xs">
            <div className="flex items-start gap-4">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-light-blue text-brand border border-brand/20">
                <Building2 className="size-6" aria-hidden="true" />
              </div>
              <div className="space-y-2">
                <h2 id="faculty-office" className="font-display text-base font-bold text-[#0B1E36] sm:text-lg">
                  Institute Office &amp; Academic Verification
                </h2>
                <p className="text-xs sm:text-sm leading-relaxed text-slate-700">
                  For official correspondence, verification of faculty credentials, or department
                  inquiries, please reach out to the institute administrative office.
                </p>
                <ul className="flex flex-wrap items-center gap-5 pt-2 text-xs sm:text-sm">
                  <li className="flex items-center gap-2 font-semibold text-slate-900">
                    <Phone className="size-4 shrink-0 text-brand" aria-hidden="true" />
                    <a href={`tel:${INSTITUTE.phone.replace(/-/g, "")}`} className="hover:text-brand transition-colors">
                      {INSTITUTE.phone}
                    </a>
                  </li>
                  <li className="flex items-center gap-2 font-semibold text-slate-900">
                    <Mail className="size-4 shrink-0 text-brand" aria-hidden="true" />
                    <a href={`mailto:${INSTITUTE.email}`} className="hover:text-brand transition-colors">
                      {INSTITUTE.email}
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3 pt-4 border-t border-slate-100">
              <Link to="/contact" className="btn-primary text-xs sm:text-sm">
                <span>Contact Office</span>
                <ArrowRight className="size-4" />
              </Link>
              <Link
                to={departmentDetailPath("electronics-communication-engineering")}
                className="btn-secondary text-xs sm:text-sm"
              >
                ECE Programme Details
              </Link>
              <Link
                to={departmentDetailPath("medical-laboratory-technology")}
                className="btn-secondary text-xs sm:text-sm"
              >
                MLT Programme Details
              </Link>
            </div>
          </section>
        </div>
      </section>
    </>
  );
}
