/**
 * Verified GPW Srinagar website knowledge — single source for the AI assistant.
 * Sourced from existing site data modules; do not invent content here.
 */

import {
  ADMISSIONS_DATES,
  ADMISSIONS_DOCUMENTS,
  ADMISSIONS_FAQS,
  ADMISSIONS_FEE_AMOUNT,
  ADMISSIONS_FEE_NOTE,
  ADMISSIONS_PROGRAMMES,
  ADMISSIONS_STEPS,
  JKBOTE_APPLY_URL,
} from "@/lib/admissions-data";
import { CAMPUS_FACILITIES } from "@/lib/campus-data";
import { GPW_PORTAL_DEPARTMENTS } from "@/lib/portal-departments";
import { departmentDetailPath } from "@/lib/departments-data";
import {
  ACADEMIC_UNITS,
  HOME_FAQS,
  INSTITUTE,
  INSTITUTE_SPOTLIGHTS,
  PROGRAMS,
  STATS,
  UTILITY_STRIP,
} from "@/lib/site-data";

export type KnowledgeRoute = {
  label: string;
  path: string;
  description?: string;
};

export const GPW_WEBSITE_ROUTES: KnowledgeRoute[] = [
  { label: "Home", path: "/", description: "Institute homepage" },
  { label: "About", path: "/about", description: "About the institute" },
  { label: "Admissions", path: "/admissions", description: "Diploma programmes, eligibility, application steps, documents and dates" },
  { label: "Academics", path: "/academics", description: "Programs and academic units" },
  { label: "Campus", path: "/campus", description: "Campus overview, facilities and gallery" },
  { label: "Notices", path: "/updates/notices", description: "Notices, examinations, results and updates" },
  { label: "Latest News", path: "/updates/news", description: "Most recent JKBOTE and college updates" },
  { label: "Events", path: "/updates/events", description: "Verified institutional events and collaborations" },
  { label: "Circulars", path: "/updates/circulars", description: "Tenders and important circulars" },
  { label: "Placements", path: "/placements", description: "Training & placement cell information" },
  { label: "Contact", path: "/contact", description: "Contact details, location map and enquiry form" },
];

export const GPW_KNOWLEDGE = {
  college: {
    name: INSTITUTE.name,
    shortName: INSTITUTE.shortName,
    brandMark: INSTITUTE.brandMark,
    established: INSTITUTE.established,
    tagline: INSTITUTE.tagline,
    type: "Government Polytechnic (diploma-level technical institution for women)",
    principal: null as string | null,
    note: "Principal name is not published in the current website knowledge base.",
  },
  admissions: {
    authority: "Jammu & Kashmir Board of Technical Education (JKBOTE)",
    applyUrl: JKBOTE_APPLY_URL,
    eligibilitySummary:
      "Eligibility depends on the diploma programme. Most programmes require 10th/Matriculation with at least 35% marks and applicable domicile of J&K or Ladakh. Medical Lab Technology requires 12th in the Medical stream with at least 35% marks. Lateral entry to the 3rd semester is available through 10+2 with relevant subjects or Class 10th plus a 2-year ITI in a relevant/allied trade, subject to current JKBOTE rules. There is no upper age bar, subject to applicable rules.",
    programmes: ADMISSIONS_PROGRAMMES.map((p) => ({
      name: p.name,
      credential: p.credential,
      duration: p.duration,
      seats: p.seats,
      category: p.category,
      page: `/academics/departments/${p.slug}`,
      specialNote: p.badge_note || undefined,
    })),
    applicationProcess: ADMISSIONS_STEPS.map((s) => ({ step: s.t, detail: s.d })),
    requiredDocuments: ADMISSIONS_DOCUMENTS.map((d) =>
      d.detail ? `${d.label} (${d.detail})` : d.label,
    ),
    faqs: ADMISSIONS_FAQS.map((f) => ({ question: f.q, answer: f.a })),
    fees: ADMISSIONS_FEE_AMOUNT,
    feeNote: ADMISSIONS_FEE_NOTE,
    importantDates: ADMISSIONS_DATES.map((d) => ({ label: d.label, value: d.date_value })),
    applySection: "/admissions#apply",
    programmesSection: "/admissions#admission-overview",
    eligibilitySection: "/admissions#eligibility",
    processSection: "/admissions#application-process",
    datesSection: "/admissions#important-dates",
    documentsSection: "/admissions#required-documents",
    feeSection: "/admissions#fee-information",
    disclaimer:
      "Admission dates, fees and seat details change with each official notification. Always verify the latest JKBOTE / institute notice before applying.",
  },
  academics: {
    programType: "Three-year full-time diploma programmes",
    stats: STATS.map((s) => ({
      label: s.label,
      value: `${s.prefix ?? ""}${s.value}${s.suffix ?? ""}`,
    })),
    academicUnits: ACADEMIC_UNITS.map((u) => ({
      title: u.title,
      subtitle: u.subtitle,
      path: u.to,
    })),
    examination: "Examination schedules and circulars are published on the Notices page.",
    results: "Results are published on the Notices page under examination-related notices.",
    academicCalendar: "Academic calendar notices are published on the Notices page when released.",
  },
  programs: PROGRAMS.map((p) => ({
    name: p.name,
    category: p.categoryLabel,
    duration: p.duration,
    eligibility: p.eligibility,
    stream: p.stream,
    overview: p.overview,
    page: "/academics#programs",
  })),
  departments: GPW_PORTAL_DEPARTMENTS.map((d) => ({
    name: d.name,
    slug: d.slug,
    summary: d.summary,
    page: departmentDetailPath(d.slug),
  })),
  campus: {
    overview: "Government Polytechnic for Women, Srinagar is located at Bemina, Srinagar.",
    spotlights: INSTITUTE_SPOTLIGHTS.map((s) => ({
      title: s.title,
      subtitle: s.subtitle,
      path: s.to,
    })),
  },
  facilities: {
    verified: CAMPUS_FACILITIES.map((f) => ({ name: f.name, description: f.description })),
    note: "The Campus page lists laboratories and technical facilities aligned with the institute diploma programmes. Confirm current availability with the institute office if needed.",
    page: "/campus#facilities",
  },
  laboratories: {
    summary:
      "Laboratories and technical facilities support practical diploma training in computing, electronics, food technology, medical laboratory technology, garment and textile technology, workshop practice, library resources, smart classrooms and seminar spaces.",
    page: "/campus#facilities",
  },
  library: {
    summary: "Library & Learning Resources — academic reference, study and learning resources.",
    page: "/campus#facilities",
  },
  hostel: {
    summary:
      "Hostel is not listed among the current campus laboratory and technical facility cards. Allotment rules and availability are not published in the current website knowledge.",
    page: "/campus#facilities",
  },
  sports: {
    summary:
      "Sports facilities are not listed among the current campus laboratory and technical facility cards. Details are not published in the current website knowledge.",
    page: "/campus#facilities",
  },
  examinations: {
    summary: "Examination schedules, date sheets and related circulars are published on the Notices page.",
    page: "/updates/notices#examination",
  },
  results: {
    summary: "Result notices are published on the Notices page when released by the institute.",
    page: "/updates/notices#examination",
    disclaimer: "Always verify the latest official result notice.",
  },
  notices: {
    summary:
      "Official JKBOTE notices relevant to Government Polytechnic for Women, Srinagar — including admissions, examinations and results — are listed on the Notices page with links to official sources.",
    utilityLinks: UTILITY_STRIP.map((l) => ({ label: l.label, path: l.to })),
    page: "/updates/notices",
    disclaimer: "Always verify the latest official JKBOTE notice. College-specific circulars appear when published by the institute.",
  },
  placements: {
    summary:
      "The Training & Placement Cell supports students with skill training, internships, career counselling and recruitment opportunities.",
    areas: [
      "Placement process and employer drives",
      "Internship opportunities",
      "Career development sessions",
      "Industry interaction and guest lectures",
    ],
    page: "/placements",
    disclaimer: "Specific recruiter names and placement statistics are not listed in the current website knowledge.",
  },
  contact: {
    address: INSTITUTE.address,
    phone: INSTITUTE.phone,
    email: INSTITUTE.email,
    page: "/contact",
    mapLink: INSTITUTE.mapLink,
    note: "Use the Contact page for the enquiry form and campus location map.",
  },
  location: {
    address: INSTITUTE.address,
    area: "Bemina, Srinagar, Jammu & Kashmir",
    postalCode: "190018",
    mapLink: INSTITUTE.mapLink,
  },
  website_navigation: GPW_WEBSITE_ROUTES,
  homepage_faqs: HOME_FAQS.map((f) => ({ question: f.q, answer: f.a })),
} as const;

/** Compact JSON context injected into the AI system prompt (server-side only). */
export function serializeKnowledgeForPrompt(): string {
  return JSON.stringify(GPW_KNOWLEDGE);
}
