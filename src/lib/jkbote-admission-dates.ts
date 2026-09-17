/** Types and defaults for JKBOTE-sourced Important Admission Dates */

export type AdmissionDateRow = {
  label: string;
  date_value: string;
  /** Official notice URL when this row is backed by a live notice */
  href?: string;
};

export type JkboteAdmissionPortalStatus = "open" | "closed" | "unknown";

export type JkboteAdmissionDatesPayload = {
  fetchedAt: string;
  ok: boolean;
  error?: string;
  sourcePages: string[];
  portalStatus: JkboteAdmissionPortalStatus;
  portalUrl: string;
  /** Latest relevant admission notice (for source label / click-through) */
  latestNotice: {
    title: string;
    publishedAt: string;
    date: string;
    url: string;
  } | null;
  rows: AdmissionDateRow[];
};

export const JKBOTE_ADMISSION_PORTAL_URL = "https://admission.jkbote.ac.in/";

/** Official board notice hosts used for admission date sync */
export const JKBOTE_ADMISSION_SOURCE_PAGES = [
  "https://jkbote.ac.in/",
  "https://jkbote.ac.in/notice.php",
  JKBOTE_ADMISSION_PORTAL_URL,
] as const;

/** Refresh official admission dates at most this often (8 hours) */
export const JKBOTE_ADMISSION_DATES_TTL_MS = 8 * 60 * 60 * 1000;

export const ADMISSION_DATE_LABELS = [
  "Admission Notification",
  "Application Opens",
  "Application Deadline",
  "Merit / Admission Updates",
] as const;

export function emptyAdmissionDateRows(): AdmissionDateRow[] {
  return [
    { label: "Admission Notification", date_value: "To be announced" },
    { label: "Application Opens", date_value: "To be announced" },
    { label: "Application Deadline", date_value: "To be announced" },
    { label: "Merit / Admission Updates", date_value: "To be announced" },
  ];
}

export function formatAdmissionSourceUpdated(iso: string | undefined): string {
  if (!iso) return "—";
  const ms = Date.parse(iso);
  if (!Number.isFinite(ms)) return "—";
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: "Asia/Kolkata",
  }).format(new Date(ms));
}
