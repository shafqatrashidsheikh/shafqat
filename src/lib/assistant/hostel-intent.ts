import { HOSTEL_RULES, HOSTEL_RULES_SUMMARY } from "@/lib/hostel-data";

const ROOM_WORDS =
  /\b(hostel\s*room|room\s*mate|roommate|room\s*no|vacant\s*bed|empty\s*bed|khali\s*room|kon\s*rehta|who\s*is\s*in\s*(the\s*)?room|bed\s*(number|no)?|allotment|allocation)\b/i;

const HOSTEL_GENERAL =
  /\b(hostel\s*rules?|hostel\s*facility|hostel\s*mess|hostel\s*timing|hostel\s*leave|can\s*i\s*get\s*hostel)\b/i;

export type HostelIntent = "roster" | "rules" | "general" | null;

export function detectHostelIntent(message: string): HostelIntent {
  const text = message.trim();
  if (!text) return null;
  if (ROOM_WORDS.test(text)) return "roster";
  if (HOSTEL_GENERAL.test(text) || /\bhostel\b/i.test(text)) {
    if (/\brules?\b|\bdiscipline\b|\bmess\b|\bleave\b|\btiming/i.test(text)) return "rules";
    return "general";
  }
  return null;
}

export function buildHostelDeniedReply(kind: "anonymous" | "pending" | "rejected"): string {
  if (kind === "anonymous") {
    return [
      "Hostel room vacancy and roommate details are private.",
      "Sign up / log in as a student, complete your profile, and wait for HOD approval. After approval you can ask the assistant about vacant beds and roommates.",
      "",
      "Public hostel rules (summary):",
      HOSTEL_RULES_SUMMARY,
      "",
      "See also: [Hostel](/hostel) · [Sign up](/signup) · [Login](/login)",
    ].join("\n");
  }
  if (kind === "rejected") {
    return [
      "Your student account was not approved, so roommate and vacancy details stay locked for privacy.",
      "Contact your department HOD or the institute office if you need a review.",
      "",
      "Hostel rules summary:",
      HOSTEL_RULES_SUMMARY,
      "",
      "[Hostel](/hostel) · [Contact](/contact)",
    ].join("\n");
  }
  return [
    "Roommate and vacant-bed details unlock only after your HOD (or authorised reviewer) approves your student profile.",
    "Finish onboarding if needed, then wait for approval. Until then only public hostel guidance is available.",
    "",
    "Hostel rules summary:",
    HOSTEL_RULES_SUMMARY,
    "",
    "[Student portal](/student) · [Hostel](/hostel)",
  ].join("\n");
}

export function buildHostelRulesReply(): string {
  return [
    "Hostel rules at GPW Srinagar (women residents):",
    ...HOSTEL_RULES.map((rule, index) => `${index + 1}. ${rule}`),
    "",
    "Room vacancy and roommate names are shown only to HOD-approved logged-in students.",
    "[Hostel](/hostel) · [Student welfare](/student-welfare)",
  ].join("\n");
}

export type HostelRoomSnapshot = {
  code: string;
  floor: string | null;
  capacity: number;
  vacantBeds: string[];
  occupied: Array<{
    bed: string;
    studentName: string;
    department: string;
    rollNumber: string | null;
  }>;
};

export function buildHostelRosterReply(rooms: HostelRoomSnapshot[]): string {
  if (!rooms.length) {
    return [
      "No active hostel rooms are published in the system yet. Ask the hostel office / principal to enter allotments.",
      "",
      buildHostelRulesReply(),
    ].join("\n");
  }

  const lines: string[] = [
    "Hostel occupancy (visible only because you are an approved student — keep this private):",
    "",
  ];

  for (const room of rooms) {
    lines.push(
      `Room ${room.code}${room.floor ? ` (${room.floor} floor)` : ""} — ${room.capacity} beds`,
    );
    if (room.occupied.length) {
      for (const person of room.occupied) {
        lines.push(
          `  · Bed ${person.bed}: ${person.studentName}` +
            (person.department ? ` — ${person.department}` : "") +
            (person.rollNumber ? ` (Roll ${person.rollNumber})` : ""),
        );
      }
    } else {
      lines.push("  · No residents allocated yet");
    }
    if (room.vacantBeds.length) {
      lines.push(`  · Vacant beds: ${room.vacantBeds.join(", ")}`);
    } else {
      lines.push("  · No vacant beds");
    }
    lines.push("");
  }

  lines.push("Rules reminder:");
  lines.push(...HOSTEL_RULES.slice(0, 5).map((rule, index) => `${index + 1}. ${rule}`));
  lines.push(`…and ${HOSTEL_RULES.length - 5} more on [Hostel](/hostel).`);
  return lines.join("\n");
}

export function buildHostelSystemHint(rooms: HostelRoomSnapshot[] | null, access: string): string {
  if (access !== "allowed" || !rooms) {
    return `HOSTEL_PRIVACY: The user is NOT allowed to see roommate names or vacant beds (${access}). Give only public rules / how to get HOD approval. Never invent occupants.`;
  }
  return `HOSTEL_ROSTER_JSON (approved student only — answer from this; do not invent people):\n${JSON.stringify(rooms)}\n\nHOSTEL_RULES:\n${HOSTEL_RULES.map((r, i) => `${i + 1}. ${r}`).join("\n")}`;
}
