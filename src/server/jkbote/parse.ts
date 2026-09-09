import type { LiveNotice, LiveNoticeCategory } from "@/lib/jkbote-live";
import { JKBOTE_NEW_WINDOW_DAYS } from "@/lib/jkbote-live";

type RawParsed = {
  title: string;
  publishedAt: string;
  url: string;
  flaggedNew: boolean;
  sourcePage: string;
};

function decodeHtml(text: string): string {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&nbsp;/g, " ")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}

function stripTags(html: string): string {
  return decodeHtml(html.replace(/<[^>]+>/g, " "));
}

function absoluteUrl(href: string, pageUrl: string): string {
  try {
    return new URL(href, pageUrl).toString();
  } catch {
    return href;
  }
}

function formatDisplayDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return iso;
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${String(d).padStart(2, "0")} ${months[m - 1]} ${y}`;
}

function hashId(url: string, publishedAt: string, title: string): string {
  const raw = `${publishedAt}|${url}|${title}`.toLowerCase();
  let h = 0;
  for (let i = 0; i < raw.length; i++) h = (h * 31 + raw.charCodeAt(i)) >>> 0;
  return `jkbote-${publishedAt}-${h.toString(16)}`;
}

/** Parse JKBOTE notice rows: date cell + linked title. */
export function parseJkboteNoticeHtml(html: string, sourcePage: string): RawParsed[] {
  const rows: RawParsed[] = [];
  const re =
    /<(?:div|td)[^>]*>\s*(20\d{2}-\d{2}-\d{2})\s*<\/(?:div|td)>\s*<(?:div|td)[^>]*>\s*<a\b[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;

  let match: RegExpExecArray | null;
  while ((match = re.exec(html))) {
    const publishedAt = match[1] ?? "";
    const href = match[2] ?? "";
    const inner = match[3] ?? "";
    const flaggedNew = /\(\s*NEW\s*\)/i.test(inner) || /class=['"][^'"]*blink/i.test(inner);
    let title = stripTags(inner)
      .replace(/^\(\s*NEW\s*\)\s*/i, "")
      .replace(/\.\s*$/, "")
      .trim();
    if (!publishedAt || !href || title.length < 12) continue;
    if (/^https?:\/\/jkbote\.ac\.in\/?(index\.php)?$/i.test(href)) continue;

    rows.push({
      title,
      publishedAt,
      url: absoluteUrl(href, sourcePage),
      flaggedNew,
      sourcePage,
    });
  }

  return rows;
}

const EXCLUDE =
  /\bITI\b|SCVT|Royal Polytechnic|NITS Polytechnic|Working Professional|Brochure|Syllabus|Paper Code|Examination Calendar|Pre Registration for Upcoming|facebook|twitter|youtube|instagram|login|sign in/i;

const INCLUDE =
  /polytechnic|diploma|semester|lateral entry|admission|registration|selection list|merit list|datesheet|date sheet|re-?evaluation|result|examination form|NEP|MJ\d{2}|NEW Scheme|Govt\.?\s*Polytechnics|UT of J&K|Women Polytechnic|GPW|Medical Lab|MLT|passport-size photograph|online registration/i;

/**
 * Keep board-wide polytechnic / diploma notices applicable to GPW Srinagar.
 * Drop ITI-only, other-college-only, and static nav chrome links.
 */
export function isRelevantToGpw(title: string, url: string): boolean {
  const text = `${title} ${url}`;
  if (/Brochure_|\.pdf$/i.test(url) && /Brochure|Syllabus|Paper Code|AC\.pdf/i.test(text)) {
    return false;
  }
  // Explicit GPW / women polytechnic always kept
  if (/Women Polytechnic|Government Polytechnic for Women|GPW\s*Srinagar/i.test(text)) {
    return true;
  }
  // Pure ITI / SCVT vocational board items are out of scope for the college ticker
  if (/\bITI\b|SCVT|itiexamination\.jkbote/i.test(text) && !/polytechnic|diploma|semester/i.test(text)) {
    return false;
  }
  if (/Royal Polytechnic|NITS Polytechnic|Working Professional/i.test(text)) {
    return false;
  }
  // Jammu-only division sheets that omit Kashmir / all-UT wording
  if (/Jammu Division/i.test(text) && !/Kashmir|Ladakh|UT of J&K|All Govt/i.test(text)) {
    return false;
  }
  if (EXCLUDE.test(title) && !INCLUDE.test(title)) {
    return false;
  }
  return INCLUDE.test(text);
}

export function categorizeNotice(title: string, sourcePage: string): LiveNoticeCategory {
  const t = title.toLowerCase();
  if (/result|re-?evaluation|gazette/i.test(t) || /noticeResult/i.test(sourcePage)) return "Results";
  if (/date\s*sheet|datesheet|centre notice/i.test(t) || /noticeDatesheet/i.test(sourcePage)) {
    return "Datesheet";
  }
  if (/admission|lateral entry|selection list|merit list|registration forms for newly admitted/i.test(t)) {
    return "Admissions";
  }
  if (/photograph|diploma certificate|class work|academic/i.test(t)) return "Academics";
  if (/exam|pcnc|examination form/i.test(t) || /noticeExam/i.test(sourcePage)) return "Examination";
  return "General";
}

export function isWithinNewWindow(publishedAt: string, _firstSeenAt: string, now = Date.now()): boolean {
  const windowMs = JKBOTE_NEW_WINDOW_DAYS * 24 * 60 * 60 * 1000;
  const publishedMs = Date.parse(`${publishedAt}T00:00:00+05:30`);
  return Number.isFinite(publishedMs) && now - publishedMs <= windowMs;
}

export function toLiveNotice(
  raw: RawParsed,
  previous: Map<string, LiveNotice>,
  nowIso: string,
): LiveNotice {
  const id = hashId(raw.url, raw.publishedAt, raw.title);
  const prev = previous.get(id) ?? previous.get(raw.url);
  const firstSeenAt = prev?.firstSeenAt ?? nowIso;
  const isNew =
    raw.flaggedNew || isWithinNewWindow(raw.publishedAt, firstSeenAt, Date.parse(nowIso));

  return {
    id,
    title: raw.title,
    date: formatDisplayDate(raw.publishedAt),
    publishedAt: raw.publishedAt,
    category: categorizeNotice(raw.title, raw.sourcePage),
    url: raw.url,
    source: "JKBOTE",
    sourcePage: raw.sourcePage,
    isNew,
    firstSeenAt,
    lastSeenAt: nowIso,
  };
}

export function dedupeNotices(items: LiveNotice[]): LiveNotice[] {
  const byKey = new Map<string, LiveNotice>();
  for (const item of items) {
    const key = item.url.toLowerCase();
    const existing = byKey.get(key);
    if (!existing || item.publishedAt > existing.publishedAt) {
      byKey.set(key, item);
    }
  }
  return [...byKey.values()].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}
