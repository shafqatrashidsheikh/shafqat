import { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Award,
  BookOpen,
  Briefcase,
  Building2,
  Compass,
  Download,
  ExternalLink,
  FileText,
  Laptop,
  Layers,
  LayoutGrid,
  Mail,
  Phone,
  Quote,
  Shirt,
  Sparkles,
  Table2,
  UserCheck,
  Users,
  Utensils,
  Wrench,
} from "lucide-react";
import type {
  DepartmentFacultyMember,
  DepartmentFacultyStaff,
  NonTeachingStaffMember,
  TableSchemaType,
} from "@/lib/department-faculty-data";
import { departmentDetailPath } from "@/lib/departments-data";

interface Props {
  data: DepartmentFacultyStaff;
  idPrefix?: string;
  showProgrammeLink?: boolean;
  defaultView?: "profiles" | "table";
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
 * Returns an appropriate icon component for each academic department
 */
export function getDepartmentIcon(slug: string) {
  switch (slug) {
    case "food-technology":
      return Utensils;
    case "travel-tourism":
    case "travel-and-tourism":
      return Compass;
    case "garment-technology":
      return Shirt;
    case "textile-technology":
      return Layers;
    case "office-management-computer-applications":
    case "omca":
      return Briefcase;
    case "computer-engineering":
      return Laptop;
    default:
      return Building2;
  }
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
      className="mt-5 rounded-2xl border border-border/60 bg-white p-2 shadow-xs backdrop-blur-xs"
    >
      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
        <a
          href="#about-department"
          className="inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs sm:text-sm font-semibold text-navy transition-colors hover:bg-light-blue/60 hover:text-brand"
        >
          <BookOpen className="size-4 text-brand" aria-hidden="true" />
          <span>About the Department</span>
        </a>

        {hasHodMessage ? (
          <a
            href="#hod-message"
            className="inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs sm:text-sm font-semibold text-navy transition-colors hover:bg-light-blue/60 hover:text-brand"
          >
            <Quote className="size-4 text-brand" aria-hidden="true" />
            <span>Message by HOD</span>
          </a>
        ) : null}

        {hasFaculty ? (
          <a
            href="#faculty-information"
            className="inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs sm:text-sm font-semibold text-navy transition-colors hover:bg-light-blue/60 hover:text-brand"
          >
            <Users className="size-4 text-brand" aria-hidden="true" />
            <span>Faculty Information</span>
          </a>
        ) : null}

        <a
          href="#syllabus-download"
          className="inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs sm:text-sm font-semibold text-navy transition-colors hover:bg-light-blue/60 hover:text-brand"
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
      <div className="border-b border-border/40 pb-3">
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

      <div className="rounded-2xl border border-border/60 bg-white p-6 sm:p-7 shadow-xs hover:shadow-sm transition-all duration-200">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
          <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-light-blue text-brand font-display font-extrabold text-xl border border-brand/20 shadow-xs">
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2.5">
              <h3 className="font-display text-lg font-bold text-navy sm:text-xl">
                {hod.name}
              </h3>
              <span className="inline-flex items-center rounded-full bg-[#0B1E36] text-white px-3 py-0.5 text-xs font-semibold shadow-2xs">
                {hod.designation}
              </span>
            </div>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Department of {departmentName} · Government Polytechnic for Women, Srinagar
            </p>

            <blockquote className="mt-4 border-l-2 border-brand/40 pl-4 py-1 text-sm sm:text-base leading-relaxed text-text-primary italic">
              &ldquo;{hod.message}&rdquo;
            </blockquote>

            <div className="mt-5 flex flex-wrap items-center gap-3 pt-3 border-t border-border/40">
              <a
                href={`tel:${hod.contact.replace(/\s+/g, "")}`}
                className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-slate-50 px-4 py-2 text-xs font-semibold text-navy transition-all hover:border-brand/40 hover:bg-light-blue/40 hover:text-brand"
                title={`Call ${hod.name}`}
              >
                <Phone className="size-3.5 text-brand" aria-hidden="true" />
                <span>{hod.contact}</span>
              </a>
              {hod.email ? (
                <a
                  href={`mailto:${hod.email}`}
                  className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-slate-50 px-4 py-2 text-xs font-semibold text-navy transition-all hover:border-brand/40 hover:bg-light-blue/40 hover:text-brand"
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
      <div className="border-b border-border/40 pb-3">
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

      <div className="rounded-2xl border border-border/60 bg-white p-6 sm:p-7 shadow-xs">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3.5">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-light-blue text-brand border border-brand/20">
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
        <tr className="border-b border-border/60 bg-slate-50 text-xs font-bold uppercase tracking-wider text-navy">
          <th scope="col" className="w-16 px-4 py-3.5 text-center">S.No.</th>
          <th scope="col" className="px-4 py-3.5 min-w-[180px]">Name</th>
          <th scope="col" className="px-4 py-3.5 min-w-[120px]">Experience</th>
          <th scope="col" className="px-4 py-3.5 min-w-[130px]">Designation</th>
          <th scope="col" className="px-4 py-3.5 min-w-[280px]">Specialization</th>
        </tr>
      );

    case "garment":
      return (
        <tr className="border-b border-border/60 bg-slate-50 text-xs font-bold uppercase tracking-wider text-navy">
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
        <tr className="border-b border-border/60 bg-slate-50 text-xs font-bold uppercase tracking-wider text-navy">
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
        <tr className="border-b border-border/60 bg-slate-50 text-xs font-bold uppercase tracking-wider text-navy">
          <th scope="col" className="w-16 px-4 py-3.5 text-center">S.No.</th>
          <th scope="col" className="px-4 py-3.5 min-w-[190px]">Name</th>
          <th scope="col" className="px-4 py-3.5 min-w-[120px]">Designation</th>
          <th scope="col" className="px-4 py-3.5 min-w-[260px]">Qualification</th>
          <th scope="col" className="px-4 py-3.5 min-w-[110px]">Experience</th>
        </tr>
      );

    case "omca":
      return (
        <tr className="border-b border-border/60 bg-slate-50 text-xs font-bold uppercase tracking-wider text-navy">
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
        <tr className="border-b border-border/60 bg-slate-50 text-xs font-bold uppercase tracking-wider text-navy">
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
        <tr key={member.sNo} className="transition-colors hover:bg-light-blue/30">
          <td className="px-4 py-3.5 text-center font-medium text-muted-foreground">{member.sNo}</td>
          <td className="px-4 py-3.5 font-bold text-navy">{member.name}</td>
          <td className="px-4 py-3.5 font-semibold text-brand">{member.experience}</td>
          <td className="px-4 py-3.5 font-medium text-navy">{member.designation}</td>
          <td className="px-4 py-3.5 text-xs sm:text-sm leading-relaxed text-muted-foreground">{member.specialization}</td>
        </tr>
      );

    case "garment":
      return (
        <tr key={member.sNo} className="transition-colors hover:bg-light-blue/30">
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
        <tr key={member.sNo} className="transition-colors hover:bg-light-blue/30">
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
        <tr key={member.sNo} className="transition-colors hover:bg-light-blue/30">
          <td className="px-4 py-3.5 text-center font-medium text-muted-foreground">{member.sNo}</td>
          <td className="px-4 py-3.5 font-bold text-navy">{member.name}</td>
          <td className="px-4 py-3.5 font-medium text-navy">{member.designation}</td>
          <td className="px-4 py-3.5 text-xs sm:text-sm text-text-primary">{member.qualification}</td>
          <td className="px-4 py-3.5 font-semibold text-brand">{member.experience}</td>
        </tr>
      );

    case "omca":
      return (
        <tr key={member.sNo} className="transition-colors hover:bg-light-blue/30">
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
        <tr key={member.sNo} className="transition-colors hover:bg-light-blue/30">
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
      className="rounded-2xl border border-border/60 bg-white p-5 shadow-xs transition-colors hover:bg-light-blue/20"
    >
      <div className="flex items-start justify-between gap-2 border-b border-border/40 pb-3">
        <div>
          <span className="text-[11px] font-semibold text-brand uppercase tracking-wider">
            #{member.sNo} · {member.designation}
          </span>
          <h4 className="font-display text-base font-bold text-navy">
            {member.name}
          </h4>
        </div>
        <span className="shrink-0 rounded-full bg-light-blue px-2.5 py-0.5 text-xs font-semibold text-brand border border-brand/15">
          {member.experience}
        </span>
      </div>
      <div className="mt-3 space-y-2">
        {member.qualification ? (
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Qualification
            </p>
            <p className="text-xs font-medium text-navy/90">{member.qualification}</p>
          </div>
        ) : null}
        {member.specialization ? (
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              {schema === "omca" ? "Specialisation" : "Specialization"}
            </p>
            <p className="text-xs leading-relaxed text-slate-600">
              {member.specialization}
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}

/**
 * Faculty Profile Card - Clean, modern, accessible profile presentation matching reference image
 */
function FacultyProfileCard({
  member,
  departmentName,
  tableSchema,
}: {
  member: DepartmentFacultyMember;
  departmentName: string;
  tableSchema: TableSchemaType;
}) {
  const initials = getInitials(member.name);

  return (
    <article className="group flex flex-col justify-between rounded-2xl border border-border/60 bg-white p-6 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:border-brand/35 h-full">
      <div>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3.5 min-w-0">
            {member.profileImage ? (
              <img
                src={member.profileImage}
                alt={member.name}
                width={52}
                height={52}
                className="size-13 shrink-0 rounded-2xl object-cover border border-border/50 shadow-2xs"
                loading="lazy"
              />
            ) : (
              <div
                className="flex size-13 shrink-0 items-center justify-center rounded-2xl bg-light-blue text-brand font-display font-bold text-sm border border-brand/20 shadow-2xs"
                aria-hidden="true"
              >
                {initials}
              </div>
            )}
            <div className="min-w-0">
              <h4 className="font-display text-base font-bold text-navy leading-snug">
                {member.name}
              </h4>
              <p className="mt-0.5 text-xs sm:text-sm font-semibold text-brand truncate">
                {member.designation}
              </p>
              <p className="mt-0.5 text-[11px] font-medium text-muted-foreground truncate">
                {departmentName}
              </p>
            </div>
          </div>

          <span className="shrink-0 inline-flex items-center gap-1 rounded-full bg-light-blue px-2.5 py-1 text-[11px] font-semibold text-brand border border-brand/15">
            <Award className="size-3 text-brand" aria-hidden="true" />
            <span>{member.experience}</span>
          </span>
        </div>

        {(member.qualification || member.specialization) && (
          <div className="mt-5 space-y-2.5 border-t border-border/40 pt-4 text-xs leading-relaxed">
            {member.qualification ? (
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Qualification
                </span>
                <span className="font-medium text-navy/90">
                  {member.qualification}
                </span>
              </div>
            ) : null}
            {member.specialization ? (
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  {tableSchema === "omca" ? "Specialisation" : "Specialization"}
                </span>
                <span className="font-normal text-slate-600 line-clamp-3">
                  {member.specialization}
                </span>
              </div>
            ) : null}
          </div>
        )}
      </div>
    </article>
  );
}

/**
 * Non-Teaching Staff Profile Card
 */
function NonTeachingStaffCard({
  staff,
  departmentName,
}: {
  staff: NonTeachingStaffMember;
  departmentName: string;
}) {
  const initials = getInitials(staff.name);

  return (
    <article className="flex items-center justify-between gap-4 rounded-2xl border border-border/60 bg-white p-5 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:border-brand/35">
      <div className="flex items-center gap-3.5 min-w-0">
        {staff.profileImage ? (
          <img
            src={staff.profileImage}
            alt={staff.name}
            width={48}
            height={48}
            className="size-12 shrink-0 rounded-2xl object-cover border border-border/50"
            loading="lazy"
          />
        ) : (
          <div
            className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-light-blue text-brand font-display font-bold text-xs border border-brand/20"
            aria-hidden="true"
          >
            {initials}
          </div>
        )}
        <div className="min-w-0">
          <h4 className="font-display text-base font-bold text-navy truncate">
            {staff.name}
          </h4>
          <p className="text-xs sm:text-sm font-semibold text-brand truncate">
            {staff.designation}
          </p>
          <p className="text-[11px] text-muted-foreground truncate">
            {departmentName}
          </p>
        </div>
      </div>
      <span className="shrink-0 inline-flex items-center gap-1 rounded-full bg-light-blue px-2.5 py-1 text-[11px] font-semibold text-brand border border-brand/15">
        <Award className="size-3 text-brand" aria-hidden="true" />
        <span>{staff.experience}</span>
      </span>
    </article>
  );
}

/**
 * Main Faculty & Staff Section with Header Strip, HOD Card, Faculty Profiles/Table, and Non-Teaching Staff
 */
export function DepartmentFacultyStaffSection({
  data,
  idPrefix,
  showProgrammeLink = false,
  defaultView = "profiles",
}: Props) {
  const { hod, faculty, nonTeachingStaff, departmentName, tableSchema, departmentSlug } = data;
  const initials = getInitials(hod.name);
  const sectionId = idPrefix ? `${idPrefix}-faculty-information` : "faculty-information";
  const headingId = idPrefix ? `${idPrefix}-heading` : "faculty-information-heading";
  const [viewMode, setViewMode] = useState<"profiles" | "table">(defaultView);
  const DeptIcon = getDepartmentIcon(departmentSlug);

  return (
    <section
      id={sectionId}
      aria-labelledby={headingId}
      className="scroll-mt-24 space-y-6 pt-2"
    >
      {/* Anchor alias for in-page linking */}
      {!idPrefix ? <span id="faculty-staff" className="scroll-mt-24 block" aria-hidden="true" /> : null}

      {/* 0. Department Header Strip - Dark navy-blue header strip following reference design */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0B1E36] via-[#102A4C] to-[#0B1E36] text-white p-4 sm:p-5 shadow-sm border border-[#0B1E36]">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="flex size-12 sm:size-13 shrink-0 items-center justify-center rounded-xl bg-white/10 text-white border border-white/15 shadow-inner">
              <DeptIcon className="size-6 text-white" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-semibold tracking-wider uppercase text-light-blue/80">
                  Academic Department
                </span>
              </div>
              <h3
                id={headingId}
                className="font-display text-xl sm:text-2xl font-bold text-white tracking-tight truncate"
              >
                {departmentName}
              </h3>
            </div>
          </div>

          {showProgrammeLink ? (
            <Link
              to={departmentDetailPath(departmentSlug)}
              className="inline-flex items-center gap-2 rounded-xl bg-white/10 hover:bg-white text-white hover:text-navy px-4 py-2 text-xs sm:text-sm font-semibold transition-all border border-white/20 shadow-xs self-start sm:self-auto shrink-0"
            >
              <span>View Programme</span>
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3.5 py-1 text-xs font-medium text-white/90 border border-white/15 self-start sm:self-auto shrink-0">
              <Users className="size-3.5" aria-hidden="true" />
              <span>{faculty.length} Teaching Faculty</span>
            </span>
          )}
        </div>
      </div>

      {/* 1. Head of Department (HOD) Section */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <UserCheck className="size-4 text-brand" aria-hidden="true" />
          <h4 className="font-display text-base font-bold text-navy sm:text-lg">
            Head of Department
          </h4>
        </div>

        <div className="rounded-2xl border border-border/60 bg-white p-6 sm:p-7 shadow-xs hover:shadow-sm transition-all duration-200">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div className="flex items-start sm:items-center gap-4 sm:gap-5">
              {hod.profileImage ? (
                <img
                  src={hod.profileImage}
                  alt={hod.name}
                  width={80}
                  height={80}
                  className="size-16 sm:size-20 shrink-0 rounded-2xl object-cover border border-border/60 shadow-xs"
                  loading="lazy"
                />
              ) : (
                <div className="flex size-16 sm:size-20 shrink-0 items-center justify-center rounded-2xl bg-light-blue text-brand font-display font-extrabold text-xl sm:text-2xl border border-brand/20 shadow-xs">
                  {initials}
                </div>
              )}

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h4 className="font-display text-lg sm:text-xl font-bold text-navy">
                    {hod.name}
                  </h4>
                  <span className="inline-flex items-center rounded-full bg-[#0B1E36] text-white px-3 py-0.5 text-xs font-semibold shadow-2xs">
                    Head of Department
                  </span>
                </div>
                <p className="mt-1 text-xs sm:text-sm font-semibold text-brand">
                  {hod.designation}
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Department of {departmentName} · Government Polytechnic for Women, Srinagar
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 pt-1 md:pt-0 shrink-0">
              <a
                href={`tel:${hod.contact.replace(/\s+/g, "")}`}
                className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-slate-50 px-4 py-2 text-xs sm:text-sm font-semibold text-navy transition-all hover:border-brand/40 hover:bg-light-blue/50 hover:text-brand"
                title={`Call ${hod.name}`}
              >
                <Phone className="size-3.5 sm:size-4 text-brand" aria-hidden="true" />
                <span>{hod.contact}</span>
              </a>
              {hod.email ? (
                <a
                  href={`mailto:${hod.email}`}
                  className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-slate-50 px-4 py-2 text-xs sm:text-sm font-semibold text-navy transition-all hover:border-brand/40 hover:bg-light-blue/50 hover:text-brand"
                  title={`Email ${hod.name}`}
                >
                  <Mail className="size-3.5 sm:size-4 text-brand" aria-hidden="true" />
                  <span>{hod.email}</span>
                </a>
              ) : null}
            </div>
          </div>

          {hod.message ? (
            <div className="mt-4 pt-4 border-t border-border/40">
              <blockquote className="border-l-2 border-brand/40 pl-3.5 py-0.5 text-xs sm:text-sm leading-relaxed text-slate-700 italic">
                &ldquo;{hod.message}&rdquo;
              </blockquote>
            </div>
          ) : null}
        </div>
      </div>

      {/* 2. Department Faculty Information Section */}
      <div className="space-y-4 pt-2">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <Users className="size-4 text-brand" aria-hidden="true" />
            <h4 className="font-display text-base font-bold text-navy sm:text-lg">
              Faculty Members
            </h4>
            <span className="rounded-full bg-light-blue px-2.5 py-0.5 text-xs font-semibold text-brand">
              {faculty.length} {faculty.length === 1 ? "Member" : "Members"}
            </span>
          </div>

          {/* Clean View Mode Toggle */}
          <div className="flex items-center gap-1 rounded-xl border border-border/60 bg-white p-1 self-start sm:self-auto shadow-2xs">
            <button
              type="button"
              onClick={() => setViewMode("profiles")}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                viewMode === "profiles"
                  ? "bg-[#0B1E36] text-white shadow-xs"
                  : "text-slate-600 hover:text-navy hover:bg-slate-50"
              }`}
              title="Profile Cards Layout"
            >
              <LayoutGrid className="size-3.5" aria-hidden="true" />
              <span>Profiles</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("table")}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                viewMode === "table"
                  ? "bg-[#0B1E36] text-white shadow-xs"
                  : "text-slate-600 hover:text-navy hover:bg-slate-50"
              }`}
              title="Table Layout"
            >
              <Table2 className="size-3.5" aria-hidden="true" />
              <span>Table</span>
            </button>
          </div>
        </div>

        {viewMode === "profiles" ? (
          /* Profile Cards Layout */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {faculty.map((member) => (
              <FacultyProfileCard
                key={member.sNo}
                member={member}
                departmentName={departmentName}
                tableSchema={tableSchema}
              />
            ))}
          </div>
        ) : (
          /* Table Layout */
          <>
            <div className="hidden md:block overflow-hidden rounded-2xl border border-border/60 bg-white shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left text-sm">
                  <thead>
                    {renderTableHeader(tableSchema)}
                  </thead>
                  <tbody className="divide-y divide-border/40">
                    {faculty.map((member) => renderTableRow(member, tableSchema))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="grid gap-3.5 md:hidden">
              {faculty.map((member) => renderMobileCard(member, tableSchema))}
            </div>
          </>
        )}
      </div>

      {/* 3. Non-Teaching Staff Section */}
      {nonTeachingStaff && nonTeachingStaff.length > 0 ? (
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Wrench className="size-4 text-brand" aria-hidden="true" />
              <h4 className="font-display text-base font-bold text-navy sm:text-lg">
                Non-Teaching Staff
              </h4>
              <span className="rounded-full bg-light-blue px-2.5 py-0.5 text-xs font-semibold text-brand">
                {nonTeachingStaff.length} {nonTeachingStaff.length === 1 ? "Member" : "Members"}
              </span>
            </div>
          </div>

          {viewMode === "profiles" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {nonTeachingStaff.map((staff) => (
                <NonTeachingStaffCard
                  key={staff.sNo}
                  staff={staff}
                  departmentName={departmentName}
                />
              ))}
            </div>
          ) : (
            <>
              <div className="hidden md:block overflow-hidden rounded-2xl border border-border/60 bg-white shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-left text-sm">
                    <thead>
                      <tr className="border-b border-border/60 bg-slate-50 text-xs font-bold uppercase tracking-wider text-navy">
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
                    <tbody className="divide-y divide-border/40">
                      {nonTeachingStaff.map((staff) => (
                        <tr
                          key={staff.sNo}
                          className="transition-colors hover:bg-light-blue/20"
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

              <div className="grid gap-3 md:hidden">
                {nonTeachingStaff.map((staff) => (
                  <div
                    key={staff.sNo}
                    className="rounded-2xl border border-border/50 bg-white p-5 shadow-xs transition-colors hover:bg-light-blue/20"
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
                      <span className="shrink-0 rounded-full bg-light-blue px-2.5 py-0.5 text-xs font-semibold text-brand border border-brand/15">
                        {staff.experience}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      ) : null}
    </section>
  );
}
