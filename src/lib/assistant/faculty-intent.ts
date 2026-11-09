/**
 * Faculty / HOD questions — answer from official external + institute sources
 * (JKBOTE intake list, Faculty page, Principal profile). No invented names.
 */

import {
  FACULTY_DIRECTORY_NOTE,
  FACULTY_LEADERSHIP,
  FACULTY_VERIFIED,
} from "@/lib/faculty-data";
import {
  COMPUTER_ENGINEERING_FACULTY_STAFF,
  FOOD_TECH_FACULTY_STAFF,
  GARMENT_FACULTY_STAFF,
  OMCA_FACULTY_STAFF,
  TEXTILE_FACULTY_STAFF,
  TRAVEL_TOURISM_FACULTY_STAFF,
} from "@/lib/department-faculty-data";

const CSE_RE =
  /\b(cse|computer\s*eng|computer\s*science|comp\.?\s*eng|hod\s+of\s+cse|head\s+of\s+(?:the\s+)?cse)\b/i;

const OMCA_RE =
  /\b(omca|office\s*management|office\s*mgmt|hod\s+of\s+omca|head\s+of\s+(?:the\s+)?omca)\b/i;

const TEXTILE_RE =
  /\b(textile|textile\s*tech|textile\s*technology|hod\s+of\s+textile|head\s+of\s+(?:the\s+)?textile)\b/i;

const GARMENT_RE =
  /\b(garment|garment\s*tech|garment\s*technology|fashion|hod\s+of\s+garment|head\s+of\s+(?:the\s+)?garment)\b/i;

const TOURISM_RE =
  /\b(travel|tourism|travel\s*(?:and|&)\s*tourism|hod\s+of\s+travel|head\s+of\s+(?:the\s+)?(?:travel|tourism))\b/i;

const FOOD_TECH_RE =
  /\b(food|food\s*tech|food\s*technology|hod\s+of\s+food|head\s+of\s+(?:the\s+)?food)\b/i;

const FACULTY_ASK_RE =
  /\b(hod|h\.o\.d|head\s+of\s+(?:the\s+)?(?:dept|department)|faculty|lecturer|staff|who\s+is|principal)\b/i;

export function detectFacultyIntent(userMessage: string): boolean {
  return FACULTY_ASK_RE.test(userMessage.trim());
}

export function isComputerEngineeringFacultyAsk(userMessage: string): boolean {
  const text = userMessage.trim();
  return FACULTY_ASK_RE.test(text) && CSE_RE.test(text);
}

export function isOmcaFacultyAsk(userMessage: string): boolean {
  const text = userMessage.trim();
  return FACULTY_ASK_RE.test(text) && OMCA_RE.test(text);
}

export function isTextileFacultyAsk(userMessage: string): boolean {
  const text = userMessage.trim();
  return FACULTY_ASK_RE.test(text) && TEXTILE_RE.test(text);
}

export function isGarmentFacultyAsk(userMessage: string): boolean {
  const text = userMessage.trim();
  return FACULTY_ASK_RE.test(text) && GARMENT_RE.test(text);
}

export function isTourismFacultyAsk(userMessage: string): boolean {
  const text = userMessage.trim();
  return FACULTY_ASK_RE.test(text) && TOURISM_RE.test(text);
}

export function isFoodTechFacultyAsk(userMessage: string): boolean {
  const text = userMessage.trim();
  return FACULTY_ASK_RE.test(text) && FOOD_TECH_RE.test(text);
}

/** Deterministic reply for CSE HOD / faculty contact from official department listing. */
export function buildComputerEngineeringFacultyReply(): string {
  const { hod, faculty, nonTeachingStaff } = COMPUTER_ENGINEERING_FACULTY_STAFF;
  const facultyNames = faculty.map((f) => `${f.name} (${f.designation})`).join(", ");

  return `For the **Computer Engineering Department** at Government Polytechnic for Women, Srinagar:

- **Head of Department (In Charge):** ${hod.name} (${hod.designation})
  - Contact: ${hod.contact}
  - Email: ${hod.email}
- **Faculty Members:** ${facultyNames}
- **Non-Teaching Staff:** ${nonTeachingStaff?.map((s) => `${s.name} (${s.designation})`).join(", ") ?? "—"}

You can view complete details, qualifications, experience, and subject specializations under the [Computer Engineering Department Page](/academics/departments/computer-engineering#faculty-staff).`;
}

/** Deterministic reply for OMCA HOD / faculty contact from official department listing. */
export function buildOmcaFacultyReply(): string {
  const { hod, faculty } = OMCA_FACULTY_STAFF;
  const facultyNames = faculty.map((f) => `${f.name} (${f.designation})`).join(", ");

  return `For the **Office Management & Computer Applications (OMCA) Department** at Government Polytechnic for Women, Srinagar:

- **Head of Department:** ${hod.name} (${hod.designation})
  - Contact: ${hod.contact}
  - Email: ${hod.email}
- **Faculty Members:** ${facultyNames}

You can view complete details, qualifications, experience, and subject specializations under the [OMCA Department Page](/academics/departments/office-management-computer-applications#faculty-information).`;
}

/** Deterministic reply for Textile Technology HOD / faculty contact. */
export function buildTextileFacultyReply(): string {
  const { hod, faculty } = TEXTILE_FACULTY_STAFF;
  const facultyNames = faculty.map((f) => `${f.name} (${f.designation})`).join(", ");

  return `For the **Textile Technology Department** at Government Polytechnic for Women, Srinagar:

- **Head of Department:** ${hod.name} (${hod.designation})
  - Contact: ${hod.contact}
  - Email: ${hod.email}
- **Faculty Members:** ${facultyNames}

You can view complete details under the [Textile Technology Department Page](/academics/departments/textile-technology#faculty-information).`;
}

/** Deterministic reply for Garment Technology HOD / faculty contact. */
export function buildGarmentFacultyReply(): string {
  const { hod, faculty } = GARMENT_FACULTY_STAFF;
  const facultyNames = faculty.map((f) => `${f.name} (${f.designation})`).join(", ");

  return `For the **Garment Technology Department** at Government Polytechnic for Women, Srinagar:

- **Head of Department:** ${hod.name} (${hod.designation})
  - Contact: ${hod.contact}
  - Email: ${hod.email}
- **Faculty Members:** ${facultyNames}

You can view complete details under the [Garment Technology Department Page](/academics/departments/garment-technology#faculty-information).`;
}

/** Deterministic reply for Travel & Tourism HOD / faculty contact. */
export function buildTourismFacultyReply(): string {
  const { hod, faculty } = TRAVEL_TOURISM_FACULTY_STAFF;
  const facultyNames = faculty.map((f) => `${f.name} (${f.designation})`).join(", ");

  return `For the **Travel & Tourism Department** at Government Polytechnic for Women, Srinagar:

- **Head of Department:** ${hod.name} (${hod.designation})
  - Contact: ${hod.contact}
- **Faculty Members:** ${facultyNames}

You can view complete details under the [Travel & Tourism Department Page](/academics/departments/travel-tourism#faculty-information).`;
}

/** Deterministic reply for Food Technology HOD / faculty contact. */
export function buildFoodTechFacultyReply(): string {
  const { hod, faculty } = FOOD_TECH_FACULTY_STAFF;
  const facultyNames = faculty.map((f) => `${f.name} (${f.designation})`).join(", ");

  return `For the **Food Technology Department** at Government Polytechnic for Women, Srinagar:

- **Head of Department:** ${hod.name} (${hod.designation})
  - Contact: ${hod.contact}
  - Email: ${hod.email}
- **Faculty Members:** ${facultyNames}

You can view complete details under the [Food Technology Department Page](/academics/departments/food-technology#faculty-information).`;
}

export function buildFacultySystemHint(userMessage: string): string {
  const cseAsk = isComputerEngineeringFacultyAsk(userMessage);
  const omcaAsk = isOmcaFacultyAsk(userMessage);
  const textileAsk = isTextileFacultyAsk(userMessage);
  const garmentAsk = isGarmentFacultyAsk(userMessage);
  const tourismAsk = isTourismFacultyAsk(userMessage);
  const foodTechAsk = isFoodTechFacultyAsk(userMessage);

  const people = FACULTY_VERIFIED.map(
    (p) =>
      `- ${p.name} — ${p.designation} (${p.department})${p.phone ? `; phone ${p.phone}` : ""} [source: ${p.source}]`,
  ).join("\n");

  return `
FACULTY_OFFICIAL_SOURCES (use these — do not invent names from general knowledge):
- Principal: ${FACULTY_LEADERSHIP.name}, ${FACULTY_LEADERSHIP.role}
- Computer Engineering HOD: ${COMPUTER_ENGINEERING_FACULTY_STAFF.hod.name} (${COMPUTER_ENGINEERING_FACULTY_STAFF.hod.designation}), Phone: ${COMPUTER_ENGINEERING_FACULTY_STAFF.hod.contact}, Email: ${COMPUTER_ENGINEERING_FACULTY_STAFF.hod.email}
- OMCA HOD: ${OMCA_FACULTY_STAFF.hod.name} (${OMCA_FACULTY_STAFF.hod.designation}), Phone: ${OMCA_FACULTY_STAFF.hod.contact}, Email: ${OMCA_FACULTY_STAFF.hod.email}
- Textile Technology HOD: ${TEXTILE_FACULTY_STAFF.hod.name} (${TEXTILE_FACULTY_STAFF.hod.designation}), Phone: ${TEXTILE_FACULTY_STAFF.hod.contact}, Email: ${TEXTILE_FACULTY_STAFF.hod.email}
- Garment Technology HOD: ${GARMENT_FACULTY_STAFF.hod.name} (${GARMENT_FACULTY_STAFF.hod.designation}), Phone: ${GARMENT_FACULTY_STAFF.hod.contact}, Email: ${GARMENT_FACULTY_STAFF.hod.email}
- Travel & Tourism HOD: ${TRAVEL_TOURISM_FACULTY_STAFF.hod.name} (${TRAVEL_TOURISM_FACULTY_STAFF.hod.designation}), Phone: ${TRAVEL_TOURISM_FACULTY_STAFF.hod.contact}
- Food Technology HOD: ${FOOD_TECH_FACULTY_STAFF.hod.name} (${FOOD_TECH_FACULTY_STAFF.hod.designation}), Phone: ${FOOD_TECH_FACULTY_STAFF.hod.contact}, Email: ${FOOD_TECH_FACULTY_STAFF.hod.email}
- Verified JKBOTE / institute contacts:
${people || "- (none beyond Principal)"}
- Faculty page: /faculty
- JKBOTE intake: https://admission.jkbote.ac.in/intake.html
- ${FACULTY_DIRECTORY_NOTE}

${
  cseAsk
    ? `USER ASKED ABOUT CSE / COMPUTER ENGINEERING FACULTY OR HOD:
- Answer with Er. Roshan Ara as In Charge / Head of Department (Contact: 9858411446, Email: roshaanara@gmail.com).`
    : omcaAsk
      ? `USER ASKED ABOUT OMCA / OFFICE MANAGEMENT FACULTY OR HOD:
- Answer with Shabina Nazir as Head of Department (Contact: +91 88250 60365, Email: shabinabasu@gmail.com).`
      : textileAsk
        ? `USER ASKED ABOUT TEXTILE TECHNOLOGY FACULTY OR HOD:
- Answer with Harish Chander as Head of Department (Contact: +91 7006446534, Email: harishch@outlook.com).`
        : garmentAsk
          ? `USER ASKED ABOUT GARMENT TECHNOLOGY FACULTY OR HOD:
- Answer with Fozia Yusuf Mir as Head of Department (Contact: +91 96979 71503, Email: foziyayusufmir974@gmail.com).`
          : tourismAsk
            ? `USER ASKED ABOUT TRAVEL & TOURISM FACULTY OR HOD:
- Answer with Ms. Ruksana Bashir as Head of Department (Contact: +91 9419201594).`
            : foodTechAsk
              ? `USER ASKED ABOUT FOOD TECHNOLOGY FACULTY OR HOD:
- Answer with Dr. Anjum Riyaz as Head of Department (Contact: +91 6005734357, Email: syedanjum.0599@gmail.com).`
              : `If asked for an HOD/faculty name not listed above: say that name is not on official public lists yet, give Principal + any related verified contact, and offer [Faculty & Staff](/faculty) and [Contact](/contact).`
}`;
}
