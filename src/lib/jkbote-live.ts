export type LiveNoticeCategory =
  | "Admissions"
  | "Examination"
  | "Academics"
  | "Results"
  | "Datesheet"
  | "General";

export type LiveNotice = {
  id: string;
  title: string;
  date: string;
  publishedAt: string;
  category: LiveNoticeCategory;
  url: string;
  source: "JKBOTE";
  sourcePage: string;
  isNew: boolean;
  firstSeenAt: string;
  lastSeenAt: string;
};

export type JkboteCachePayload = {
  fetchedAt: string;
  notices: LiveNotice[];
  sourcePages: string[];
  ok: boolean;
  error?: string;
};

export const JKBOTE_SOURCE_PAGES = [
  "https://jkbote.ac.in/",
  "https://jkbote.ac.in/notice.php",
  "https://jkbote.ac.in/noticeExam.php",
  "https://jkbote.ac.in/noticeDatesheet.php",
  "https://jkbote.ac.in/noticeResult.php",
] as const;

/** Re-fetch official pages at most this often */
export const JKBOTE_FETCH_TTL_MS = 30 * 60 * 1000;

/** Client polling interval for the ticker */
export const JKBOTE_CLIENT_POLL_MS = 15 * 60 * 1000;

/** Keep NEW badge for this many days after publish/first-seen */
export const JKBOTE_NEW_WINDOW_DAYS = 14;
