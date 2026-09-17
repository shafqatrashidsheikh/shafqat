/**
 * Official people the vision model may identify against (institute + JKBOTE sources only).
 */

import { FACULTY_LEADERSHIP, FACULTY_VERIFIED } from "@/lib/faculty-data";
import { PRINCIPAL } from "@/lib/principal-data";

export function buildOfficialIdentityRoster(): string {
  const faculty = FACULTY_VERIFIED.map(
    (p) =>
      `- ${p.name} — ${p.designation}, ${p.department} (source: ${p.sourceUrl ?? p.source})`,
  ).join("\n");

  return `OFFICIAL IDENTITY ROSTER (verify photos against this — do not invent other names):
- ${PRINCIPAL.name} — ${PRINCIPAL.role}, ${PRINCIPAL.institute}. Official portrait is published on [Principal's Message](/principal-message) and [Faculty](/faculty).
  Visual cues: often seated at a desk with a nameplate reading PRINCIPAL / PRINCIPAL'S OFFICE; formal suit; institute office setting.
${faculty || "- (no other named faculty published yet)"}
- If the student photo clearly matches the official Principal portrait or shows the PRINCIPAL nameplate in a GPW Srinagar office context, identify him as ${PRINCIPAL.name}, ${FACULTY_LEADERSHIP.role}.
- If you are given an OFFICIAL REFERENCE portrait in the same turn, compare faces carefully and say whether it is the same person.
- If the person is not in this roster, describe what you see and say the name is not on official public institute/JKBOTE lists yet. Offer [Faculty & Staff](/faculty) and [Contact](/contact).`;
}

export function buildVisionIdentityHint(): string {
  return `The student attached a photo. Use the OFFICIAL IDENTITY ROSTER and any OFFICIAL REFERENCE portrait in this turn to verify who appears in the image. Prefer official names over "I am not sure" when the match is clear (especially Principal / PRINCIPAL nameplate). Do not invent names that are not on the roster.`;
}
