/**
 * Instant FAQ capabilities — answered without calling the LLM.
 * Covers the chips students tap most; keeps replies fast and verified.
 */

import {
  ADMISSIONS_DOCUMENTS_NOTE,
  ADMISSIONS_ELIGIBILITY_GROUPS,
  ADMISSIONS_ELIGIBILITY_NOTE,
  ADMISSIONS_FEE_AMOUNT,
  ADMISSIONS_FEE_NOTE,
  ADMISSIONS_STEPS,
  JKBOTE_APPLY_URL,
} from "@/lib/admissions-data";
import { ASSISTANT_LANGUAGE_LIST, type AssistantLanguage } from "@/lib/assistant/language-intent";
import { CAMPUS_FACILITIES } from "@/lib/campus-data";
import { GPW_DEPARTMENTS } from "@/lib/departments-data";
import { HOSTEL_RULES } from "@/lib/hostel-data";
import type { LiveNotice } from "@/lib/jkbote-live";
import { INSTITUTE } from "@/lib/site-data";

export type AssistantCapability =
  | "admissions"
  | "apply"
  | "eligibility"
  | "documents"
  | "fees"
  | "programs"
  | "campus"
  | "library"
  | "hostel-public"
  | "examinations"
  | "notices"
  | "contact"
  | "placements"
  | "faculty"
  | "downloads"
  | "principal"
  | "about"
  | "languages"
  | "portal"
  | "dates"
  | "calendar"
  | "welfare"
  | "syllabus-help";

type ReplyPair = { english: string; local: string };

export type LiveCapabilitySlice = {
  fetchedAt: string;
  admissionPortal: {
    status: "open" | "closed" | "unknown";
    portalUrl: string;
    checkedAt: string;
  };
  admissionDates: {
    portalStatus: "open" | "closed" | "unknown";
    portalUrl: string;
    latestNotice: { title: string; date: string; url: string } | null;
    rows: { label: string; date_value: string; href?: string }[];
  };
  recentNotices: Pick<LiveNotice, "title" | "date" | "url" | "category">[];
};

function isLocal(language: AssistantLanguage): boolean {
  return language !== "english";
}

function pick(pair: ReplyPair, language: AssistantLanguage): string {
  return isLocal(language) ? pair.local : pair.english;
}

const PROGRAMME_LINES = GPW_DEPARTMENTS.map(
  (d) =>
    `- ${d.name} (${d.duration}, ${d.stream}) — [/academics/departments/${d.slug}](/academics/departments/${d.slug})`,
).join("\n");

const FACILITY_LINES = CAMPUS_FACILITIES.slice(0, 10)
  .map((f) => `- ${f.name}: ${f.description}`)
  .join("\n");

const ELIGIBILITY_LINES = ADMISSIONS_ELIGIBILITY_GROUPS.map(
  (g) => `- ${g.heading} (${g.badge}): ${g.highlight}. ${g.body}`,
).join("\n");

const STEP_LINES = ADMISSIONS_STEPS.map((s, i) => `${i + 1}. ${s.t} — ${s.d}`).join("\n");

const HOSTEL_RULE_LINES = HOSTEL_RULES.slice(0, 6)
  .map((r) => `- ${r}`)
  .join("\n");

const LANGUAGE_LINES = ASSISTANT_LANGUAGE_LIST.map((name, i) => `${i + 1}. ${name}`).join("\n");

const CAPABILITY_REPLIES: Record<
  Exclude<AssistantCapability, "notices" | "portal" | "dates">,
  ReplyPair
> = {
  admissions: {
    english: `Admissions at Government Polytechnic for Women, Srinagar are conducted through the J&K Board of Technical Education (JKBOTE).

How to apply:
${STEP_LINES}

Official portal: [JKBOTE Apply Online](${JKBOTE_APPLY_URL})
Institute page: [Admissions](/admissions)
Latest notices: [Updates](/updates/notices)`,
    local: `GPW Srinagar mein admission JKBOTE (J&K Board of Technical Education) ke through hota hai.

Apply kaise karein:
${STEP_LINES}

Official portal: [JKBOTE Apply Online](${JKBOTE_APPLY_URL})
College page: [Admissions](/admissions)
Latest notices: [Updates](/updates/notices)`,
  },
  apply: {
    english: `Apply online on the official JKBOTE admission portal — that is the only application channel for GPW Srinagar diploma admissions.

[Apply on JKBOTE](${JKBOTE_APPLY_URL})
Process overview: [Admissions](/admissions)`,
    local: `GPW Srinagar diploma admission ke liye sirf official JKBOTE portal pe apply karein.

[JKBOTE pe Apply karein](${JKBOTE_APPLY_URL})
Poora process: [Admissions](/admissions)`,
  },
  eligibility: {
    english: `Eligibility depends on the entry route and programme (always confirm the latest JKBOTE notification):

${ELIGIBILITY_LINES}

${ADMISSIONS_ELIGIBILITY_NOTE}

Details: [Admissions](/admissions) · Portal: [JKBOTE](${JKBOTE_APPLY_URL})`,
    local: `Eligibility programme aur entry route pe depend karti hai (latest JKBOTE notice zaroor check karein):

${ELIGIBILITY_LINES}

${ADMISSIONS_ELIGIBILITY_NOTE}

Details: [Admissions](/admissions) · Portal: [JKBOTE](${JKBOTE_APPLY_URL})`,
  },
  documents: {
    english: `Required certificates and photograph must be uploaded in the format prescribed in the latest JKBOTE admission notification.

${ADMISSIONS_DOCUMENTS_NOTE}

See: [Admissions](/admissions) · [JKBOTE portal](${JKBOTE_APPLY_URL}) · Forms: [Downloads](/downloads)`,
    local: `Documents latest JKBOTE admission notification ke hisaab se upload karne hote hain (certificates + photo).

${ADMISSIONS_DOCUMENTS_NOTE}

Dekhein: [Admissions](/admissions) · [JKBOTE portal](${JKBOTE_APPLY_URL}) · Forms: [Downloads](/downloads)`,
  },
  fees: {
    english: `Published annual fee reference for GPW Srinagar diploma programmes: ${ADMISSIONS_FEE_AMOUNT}.

${ADMISSIONS_FEE_NOTE}

Confirm on [Admissions](/admissions) and the latest JKBOTE notice before paying.`,
    local: `GPW Srinagar diploma programmes ka published annual fee reference: ${ADMISSIONS_FEE_AMOUNT}.

${ADMISSIONS_FEE_NOTE}

Payment se pehle [Admissions](/admissions) aur latest JKBOTE notice confirm karein.`,
  },
  programs: {
    english: `GPW Srinagar offers eight three-year diploma programmes affiliated to JKBOTE:

${PROGRAMME_LINES}

Browse all: [Academics](/academics)`,
    local: `GPW Srinagar pe JKBOTE-affiliated 8 three-year diploma programmes hain:

${PROGRAMME_LINES}

Sab dekhein: [Academics](/academics)`,
  },
  campus: {
    english: `Campus facilities at Government Polytechnic for Women, Srinagar (Bemina) include:

${FACILITY_LINES}

More photos and details: [Campus](/campus)`,
    local: `GPW Srinagar (Bemina) campus facilities:

${FACILITY_LINES}

Zyada photos/details: [Campus](/campus)`,
  },
  library: {
    english: `The institute library supports diploma study with reading and learning resources on campus.

Open: [Library](/library)
Campus overview: [Campus](/campus)`,
    local: `Institute library campus pe reading aur learning resources ke liye available hai.

Page: [Library](/library)
Campus: [Campus](/campus)`,
  },
  "hostel-public": {
    english: `GPW Srinagar provides residential hostel support for eligible women diploma students (seats limited; allotment by official notice).

Public rules (summary):
${HOSTEL_RULE_LINES}

Full page: [Hostel](/hostel)
Roommate / vacant-bed details need a logged-in, approved student account.`,
    local: `GPW Srinagar eligible women diploma students ke liye hostel support deta hai (seats limited; allotment official notice se).

Public rules (summary):
${HOSTEL_RULE_LINES}

Poora page: [Hostel](/hostel)
Roommate / vacant bed details ke liye login + approved student account chahiye.`,
  },
  examinations: {
    english: `Examination schedules, datesheets and result notices are published by JKBOTE.

Institute page: [Examination](/examination)
JKBOTE results board: [JKBOTE Results](https://jkbote.ac.in/noticeResult.php)
JKBOTE home: [jkbote.ac.in](https://jkbote.ac.in/)
Ask me “6th sem result aya?” for a live notice check.`,
    local: `Exam schedules, datesheets aur results JKBOTE publish karta hai.

College page: [Examination](/examination)
JKBOTE results: [JKBOTE Results](https://jkbote.ac.in/noticeResult.php)
JKBOTE home: [jkbote.ac.in](https://jkbote.ac.in/)
Live check ke liye poochhein: “6th sem result aya?”`,
  },
  contact: {
    english: `Government Polytechnic for Women, Srinagar

Address: ${INSTITUTE.address}
Phone: ${INSTITUTE.phone}
Email: ${INSTITUTE.email}

[Contact page](/contact) · [Map & location](/contact#location)`,
    local: `Government Polytechnic for Women, Srinagar

Address: ${INSTITUTE.address}
Phone: ${INSTITUTE.phone}
Email: ${INSTITUTE.email}

[Contact page](/contact) · [Map & location](/contact#location)`,
  },
  placements: {
    english: `Placement support and career information for diploma students is summarised on the Placements page. Outcomes vary by student performance and market conditions — no guaranteed percentages are published here.

Open: [Placements](/placements)`,
    local: `Diploma students ke liye placement / career info Placements page pe hai. Outcomes student performance aur market pe depend karti hain — yahan guaranteed % publish nahi hain.

Page: [Placements](/placements)`,
  },
  faculty: {
    english: `Leadership and verified faculty contacts are on the Faculty page. For Computer Engineering lecturer details from the official JKBOTE intake list, ask “Computer Engineering faculty”.

Open: [Faculty & Staff](/faculty)`,
    local: `Leadership aur verified faculty contacts Faculty page pe hain. Computer Engineering lecturer (JKBOTE intake list) ke liye poochhein: “Computer Engineering faculty”.

Page: [Faculty & Staff](/faculty)`,
  },
  downloads: {
    english: `Forms, curriculum links and institute downloads are collected here:

[Downloads](/downloads)
Syllabus PDFs: ask “1st semester syllabus” or open [Academics](/academics)`,
    local: `Forms, curriculum aur institute downloads yahan hain:

[Downloads](/downloads)
Syllabus PDF: “1st semester syllabus” poochhein ya [Academics](/academics) kholen.`,
  },
  principal: {
    english: `Read the Principal’s message and official note on the institute website.

[Principal’s Message](/principal-message)`,
    local: `Principal ka official message website pe available hai.

[Principal’s Message](/principal-message)`,
  },
  about: {
    english: `Government Polytechnic for Women, Srinagar (est. ${INSTITUTE.established}) is a government technical institute at Bemina offering JKBOTE-affiliated diploma programmes for women.

[About the Institute](/about) · [Academics](/academics) · [Campus](/campus)`,
    local: `Government Polytechnic for Women, Srinagar (${INSTITUTE.established} se) Bemina mein government technical institute hai — women ke liye JKBOTE-affiliated diploma programmes.

[About](/about) · [Academics](/academics) · [Campus](/campus)`,
  },
  languages: {
    english: `I can reply in these languages (same facts and official links in every language):

${LANGUAGE_LINES}

Ask in any of these, or say “Urdu mein batao” / “Kashmiri mein” to switch. Mic works for spoken questions too.`,
    local: `Main in languages mein reply kar sakta hoon (facts aur official links same rehte hain):

${LANGUAGE_LINES}

In mein se kisi mein poochhein, ya “Urdu mein batao” / “Kashmiri mein” bol kar switch karein. Mic se bhi sawal poochh sakte hain.`,
  },
  calendar: {
    english: `Academic calendar and term dates are published on the institute Academic Calendar page (confirm the latest PDF/notice there).

Open: [Academic Calendar](/academic-calendar)
Related: [Examination](/examination) · [Notices](/updates/notices)`,
    local: `Academic calendar / term dates Academic Calendar page pe publish hote hain (latest PDF/notice wahan confirm karein).

Page: [Academic Calendar](/academic-calendar)
Related: [Examination](/examination) · [Notices](/updates/notices)`,
  },
  welfare: {
    english: `Student welfare, anti-ragging support and reporting guidance are on the Student Welfare page.

Open: [Student Welfare](/student-welfare)
Contact office: [Contact](/contact)`,
    local: `Student welfare, anti-ragging support aur reporting guidance Student Welfare page pe hain.

Page: [Student Welfare](/student-welfare)
Office: [Contact](/contact)`,
  },
  "syllabus-help": {
    english: `Official JKBOTE semester syllabus PDFs are available here.

Ask like: “1st semester Computer Engineering syllabus PDF”
Or open: [Academics](/academics) · [Downloads](/downloads)`,
    local: `Official JKBOTE semester syllabus PDFs yahan se milte hain.

Aise poochhein: “1st semester Computer Engineering syllabus PDF”
Ya kholen: [Academics](/academics) · [Downloads](/downloads)`,
  },
};

const NOTICES_FALLBACK: ReplyPair = {
  english: `Official updates are listed on this website and on JKBOTE.

[Latest notices](/updates/notices)
[News](/updates/news) · [Circulars](/updates/circulars) · [Events](/updates/events)
JKBOTE: [jkbote.ac.in](https://jkbote.ac.in/)`,
  local: `Official updates is website aur JKBOTE pe milti hain.

[Latest notices](/updates/notices)
[News](/updates/news) · [Circulars](/updates/circulars) · [Events](/updates/events)
JKBOTE: [jkbote.ac.in](https://jkbote.ac.in/)`,
};

/** Detect a high-confidence FAQ capability from the user message. */
export function detectCapabilityIntent(text: string): AssistantCapability | null {
  const t = text.trim();
  if (!t || t.length > 480) return null;

  // More specific first
  if (
    /\b(which\s*languages?|kya\s*languages?|kitni\s*languages?|languages?\s*(do\s*you|you\s*support|supported)|urdu\s*hinglish\s*kashmiri|reply\s*languages?)\b/i.test(
      t,
    )
  ) {
    return "languages";
  }
  if (/\b(eligib|paatrata|yogya|10th|12th\s*medical|lateral\s*entr)/i.test(t)) return "eligibility";
  if (/\b(document|certificate|upload\s*doc|marksheet\s*upload|photo\s*size)\b/i.test(t))
    return "documents";
  if (/\b(fee|fees|charges|kitna\s*paisa|annual\s*fee|tuition)\b/i.test(t)) return "fees";
  if (
    /\b(portal\s*(open|status|band)|admission\s*portal|is\s*(the\s*)?(jkbote\s*)?portal|online\s*admission\s*portal)\b/i.test(
      t,
    )
  ) {
    return "portal";
  }
  if (
    /\b(important\s*dates?|admission\s*dates?|last\s*date|deadline|key\s*dates?)\b/i.test(t) &&
    !/\bresult\b/i.test(t)
  ) {
    return "dates";
  }
  if (/\b(apply\s*online|online\s*apply|admission\s*portal|jkbote\s*portal|kaise\s*apply)\b/i.test(t))
    return "apply";
  if (/\b(admission|dakhla|pravesh|apply|application\s*process|how\s*do\s*i\s*apply)\b/i.test(t))
    return "admissions";
  if (
    /\b(program|programme|course|courses|diploma|department|departments|branch|branches)\b/i.test(t) &&
    !/\bsyllabus\b/i.test(t)
  ) {
    return "programs";
  }
  if (/\b(syllabus|curriculum)\b/i.test(t) && !/\b(sem(?:ester)?\s*[1-6]|[1-6](?:st|nd|rd|th)?\s*sem)/i.test(t)) {
    return "syllabus-help";
  }
  if (/\b(library|kitabein|reading\s*room)\b/i.test(t)) return "library";
  if (
    /\b(hostel\s*rule|hostel\s*facilit|does\s*.*hostel|hostel\s*hai|have\s*hostel)\b/i.test(t)
  ) {
    return "hostel-public";
  }
  if (/\b(campus|facilit|laborator|workshop|playground)\b/i.test(t)) return "campus";
  if (/\b(examination|exams?|datesheet|date\s*sheet|exam\s*schedules?)\b/i.test(t) && !/\bresult\b/i.test(t))
    return "examinations";
  if (
    /\b(notice|notices|notification|notifications|circular|circulars|latest\s*(official\s*)?(jkbote\s*)?(notice|notification|update|updates)|summarise\s*the\s*latest|latest\s*(update|updates|notification|notifications))\b/i.test(
      t,
    ) &&
    !/\bresult\b/i.test(t)
  ) {
    return "notices";
  }
  if (/\b(contact|location|address|phone|email|map|where\s*is|bemina|call\s*kar|how\s*can\s*i\s*contact)\b/i.test(t))
    return "contact";
  if (/\b(placement|placements|career|job\s*opportunit)\b/i.test(t)) return "placements";
  if (/\b(faculty|staff|hod|lecturer|teacher|teachers)\b/i.test(t)) return "faculty";
  if (/\b(download|form\s*download|prospectus|all\s*semester\s*syllabus)\b/i.test(t)) return "downloads";
  if (/\b(principal|principals?\s*message|principal.?s\s*corner)\b/i.test(t)) return "principal";
  if (/\b(academic\s*calendar|term\s*dates?|session\s*calendar)\b/i.test(t)) return "calendar";
  if (/\b(student\s*welfare|anti-?\s*ragging|ragging)\b/i.test(t)) return "welfare";
  if (/\b(about\s*(the\s*)?(institute|college|gpw)|institute\s*history|kab\s*bana)\b/i.test(t))
    return "about";

  return null;
}

export function buildCapabilityDirectReply(
  capability: Exclude<AssistantCapability, "notices" | "portal" | "dates">,
  language: AssistantLanguage,
): string {
  return pick(CAPABILITY_REPLIES[capability], language);
}

/** Live notices summary — still instant (no LLM), uses already-fetched feed. */
export function buildNoticesDirectReply(
  notices: Pick<LiveNotice, "title" | "date" | "url" | "category">[],
  language: AssistantLanguage,
  fetchedAt?: string,
): string {
  const top = notices.slice(0, 5);
  if (!top.length) {
    return pick(NOTICES_FALLBACK, language);
  }

  const lines = top
    .map((n, i) => `${i + 1}. ${n.title} (${n.date}) — [${n.category}](${n.url})`)
    .join("\n");

  const stamp = fetchedAt ? ` (checked ${new Date(fetchedAt).toLocaleString("en-IN")})` : "";

  if (isLocal(language)) {
    return `Latest official JKBOTE / feed notices${stamp}:\n\n${lines}\n\nAur dekhein: [Updates](/updates/notices) · [JKBOTE](https://jkbote.ac.in/)`;
  }

  return `Latest official notices${stamp}:\n\n${lines}\n\nMore: [Updates](/updates/notices) · [JKBOTE](https://jkbote.ac.in/)`;
}

export function buildPortalDirectReply(
  live: LiveCapabilitySlice | null,
  language: AssistantLanguage,
): string {
  const portal = live?.admissionPortal;
  const url = portal?.portalUrl ?? JKBOTE_APPLY_URL;
  const status = portal?.status ?? "unknown";
  const checked = portal?.checkedAt
    ? new Date(portal.checkedAt).toLocaleString("en-IN")
    : live?.fetchedAt
      ? new Date(live.fetchedAt).toLocaleString("en-IN")
      : "just now";

  const statusLine =
    status === "open"
      ? isLocal(language)
        ? "JKBOTE online admission portal abhi OPEN dikh raha hai."
        : "The JKBOTE online admission portal currently appears OPEN."
      : status === "closed"
        ? isLocal(language)
          ? "JKBOTE online admission portal abhi CLOSED / not accepting looks like."
          : "The JKBOTE online admission portal currently appears CLOSED / not accepting applications."
        : isLocal(language)
          ? "Portal status abhi confirm nahi ho paya — official link se check karein."
          : "Portal status could not be confirmed right now — please verify on the official link.";

  if (isLocal(language)) {
    return `${statusLine}

Checked: ${checked}
Portal: [JKBOTE Admission](${url})
Process: [Admissions](/admissions)`;
  }

  return `${statusLine}

Checked: ${checked}
Portal: [JKBOTE Admission](${url})
Process: [Admissions](/admissions)`;
}

export function buildDatesDirectReply(
  live: LiveCapabilitySlice | null,
  language: AssistantLanguage,
): string {
  const rows = live?.admissionDates.rows?.slice(0, 8) ?? [];
  const latest = live?.admissionDates.latestNotice;
  const url = live?.admissionDates.portalUrl ?? JKBOTE_APPLY_URL;

  if (!rows.length && !latest) {
    return isLocal(language)
      ? `Important admission dates latest JKBOTE notice / portal pe confirm karein.

[JKBOTE Admission](${url})
[Admissions](/admissions)
[Notices](/updates/notices)`
      : `Important admission dates should be confirmed from the latest JKBOTE notice or portal.

[JKBOTE Admission](${url})
[Admissions](/admissions)
[Notices](/updates/notices)`;
  }

  const lines = rows.map((r) => `- ${r.label}: ${r.date_value}${r.href ? ` — [link](${r.href})` : ""}`).join("\n");
  const noticeLine = latest
    ? isLocal(language)
      ? `\nLatest related notice: ${latest.title} (${latest.date}) — [Open](${latest.url})`
      : `\nLatest related notice: ${latest.title} (${latest.date}) — [Open](${latest.url})`
    : "";

  if (isLocal(language)) {
    return `JKBOTE / admission important dates (live check):\n\n${lines || "(rows unavailable)"}${noticeLine}

Portal: [JKBOTE Admission](${url})
College: [Admissions](/admissions)`;
  }

  return `JKBOTE / admission important dates (live check):\n\n${lines || "(rows unavailable)"}${noticeLine}

Portal: [JKBOTE Admission](${url})
College: [Admissions](/admissions)`;
}

/** Capabilities that need a live JKBOTE fetch (still no LLM). */
export function capabilityNeedsLive(capability: AssistantCapability): boolean {
  return capability === "notices" || capability === "portal" || capability === "dates";
}

/**
 * Build the full instant reply for a capability.
 * Pass live context when capabilityNeedsLive(capability) is true.
 */
export function resolveCapabilityReply(
  capability: AssistantCapability,
  language: AssistantLanguage,
  live?: LiveCapabilitySlice | null,
): string {
  if (capability === "notices") {
    return buildNoticesDirectReply(live?.recentNotices ?? [], language, live?.fetchedAt);
  }
  if (capability === "portal") {
    return buildPortalDirectReply(live ?? null, language);
  }
  if (capability === "dates") {
    return buildDatesDirectReply(live ?? null, language);
  }
  return buildCapabilityDirectReply(capability, language);
}

/** True when this turn needs JKBOTE live fetch for the LLM path. */
export function needsLiveOfficialContext(text: string): boolean {
  return (
    /\b(result|gazette|re-?eval|datesheet|date\s*sheet|notice|notices|circular|portal\s*(open|status)|admission\s*date|important\s*date|apply\s*online|portal)\b/i.test(
      text,
    ) || /\b(aya|aaya|nikla|declare|out)\b/i.test(text)
  );
}
