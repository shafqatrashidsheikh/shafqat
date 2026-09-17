import type { LiveNotice } from "@/lib/jkbote-live";
import {
  emptyAdmissionDateRows,
  JKBOTE_ADMISSION_DATES_TTL_MS,
  JKBOTE_ADMISSION_PORTAL_URL,
  JKBOTE_ADMISSION_SOURCE_PAGES,
  type JkboteAdmissionDatesPayload,
} from "@/lib/jkbote-admission-dates";
import {
  readAdmissionDatesCache,
  writeAdmissionDatesCache,
} from "@/server/jkbote/admission-dates-cache";
import { fetchPortalStatus, rememberPortalStatus } from "@/server/jkbote/portal-status";
import { getLiveJkboteNotices } from "@/server/jkbote/sync";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function formatDisplayDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return iso;
  return `${String(d).padStart(2, "0")} ${MONTHS[m - 1]} ${y}`;
}

/** Parse an explicit calendar date from official notice title text only. */
export function parseExplicitDateFromTitle(title: string): string | null {
  const patterns = [
    /(?:last\s*date|deadline|closing\s*date|upto|up\s*to|till|until)[:\s]+(\d{1,2})[./-](\d{1,2})[./-](\d{2,4})/i,
    /(?:from|w\.?e\.?f\.?|commencing|starts?(?:\s+from)?)[:\s]+(\d{1,2})[./-](\d{1,2})[./-](\d{2,4})/i,
    /\b(\d{1,2})[./-](\d{1,2})[./-](20\d{2})\b/,
  ];

  for (const re of patterns) {
    const match = title.match(re);
    if (!match) continue;
    const day = Number(match[1]);
    const month = Number(match[2]);
    let year = Number(match[3]);
    if (year < 100) year += 2000;
    if (day < 1 || day > 31 || month < 1 || month > 12 || year < 2000) continue;
    return formatDisplayDate(
      `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
    );
  }
  return null;
}

function isAdmissionRelated(notice: LiveNotice): boolean {
  if (notice.category === "Admissions") return true;
  return /admission|lateral entry|selection list|merit list|online application|newly admitted/i.test(
    notice.title,
  );
}

function isMeritNotice(title: string): boolean {
  return /selection list|merit list|provisional selection|allotment/i.test(title);
}

function isApplicationCycleNotice(title: string): boolean {
  return /online application|online admission|admission application|admission notification|admission notice|inviting application|extension of online application|admission portal|admission for the (?:year|session)|diploma course for the year/i.test(
    title,
  );
}

function isPostAdmissionRegistration(title: string): boolean {
  return /newly admitted|registration forms for newly admitted/i.test(title);
}

function buildRows(
  notices: LiveNotice[],
): Pick<JkboteAdmissionDatesPayload, "rows" | "latestNotice"> {
  const rows = emptyAdmissionDateRows();
  const admissionNotices = notices
    .filter(isAdmissionRelated)
    .filter((n) => !/royal polytechnic|nits polytechnic|working professional/i.test(n.title))
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));

  const latestNotice =
    admissionNotices[0] != null
      ? {
          title: admissionNotices[0].title,
          publishedAt: admissionNotices[0].publishedAt,
          date: admissionNotices[0].date,
          url: admissionNotices[0].url,
        }
      : null;

  const cycleNotices = admissionNotices.filter(
    (n) =>
      isApplicationCycleNotice(n.title) &&
      !isMeritNotice(n.title) &&
      !isPostAdmissionRegistration(n.title),
  );
  const meritNotices = admissionNotices.filter((n) => isMeritNotice(n.title));

  // Admission Notification → publication date of latest cycle notice (official issue date)
  const notification = cycleNotices[0] ?? admissionNotices.find(
    (n) => !isMeritNotice(n.title) && !isPostAdmissionRegistration(n.title),
  );
  if (notification) {
    rows[0] = {
      label: "Admission Notification",
      date_value: notification.date,
      href: notification.url,
    };
  }

  // Application Opens / Deadline → ONLY when an explicit date appears in the official title
  for (const notice of [...cycleNotices].reverse()) {
    const explicit = parseExplicitDateFromTitle(notice.title);
    if (!explicit) continue;
    const isDeadline = /last\s*date|deadline|closing|upto|up\s*to|till|until/i.test(notice.title);
    const isOpen = /(?:from|w\.?e\.?f|commencing|starts?)/i.test(notice.title) && !isDeadline;
    if (isDeadline) {
      rows[2] = { label: "Application Deadline", date_value: explicit, href: notice.url };
    } else if (isOpen) {
      rows[1] = { label: "Application Opens", date_value: explicit, href: notice.url };
    }
  }

  // Merit / Admission Updates → publication date of latest selection/merit notice
  if (meritNotices.length > 0) {
    const merit = meritNotices[0]!;
    rows[3] = {
      label: "Merit / Admission Updates",
      date_value: merit.date,
      href: merit.url,
    };
  } else if (admissionNotices.some((n) => isPostAdmissionRegistration(n.title))) {
    const reg = admissionNotices.find((n) => isPostAdmissionRegistration(n.title));
    rows[3] = {
      label: "Merit / Admission Updates",
      date_value: "As notified by JKBOTE",
      href: reg?.url,
    };
  }

  return { rows, latestNotice };
}

function fallbackPayload(
  existing: JkboteAdmissionDatesPayload | null,
  error: string,
  nowIso: string,
): JkboteAdmissionDatesPayload {
  if (existing?.rows?.length === 4) {
    return {
      ...existing,
      ok: false,
      error,
      fetchedAt: existing.fetchedAt || nowIso,
    };
  }
  return {
    fetchedAt: nowIso,
    ok: false,
    error,
    sourcePages: [...JKBOTE_ADMISSION_SOURCE_PAGES],
    portalStatus: "unknown",
    portalUrl: JKBOTE_ADMISSION_PORTAL_URL,
    latestNotice: null,
    rows: emptyAdmissionDateRows(),
  };
}

export async function syncJkboteAdmissionDates(options?: {
  force?: boolean;
}): Promise<JkboteAdmissionDatesPayload> {
  const existing = readAdmissionDatesCache();
  const now = Date.now();
  const fetchedAtMs = existing?.fetchedAt ? Date.parse(existing.fetchedAt) : 0;

  if (
    !options?.force &&
    existing?.ok &&
    existing.rows.length === 4 &&
    Number.isFinite(fetchedAtMs) &&
    now - fetchedAtMs < JKBOTE_ADMISSION_DATES_TTL_MS
  ) {
    return existing;
  }

  const nowIso = new Date().toISOString();

  try {
    const [noticesPayload, portal] = await Promise.all([
      getLiveJkboteNotices({ force: options?.force === true, limit: 40 }),
      fetchPortalStatus(),
    ]);

    const { rows, latestNotice } = buildRows(noticesPayload.notices);
    const errors = [noticesPayload.error, portal.error].filter(Boolean);

    const payload: JkboteAdmissionDatesPayload = {
      fetchedAt: nowIso,
      ok: noticesPayload.ok || noticesPayload.notices.length > 0,
      sourcePages: [...JKBOTE_ADMISSION_SOURCE_PAGES],
      portalStatus: portal.status,
      portalUrl: JKBOTE_ADMISSION_PORTAL_URL,
      latestNotice,
      rows,
      ...(errors.length ? { error: errors.join("; ") } : {}),
    };

    rememberPortalStatus(portal.status, {
      error: portal.error,
      ok: !portal.error,
    });

    if (!payload.ok && existing?.rows?.length === 4) {
      return fallbackPayload(
        existing,
        payload.error ?? "JKBOTE admission sync incomplete; showing last cached dates.",
        nowIso,
      );
    }

    writeAdmissionDatesCache(payload);
    return payload;
  } catch (error) {
    return fallbackPayload(
      existing,
      error instanceof Error ? error.message : "JKBOTE admission dates sync failed",
      nowIso,
    );
  }
}

export async function getJkboteAdmissionDates(options?: {
  force?: boolean;
}): Promise<JkboteAdmissionDatesPayload> {
  return syncJkboteAdmissionDates(options);
}

/** Test helper — build rows from a notice list without network I/O */
export function deriveAdmissionDateRowsForTest(notices: LiveNotice[]) {
  return buildRows(notices);
}
