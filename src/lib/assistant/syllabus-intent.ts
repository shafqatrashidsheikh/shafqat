/**
 * Detect syllabus / curriculum asks and return the official JKBOTE semester PDF.
 * Board PDFs are multi-branch — Computer Engineering section is inside the same file.
 */

import { JKBOTE_SEMESTER_CURRICULUM_FALLBACK } from "@/lib/jkbote-syllabus";

const PROGRAMME_ALIASES: { slug: string; name: string; patterns: RegExp }[] = [
  {
    slug: "computer-engineering",
    name: "Computer Engineering",
    patterns: /\b(cse|computer\s*eng|computer\s*science|comp\.?\s*eng)\b/i,
  },
  {
    slug: "electronics-communication-engineering",
    name: "Electronics & Communication Engineering",
    patterns: /\b(ece|electronics|e\s*&\s*c|communication)\b/i,
  },
  {
    slug: "textile-technology",
    name: "Textile Technology",
    patterns: /\btextile\b/i,
  },
  {
    slug: "medical-lab-technology",
    name: "Medical Lab Technology",
    patterns: /\b(mlt|medical\s*lab)\b/i,
  },
  {
    slug: "office-management-computer-applications",
    name: "Office Management & Computer Applications",
    patterns: /\b(omca|office\s*management)\b/i,
  },
  {
    slug: "travel-tourism",
    name: "Travel & Tourism",
    patterns: /\b(travel|tourism)\b/i,
  },
  {
    slug: "food-technology",
    name: "Food Technology",
    patterns: /\bfood\s*tech/i,
  },
  {
    slug: "garment-technology",
    name: "Garment Technology",
    patterns: /\bgarment\b/i,
  },
];

function detectSemester(text: string): 1 | 2 | 3 | 4 | 5 | 6 | null {
  const m =
    text.match(/\b(?:sem(?:ester)?|sem\.?)\s*[-\s]*([1-6]|i{1,3}|iv|v|vi)\b/i) ||
    text.match(/\b([1-6]|i{1,3}|iv|v|vi)(?:st|nd|rd|th)?\s*(?:sem(?:ester)?)\b/i);
  if (!m) return null;
  const raw = m[1].toLowerCase();
  const map: Record<string, 1 | 2 | 3 | 4 | 5 | 6> = {
    "1": 1,
    "2": 2,
    "3": 3,
    "4": 4,
    "5": 5,
    "6": 6,
    i: 1,
    ii: 2,
    iii: 3,
    iv: 4,
    v: 5,
    vi: 6,
  };
  return map[raw] ?? null;
}

export type SyllabusIntent = {
  semester: 1 | 2 | 3 | 4 | 5 | 6;
  programmeName: string | null;
  pdfHref: string;
  pdfLabel: string;
};

export function detectSyllabusIntent(userMessage: string): SyllabusIntent | null {
  const text = userMessage.trim();
  if (!/(syllabus|curriculum|scheme|study\s*scheme)/i.test(text)) return null;
  // “all semesters” → let the model list every PDF from the system prompt
  if (/\ball\s+sem/i.test(text)) return null;

  const semester = detectSemester(text) ?? 1;
  const programme = PROGRAMME_ALIASES.find((p) => p.patterns.test(text)) ?? null;
  const board =
    JKBOTE_SEMESTER_CURRICULUM_FALLBACK.find((s) => s.semester === semester) ??
    JKBOTE_SEMESTER_CURRICULUM_FALLBACK[0];

  return {
    semester,
    programmeName: programme?.name ?? null,
    pdfHref: board.href,
    pdfLabel: `Download ${board.label} syllabus PDF (JKBOTE)`,
  };
}

/** Extra system hint so the model returns the PDF link, not a “go to Downloads” answer. */
export function buildSyllabusReplyHint(intent: SyllabusIntent): string {
  const programmeLine = intent.programmeName
    ? `Programme mentioned: ${intent.programmeName} (find this branch inside the Board PDF).`
    : "If a programme was mentioned, tell the user to open the matching branch section inside the PDF.";

  return `
SYLLABUS_REQUEST_DETECTED:
- User wants the syllabus PDF itself, not directions to another page.
- Reply with a short confirmation, then this markdown download link exactly:
  [${intent.pdfLabel}](${intent.pdfHref})
- ${programmeLine}
- Note briefly that JKBOTE semester PDFs cover multiple diploma branches in one file.
- Do NOT say “go to Downloads” or “visit the website section” as the main answer.
- Do NOT invent subject lists if not in knowledge — the PDF is the source.`;
}

/** Deterministic reply — guarantees a clickable official PDF link in chat. */
export function buildSyllabusDirectReply(intent: SyllabusIntent): string {
  const forWhom = intent.programmeName
    ? ` for ${intent.programmeName}`
    : "";
  return `Here is the official JKBOTE Semester ${intent.semester} curriculum PDF${forWhom}. Board semester files cover multiple diploma branches — open the PDF and use your programme section.\n\n[${intent.pdfLabel}](${intent.pdfHref})`;
}
