export const INSTITUTE = {
  name: "Government Polytechnic for Women, Srinagar",
  shortName: "GPW Srinagar",
  brandMark: "GPWS",
  established: "1986",
  tagline:
    "Empowering women through quality technical education, practical learning and career-focused skills.",
  address: "Government Polytechnic for Women, Bemina, Srinagar, Jammu & Kashmir",
  phone: "0194-2491176",
  email: "wpolysgr@yahoo.co.in",
  /** Bemina campus — verified coordinates (34°4′43″N 74°45′47″E) */
  mapEmbedUrl:
    "https://www.google.com/maps?q=34.078611,74.763056&hl=en&z=16&output=embed",
  mapLink:
    "https://www.google.com/maps/search/?api=1&query=Government+Polytechnic+for+Women+Bemina+Srinagar",
};

export type NavItem = { label: string; to: string; children?: { label: string; to: string }[] };

/** Quick access links — homepage announcements & footer */
export const UTILITY_STRIP = [
  { label: "Notices", to: "/updates/notices" },
  { label: "Examination", to: "/updates/notices#examination" },
  { label: "Results", to: "/updates/notices#examination" },
  { label: "Tenders", to: "/updates/circulars#tenders" },
  { label: "Contact", to: "/contact" },
];

/** Hero discovery panels — inspired by IITD Research / News / Startups spotlights */
export const INSTITUTE_SPOTLIGHTS = [
  {
    title: "Admissions",
    subtitle: "Pathways to join GPW Srinagar",
    to: "/admissions",
  },
  {
    title: "Academics",
    subtitle: "Diploma programs & departments",
    to: "/academics",
  },
  {
    title: "Campus",
    subtitle: "Labs, workshops & student life",
    to: "/campus",
  },
  {
    title: "Updates",
    subtitle: "Notices, exams & announcements",
    to: "/updates/news",
  },
] as const;

/** Academic unit tiles — IITD Academic Units pattern */
export const ACADEMIC_UNITS = [
  { title: "Departments", subtitle: "Specialized teaching units", to: "/academics#departments" },
  { title: "Programs", subtitle: "Three-year diploma courses", to: "/academics#programs" },
  { title: "Laboratories", subtitle: "Hands-on technical practice", to: "/academics#labs-workshops" },
  { title: "Facilities", subtitle: "Library, workshop & campus", to: "/campus#facilities" },
] as const;

export const HOME_FAQS = [
  {
    q: "Who can apply for diploma programs?",
    a: "Women candidates who meet the eligibility published in the official admission notification for each program.",
  },
  {
    q: "What is the duration of diploma courses?",
    a: "Most diploma programs are three-year full-time courses combining classroom instruction with laboratory practice.",
  },
  {
    q: "Where can I find examination and result notices?",
    a: "All examination schedules, results and circulars are published on the Notices page as they are released by the institute.",
  },
  {
    q: "How do I contact the institute for admissions queries?",
    a: "Use the Contact page for the institute address, phone, email and enquiry form, or visit the Admissions page for process details.",
  },
] as const;

export type HeaderCtaPillItem = {
  label: string;
  to?: string;
  primary?: boolean;
  /** Non-link placeholder (e.g. coming soon) */
  comingSoon?: boolean;
};

export type HeaderCtaPill = {
  label: string;
  /** Parent landing page — click navigates here */
  to: string;
  items: HeaderCtaPillItem[];
};

/** Pill CTA buttons in the header — each opens a dropdown of action links */
export const HEADER_CTA_PILLS: HeaderCtaPill[] = [
  {
    label: "Admissions",
    to: "/admissions",
    items: [
      { label: "Apply Now", to: "/admissions#apply", primary: true },
      { label: "Admission Information", to: "/admissions#admission-overview" },
      { label: "Eligibility", to: "/admissions#eligibility" },
      { label: "Application Process", to: "/admissions#application-process" },
      { label: "Important Dates", to: "/admissions#important-dates" },
      { label: "Required Documents", to: "/admissions#required-documents" },
      { label: "Fee Information", to: "/admissions#fee-information" },
      { label: "Admission Notices", to: "/updates/notices#admissions" },
    ],
  },
  {
    label: "Academics",
    to: "/academics",
    items: [
      { label: "Programs / Courses", to: "/academics#programs", primary: true },
      { label: "Departments", to: "/academics#departments" },
      { label: "Academic Calendar", to: "/updates/notices#academics" },
      { label: "Curriculum & Syllabus", to: "/updates/notices" },
      { label: "Examination", to: "/updates/notices#examination" },
      { label: "Results", to: "/updates/notices#examination" },
    ],
  },
  {
    label: "Campus",
    to: "/campus",
    items: [
      { label: "Campus Overview", to: "/campus#campus-overview", primary: true },
      { label: "Laboratories & Facilities", to: "/campus#facilities" },
      { label: "Library", to: "/campus#facilities" },
      { label: "Hostel", to: "/campus#facilities" },
      { label: "Student Facilities", to: "/campus#facilities" },
      { label: "Campus Gallery", to: "/campus#gallery" },
      { label: "Contact / Location", to: "/contact" },
      { label: "360° Virtual Tour — Coming Soon", to: "/campus#virtual-tour", comingSoon: true },
    ],
  },
  {
    label: "Updates",
    to: "/updates/news",
    items: [
      { label: "Latest News", to: "/updates/news", primary: true },
      { label: "Notices", to: "/updates/notices" },
      { label: "Events", to: "/updates/events" },
      { label: "Tenders / Important Circulars", to: "/updates/circulars" },
    ],
  },
];

export { ANNOUNCEMENTS, CAMPUS_EVENTS } from "@/lib/updates-data";

export const STATS = [
  { value: 1986, label: "Established", prefix: "", suffix: "" },
  { value: 8, label: "Diploma Programmes", prefix: "", suffix: "" },
  { value: 240, label: "Sanctioned Seats", prefix: "", suffix: "" },
  { value: 3, label: "Diploma Duration", prefix: "", suffix: " Years" },
];

const UNVERIFIED_GLANCE_LABELS = new Set(["Laboratories", "Departments", "Diploma Programs"]);

/** Use CMS stats only when they match verified GPW Srinagar figures. */
export function resolveGlanceStats<T extends { label: string }>(rows: T[]): T[] | typeof STATS {
  if (rows.length === 0 || rows.some((row) => UNVERIFIED_GLANCE_LABELS.has(row.label))) {
    return STATS;
  }
  return rows;
}

import { GPW_DEPARTMENTS, type ProgramCategory, type ProgramIcon } from "@/lib/departments-data";

export type { ProgramCategory, ProgramIcon };

/** Diploma programmes — derived from official department records. */
export const PROGRAMS = GPW_DEPARTMENTS.map(
  ({ name, categoryLabel, duration, eligibility, programType, stream, summary, icon, slug }) => ({
    name,
    categoryLabel,
    duration,
    eligibility,
    programType,
    stream,
    overview: summary,
    icon,
    slug,
  }),
);
