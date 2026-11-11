import { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Award,
  BookOpen,
  Briefcase,
  Building2,
  ChefHat,
  Code,
  Download,
  ExternalLink,
  FileText,
  Layers,
  LayoutGrid,
  Mail,
  Monitor,
  Phone,
  Plane,
  Quote,
  Shirt,
  Table2,
  User,
  UserCheck,
  Users,
  Wrench,
} from "lucide-react";
import type {
  DepartmentFacultyMember,
  DepartmentFacultyStaff,
  NonTeachingStaffMember,
  TableSchemaType,
} from "@/lib/department-faculty-data";
import { departmentDetailPath } from "@/lib/departments-data";
import { CAMPUS_IMAGES } from "@/lib/campus-images";

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
 * Returns an appropriate icon component matching the reference design for each department
 */
export function getDepartmentIcon(slug: string) {
  switch (slug) {
    case "food-technology":
      return ChefHat;
    case "travel-tourism":
    case "travel-and-tourism":
      return Plane;
    case "garment-technology":
      return Shirt;
    case "textile-technology":
      return Layers;
    case "office-management-computer-applications":
    case "omca":
      return Monitor;
    case "computer-engineering":
      return Code;
    default:
      return Building2;
  }
}

/**
 * Returns the subject-specific laboratory, equipment, or campus visual banner image for each department
 */
export function getDepartmentBannerImage(slug: string): string {
  switch (slug) {
    case "food-technology":
      // Food science, laboratory equipment, grains, food testing
      return CAMPUS_IMAGES.microscopeLab;
    case "travel-tourism":
    case "travel-and-tourism":
      // Tourism, travel, mountains and hospitality
      return CAMPUS_IMAGES.summer;
    case "garment-technology":
      // Garment designing, workshop and textiles
      return CAMPUS_IMAGES.placementCareerGuidance;
    case "textile-technology":
      // Textile manufacturing, fabrics, weaving and skill development
      return CAMPUS_IMAGES.skillSignage;
    case "office-management-computer-applications":
    case "omca":
      // Office management, computers and administration workstations
      return CAMPUS_IMAGES.libraryStudyTable;
    case "computer-engineering":
      // Computers, coding, programming and technology lab
      return CAMPUS_IMAGES.computerLab;
    default:
      return CAMPUS_IMAGES.collegeHero;
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
      className="mt-5 rounded-2xl border border-slate-200/80 bg-white p-2 shadow-xs backdrop-blur-xs"
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
      <div className="border-b border-slate-200/60 pb-3">
        <p className="text-[11px] font-semibold tracking-[0.14em] text-brand uppercase">
          Leadership Message
        </p>
        <h2
          id="hod-message-heading"
          className="mt-1 font-display text-[1.25rem] font-extrabold text-[#0B1E36] md:text-[1.375rem]"
        >
          Message by Head of Department
        </h2>
        <p className="mt-1 text-sm text-slate-700">
          Academic vision and welcome message for prospective and enrolled students of {departmentName}.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 sm:p-7 shadow-xs hover:shadow-sm transition-all duration-200">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
          {hod.profileImage ? (
            <img
              src={hod.profileImage}
              alt={hod.name}
              width={56}
              height={56}
              className="size-14 shrink-0 rounded-2xl object-cover object-top border border-amber-300/80 shadow-xs"
              loading="lazy"
            />
          ) : (
            <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-light-blue text-brand font-display font-extrabold text-xl border border-brand/20 shadow-xs">
              {initials}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2.5">
              <h3 className="font-display text-lg font-bold text-[#0B1E36] sm:text-xl">
                {hod.name}
              </h3>
              <span className="inline-flex items-center rounded-full bg-purple-100 text-purple-700 px-3 py-0.5 text-xs font-semibold shadow-2xs">
                {hod.designation}
              </span>
            </div>
            <p className="mt-0.5 text-xs font-medium text-slate-700">
              Department of {departmentName} · Government Polytechnic for Women, Srinagar
            </p>

            <blockquote className="mt-4 border-l-2 border-brand/40 pl-4 py-1 text-sm sm:text-base leading-relaxed text-slate-800 italic">
              &ldquo;{hod.message}&rdquo;
            </blockquote>

            <div className="mt-5 flex flex-wrap items-center gap-3 pt-3 border-t border-slate-100">
              {hod.contact ? (
                <a
                  href={`tel:${hod.contact.replace(/\s+/g, "")}`}
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-bold text-[#0B1E36] transition-all hover:border-brand/40 hover:bg-light-blue/40 hover:text-brand"
                  title={`Call ${hod.name}`}
                >
                  <Phone className="size-3.5 text-[#0B1E36]" aria-hidden="true" />
                  <span>{hod.contact}</span>
                </a>
              ) : null}
              {hod.email ? (
                <a
                  href={`mailto:${hod.email}`}
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-bold text-[#0B1E36] transition-all hover:border-brand/40 hover:bg-light-blue/40 hover:text-brand"
                  title={`Email ${hod.name}`}
                >
                  <Mail className="size-3.5 text-[#0B1E36]" aria-hidden="true" />
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
      <div className="border-b border-slate-200/60 pb-3">
        <p className="text-[11px] font-semibold tracking-[0.14em] text-brand uppercase">
          Curriculum &amp; Downloads
        </p>
        <h2
          id="syllabus-download-heading"
          className="mt-1 font-display text-[1.25rem] font-extrabold text-[#0B1E36] md:text-[1.375rem]"
        >
          Syllabus View / Download
        </h2>
        <p className="mt-1 text-sm text-slate-700">
          Official semester-wise curriculum schemes and board syllabus issued by JKBOTE for {departmentName}.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 sm:p-7 shadow-xs">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3.5">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-light-blue text-brand border border-brand/20">
              <FileText className="size-5" aria-hidden="true" />
            </div>
            <div>
              <h3 className="font-display text-base font-bold text-[#0B1E36] sm:text-lg">
                {departmentName} — 3-Year Diploma Syllabus
              </h3>
              <p className="mt-1 text-xs sm:text-sm text-slate-700">
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
        <tr className="border-b border-slate-200 bg-slate-50 text-xs font-bold uppercase tracking-wider text-[#0B1E36]">
          <th scope="col" className="w-16 px-4 py-3.5 text-center">S.No.</th>
          <th scope="col" className="px-4 py-3.5 min-w-[180px]">Name</th>
          <th scope="col" className="px-4 py-3.5 min-w-[120px]">Experience</th>
          <th scope="col" className="px-4 py-3.5 min-w-[130px]">Designation</th>
          <th scope="col" className="px-4 py-3.5 min-w-[280px]">Specialization</th>
        </tr>
      );

    case "garment":
      return (
        <tr className="border-b border-slate-200 bg-slate-50 text-xs font-bold uppercase tracking-wider text-[#0B1E36]">
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
        <tr className="border-b border-slate-200 bg-slate-50 text-xs font-bold uppercase tracking-wider text-[#0B1E36]">
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
        <tr className="border-b border-slate-200 bg-slate-50 text-xs font-bold uppercase tracking-wider text-[#0B1E36]">
          <th scope="col" className="w-16 px-4 py-3.5 text-center">S.No.</th>
          <th scope="col" className="px-4 py-3.5 min-w-[190px]">Name</th>
          <th scope="col" className="px-4 py-3.5 min-w-[120px]">Designation</th>
          <th scope="col" className="px-4 py-3.5 min-w-[260px]">Qualification</th>
          <th scope="col" className="px-4 py-3.5 min-w-[110px]">Experience</th>
        </tr>
      );

    case "omca":
      return (
        <tr className="border-b border-slate-200 bg-slate-50 text-xs font-bold uppercase tracking-wider text-[#0B1E36]">
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
        <tr className="border-b border-slate-200 bg-slate-50 text-xs font-bold uppercase tracking-wider text-[#0B1E36]">
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
          <td className="px-4 py-3.5 text-center font-bold text-slate-700">{member.sNo}</td>
          <td className="px-4 py-3.5 font-extrabold text-[#0B1E36]">{member.name}</td>
          <td className="px-4 py-3.5 font-bold text-brand">{member.experience}</td>
          <td className="px-4 py-3.5 font-semibold text-slate-800">{member.designation}</td>
          <td className="px-4 py-3.5 text-xs sm:text-sm leading-relaxed text-slate-800">{member.specialization}</td>
        </tr>
      );

    case "garment":
      return (
        <tr key={member.sNo} className="transition-colors hover:bg-light-blue/30">
          <td className="px-4 py-3.5 text-center font-bold text-slate-700">{member.sNo}</td>
          <td className="px-4 py-3.5 font-extrabold text-[#0B1E36]">{member.name}</td>
          <td className="px-4 py-3.5 text-xs sm:text-sm font-semibold text-slate-900">{member.qualification}</td>
          <td className="px-4 py-3.5 font-semibold text-slate-800">{member.designation}</td>
          <td className="px-4 py-3.5 text-xs sm:text-sm leading-relaxed text-slate-800">{member.specialization}</td>
          <td className="px-4 py-3.5 font-bold text-brand">{member.experience}</td>
        </tr>
      );

    case "tourism":
      return (
        <tr key={member.sNo} className="transition-colors hover:bg-light-blue/30">
          <td className="px-4 py-3.5 text-center font-bold text-slate-700">{member.sNo}</td>
          <td className="px-4 py-3.5 font-extrabold text-[#0B1E36]">{member.name}</td>
          <td className="px-4 py-3.5 font-semibold text-slate-800">{member.designation}</td>
          <td className="px-4 py-3.5 text-xs sm:text-sm font-semibold text-slate-900">{member.qualification}</td>
          <td className="px-4 py-3.5 text-xs sm:text-sm leading-relaxed text-slate-800">{member.specialization}</td>
          <td className="px-4 py-3.5 font-bold text-brand">{member.experience}</td>
        </tr>
      );

    case "food-tech":
      return (
        <tr key={member.sNo} className="transition-colors hover:bg-light-blue/30">
          <td className="px-4 py-3.5 text-center font-bold text-slate-700">{member.sNo}</td>
          <td className="px-4 py-3.5 font-extrabold text-[#0B1E36]">{member.name}</td>
          <td className="px-4 py-3.5 font-semibold text-slate-800">{member.designation}</td>
          <td className="px-4 py-3.5 text-xs sm:text-sm font-semibold text-slate-900">{member.qualification}</td>
          <td className="px-4 py-3.5 font-bold text-brand">{member.experience}</td>
        </tr>
      );

    case "omca":
      return (
        <tr key={member.sNo} className="transition-colors hover:bg-light-blue/30">
          <td className="px-4 py-3.5 text-center font-bold text-slate-700">{member.sNo}</td>
          <td className="px-4 py-3.5 font-extrabold text-[#0B1E36]">{member.name}</td>
          <td className="px-4 py-3.5 font-semibold text-slate-800">{member.designation}</td>
          <td className="px-4 py-3.5 text-xs sm:text-sm font-semibold text-slate-900">{member.qualification}</td>
          <td className="px-4 py-3.5 text-xs sm:text-sm leading-relaxed text-slate-800">{member.specialization}</td>
          <td className="px-4 py-3.5 font-bold text-brand">{member.experience}</td>
        </tr>
      );

    case "cse":
    default:
      return (
        <tr key={member.sNo} className="transition-colors hover:bg-light-blue/30">
          <td className="px-4 py-3.5 text-center font-bold text-slate-700">{member.sNo}</td>
          <td className="px-4 py-3.5 font-extrabold text-[#0B1E36]">{member.name}</td>
          <td className="px-4 py-3.5 font-bold text-brand">{member.experience}</td>
          <td className="px-4 py-3.5 font-semibold text-slate-800">{member.designation}</td>
          <td className="px-4 py-3.5 text-xs sm:text-sm leading-relaxed text-slate-800">{member.specialization}</td>
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
      className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs transition-colors hover:bg-light-blue/20"
    >
      <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-3">
        <div>
          <span className="text-[11px] font-bold text-brand uppercase tracking-wider">
            #{member.sNo} · {member.designation}
          </span>
          <h4 className="font-display text-base font-extrabold text-[#0B1E36]">
            {member.name}
          </h4>
        </div>
        <span className="shrink-0 rounded-full bg-blue-50 text-blue-700 border border-blue-200/60 px-2.5 py-0.5 text-xs font-bold">
          {member.experience}
        </span>
      </div>
      <div className="mt-3 space-y-2">
        {member.qualification ? (
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-800">
              Qualification
            </p>
            <p className="text-xs font-semibold text-slate-900">{member.qualification}</p>
          </div>
        ) : null}
        {member.specialization ? (
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-800">
              {schema === "omca" ? "Specialisation" : "Specialization"}
            </p>
            <p className="text-xs font-medium leading-relaxed text-slate-800">
              {member.specialization}
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}

/**
 * Faculty Profile Card - Matches reference image with blue circular avatar silhouette and dark, prominent typography
 */
function FacultyProfileCard({
  member,
  departmentName: _departmentName,
  tableSchema,
}: {
  member: DepartmentFacultyMember;
  departmentName: string;
  tableSchema: TableSchemaType;
}) {
  return (
    <article className="group flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-4 sm:p-4.5 shadow-2xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 h-full">
      <div>
        {/* Top: Avatar/Placeholder on left, Experience Badge on right */}
        <div className="flex items-start justify-between gap-2">
          {member.profileImage ? (
            <img
              src={member.profileImage}
              alt={member.name}
              width={44}
              height={44}
              className="size-10 sm:size-11 shrink-0 rounded-full object-cover border border-slate-200 shadow-2xs"
              loading="lazy"
            />
          ) : (
            <div
              className="size-10 sm:size-11 shrink-0 rounded-full bg-blue-100/90 text-blue-600 flex items-center justify-center border border-blue-200/50 shadow-2xs"
              aria-hidden="true"
            >
              <User className="size-5 sm:size-6 text-blue-600" />
            </div>
          )}

          <span className="shrink-0 inline-flex items-center gap-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200/60 px-2 py-0.5 text-[10px] sm:text-[11px] font-bold">
            <Briefcase className="size-2.5 sm:size-3 text-blue-600" aria-hidden="true" />
            <span>{member.experience}</span>
          </span>
        </div>

        {/* Name and Designation */}
        <div className="mt-3">
          <h5
            className="font-display text-sm sm:text-base font-extrabold text-[#0B1E36] leading-snug line-clamp-1"
            title={member.name}
          >
            {member.name}
          </h5>
          <p className="text-xs font-semibold text-slate-800 mt-0.5 leading-tight truncate">
            {member.designation}
          </p>
        </div>

        {/* Qualification & Specialization with high-contrast text */}
        <div className="mt-3 border-t border-slate-100 pt-2.5 space-y-2 text-xs">
          <div>
            <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-800">
              Qualification:
            </span>
            <p className="font-semibold text-slate-900 mt-0.5 leading-snug text-xs line-clamp-2">
              {member.qualification || "—"}
            </p>
          </div>

          <div>
            <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-800">
              {tableSchema === "omca" ? "Specialisation:" : "Specialization:"}
            </span>
            <p className="text-slate-800 font-medium mt-0.5 leading-snug text-xs line-clamp-3">
              {member.specialization || "—"}
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}

/**
 * Non-Teaching Staff Profile Card
 */
function NonTeachingStaffCard({
  staff,
  departmentName: _departmentName,
}: {
  staff: NonTeachingStaffMember;
  departmentName: string;
}) {
  return (
    <article className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200/90 bg-white p-4 sm:p-5 shadow-2xs transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-center gap-3.5 min-w-0">
        {staff.profileImage ? (
          <img
            src={staff.profileImage}
            alt={staff.name}
            width={44}
            height={44}
            className="size-11 shrink-0 rounded-full object-cover border border-slate-200"
            loading="lazy"
          />
        ) : (
          <div
            className="flex size-11 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600 border border-blue-200/60"
            aria-hidden="true"
          >
            <User className="size-5 text-blue-600" />
          </div>
        )}
        <div className="min-w-0">
          <h5 className="font-display text-sm sm:text-base font-extrabold text-[#0B1E36] truncate">
            {staff.name}
          </h5>
          <p className="text-xs font-semibold text-slate-800 truncate">
            {staff.designation}
          </p>
        </div>
      </div>
      <span className="shrink-0 inline-flex items-center gap-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200/60 px-2.5 py-0.5 text-[11px] font-bold">
        <Award className="size-3 text-blue-600" aria-hidden="true" />
        <span>{staff.experience}</span>
      </span>
    </article>
  );
}

/**
 * Main Faculty & Staff Section matching the exact reference screenshot:
 * - Top Navy Header Strip with Icon, Department Name, Purple Accent Slash, View Programme link
 * - HOD Profile Card with photo/placeholder + purple badge + prominent name & contact details
 * - Right-side Department Subject Visual Banner with curved smooth mask
 * - Faculty Members Header + Profiles/Table Toggle
 * - 5-column responsive grid with dark, high-contrast, prominent text
 */
export function DepartmentFacultyStaffSection({
  data,
  idPrefix,
  showProgrammeLink = true,
  defaultView = "profiles",
}: Props) {
  const { hod, faculty, nonTeachingStaff, departmentName, tableSchema, departmentSlug } = data;
  const sectionId = idPrefix ? `${idPrefix}-faculty-information` : "faculty-information";
  const headingId = idPrefix ? `${idPrefix}-heading` : "faculty-information-heading";
  const [viewMode, setViewMode] = useState<"profiles" | "table">(defaultView);
  const DeptIcon = getDepartmentIcon(departmentSlug);
  const bannerImage = getDepartmentBannerImage(departmentSlug);

  return (
    <section
      id={sectionId}
      aria-labelledby={headingId}
      className="scroll-mt-24 space-y-6 pt-2"
    >
      {/* Anchor alias for in-page linking */}
      {!idPrefix ? <span id="faculty-staff" className="scroll-mt-24 block" aria-hidden="true" /> : null}

      {/* Main Department Card Container */}
      <div className="overflow-hidden rounded-3xl border border-slate-200/90 bg-white shadow-sm">
        {/* 1. Dark Navy-Blue Header Strip */}
        <div className="bg-[#0B1E36] text-white px-5 sm:px-7 py-3.5 sm:py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <DeptIcon className="size-5 sm:size-6 text-white shrink-0" aria-hidden="true" />
            <h3
              id={headingId}
              className="font-display text-lg sm:text-xl md:text-2xl font-bold text-white tracking-tight truncate"
            >
              {departmentName}
            </h3>
            {/* Angled purple accent stripe matching reference screenshot */}
            <div className="h-5 w-1.5 rotate-12 rounded-full bg-purple-500 mx-1 shrink-0" aria-hidden="true" />
          </div>

          {showProgrammeLink ? (
            <Link
              to={departmentDetailPath(departmentSlug)}
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-white/90 hover:text-white transition-colors shrink-0"
            >
              <span>View Programme</span>
              <ArrowRight className="size-3.5 sm:size-4" aria-hidden="true" />
            </Link>
          ) : (
            <span className="text-xs text-white/80 font-medium shrink-0">
              {faculty.length} Faculty Members
            </span>
          )}
        </div>

        {/* 2. HOD Profile Section + Right-Side Department Visual Banner */}
        <div className="p-5 sm:p-7 border-b border-slate-100">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            {/* Left: HOD Image + Information */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-5 min-w-0">
              {/* HOD Photograph or Placeholder with identical dimensions */}
              {hod.profileImage ? (
                <img
                  src={hod.profileImage}
                  alt={hod.name}
                  width={120}
                  height={150}
                  className="w-28 sm:w-32 h-36 sm:h-40 shrink-0 rounded-2xl object-cover object-top border-2 border-amber-300/80 shadow-xs"
                  loading="lazy"
                />
              ) : (
                <div
                  className="w-28 sm:w-32 h-36 sm:h-40 shrink-0 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 border-2 border-slate-300/80 shadow-xs flex flex-col items-center justify-center p-3 text-center"
                  title="HOD Photograph Placeholder"
                >
                  <div className="size-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mb-1">
                    <User className="size-6 text-blue-600" />
                  </div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    Photo
                  </span>
                </div>
              )}

              {/* HOD Details */}
              <div className="min-w-0 space-y-1.5">
                <span className="inline-flex items-center rounded-full bg-purple-100 px-3 py-0.5 text-xs font-semibold text-purple-700 shadow-2xs">
                  Head of Department
                </span>

                <h4 className="font-display text-xl sm:text-2xl md:text-3xl font-extrabold text-[#0B1E36] tracking-tight">
                  {hod.name}
                </h4>

                <p className="text-xs sm:text-sm font-semibold text-slate-800">
                  Head of {departmentName} Department
                </p>

                <div className="pt-2 flex flex-wrap items-center gap-4 text-xs sm:text-sm font-semibold text-slate-900">
                  {hod.contact ? (
                    <a
                      href={`tel:${hod.contact.replace(/\s+/g, "")}`}
                      className="inline-flex items-center gap-2 hover:text-brand transition-colors"
                      title={`Call ${hod.name}`}
                    >
                      <Phone className="size-4 text-[#0B1E36]" aria-hidden="true" />
                      <span>{hod.contact}</span>
                    </a>
                  ) : null}

                  {hod.email ? (
                    <a
                      href={`mailto:${hod.email}`}
                      className="inline-flex items-center gap-2 hover:text-brand transition-colors"
                      title={`Email ${hod.name}`}
                    >
                      <Mail className="size-4 text-[#0B1E36]" aria-hidden="true" />
                      <span>{hod.email}</span>
                    </a>
                  ) : null}
                </div>
              </div>
            </div>

            {/* Right: Department-Specific Subject Visual Banner */}
            <div className="relative hidden md:block shrink-0">
              <img
                src={bannerImage}
                alt={`${departmentName} Laboratory and Visuals`}
                width={420}
                height={210}
                className="w-72 lg:w-96 xl:w-[420px] h-44 sm:h-48 md:h-52 object-cover rounded-2xl md:rounded-l-[40px] md:rounded-r-2xl border border-slate-200/80 shadow-xs"
                loading="lazy"
              />
              <div className="absolute inset-0 rounded-2xl md:rounded-l-[40px] md:rounded-r-2xl bg-gradient-to-l from-transparent via-transparent to-white/10 pointer-events-none" />
            </div>
          </div>

          {hod.message ? (
            <div className="mt-4 pt-3 border-t border-slate-100">
              <blockquote className="border-l-2 border-brand/40 pl-3.5 py-0.5 text-xs sm:text-sm leading-relaxed text-slate-800 italic">
                &ldquo;{hod.message}&rdquo;
              </blockquote>
            </div>
          ) : null}
        </div>

        {/* 3. Faculty Members Section */}
        <div className="p-5 sm:p-7 space-y-5">
          {/* Header row: Title + Count badge + Profiles/Table Toggle */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <Users className="size-5 text-blue-600" aria-hidden="true" />
              <h4 className="font-display text-base sm:text-lg font-bold text-[#0B1E36]">
                Faculty Members ({faculty.length} {faculty.length === 1 ? "Member" : "Members"})
              </h4>
            </div>

            {/* Profiles / Table View Toggle */}
            <div className="inline-flex items-center rounded-xl border border-slate-200 bg-white p-1 shadow-2xs self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setViewMode("profiles")}
                className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                  viewMode === "profiles"
                    ? "bg-[#0B1E36] text-white shadow-xs"
                    : "text-slate-700 hover:text-navy hover:bg-slate-50"
                }`}
                title="Profiles View"
              >
                <LayoutGrid className="size-3.5" aria-hidden="true" />
                <span>Profiles</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode("table")}
                className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                  viewMode === "table"
                    ? "bg-[#0B1E36] text-white shadow-xs"
                    : "text-slate-700 hover:text-navy hover:bg-slate-50"
                }`}
                title="Table View"
              >
                <Table2 className="size-3.5" aria-hidden="true" />
                <span>Table</span>
              </button>
            </div>
          </div>

          {/* Profiles View (5 columns on desktop matching reference screenshot) */}
          {viewMode === "profiles" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4">
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
            /* Table View */
            <>
              <div className="hidden md:block overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-left text-sm">
                    <thead>
                      {renderTableHeader(tableSchema)}
                    </thead>
                    <tbody className="divide-y divide-slate-100">
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

          {/* Non-Teaching Staff (if available in this department) */}
          {nonTeachingStaff && nonTeachingStaff.length > 0 ? (
            <div className="mt-8 pt-6 border-t border-slate-100 space-y-4">
              <div className="flex items-center gap-2">
                <Wrench className="size-4.5 text-blue-600" aria-hidden="true" />
                <h5 className="font-display text-base font-bold text-[#0B1E36]">
                  Technical &amp; Non-Teaching Staff ({nonTeachingStaff.length})
                </h5>
              </div>

              {viewMode === "profiles" ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-4">
                  {nonTeachingStaff.map((staff) => (
                    <NonTeachingStaffCard
                      key={staff.sNo}
                      staff={staff}
                      departmentName={departmentName}
                    />
                  ))}
                </div>
              ) : (
                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-left text-sm">
                      <thead>
                        <tr className="border-b border-slate-200 bg-slate-50 text-xs font-bold uppercase tracking-wider text-[#0B1E36]">
                          <th scope="col" className="w-16 px-4 py-3 text-center">S.No.</th>
                          <th scope="col" className="px-4 py-3 min-w-[200px]">Name</th>
                          <th scope="col" className="px-4 py-3 min-w-[130px]">Experience</th>
                          <th scope="col" className="px-4 py-3 min-w-[180px]">Designation</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {nonTeachingStaff.map((staff) => (
                          <tr key={staff.sNo} className="transition-colors hover:bg-light-blue/20">
                            <td className="px-4 py-3 text-center font-bold text-slate-700">{staff.sNo}</td>
                            <td className="px-4 py-3 font-extrabold text-[#0B1E36]">{staff.name}</td>
                            <td className="px-4 py-3 font-bold text-brand">{staff.experience}</td>
                            <td className="px-4 py-3 font-semibold text-slate-800">{staff.designation}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
