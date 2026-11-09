/**
 * Faculty & staff — only verified public entries.
 * Sources: institute principal profile; JKBOTE admission intake contact list.
 * Do not invent HOD / faculty names beyond these verified rows.
 */

import { PRINCIPAL } from "@/lib/principal-data";
import { GPW_DEPARTMENTS } from "@/lib/departments-data";
import { getDepartmentFacultyStaff } from "@/lib/department-faculty-data";

export type FacultyPerson = {
  name: string;
  designation: string;
  department: string;
  phone?: string;
  /** Where this listing was verified */
  source: string;
  sourceUrl?: string;
};

export const FACULTY_LEADERSHIP = {
  name: PRINCIPAL.name,
  role: PRINCIPAL.role,
  institute: PRINCIPAL.institute,
  portrait: PRINCIPAL.portrait,
  portraitAlt: PRINCIPAL.portraitAlt,
  note: "Academic and administrative head of the institute under the Directorate of Skill Development, J&K.",
} as const;

/** Official JKBOTE intake contact for Govt. Women Polytechnic, Bemina Srinagar */
export const FACULTY_VERIFIED: readonly FacultyPerson[] = [
  {
    name: "Suhail Ahmad Nehvi",
    designation: "Lecturer (A/A), Computer Engineering",
    department: "Computer Engineering",
    phone: "9419419906",
    source: "JKBOTE admission intake (Kashmir Division)",
    sourceUrl: "https://admission.jkbote.ac.in/intake.html",
  },
] as const;

export const FACULTY_ROLE_GROUPS = [
  {
    title: "Teaching faculty",
    body: "Lecturers and instructors deliver theory and laboratory instruction for each diploma programme under JKBOTE curriculum.",
  },
  {
    title: "Technical & workshop staff",
    body: "Laboratory and workshop staff support practical classes, equipment care and skill-based training sessions.",
  },
  {
    title: "Administration",
    body: "The Principal’s office and institute administration coordinate academics, examinations liaison and student services.",
  },
] as const;

/** Programme units that carry teaching faculty — names published from official department directories */
export const FACULTY_DEPARTMENT_UNITS = GPW_DEPARTMENTS.map((d) => {
  const deptStaff = getDepartmentFacultyStaff(d.slug);
  if (deptStaff) {
    return {
      slug: d.slug,
      name: d.name,
      stream: d.stream,
      verifiedPeople: [
        {
          name: deptStaff.hod.name,
          designation: deptStaff.hod.designation,
          department: d.name,
          phone: deptStaff.hod.contact,
          source: "Official Department Directory",
        },
      ],
      facultyCount: deptStaff.faculty.length,
    };
  }

  return {
    slug: d.slug,
    name: d.name,
    stream: d.stream,
    verifiedPeople: [],
    facultyCount: 0,
  };
});

export const FACULTY_DIRECTORY_NOTE =
  "Only names confirmed on official institute or JKBOTE public pages are listed here. Additional faculty names will be added after official institute confirmation so the directory stays accurate.";
