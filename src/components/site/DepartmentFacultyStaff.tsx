import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BookOpen,
  Download,
  ExternalLink,
  FileText,
  Mail,
  Phone,
  Quote,
  UserCheck,
  Users,
  Wrench,
} from "lucide-react";
import type {
  DepartmentFacultyMember,
  DepartmentFacultyStaff,
  TableSchemaType,
} from "@/lib/department-faculty-data";
import { departmentDetailPath } from "@/lib/departments-data";

interface Props {
  data: DepartmentFacultyStaff;
  idPrefix?: string;
  showProgrammeLink?: boolean;
}

function getInitials(name: string): string {
  return (
    name
      .replace(/^(Er\.|Ms\.|Mr\.|Dr\.)\s*/i, "")
      .split(" ")
      .map((part) => part[0])
      .filter(Boolean)
      .slice(0, 2)
      .join("")
      .toUpperCase() || "HD"
  );
}

/**
 * 4-item Department Navigation Bar across all departments with rich directory & syllabus
 */
export function DepartmentNavTabs({
  hasHodMessage,
  hasFaculty,
}: {
  hasHodMessage?: boolean;
  hasFaculty?: boolean;
}) {
  return (
    <nav
      aria-label="Department sections navigation"
      className="mt-5 rounded-2xl border border-border/80 bg-surface/90 p-2 shadow-soft backdrop-blur-xs"
    >
      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
        <a
          href="#about-department"
          className="inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs sm:text-sm font-semibold text-navy transition-colors hover:border-brand hover:bg-light-blue hover:text-brand"
        >
          <BookOpen className="size-4 text-brand" aria-hidden="true" />
          <span>About the Department</span>
        </a>

        {hasHodMessage ? (
          <a
            href="#hod-message"
            className="inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs sm:text-sm font-semibold text-navy transition-colors hover:border-brand hover:bg-light-blue hover:text-brand"
          >
            <Quote className="size-4 text-brand" aria-hidden="true" />
            <span>Message by HOD</span>
          </a>
        ) : null}

        {hasFaculty ? (
          <a
            href="#faculty-information"
            className="inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs sm:text-sm font-semibold text-navy transition-colors hover:border-brand hover:bg-light-blue hover:text-brand"
          >
            <Users className="size-4 text-brand" aria-hidden="true" />
            <span>Faculty Information</span>
          </a>
        ) : null}

        <a
          href="#syllabus-download"
          className="inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs sm:text-sm font-semibold text-navy transition-colors hover:border-brand hover:bg-light-blue hover:text-brand"
        >
          <Download className="size-4 text-brand" aria-hidden="true" />
          <span>Syllabus View/Download</span>
        </a>
      </div>
    </nav>
  );
}

/**
 * Message by Head of Department Section
 */
export function DepartmentHodMessageSection({ data }: Props) {
  const { hod, departmentName } = data;
  if (!hod.message) return null;

  const initials = getInitials(hod.name);

  return (
    <section
      id="hod-message"
      aria-labelledby="hod-message-heading"
      className="scroll-mt-24 space-y-4 pt-2"
    >
      <div className="border-b border-border/80 pb-3">
        <p className="text-[11px] font-semibold tracking-[0.14em] text-brand uppercase">
          Leadership Message
        </p>
        <h2
          id="hod-message-heading"
          className="mt-1 font-display text-[1.25rem] font-extrabold text-navy md:text-[1.375rem]"
        >
          Message by Head of Department
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Academic vision and welcome message for prospective and enrolled students of {departmentName}.
        </p>
      </div>

      <div className="rounded-2xl border border-brand/30 bg-surface p-5 sm:p-7 shadow-soft transition-all duration-200 hover:border-brand/50">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
          <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-brand/10 text-brand font-display font-extrabold text-xl">
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2.5">
              <h3 className="font-display text-lg font-bold text-navy sm:text-xl">
                {hod.name}
              </h3>
              <span className="inline-flex items-center rounded-full bg-brand/10 px-3 py-0.5 text-xs font-semibold text-brand">
                {hod.designation}
              </span>
            </div>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Department of {departmentName} · Government Polytechnic for Women, Srinagar
            </p>

            <blockquote className="mt-4 border-l-3 border-brand/50 pl-4 py-1 text-sm sm:text-base leading-relaxed text-text-primary italic">
              &ldquo;{hod.message}&rdquo;
            </blockquote>

            <div className="mt-5 flex flex-wrap items-center gap-3 pt-2 border-t border-border/60">
              <a
                href={`tel:${hod.contact.replace(/\s+/g, "")}`}
                className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-semibold text-navy transition-colors hover:border-brand hover:bg-light-blue hover:text-brand"
                title={`Call ${hod.name}`}
              >
                <Phone className="size-3.5 text-brand" aria-hidden="true" />
                <span>{hod.contact}</span>
              </a>
              {hod.email ? (
                <a
                  href={`mailto:${hod.email}`}
                  className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-semibold text-navy transition-colors hover:border-brand hover:bg-light-blue hover:text-brand"
                  title={`Email ${hod.name}`}
                >
                  <Mail className="size-3.5 text-brand" aria-hidden="true" />
                  <span>{hod.email}</span>
                </a>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * Dedicated Syllabus View / Download Section
 */
export function DepartmentSyllabusSection({ departmentName }: { departmentName: string }) {
  return (
    <section
      id="syllabus-download"
      aria-labelledby="syllabus-download-heading"
      className="scroll-mt-24 space-y-4 pt-2"
    >
      <div className="border-b border-border/80 pb-3">
        <p className="text-[11px] font-semibold tracking-[0.14em] text-brand uppercase">
          Curriculum &amp; Downloads
        </p>
        <h2
          id="syllabus-download-heading"
          className="mt-1 font-display text-[1.25rem] font-extrabold text-navy md:text-[1.375rem]"
        >
          Syllabus View / Download
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Official semester-wise curriculum schemes and board syllabus issued by JKBOTE for {departmentName}.
        </p>
      </div>

      <div className="rounded-2xl border border-border bg-surface p-5 sm:p-6 shadow-soft">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3.5">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-brand/10 text-brand">
              <FileText className="size-5" aria-hidden="true" />
            </div>
            <div>
              <h3 className="font-display text-base font-bold text-navy sm:text-lg">
                {departmentName} — 3-Year Diploma Syllabus
              </h3>
              <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
                Official JKBOTE scheme covering Semester 1 through Semester 6, course outcomes, practical evaluation guidelines and recommended reference books.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 sm:shrink-0">
            <a
              href="/downloads"
              className="btn-primary inline-flex items-center gap-2 text-xs sm:text-sm"
            >
              <Download className="size-4" aria-hidden="true" />
              <span>Download Syllabus</span>
            </a>
            <a
              href="https://admission.jkbote.ac.in"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary inline-flex items-center gap-1.5 text-xs sm:text-sm"
            >
              <span>JKBOTE Portal</span>
              <ExternalLink className="size-3.5 text-muted-foreground" aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * Desktop Table Header Configuration by Schema
 */
function renderTableHeader(schema: TableSchemaType) {
  switch (schema) {
    case "textile":
      return (
        <tr className="border-b border-border bg-muted/35 text-xs font-bold uppercase tracking-wider text-navy">
          <th scope="col" className="w-16 px-4 py-3.5 text-center">S.No.</th>
          <th scope="col" className="px-4 py-3.5 min-w-[180px]">Name</th>
          <th scope="col" className="px-4 py-3.5 min-w-[120px]">Experience</th>
          <th scope="col" className="px-4 py-3.5 min-w-[130px]">Designation</th>
          <th scope="col" className="px-4 py-3.5 min-w-[280px]">Specialization</th>
        </tr>
      );

    case "garment":
      return (
        <tr className="border-b border-border bg-muted/35 text-xs font-bold uppercase tracking-wider text-navy">
          <th scope="col" className="w-16 px-4 py-3.5 text-center">S.No.</th>
          <th scope="col" className="px-4 py-3.5 min-w-[180px]">Name</th>
          <th scope="col" className="px-4 py-3.5 min-w-[220px]">Qualification</th>
          <th scope="col" className="px-4 py-3.5 min-w-[120px]">Designation</th>
          <th scope="col" className="px-4 py-3.5 min-w-[280px]">Specialization</th>
          <th scope="col" className="px-4 py-3.5 min-w-[110px]">Experience</th>
        </tr>
      );

    case "tourism":
      return (
        <tr className="border-b border-border bg-muted/35 text-xs font-bold uppercase tracking-wider text-navy">
          <th scope="col" className="w-16 px-4 py-3.5 text-center">S.No.</th>
          <th scope="col" className="px-4 py-3.5 min-w-[190px]">Name</th>
          <th scope="col" className="px-4 py-3.5 min-w-[120px]">Designation</th>
          <th scope="col" className="px-4 py-3.5 min-w-[240px]">Qualification</th>
          <th scope="col" className="px-4 py-3.5 min-w-[280px]">Specialization</th>
          <th scope="col" className="px-4 py-3.5 min-w-[110px]">Experience</th>
        </tr>
      );

    case "food-tech":
      return (
        <tr className="border-b border-border bg-muted/35 text-xs font-bold uppercase tracking-wider text-navy">
          <th scope="col" className="w-16 px-4 py-3.5 text-center">S.No.</th>
          <th scope="col" className="px-4 py-3.5 min-w-[190px]">Name</th>
          <th scope="col" className="px-4 py-3.5 min-w-[120px]">Designation</th>
          <th scope="col" className="px-4 py-3.5 min-w-[260px]">Qualification</th>
          <th scope="col" className="px-4 py-3.5 min-w-[110px]">Experience</th>
        </tr>
      );

    case "omca":
      return (
        <tr className="border-b border-border bg-muted/35 text-xs font-bold uppercase tracking-wider text-navy">
          <th scope="col" className="w-16 px-4 py-3.5 text-center">S.No.</th>
          <th scope="col" className="px-4 py-3.5 min-w-[170px]">Name</th>
          <th scope="col" className="px-4 py-3.5 min-w-[120px]">Designation</th>
          <th scope="col" className="px-4 py-3.5 min-w-[210px]">Qualification</th>
          <th scope="col" className="px-4 py-3.5 min-w-[240px]">Specialisation</th>
          <th scope="col" className="px-4 py-3.5 min-w-[110px]">Experience</th>
        </tr>
      );

    case "cse":
    default:
      return (
        <tr className="border-b border-border bg-muted/35 text-xs font-bold uppercase tracking-wider text-navy">
          <th scope="col" className="w-16 px-4 py-3.5 text-center">S.No.</th>
          <th scope="col" className="px-4 py-3.5 min-w-[180px]">Faculty Name</th>
          <th scope="col" className="px-4 py-3.5 min-w-[110px]">Experience</th>
          <th scope="col" className="px-4 py-3.5 min-w-[130px]">Designation</th>
          <th scope="col" className="px-4 py-3.5 min-w-[280px]">Specialization</th>
        </tr>
      );
  }
}

/**
 * Desktop Table Row Configuration by Schema
 */
function renderTableRow(member: DepartmentFacultyMember, schema: TableSchemaType) {
  switch (schema) {
    case "textile":
      return (
        <tr key={member.sNo} className="transition-colors hover:bg-light-blue/40">
          <td className="px-4 py-3.5 text-center font-medium text-muted-foreground">{member.sNo}</td>
          <td className="px-4 py-3.5 font-bold text-navy">{member.name}</td>
          <td className="px-4 py-3.5 font-semibold text-brand">{member.experience}</td>
          <td className="px-4 py-3.5 font-medium text-navy">{member.designation}</td>
          <td className="px-4 py-3.5 text-xs sm:text-sm leading-relaxed text-muted-foreground">{member.specialization}</td>
        </tr>
      );

    case "garment":
      return (
        <tr key={member.sNo} className="transition-colors hover:bg-light-blue/40">
          <td className="px-4 py-3.5 text-center font-medium text-muted-foreground">{member.sNo}</td>
          <td className="px-4 py-3.5 font-bold text-navy">{member.name}</td>
          <td className="px-4 py-3.5 text-xs sm:text-sm text-text-primary">{member.qualification}</td>
          <td className="px-4 py-3.5 font-medium text-navy">{member.designation}</td>
          <td className="px-4 py-3.5 text-xs sm:text-sm leading-relaxed text-muted-foreground">{member.specialization}</td>
          <td className="px-4 py-3.5 font-semibold text-brand">{member.experience}</td>
        </tr>
      );

    case "tourism":
      return (
        <tr key={member.sNo} className="transition-colors hover:bg-light-blue/40">
          <td className="px-4 py-3.5 text-center font-medium text-muted-foreground">{member.sNo}</td>
          <td className="px-4 py-3.5 font-bold text-navy">{member.name}</td>
          <td className="px-4 py-3.5 font-medium text-navy">{member.designation}</td>
          <td className="px-4 py-3.5 text-xs sm:text-sm text-text-primary">{member.qualification}</td>
          <td className="px-4 py-3.5 text-xs sm:text-sm leading-relaxed text-muted-foreground">{member.specialization}</td>
          <td className="px-4 py-3.5 font-semibold text-brand">{member.experience}</td>
        </tr>
      );

    case "food-tech":
      return (
        <tr key={member.sNo} className="transition-colors hover:bg-light-blue/40">
          <td className="px-4 py-3.5 text-center font-medium text-muted-foreground">{member.sNo}</td>
          <td className="px-4 py-3.5 font-bold text-navy">{member.name}</td>
          <td className="px-4 py-3.5 font-medium text-navy">{member.designation}</td>
          <td className="px-4 py-3.5 text-xs sm:text-sm text-text-primary">{member.qualification}</td>
          <td className="px-4 py-3.5 font-semibold text-brand">{member.experience}</td>
        </tr>
      );

    case "omca":
      return (
        <tr key={member.sNo} className="transition-colors hover:bg-light-blue/40">
          <td className="px-4 py-3.5 text-center font-medium text-muted-foreground">{member.sNo}</td>
          <td className="px-4 py-3.5 font-bold text-navy">{member.name}</td>
          <td className="px-4 py-3.5 font-medium text-navy">{member.designation}</td>
          <td className="px-4 py-3.5 text-xs sm:text-sm text-text-primary">{member.qualification}</td>
          <td className="px-4 py-3.5 text-xs sm:text-sm leading-relaxed text-muted-foreground">{member.specialization}</td>
          <td className="px-4 py-3.5 font-semibold text-brand">{member.experience}</td>
        </tr>
      );

    case "cse":
    default:
      return (
        <tr key={member.sNo} className="transition-colors hover:bg-light-blue/40">
          <td className="px-4 py-3.5 text-center font-medium text-muted-foreground">{member.sNo}</td>
          <td className="px-4 py-3.5 font-bold text-navy">{member.name}</td>
          <td className="px-4 py-3.5 font-semibold text-brand">{member.experience}</td>
          <td className="px-4 py-3.5 font-medium text-navy">{member.designation}</td>
          <td className="px-4 py-3.5 text-xs sm:text-sm leading-relaxed text-muted-foreground">{member.specialization}</td>
        </tr>
      );
  }
}

/**
 * Mobile Card Layout Configuration by Schema
 */
function renderMobileCard(member: DepartmentFacultyMember, schema: TableSchemaType) {
  return (
    <div
      key={member.sNo}
      className="rounded-xl border border-border bg-surface p-4 shadow-soft transition-colors hover:bg-light-blue/20"
    >
      <div className="flex items-start justify-between gap-2 border-b border-border/60 pb-2.5">
        <div>
          <span className="text-[11px] font-semibold text-brand uppercase tracking-wider">
            #{member.sNo} · {member.designation}
          </span>
          <h4 className="font-display text-base font-bold text-navy">
            {member.name}
          </h4>
        </div>
        <span className="shrink-0 rounded-md bg-brand/10 px-2 py-0.5 text-xs font-semibold text-brand">
          {member.experience}
        </span>
      </div>
      <div className="mt-2.5 space-y-1.5">
        {member.qualification ? (
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Qualification
            </p>
            <p className="text-xs text-text-primary">{member.qualification}</p>
          </div>
        ) : null}
        {member.specialization ? (
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              {schema === "omca" ? "Specialisation" : "Specialization"}
            </p>
            <p className="text-xs leading-relaxed text-navy">
              {member.specialization}
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}

/**
 * Main Faculty & Staff Section with HOD, Faculty Table and Non-Teaching Staff
 */
export function DepartmentFacultyStaffSection({
  data,
  idPrefix,
  showProgrammeLink = false,
}: Props) {
  const { hod, faculty, nonTeachingStaff, departmentName, tableSchema, departmentSlug } = data;
  const initials = getInitials(hod.name);
  const sectionId = idPrefix ? `${idPrefix}-faculty-information` : "faculty-information";
  const headingId = idPrefix ? `${idPrefix}-heading` : "faculty-information-heading";

  return (
    <section
      id={sectionId}
      aria-labelledby={headingId}
      className="scroll-mt-24 space-y-6 pt-2"
    >
      {/* Anchor alias for in-page linking */}
      {!idPrefix ? <span id="faculty-staff" className="scroll-mt-24 block" aria-hidden="true" /> : null}

      {/* Main Section Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-border/80 pb-3">
        <div>
          <p className="text-[11px] font-semibold tracking-[0.14em] text-brand uppercase">
            {departmentName} Directory
          </p>
          <h2
            id={headingId}
            className="mt-1 font-display text-[1.25rem] font-extrabold text-navy md:text-[1.375rem]"
          >
            Faculty & Staff Information
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Head of Department, teaching faculty members and technical staff of {departmentName}.
          </p>
        </div>
        {showProgrammeLink ? (
          <Link
            to={departmentDetailPath(departmentSlug)}
            className="link-cta mt-2 sm:mt-0 w-fit shrink-0 text-xs sm:text-sm"
          >
            <span>View Programme</span>
            <ArrowRight className="size-3.5" aria-hidden="true" />
          </Link>
        ) : null}
      </div>

      {/* 1. Head of Department (HOD) Section */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <UserCheck className="size-4 text-brand" aria-hidden="true" />
          <h3 className="font-display text-base font-bold text-navy sm:text-lg">
            HOD Information
          </h3>
        </div>

        <div className="rounded-2xl border border-brand/25 bg-surface p-5 shadow-soft sm:p-6 transition-all duration-200 hover:border-brand/40 hover:shadow-md">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-brand/10 text-brand font-display font-extrabold text-lg">
                {initials}
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h4 className="font-display text-lg font-bold text-navy sm:text-xl">
                    {hod.name}
                  </h4>
                  <span className="inline-flex items-center rounded-full bg-brand/10 px-2.5 py-0.5 text-xs font-semibold text-brand">
                    {hod.designation}
                  </span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
                  Head of {departmentName} Department · Government Polytechnic for Women, Srinagar
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2 sm:pt-0 sm:shrink-0">
              <a
                href={`tel:${hod.contact.replace(/\s+/g, "")}`}
                className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3.5 py-2 text-xs sm:text-sm font-semibold text-navy transition-colors hover:border-brand hover:bg-light-blue hover:text-brand"
                title={`Call ${hod.name}`}
              >
                <Phone className="size-3.5 sm:size-4 text-brand" aria-hidden="true" />
                <span>{hod.contact}</span>
              </a>
              {hod.email ? (
                <a
                  href={`mailto:${hod.email}`}
                  className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3.5 py-2 text-xs sm:text-sm font-semibold text-navy transition-colors hover:border-brand hover:bg-light-blue hover:text-brand"
                  title={`Email ${hod.name}`}
                >
                  <Mail className="size-3.5 sm:size-4 text-brand" aria-hidden="true" />
                  <span>{hod.email}</span>
                </a>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Department Faculty Information Section */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="size-4 text-brand" aria-hidden="true" />
            <h3 className="font-display text-base font-bold text-navy sm:text-lg">
              Faculty Information
            </h3>
          </div>
          <span className="text-xs font-medium text-muted-foreground">
            {faculty.length} Faculty Members
          </span>
        </div>

        {/* Desktop and Tablet Table */}
        <div className="hidden md:block overflow-hidden rounded-xl border border-border bg-surface shadow-soft">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm">
              <thead>
                {renderTableHeader(tableSchema)}
              </thead>
              <tbody className="divide-y divide-border/70">
                {faculty.map((member) => renderTableRow(member, tableSchema))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile View: Responsive Cards to prevent awkward horizontal squeeze on mobile */}
        <div className="grid gap-3 md:hidden">
          {faculty.map((member) => renderMobileCard(member, tableSchema))}
        </div>
      </div>

      {/* 3. Non-Teaching Staff Section (Rendered only when nonTeachingStaff exists) */}
      {nonTeachingStaff && nonTeachingStaff.length > 0 ? (
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Wrench className="size-4 text-brand" aria-hidden="true" />
              <h3 className="font-display text-base font-bold text-navy sm:text-lg">
                Non-Teaching Staff
              </h3>
            </div>
            <span className="text-xs font-medium text-muted-foreground">
              {nonTeachingStaff.length} Staff Member
            </span>
          </div>

          {/* Desktop and Tablet Table */}
          <div className="hidden md:block overflow-hidden rounded-xl border border-border bg-surface shadow-soft">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/35 text-xs font-bold uppercase tracking-wider text-navy">
                    <th scope="col" className="w-16 px-4 py-3.5 text-center">
                      S.No.
                    </th>
                    <th scope="col" className="px-4 py-3.5 min-w-[200px]">
                      Name
                    </th>
                    <th scope="col" className="px-4 py-3.5 min-w-[130px]">
                      Experience
                    </th>
                    <th scope="col" className="px-4 py-3.5 min-w-[180px]">
                      Designation
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/70">
                  {nonTeachingStaff.map((staff) => (
                    <tr
                      key={staff.sNo}
                      className="transition-colors hover:bg-light-blue/40"
                    >
                      <td className="px-4 py-3.5 text-center font-medium text-muted-foreground">
                        {staff.sNo}
                      </td>
                      <td className="px-4 py-3.5 font-bold text-navy">
                        {staff.name}
                      </td>
                      <td className="px-4 py-3.5 font-semibold text-brand">
                        {staff.experience}
                      </td>
                      <td className="px-4 py-3.5 text-navy font-medium">
                        {staff.designation}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile View */}
          <div className="grid gap-3 md:hidden">
            {nonTeachingStaff.map((staff) => (
              <div
                key={staff.sNo}
                className="rounded-xl border border-border bg-surface p-4 shadow-soft transition-colors hover:bg-light-blue/20"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-semibold text-brand uppercase tracking-wider">
                      #{staff.sNo} · {staff.designation}
                    </span>
                    <h4 className="font-display text-base font-bold text-navy">
                      {staff.name}
                    </h4>
                  </div>
                  <span className="shrink-0 rounded-md bg-brand/10 px-2 py-0.5 text-xs font-semibold text-brand">
                    {staff.experience}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}
