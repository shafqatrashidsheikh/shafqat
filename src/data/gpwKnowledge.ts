/**
 * Verified GPW Srinagar website knowledge — single source for the AI assistant.
 * Aggregates existing site data modules; do not invent content here.
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
import {
  FORM_DOWNLOADS,
  INSTITUTE_DOWNLOADS,
  JKBOTE_PORTAL_URL,
  PROGRAMME_SYLLABUS,
} from "@/lib/downloads-data";
import {
  departmentDetailPath,
  GPW_DEPARTMENTS,
  PROGRAMME_ADMISSION_NOTE,
  PROGRAMME_CAREER_DISCLAIMER,
} from "@/lib/departments-data";
import { JKBOTE_ADMISSION_PORTAL_URL, JKBOTE_ADMISSION_SOURCE_PAGES } from "@/lib/jkbote-admission-dates";
import { JKBOTE_SOURCE_PAGES } from "@/lib/jkbote-live";
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
  { label: "About", path: "/about", description: "About the institute, affiliation and approvals" },
  { label: "Admissions", path: "/admissions", description: "Diploma programmes, eligibility, application steps, documents and dates" },
  { label: "Academics", path: "/academics", description: "Programmes and academic units" },
  { label: "Campus", path: "/campus", description: "Campus overview, facilities and gallery" },
  { label: "Library", path: "/library", description: "Library and learning resources" },
  { label: "Hostel", path: "/hostel", description: "Hostel accommodation for women students" },
  { label: "Faculty & Staff", path: "/faculty", description: "Faculty and staff directory guidance (no invented names)" },
  { label: "Downloads & Syllabus", path: "/downloads", description: "Syllabus links, forms and institute downloads" },
  { label: "Academic Calendar", path: "/academic-calendar", description: "Session academic calendar when published" },
  { label: "Examination & Results", path: "/examination", description: "Examination schedules, forms and results guidance" },
  { label: "Student Welfare", path: "/student-welfare", description: "Anti-ragging and student welfare" },
  { label: "RTI", path: "/rti", description: "Right to Information guidance" },
  { label: "Mandatory Disclosures", path: "/mandatory-disclosures", description: "Mandatory public disclosures" },
  { label: "Privacy Policy", path: "/privacy-policy", description: "Website privacy policy" },
  { label: "Website Policy", path: "/website-policy", description: "Website usage policy" },
  { label: "Notices", path: "/updates/notices", description: "JKBOTE and college notices" },
  { label: "Latest News", path: "/updates/news", description: "Recent JKBOTE and college updates" },
  { label: "Events", path: "/updates/events", description: "Verified institutional events" },
  { label: "Circulars", path: "/updates/circulars", description: "Tenders and important circulars" },
  { label: "Placements", path: "/placements", description: "Training & placement cell" },
  { label: "Principal's Message", path: "/principal-message", description: "Principal's message page" },
  { label: "Contact", path: "/contact", description: "Contact details, map and enquiry form" },
];

export const OFFICIAL_EXTERNAL_SOURCES = {
  jkbotePortal: JKBOTE_PORTAL_URL,
  jkboteAdmissionPortal: JKBOTE_ADMISSION_PORTAL_URL,
  jkboteApplyUrl: JKBOTE_APPLY_URL,
  jkboteNoticePages: [...JKBOTE_SOURCE_PAGES],
  jkboteAdmissionSourcePages: [...JKBOTE_ADMISSION_SOURCE_PAGES],
  note:
    "Live admission status, dates and notices are synced from these official JKBOTE pages. Prefer LIVE_OFFICIAL_DATA over static placeholders when both exist.",
};

/** Baseline knowledge from code modules (used when CMS is offline, and as merge base). */
export function buildBaselineKnowledge(): Record<string, unknown> {
  return {
  college: {
    name: INSTITUTE.name,
    shortName: INSTITUTE.shortName,
    brandMark: INSTITUTE.brandMark,
    established: INSTITUTE.established,
    tagline: INSTITUTE.tagline,
    type: "Government Polytechnic (diploma-level technical institution for women)",
    location: "Bemina, Srinagar, Jammu & Kashmir — 190018",
    affiliation: "Jammu & Kashmir Board of Technical Education (JKBOTE)",
    principal: null as string | null,
    note: "Principal name is not published in the current website knowledge base. Direct visitors to /principal-message or /contact.",
  },
  official_sources: OFFICIAL_EXTERNAL_SOURCES,
  admissions: {
    authority: "Jammu & Kashmir Board of Technical Education (JKBOTE)",
    applyUrl: JKBOTE_APPLY_URL,
    admissionPortal: JKBOTE_ADMISSION_PORTAL_URL,
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
    reference_qa: ADMISSIONS_FAQS.map((f) => ({ question: f.q, answer: f.a })),
    fees: ADMISSIONS_FEE_AMOUNT,
    feeNote: ADMISSIONS_FEE_NOTE,
    importantDates_static_fallback: ADMISSIONS_DATES.map((d) => ({
      label: d.label,
      value: d.date_value,
    })),
    applySection: "/admissions#apply",
    programmesSection: "/admissions#admission-overview",
    eligibilitySection: "/admissions#eligibility",
    processSection: "/admissions#application-process",
    datesSection: "/admissions#important-dates",
    documentsSection: "/admissions#required-documents",
    feeSection: "/admissions#fee-information",
    disclaimer:
      "Admission dates, fees and seat details change with each official notification. Always prefer LIVE_OFFICIAL_DATA and verify on JKBOTE before applying.",
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
    examinationPage: "/examination",
    academicCalendarPage: "/academic-calendar",
    downloadsPage: "/downloads",
  },
  programs: PROGRAMS.map((p) => {
    const match = GPW_DEPARTMENTS.find((d) => d.name === p.name);
    return {
      name: p.name,
      category: p.categoryLabel,
      duration: p.duration,
      eligibility: p.eligibility,
      stream: p.stream,
      overview: p.overview,
      page: match ? departmentDetailPath(match.slug) : "/academics#programs",
    };
  }),
  departments: GPW_DEPARTMENTS.map((d) => ({
    name: d.name,
    slug: d.slug,
    summary: d.summary,
    overview: d.overview,
    duration: d.duration,
    intake: d.intake,
    studyMode: d.studyMode,
    award: d.award,
    eligibility: d.eligibility,
    stream: d.stream,
    learningAreas: [...d.learningAreas],
    practicalPoints: [...d.practicalPoints],
    careerPathways: [...d.careerPathways],
    academicAuthority: d.academicAuthority,
    admissionNote: PROGRAMME_ADMISSION_NOTE,
    careerDisclaimer: PROGRAMME_CAREER_DISCLAIMER,
    page: departmentDetailPath(d.slug),
    syllabusHint:
      "Scheme and syllabus are prescribed by JKBOTE. See /downloads and the official JKBOTE portal for current documents.",
  })),
  downloads: {
    page: "/downloads",
    jkbotePortal: JKBOTE_PORTAL_URL,
    boardSemesterCurriculum: [
      { semester: 1, label: "Semester 1", href: "https://jkbote.ac.in/NEP-FIRST.pdf" },
      { semester: 2, label: "Semester 2", href: "https://jkbote.ac.in/2nd_Semester_Curriculum.pdf" },
      { semester: 3, label: "Semester 3", href: "https://jkbote.ac.in/3rdSemester.pdf" },
      { semester: 4, label: "Semester 4", href: "https://jkbote.ac.in/4thSemester.pdf" },
      { semester: 5, label: "Semester 5", href: "https://jkbote.ac.in/5thSemester.pdf" },
      { semester: 6, label: "Semester 6", href: "https://jkbote.ac.in/6thSemester.pdf" },
    ],
    programmeSyllabus: PROGRAMME_SYLLABUS.map((s) => ({
      name: s.name,
      slug: s.slug,
      description: s.description,
      pdfAvailable: Boolean(s.pdfHref),
      pdfHref: s.pdfHref ?? null,
    })),
    instituteDocuments: INSTITUTE_DOWNLOADS.map((d) => ({
      title: d.title,
      description: d.description,
      status: d.status,
      path: d.href ?? null,
    })),
    forms: FORM_DOWNLOADS.map((d) => ({
      title: d.title,
      description: d.description,
      status: d.status,
      path: d.href ?? null,
    })),
  },
  campus: {
    overview: "Government Polytechnic for Women, Srinagar is located at Bemina, Srinagar.",
    spotlights: INSTITUTE_SPOTLIGHTS.map((s) => ({
      title: s.title,
      subtitle: s.subtitle,
      path: s.to,
    })),
    page: "/campus",
  },
  facilities: {
    verified: CAMPUS_FACILITIES.map((f) => ({ name: f.name, description: f.description })),
    note: "Confirm current availability with the institute office if needed.",
    page: "/campus#facilities",
  },
  library: {
    summary:
      "The GPW Srinagar library on the Bemina campus supports diploma teaching with programme-linked books and reference material (including subject cabinets such as Electronics & Communication and Food Technology), reading / study seating, journals and career guides. Borrowing rules, membership and opening hours are issued by the library office — do not invent volume counts or timings.",
    page: "/library",
  },
  hostel: {
    summary:
      "GPW Srinagar provides a separate hostel for eligible women diploma students near the Bemina campus. Mess and residential arrangements follow institute rules. Seats, fees and allotment dates are published only through official notices — do not invent capacity, room types or fee amounts. Roommate names, bed labels and vacant beds are PRIVATE: the assistant may share them only with logged-in students whose profile is HOD-approved (or staff/admin). Public users get hostel rules and login/approval guidance only.",
    rules: [
      "Women diploma students only",
      "Allotment by official notice",
      "Anti-ragging mandatory",
      "Mess and leave follow warden rules",
      "No cooking / unsafe appliances in rooms",
      "Misconduct may cancel allotment",
    ],
    page: "/hostel",
  },
  student_welfare: {
    summary:
      "The institute maintains a student welfare and anti-ragging commitment. Ragging is prohibited. Students should use official channels for complaints and support.",
    page: "/student-welfare",
  },
  examination: {
    summary:
      "Examination schedules, forms and result-related circulars are issued by JKBOTE / the institute. Use the Examination page and live notices.",
    page: "/examination",
    noticesHash: "/updates/notices#examination",
  },
  results: {
    summary: "Result notices are published via JKBOTE / institute notices when released.",
    page: "/examination",
    noticesHash: "/updates/notices#examination",
    disclaimer: "Always verify the latest official result notice.",
  },
  academic_calendar: {
    summary: "Academic calendar is published by the institute / JKBOTE for each session when released.",
    page: "/academic-calendar",
  },
  notices: {
    summary:
      "Official JKBOTE notices relevant to GPW Srinagar — admissions, examinations, results and datesheets — are listed on the Notices page with links to official sources.",
    utilityLinks: UTILITY_STRIP.map((l) => ({ label: l.label, path: l.to })),
    page: "/updates/notices",
    disclaimer: "Prefer LIVE_OFFICIAL_DATA.recentNotices when answering about current notices.",
  },
  rti: {
    summary: "Right to Information guidance is published on the RTI page.",
    page: "/rti",
  },
  mandatory_disclosures: {
    summary: "Mandatory public disclosures are listed on the Mandatory Disclosures page.",
    page: "/mandatory-disclosures",
  },
  faculty: {
    summary:
      "Faculty leadership and verified JKBOTE contacts are on /faculty. Department faculty directories are available on their respective programme pages: Computer Engineering (/academics/departments/computer-engineering), Office Management & Computer Applications (/academics/departments/office-management-computer-applications), Textile Technology (/academics/departments/textile-technology), Garment Technology (/academics/departments/garment-technology), Travel & Tourism (/academics/departments/travel-tourism), and Food Technology (/academics/departments/food-technology).",
    page: "/faculty",
    externalOfficialSource: "https://admission.jkbote.ac.in/intake.html",
  },
  placements: {
    summary:
      "The Training & Placement Cell supports diploma students with industrial training, internships, career counselling and placement-related guidance.",
    areas: [
      "Training and professional guidance",
      "Internships and industrial training",
      "Career counselling",
      "Industry interaction and expert lectures",
    ],
    page: "/placements",
    disclaimer:
      "Specific recruiter names, placement percentages and salary figures are not published. Do not invent them.",
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
  /** Common Q&A retained as assistant reference — homepage FAQ UI removed in favour of the assistant. */
  common_questions: HOME_FAQS.map((f) => ({ question: f.q, answer: f.a })),
  };
}

export const GPW_KNOWLEDGE = buildBaselineKnowledge();

/** Compact JSON context injected into the AI system prompt (server-side only). */
export function serializeKnowledgeForPrompt(): string {
  return JSON.stringify(buildBaselineKnowledge());
}
