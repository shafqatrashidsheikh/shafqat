/** Shared admissions content — static fallback, bootstrap seed, and public-page defaults. */

export const JKBOTE_APPLY_URL = "https://admission.jkbote.ac.in/";
export const ADMISSIONS_NOTICE_HREF = "/updates/notices#admissions";

export const ADMISSIONS_YEAR = 2026;
export const ADMISSIONS_TITLE = "Admissions 2026";

export const ADMISSIONS_INTRO =
  "Explore diploma programmes, eligibility, application steps, required documents and important admission updates at Government Polytechnic for Women, Srinagar.";

export const ADMISSIONS_STRIP = "Admissions are conducted through J&K Board of Technical Education.";

export const ADMISSIONS_APPLY_LABEL = "Apply Online";

export const ADMISSIONS_FEE_AMOUNT = "₹2,155 + applicable insurance fee per annum";

export const ADMISSIONS_FEE_NOTE = "Fee and other charges are subject to the latest official notification.";

export const ADMISSIONS_NOTICE_LABEL = "View Latest Admission Notice";

export const ADMISSIONS_ELIGIBILITY_INTRO =
  "Choose the entry route that matches your qualification.";

export const ADMISSIONS_ELIGIBILITY_NOTE =
  "Always verify the latest JKBOTE admission notification for course-specific subjects, lateral-entry discipline mapping, dates and other conditions.";

export const ADMISSIONS_DOCUMENTS_NOTE =
  "Document requirements may vary according to the latest admission notification and category claimed.";

export const ADMISSIONS_PROGRAMMES_NOTE =
  "Government Polytechnic for Women, Srinagar offers eight three-year diploma programmes. Explore the programmes below before checking eligibility and applying.";

export const ADMISSIONS_ASSISTANT_TITLE = "Need Help With Admission?";

export const ADMISSIONS_ASSISTANT_BODY =
  "Ask GPW Assistant about eligibility, programmes, documents, fees or the application process.";

export const ADMISSIONS_ASSISTANT_LABEL = "Ask GPW Assistant";

export const ADMISSIONS_FINAL_CTA_TITLE = "Ready to Apply?";

export const ADMISSIONS_FINAL_CTA_BODY =
  "Review your eligibility and submit your application through the official JKBOTE admission portal.";

export const ADMISSIONS_STEPS = [
  {
    t: "Check Eligibility",
    d: "Choose a programme and confirm that you meet its eligibility requirements.",
  },
  {
    t: "Apply Online",
    d: "Complete the application through the official JKBOTE admission portal.",
  },
  {
    t: "Upload Documents",
    d: "Submit the required certificates and photograph in the prescribed format.",
  },
  {
    t: "Review & Submit",
    d: "Check your information carefully and submit the application before the official deadline.",
  },
  {
    t: "Merit & Admission",
    d: "Follow the official JKBOTE merit and admission process.",
  },
] as const;

export type AdmissionProgrammeSeed = {
  name: string;
  credential: string;
  duration: string;
  seats: number;
  category: string;
  slug: string;
  badge: string;
  badge_note: string;
};

export const ADMISSIONS_PROGRAMMES: readonly AdmissionProgrammeSeed[] = [
  {
    name: "Computer Engineering",
    credential: "Diploma",
    duration: "3 Years",
    seats: 30,
    category: "TECHNICAL",
    slug: "computer-engineering",
    badge: "",
    badge_note: "",
  },
  {
    name: "Electronics & Communication Engineering",
    credential: "Diploma",
    duration: "3 Years",
    seats: 30,
    category: "TECHNICAL",
    slug: "electronics-communication-engineering",
    badge: "",
    badge_note: "",
  },
  {
    name: "Textile Technology",
    credential: "Diploma",
    duration: "3 Years",
    seats: 30,
    category: "APPLIED TECHNOLOGY",
    slug: "textile-technology",
    badge: "",
    badge_note: "",
  },
  {
    name: "Garment Technology",
    credential: "Diploma",
    duration: "3 Years",
    seats: 30,
    category: "APPLIED TECHNOLOGY",
    slug: "garment-technology",
    badge: "",
    badge_note: "",
  },
  {
    name: "Food Technology",
    credential: "Diploma",
    duration: "3 Years",
    seats: 30,
    category: "APPLIED TECHNOLOGY",
    slug: "food-technology",
    badge: "",
    badge_note: "",
  },
  {
    name: "Office Management & Computer Applications",
    credential: "Diploma",
    duration: "3 Years",
    seats: 30,
    category: "COMPUTER APPLICATIONS",
    slug: "office-management-computer-applications",
    badge: "",
    badge_note: "",
  },
  {
    name: "Travel & Tourism",
    credential: "Diploma",
    duration: "3 Years",
    seats: 30,
    category: "PROFESSIONAL STUDIES",
    slug: "travel-tourism",
    badge: "",
    badge_note: "",
  },
  {
    name: "Medical Lab Technology",
    credential: "Diploma",
    duration: "3 Years",
    seats: 30,
    category: "MEDICAL",
    slug: "medical-lab-technology",
    badge: "12th Medical",
    badge_note: "Different eligibility applies",
  },
];

export type AdmissionEligibilityCard = {
  heading: string;
  badge: string;
  highlight: string;
  body: string;
  routes?: readonly { label: string; detail: string }[];
  footnote?: string;
};

export const ADMISSIONS_ELIGIBILITY_GROUPS: readonly AdmissionEligibilityCard[] = [
  {
    heading: "Regular Diploma",
    badge: "10th Based",
    highlight: "Minimum 35% in Class 10th",
    body: "Applies to regular 3-year diploma programmes except Medical Lab Technology.",
  },
  {
    heading: "Medical Lab Technology",
    badge: "12th Medical",
    highlight: "Minimum 35% in Class 12th",
    body: "12th Medical stream is required for MLT.",
  },
  {
    heading: "Lateral Entry",
    badge: "Direct 3rd Semester",
    highlight: "10+2 / 2-Year ITI",
    body: "Entry to the 2nd year is subject to relevant discipline/trade and current JKBOTE rules.",
    routes: [
      {
        label: "10+2",
        detail: "Class 12th with the required relevant subjects for the chosen diploma discipline.",
      },
      {
        label: "ITI",
        detail: "Class 10th plus a 2-year ITI course in a relevant or allied trade.",
      },
    ],
    footnote:
      "Minimum qualifying marks and discipline-specific requirements are as prescribed in the current JKBOTE Lateral Entry admission notification.",
  },
];

export function serializeEligibilityGroup(group: AdmissionEligibilityCard): string {
  const lines = [group.badge, group.highlight, group.body];
  for (const route of group.routes ?? []) {
    lines.push(`${route.label}: ${route.detail}`);
  }
  if (group.footnote) lines.push(group.footnote);
  return lines.join("\n");
}

export function parseEligibilityGroup(heading: string, body: string): AdmissionEligibilityCard {
  const fallback = ADMISSIONS_ELIGIBILITY_GROUPS.find(
    (group) => group.heading.toLowerCase() === heading.trim().toLowerCase(),
  );
  const lines = body
    .split(/\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length < 2 || (lines[0]?.length ?? 0) > 40) {
    return fallback ?? { heading, badge: "", highlight: "", body };
  }

  const routes: { label: string; detail: string }[] = [];
  const bodyParts: string[] = [];
  let footnote = "";

  for (const line of lines.slice(2)) {
    const routeMatch = /^(10\+2|ITI):\s*(.+)$/i.exec(line);
    if (routeMatch?.[1] && routeMatch[2]) {
      routes.push({
        label: routeMatch[1].toUpperCase() === "ITI" ? "ITI" : "10+2",
        detail: routeMatch[2],
      });
      continue;
    }
    if (/JKBOTE Lateral Entry/i.test(line) || /discipline-specific requirements/i.test(line)) {
      footnote = line;
      continue;
    }
    bodyParts.push(line);
  }

  return {
    heading,
    badge: lines[0] ?? fallback?.badge ?? "",
    highlight: lines[1] ?? fallback?.highlight ?? "",
    body: bodyParts.join(" ") || fallback?.body || "",
    routes: routes.length > 0 ? routes : fallback?.routes,
    footnote: footnote || fallback?.footnote,
  };
}

export const ADMISSIONS_DOCUMENTS = [
  { label: "Qualifying examination marks certificate", detail: "" },
  { label: "Date of birth / Matriculation certificate", detail: "" },
  { label: "Domicile certificate", detail: "" },
  { label: "Valid category certificate, if applicable", detail: "" },
  { label: "Recent passport-size photograph", detail: "" },
  { label: "Sports certificate, if applicable", detail: "" },
  { label: "TFW / income-related certificate, if applicable", detail: "" },
] as const;

export const ADMISSIONS_DATES = [
  { label: "Admission Notification", date_value: "To be announced" },
  { label: "Application Opens", date_value: "To be announced" },
  { label: "Application Deadline", date_value: "To be announced" },
  { label: "Merit / Admission Updates", date_value: "As notified by JKBOTE" },
] as const;

/** Kept for GPW Assistant knowledge — not rendered on the Admissions page. */
export const ADMISSIONS_FAQS = [
  {
    q: "Who can apply for diploma programmes?",
    a: "Eligible candidates who meet the prescribed educational and domicile requirements can apply through the JKBOTE admission process.",
  },
  {
    q: "What is the minimum qualification?",
    a: "For most diploma programmes, candidates must have passed 10th/Matriculation with at least 35% marks. Medical Lab Technology requires 12th in the Medical stream with at least 35% marks. Lateral entry to the 3rd semester is available through 10+2 with relevant subjects or Class 10th plus a 2-year ITI in a relevant/allied trade, subject to current JKBOTE rules.",
  },
  {
    q: "How are candidates selected?",
    a: "JKBOTE prepares the merit list based on the qualifying examination and applicable admission rules.",
  },
  {
    q: "Where do I apply?",
    a: "Applications are submitted online through the official JKBOTE admission portal.",
  },
  {
    q: "Is there an upper age limit?",
    a: "No upper age bar is prescribed for admission to polytechnic courses, subject to applicable rules.",
  },
] as const;

export const ADMISSIONS_DATES_NOTE = "To be announced";

const SUPERSEDED_COPY = new Set([
  "Explore diploma programmes, eligibility, application steps, required documents\nand important admission updates at Government Polytechnic for Women, Srinagar.",
  "Everything you need to apply — eligibility, process, important dates, fee structure and documents required.",
  "Admission information for diploma programmes at Government Polytechnic for Women, Srinagar, including eligibility, application procedure, documents, merit and important admission updates.",
  "Official diploma admissions information for Government Polytechnic for Women, Srinagar.",
  "Admissions are conducted through the Jammu & Kashmir Board of Technical Education (JKBOTE).",
  "[ADD OFFICIAL FEE STRUCTURE]",
  "Fee details are published in the official admission notification and on the Notices page when released by the institute.",
  "Fee shown is indicative and should be verified against the latest official admission notification / institute instructions.",
  "Eligibility depends on the diploma programme selected and the requirements prescribed by the J&K Board of Technical Education.",
  "Eligibility depends on the programme you choose. Check the applicable qualification before starting your application.",
  "Always verify the latest JKBOTE admission notification before applying.",
  "There is no upper age bar for admission to polytechnic courses, subject to the applicable admission rules.",
  "Document requirements may vary according to the admission notification and category claimed. Always check the latest JKBOTE instructions before submitting the application.",
  "Total sanctioned intake: 240 seats.",
  "View Admission Notice",
]);

const LEGACY_ELIGIBILITY_MARKERS = [
  "Passed Secondary School Examination",
  "Passed 12th examination in the Medical stream with at least 35%",
  "prescribed minimum qualification requirements",
  "General diploma programmes",
];

const LEGACY_STEP_TITLES = new Set([
  "Register Online",
  "Select Programme",
  "Submit & Verify",
  "Merit & Counselling",
  "Notification",
  "Commencement",
]);

export function isAdmissionPlaceholder(value: string | null | undefined): boolean {
  const v = (value ?? "").trim();
  if (!v) return true;
  return /\[add\b/i.test(v) || /lorem ipsum/i.test(v);
}

export function filledAdmissionText(value: string | null | undefined, fallback: string): string {
  const v = (value ?? "").trim();
  if (!v || isAdmissionPlaceholder(v) || SUPERSEDED_COPY.has(v)) return fallback;
  return v;
}

export function displayAdmissionDate(
  value: string | null | undefined,
  emptyFallback = "To be announced",
): string {
  const v = (value ?? "").trim();
  if (!v || isAdmissionPlaceholder(v) || v === "—" || /^to be notified$/i.test(v)) {
    return emptyFallback;
  }
  return v;
}

function normalizeDateLabel(label: string): string {
  const l = label.toLowerCase();
  if (l.includes("notification")) return "notification";
  if (l.includes("opens") || (l.includes("application") && l.includes("open"))) return "opens";
  if (l.includes("deadline") || (l.includes("last") && l.includes("application"))) return "deadline";
  if (l.includes("merit") || l.includes("joining") || l.includes("counselling") || l.includes("counseling")) {
    return "merit";
  }
  return l;
}

export function resolveAdmissionDates(
  cms: readonly { label: string; date_value: string }[],
): { label: string; date_value: string }[] {
  const hasLegacyShape =
    cms.length === 0 ||
    cms.length !== 4 ||
    cms.some(
      (d) =>
        isAdmissionPlaceholder(d.date_value) ||
        /^counselling$/i.test(d.label) ||
        /^session begins$/i.test(d.label) ||
        /^online application opens$/i.test(d.label) ||
        /^application last date$/i.test(d.label) ||
        /^merit list$/i.test(d.label) ||
        /^admission \/ joining$/i.test(d.label),
    );

  if (!hasLegacyShape) {
    return cms.map((row) => ({
      label: row.label,
      date_value: displayAdmissionDate(
        row.date_value,
        /merit/i.test(row.label) ? "As notified by JKBOTE" : "To be announced",
      ),
    }));
  }

  const cmsByKey = new Map(cms.map((d) => [normalizeDateLabel(d.label), d.date_value]));
  return ADMISSIONS_DATES.map((row) => {
    const fallback = /merit/i.test(row.label) ? "As notified by JKBOTE" : "To be announced";
    return {
      label: row.label,
      date_value: displayAdmissionDate(cmsByKey.get(normalizeDateLabel(row.label)) ?? row.date_value, fallback),
    };
  });
}

export function resolveAdmissionSteps(
  cms: readonly { title: string; description: string }[],
): { t: string; d: string }[] {
  const titles = new Set(cms.map((s) => s.title));
  const legacy =
    cms.length === 0 ||
    cms.length !== ADMISSIONS_STEPS.length ||
    [...titles].some((title) => LEGACY_STEP_TITLES.has(title));
  if (legacy) return ADMISSIONS_STEPS.map((s) => ({ t: s.t, d: s.d }));
  return cms.map((s) => ({ t: s.title, d: s.description }));
}

export function resolveAdmissionDocuments(
  cms: readonly { label: string; detail?: string | null }[],
): { label: string; detail: string }[] {
  const legacy =
    cms.length === 0 ||
    cms.some(
      (d) =>
        /aadhaar/i.test(d.label) ||
        d.label === "Class 10th marks certificate" ||
        d.label === "Domicile Certificate" ||
        d.label === "Qualifying Examination Marks Certificate",
    );
  if (legacy) return ADMISSIONS_DOCUMENTS.map((d) => ({ label: d.label, detail: d.detail }));
  return cms.map((d) => ({ label: d.label, detail: (d.detail ?? "").trim() }));
}

export function resolveAdmissionFaqs(cms: readonly { question: string; answer: string }[]): { q: string; a: string }[] {
  const legacy =
    cms.length === 0 ||
    cms.some(
      (f) =>
        /hostel/i.test(f.question) ||
        isAdmissionPlaceholder(f.answer) ||
        f.question === "Who can apply?",
    );
  if (legacy) return ADMISSIONS_FAQS.map((f) => ({ q: f.q, a: f.a }));
  return cms.map((f) => ({ q: f.question, a: f.answer }));
}

export function resolveAdmissionEligibility(
  cms: readonly { heading: string; body: string }[],
): AdmissionEligibilityCard[] {
  const headings = cms.map((group) => group.heading.toLowerCase());
  const legacy =
    cms.length !== ADMISSIONS_ELIGIBILITY_GROUPS.length ||
    !headings.some((heading) => heading.includes("lateral")) ||
    !headings.some((heading) => heading.includes("medical")) ||
    cms.some(
      (group) =>
        LEGACY_ELIGIBILITY_MARKERS.some(
          (marker) => group.body.includes(marker) || group.heading === marker,
        ),
    );

  if (legacy) {
    return ADMISSIONS_ELIGIBILITY_GROUPS.map((group) => ({ ...group }));
  }

  return cms.map((group) => parseEligibilityGroup(group.heading, group.body));
}

export type ResolvedAdmissionProgramme = AdmissionProgrammeSeed & { sort_order: number };

function canonicalProgramme(name: string): AdmissionProgrammeSeed | undefined {
  const key = name.trim().toLowerCase();
  return ADMISSIONS_PROGRAMMES.find((p) => p.name.toLowerCase() === key);
}

export function resolveAdmissionProgrammes(
  cms: readonly {
    name: string;
    credential?: string | null;
    duration?: string | null;
    seats: number;
    category?: string | null;
    slug?: string | null;
    badge?: string | null;
    badge_note?: string | null;
    sort_order: number;
    is_active?: boolean;
  }[],
): ResolvedAdmissionProgramme[] {
  const active = cms.filter((p) => p.is_active !== false);
  const hasCategories = active.some((p) => (p.category ?? "").trim());

  if (active.length === 0 || !hasCategories) {
    return ADMISSIONS_PROGRAMMES.map((programme, index) => {
      const match = active.find((p) => p.name.trim().toLowerCase() === programme.name.toLowerCase());
      return {
        ...programme,
        credential: match?.credential?.trim() || programme.credential,
        duration: match?.duration?.trim() || programme.duration,
        seats: match?.seats || programme.seats,
        sort_order: index + 1,
      };
    });
  }

  return [...active]
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((programme, index) => {
      const fallback = canonicalProgramme(programme.name);
      return {
        name: programme.name,
        credential: programme.credential?.trim() || fallback?.credential || "Diploma",
        duration: programme.duration?.trim() || fallback?.duration || "3 Years",
        seats: programme.seats || fallback?.seats || 30,
        category: programme.category?.trim() || fallback?.category || "",
        slug: programme.slug?.trim() || fallback?.slug || "",
        badge: programme.badge?.trim() || fallback?.badge || "",
        badge_note: programme.badge_note?.trim() || fallback?.badge_note || "",
        sort_order: programme.sort_order || index + 1,
      };
    });
}

export function programmeDurationLabel(duration: string, credential = "Diploma"): string {
  const d = duration.trim();
  if (!d) return "3-Year Diploma";
  if (/^3[\s-]*years?$/i.test(d)) return "3-Year Diploma";
  if (/diploma/i.test(d)) return d;
  return `${d} ${credential}`.trim();
}

export function totalProgrammeSeats(programmes: readonly { seats: number }[]): number {
  return programmes.reduce((sum, p) => sum + p.seats, 0);
}

export function admissionProgrammeInsert(
  cycleId: string,
  programme: AdmissionProgrammeSeed,
  sortOrder: number,
) {
  return {
    cycle_id: cycleId,
    name: programme.name,
    credential: programme.credential,
    duration: programme.duration,
    seats: programme.seats,
    category: programme.category,
    slug: programme.slug,
    badge: programme.badge,
    badge_note: programme.badge_note,
    sort_order: sortOrder,
    is_active: true,
  };
}
