/**
 * Result / datesheet questions — answer from live JKBOTE notices.
 * Example: "6th sem result aya?" → Haan/Nahi + date + official notice link.
 */

import type { LiveNotice } from "@/lib/jkbote-live";

export const JKBOTE_RESULT_NOTICES_URL = "https://jkbote.ac.in/noticeResult.php";
export const JKBOTE_PORTAL_URL = "https://jkbote.ac.in/";

const RESULT_ASK_RE =
  /\b(result|results|gazette|re-?eval(?:uation)?|marks?\s*card|marksheet|score\s*card)\b|result\s*(aya|aaya|aa\s*gaya|nikla|declare|out|publish)|aya\s*(kya)?\s*result|result\s*kab/i;

const DATESHEET_ASK_RE =
  /\b(date\s*sheet|datesheet|exam\s*schedule|time\s*table)\b/i;

const ORDINAL_MAP: Record<string, number> = {
  "1": 1,
  "2": 2,
  "3": 3,
  "4": 4,
  "5": 5,
  "6": 6,
  "7": 7,
  "8": 8,
  first: 1,
  second: 2,
  third: 3,
  fourth: 4,
  fifth: 5,
  sixth: 6,
  seventh: 7,
  eighth: 8,
  i: 1,
  ii: 2,
  iii: 3,
  iv: 4,
  v: 5,
  vi: 6,
  vii: 7,
  viii: 8,
};

function parseSemesterToken(raw: string): number | null {
  const key = raw.toLowerCase().replace(/\./g, "");
  return ORDINAL_MAP[key] ?? null;
}

/** Extract semester numbers mentioned in free text (query or notice title). */
export function extractSemesters(text: string): number[] {
  const found = new Set<number>();
  const patterns = [
    /\b(?:sem(?:ester)?|sem\.?)\s*[-\s]*([1-8]|i{1,3}|iv|v|vi|vii|viii|first|second|third|fourth|fifth|sixth)\b/gi,
    /\b([1-8]|i{1,3}|iv|v|vi|vii|viii)(?:st|nd|rd|th)?\s*(?:sem(?:ester)?)\b/gi,
    /\b(first|second|third|fourth|fifth|sixth)\s+semester\b/gi,
  ];
  for (const re of patterns) {
    let m: RegExpExecArray | null;
    while ((m = re.exec(text)) !== null) {
      const n = parseSemesterToken(m[1]!);
      if (n) found.add(n);
    }
  }
  return [...found].sort((a, b) => a - b);
}

function isResultNotice(n: Pick<LiveNotice, "title" | "category" | "sourcePage">): boolean {
  return (
    n.category === "Results" ||
    /result|re-?evaluation|gazette/i.test(n.title) ||
    /noticeResult/i.test(n.sourcePage)
  );
}

function isDatesheetNotice(n: Pick<LiveNotice, "title" | "category" | "sourcePage">): boolean {
  return (
    n.category === "Datesheet" ||
    /date\s*sheet|datesheet/i.test(n.title) ||
    /noticeDatesheet/i.test(n.sourcePage)
  );
}

export type ResultIntentKind = "result" | "datesheet";

export type ResultIntent = {
  kind: ResultIntentKind;
  semesters: number[];
};

export function detectResultIntent(userMessage: string): ResultIntent | null {
  const text = userMessage.trim();
  if (!text) return null;
  const wantsResult = RESULT_ASK_RE.test(text);
  const wantsDatesheet = DATESHEET_ASK_RE.test(text);
  if (!wantsResult && !wantsDatesheet) return null;
  return {
    kind: wantsResult ? "result" : "datesheet",
    semesters: extractSemesters(text),
  };
}

export type ResultNoticeHit = {
  title: string;
  date: string;
  publishedAt: string;
  url: string;
  matchedSemesters: number[];
};

function noticeMatchesSemester(title: string, asked: number[]): boolean {
  if (asked.length === 0) return true;
  const inTitle = extractSemesters(title);
  if (inTitle.length === 0) {
    // Generic "diploma result" / "all semester" — treat as match when user asked a specific sem
    return /all\s+sem|diploma\s+exam|declaration\s+of\s+result/i.test(title);
  }
  return asked.some((s) => inTitle.includes(s));
}

export function findResultNotices(
  notices: LiveNotice[],
  intent: ResultIntent,
): ResultNoticeHit[] {
  const pool = notices.filter((n) =>
    intent.kind === "result" ? isResultNotice(n) : isDatesheetNotice(n),
  );

  const ranked = pool
    .map((n) => {
      const matchedSemesters = extractSemesters(n.title).filter((s) =>
        intent.semesters.length === 0 ? true : intent.semesters.includes(s),
      );
      const matches = noticeMatchesSemester(n.title, intent.semesters);
      return { n, matchedSemesters, matches };
    })
    .filter((x) => x.matches)
    .sort((a, b) => {
      const ta = Date.parse(a.n.publishedAt) || 0;
      const tb = Date.parse(b.n.publishedAt) || 0;
      return tb - ta;
    });

  return ranked.slice(0, 4).map(({ n, matchedSemesters }) => ({
    title: n.title,
    date: n.date,
    publishedAt: n.publishedAt,
    url: n.url,
    matchedSemesters,
  }));
}

function formatWhen(dateLabel: string, publishedAt: string): string {
  const ms = Date.parse(publishedAt);
  if (Number.isFinite(ms)) {
    try {
      return new Intl.DateTimeFormat("en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
        timeZone: "Asia/Kolkata",
      }).format(new Date(ms));
    } catch {
      /* fall through */
    }
  }
  return dateLabel || publishedAt;
}

function semLabel(semesters: number[]): string {
  if (semesters.length === 0) return "diploma";
  const ordinal = (n: number) => {
    if (n === 1) return "1st";
    if (n === 2) return "2nd";
    if (n === 3) return "3rd";
    return `${n}th`;
  };
  if (semesters.length === 1) return `${ordinal(semesters[0]!)} semester`;
  return `semester ${semesters.map(ordinal).join(" & ")}`;
}

export function buildResultDirectReply(
  intent: ResultIntent,
  notices: LiveNotice[],
  options?: { fetchedAt?: string; english?: boolean },
): string {
  const hits = findResultNotices(notices, intent);
  const topic = intent.kind === "result" ? "result" : "date sheet";
  const asked = semLabel(intent.semesters);
  const checked = options?.fetchedAt
    ? formatWhen("", options.fetchedAt)
    : null;
  const english = options?.english !== false;

  const resultChipLabel =
    intent.kind === "result" ? "Open official result" : "Open official notice";

  if (hits.length === 0) {
    if (english) {
      return [
        `No — I do not see an official JKBOTE ${topic} notice for ${asked} in the latest Board updates yet.`,
        checked ? `Last checked: ${checked} (IST).` : null,
        `[JKBOTE result notices](${JKBOTE_RESULT_NOTICES_URL}) · [Examination & Results](/examination)`,
        `When the Board publishes it, ask again and I will share the official link.`,
      ]
        .filter(Boolean)
        .join("\n\n");
    }
    return [
      `Nahi — abhi latest JKBOTE updates mein ${asked} ka official ${topic} notice nahi dikh raha.`,
      checked ? `Last checked: ${checked} (IST).` : null,
      `[JKBOTE result notices](${JKBOTE_RESULT_NOTICES_URL}) · [Examination & Results](/examination)`,
      `Jab Board publish kare, phir poochho — main official link de dunga.`,
    ]
      .filter(Boolean)
      .join("\n\n");
  }

  const primary = hits[0]!;
  const when = formatWhen(primary.date, primary.publishedAt);
  const more =
    hits.length > 1
      ? `\n\nRelated:\n${hits
          .slice(1)
          .map(
            (h) =>
              `- ${h.title}\n  [${resultChipLabel}](${h.url}) · ${formatWhen(h.date, h.publishedAt)}`,
          )
          .join("\n")}`
      : "";

  if (english) {
    return [
      `Yes — an official JKBOTE ${topic} for ${asked} is published.`,
      `Listed: ${when} (IST).`,
      primary.title,
      `[${resultChipLabel}](${primary.url})`,
      more.trim() || null,
      checked ? `Synced from JKBOTE · checked ${checked} (IST).` : null,
      `Use your roll number on the Board page for personal marks when the notice directs you there.`,
    ]
      .filter(Boolean)
      .join("\n\n");
  }

  return [
    `Haan — ${asked} ke liye official JKBOTE ${topic} notice aa chuka hai.`,
    `Date / time: ${when} (IST).`,
    primary.title,
    `[${resultChipLabel}](${primary.url})`,
    more.trim() || null,
    checked ? `JKBOTE se sync · checked ${checked} (IST).` : null,
    `Personal marksheet Board page pe roll number se milegi jab notice uska link de.`,
  ]
    .filter(Boolean)
    .join("\n\n");
}

/** Hint for the model when we still route through LLM (non-English polish). */
export function buildResultSystemHint(
  intent: ResultIntent,
  notices: LiveNotice[],
  fetchedAt?: string,
): string {
  const hits = findResultNotices(notices, intent);
  const payload = {
    kind: intent.kind,
    askedSemesters: intent.semesters,
    checkedAt: fetchedAt ?? null,
    matches: hits,
    resultBoardPage: JKBOTE_RESULT_NOTICES_URL,
  };
  return `
RESULT_QUERY_OFFICIAL_DATA (answer only from this — do not invent results):
${JSON.stringify(payload, null, 2)}

INSTRUCTIONS:
- If matches is non-empty: say YES clearly, give date/time (IST), quote the notice title in plain text, then add ONE markdown chip link like [Open official result](url) — never paste a raw https:// URL.
- If matches is empty: say NO / not published yet in latest JKBOTE feed, give last checked time, and markdown-link ${JKBOTE_RESULT_NOTICES_URL} and /examination.
- Never invent student marks. Only share official declaration notices and Board links.
`;
}
