/**
 * Faculty / HOD questions — answer from official external + institute sources
 * (JKBOTE intake list, Faculty page, Principal profile). No invented names.
 */

import {
  FACULTY_DIRECTORY_NOTE,
  FACULTY_LEADERSHIP,
  FACULTY_VERIFIED,
} from "@/lib/faculty-data";

const CSE_RE =
  /\b(cse|computer\s*eng|computer\s*science|comp\.?\s*eng|hod\s+of\s+cse|head\s+of\s+(?:the\s+)?cse)\b/i;

const FACULTY_ASK_RE =
  /\b(hod|h\.o\.d|head\s+of\s+(?:the\s+)?(?:dept|department)|faculty|lecturer|staff|who\s+is|principal)\b/i;

export function detectFacultyIntent(userMessage: string): boolean {
  return FACULTY_ASK_RE.test(userMessage.trim());
}

export function isComputerEngineeringFacultyAsk(userMessage: string): boolean {
  const text = userMessage.trim();
  return FACULTY_ASK_RE.test(text) && CSE_RE.test(text);
}

/** Deterministic reply for CSE HOD / faculty contact from JKBOTE official list. */
export function buildComputerEngineeringFacultyReply(): string {
  const cse = FACULTY_VERIFIED.find((p) =>
    /computer/i.test(p.department),
  );

  if (!cse) {
    return `A full HOD directory is not published yet. See [Faculty & Staff](/faculty) or [Contact](/contact) for the institute office.`;
  }

  const phoneLine = cse.phone
    ? `\n\nOfficial contact number listed by JKBOTE: ${cse.phone}`
    : "";

  return `For Computer Engineering at Government Polytechnic for Women, Bemina Srinagar, the official JKBOTE admission contact is:

${cse.name}
${cse.designation}${phoneLine}

Note: JKBOTE lists this person as Lecturer (A/A), Computer Engineering — not as a separate “HOD” title. If you need a formal HOD confirmation, contact the institute office via [Contact](/contact) or see [Faculty & Staff](/faculty).

Source: [JKBOTE admission intake](${cse.sourceUrl ?? "https://admission.jkbote.ac.in/intake.html"})`;
}

export function buildFacultySystemHint(userMessage: string): string {
  const cseAsk = isComputerEngineeringFacultyAsk(userMessage);
  const people = FACULTY_VERIFIED.map(
    (p) =>
      `- ${p.name} — ${p.designation} (${p.department})${p.phone ? `; phone ${p.phone}` : ""} [source: ${p.source}]`,
  ).join("\n");

  return `
FACULTY_OFFICIAL_SOURCES (use these — do not invent names from general knowledge):
- Principal: ${FACULTY_LEADERSHIP.name}, ${FACULTY_LEADERSHIP.role}
- Verified JKBOTE / institute contacts:
${people || "- (none beyond Principal)"}
- Faculty page: /faculty
- JKBOTE intake: https://admission.jkbote.ac.in/intake.html
- ${FACULTY_DIRECTORY_NOTE}

${
  cseAsk
    ? `USER ASKED ABOUT CSE / COMPUTER ENGINEERING FACULTY OR HOD:
- Answer with Suhail Ahmad Nehvi as the official JKBOTE-listed Computer Engineering lecturer / admission contact.
- Clarify that the Board listing uses “Lecturer (A/A), Computer Engineering”, not a separate HOD title.
- Include the phone if present and the JKBOTE source link.
- Do NOT say only “not in knowledge base” or only “visit Faculty page” without giving this verified contact.`
    : `If asked for an HOD/faculty name not listed above: say that name is not on official public lists yet, give Principal + any related verified contact, and offer [Faculty & Staff](/faculty) and [Contact](/contact).`
}`;
}
