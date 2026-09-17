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

/** Quick access links — homepage announcements strip */
export const UTILITY_STRIP = [
  { label: "Notices", to: "/updates/notices" },
  { label: "Examination", to: "/examination" },
  { label: "Downloads", to: "/downloads" },
  { label: "Tenders", to: "/updates/circulars#tenders" },
  { label: "Contact", to: "/contact" },
];

/**
 * Official footer Quick Links — institute navigation only (no duplicate Academics items).
 * Matches what J&K / AICTE polytechnic sites typically expose for visitors.
 */
export const FOOTER_QUICK_LINKS = [
  { label: "About the Institute", to: "/about" },
  { label: "Admissions", to: "/admissions" },
  { label: "Notices & Updates", to: "/updates/notices" },
  { label: "Downloads", to: "/downloads" },
  { label: "Examination & Results", to: "/examination" },
  { label: "RTI", to: "/rti" },
  { label: "Contact", to: "/contact" },
] as const;

/** Official footer Academics column */
export const FOOTER_ACADEMIC_LINKS = [
  { label: "Diploma Programmes", to: "/academics#programmes" },
  { label: "Syllabus & Downloads", to: "/downloads" },
  { label: "Academic Calendar", to: "/academic-calendar" },
  { label: "Faculty & Staff", to: "/faculty" },
  { label: "Principal's Message", to: "/principal-message" },
] as const;

/** Campus life / explore — visitor-facing facilities and support */
export const FOOTER_EXPLORE_LINKS = [
  { label: "Campus & Facilities", to: "/campus" },
  { label: "Laboratories", to: "/campus#facilities" },
  { label: "Library", to: "/library" },
  { label: "Hostel", to: "/hostel" },
  { label: "Student Welfare", to: "/student-welfare" },
  { label: "Placements", to: "/placements" },
  { label: "News & Events", to: "/updates/news" },
] as const;

/** GIGW-style mandatory bar for a government institute site */
export const FOOTER_MANDATORY_LINKS = [
  { label: "RTI", to: "/rti" },
  { label: "Mandatory Disclosures", to: "/mandatory-disclosures" },
  { label: "Privacy Policy", to: "/privacy-policy" },
  { label: "Website Policy", to: "/website-policy" },
] as const;

/** Official board portals used by GPW Srinagar admissions & exams (JKBOTE) */
export const FOOTER_BOARD_LINKS = [
  { label: "JKBOTE Admission Portal", href: "https://admission.jkbote.ac.in/" },
  { label: "JKBOTE Board", href: "https://jkbote.ac.in/" },
] as const;

/**
 * Official institute social profiles only
 * (listed on facebook.com/GPWSrinagar About).
 * Do not add YouTube / LinkedIn until an official page is confirmed.
 */
export const FOOTER_SOCIAL_LINKS = [
  {
    id: "facebook" as const,
    label: "Facebook — Govt. Polytechnic for Women, Srinagar",
    href: "https://www.facebook.com/GPWSrinagar",
  },
  {
    id: "instagram" as const,
    label: "Instagram — @wpolysgr",
    href: "https://www.instagram.com/wpolysgr/",
  },
  {
    id: "x" as const,
    label: "X — @GWP_SRINAGAR",
    href: "https://x.com/GWP_SRINAGAR",
  },
] as const;

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

/** Academic gateway tiles — one purpose each (no programmes/departments or labs/facilities split). */
export const ACADEMIC_UNITS = [
  {
    title: "Diploma Programmes",
    subtitle: "Eight three-year full-time diploma programmes",
    to: "/academics#programmes",
  },
  {
    title: "Syllabus & Downloads",
    subtitle: "Board syllabus references and institute documents",
    to: "/downloads",
  },
  {
    title: "Examination & Results",
    subtitle: "Schedules, forms and result guidance",
    to: "/examination",
  },
  {
    title: "Laboratories & Workshops",
    subtitle: "Practical training spaces on campus",
    to: "/campus#facilities",
  },
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
    q: "Where can I find syllabus and downloads?",
    a: "Programme syllabus references and institute documents are listed on the Downloads page. Board syllabi follow JKBOTE notifications.",
  },
  {
    q: "Where can I find examination and result notices?",
    a: "Use the Examination & Results page for hubs and links, and the Notices page for the latest official circulars.",
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
  /** Smart Apply Online flow (JKBOTE open/closed) instead of a route link */
  action?: "apply-online";
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
      { label: "Apply Now", action: "apply-online", primary: true },
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
      { label: "Diploma Programmes", to: "/academics#programmes", primary: true },
      { label: "Syllabus & Downloads", to: "/downloads" },
      { label: "Academic Calendar", to: "/academic-calendar" },
      { label: "Examination & Results", to: "/examination" },
      { label: "Faculty & Staff", to: "/faculty" },
    ],
  },
  {
    label: "Campus",
    to: "/campus",
    items: [
      { label: "Campus Overview", to: "/campus#campus-overview", primary: true },
      { label: "Laboratories & Facilities", to: "/campus#facilities" },
      { label: "Library", to: "/library" },
      { label: "Hostel", to: "/hostel" },
      { label: "Student Welfare", to: "/student-welfare" },
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
      { label: "Examination Notices", to: "/examination" },
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
