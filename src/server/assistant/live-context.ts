/**
 * Live official-source context for the GPWS Assistant.
 * Pulls cached / freshly synced JKBOTE notices, admission portal status and dates.
 */

import type { LiveNotice } from "@/lib/jkbote-live";
import { getJkboteAdmissionDates } from "@/server/jkbote/admission-dates";
import { getJkboteAdmissionPortalStatus } from "@/server/jkbote/portal-status";
import { getLiveJkboteNotices } from "@/server/jkbote/sync";

export type AssistantLiveContext = {
  fetchedAt: string;
  admissionPortal: {
    status: "open" | "closed" | "unknown";
    portalUrl: string;
    checkedAt: string;
    ok: boolean;
  };
  admissionDates: {
    ok: boolean;
    portalStatus: "open" | "closed" | "unknown";
    portalUrl: string;
    latestNotice: { title: string; date: string; url: string } | null;
    rows: { label: string; date_value: string; href?: string }[];
  };
  recentNotices: {
    title: string;
    date: string;
    category: string;
    url: string;
    isNew: boolean;
  }[];
  /** Result / re-eval notices (for “6th sem result aya?” style questions). */
  resultNotices: {
    title: string;
    date: string;
    publishedAt: string;
    category: string;
    url: string;
    sourcePage: string;
  }[];
  /** Full notice list for result-intent matching (server-side only). */
  allNoticesForMatching: LiveNotice[];
  noticeSources: string[];
  ok: boolean;
  notes: string[];
};

/** Short in-memory reuse so chip taps / follow-ups stay fast. */
const LIVE_MEMORY_TTL_MS = 20_000;
let liveMemory: { at: number; value: AssistantLiveContext } | null = null;
let liveInflight: Promise<AssistantLiveContext> | null = null;

async function fetchAssistantLiveContext(): Promise<AssistantLiveContext> {
  const notes: string[] = [];
  const fetchedAt = new Date().toISOString();

  const [noticesResult, statusResult, datesResult] = await Promise.allSettled([
    getLiveJkboteNotices({ limit: 48 }),
    getJkboteAdmissionPortalStatus(),
    getJkboteAdmissionDates(),
  ]);

  const notices = noticesResult.status === "fulfilled" ? noticesResult.value : null;
  if (noticesResult.status === "rejected") {
    notes.push("JKBOTE notices could not be loaded for this reply.");
  } else if (notices && !notices.ok) {
    notes.push(notices.error ?? "JKBOTE notice sync reported a partial/fallback result.");
  }

  const status = statusResult.status === "fulfilled" ? statusResult.value : null;
  if (statusResult.status === "rejected") {
    notes.push("JKBOTE admission portal status could not be loaded.");
  }

  const dates = datesResult.status === "fulfilled" ? datesResult.value : null;
  if (datesResult.status === "rejected") {
    notes.push("JKBOTE admission dates could not be loaded.");
  }

  const allNotices = notices?.notices ?? [];
  const resultNotices = allNotices
    .filter(
      (n) =>
        n.category === "Results" ||
        /result|re-?evaluation|gazette/i.test(n.title) ||
        /noticeResult/i.test(n.sourcePage),
    )
    .slice(0, 12)
    .map((n) => ({
      title: n.title,
      date: n.date,
      publishedAt: n.publishedAt,
      category: n.category,
      url: n.url,
      sourcePage: n.sourcePage,
    }));

  return {
    fetchedAt,
    admissionPortal: {
      status: status?.status ?? "unknown",
      portalUrl: status?.portalUrl ?? "https://admission.jkbote.ac.in/",
      checkedAt: status?.checkedAt ?? fetchedAt,
      ok: status?.ok ?? false,
    },
    admissionDates: {
      ok: dates?.ok ?? false,
      portalStatus: dates?.portalStatus ?? "unknown",
      portalUrl: dates?.portalUrl ?? "https://admission.jkbote.ac.in/",
      latestNotice: dates?.latestNotice
        ? {
            title: dates.latestNotice.title,
            date: dates.latestNotice.date,
            url: dates.latestNotice.url,
          }
        : null,
      rows: (dates?.rows ?? []).map((r) => ({
        label: r.label,
        date_value: r.date_value,
        ...(r.href ? { href: r.href } : {}),
      })),
    },
    recentNotices: allNotices.slice(0, 10).map((n) => ({
      title: n.title,
      date: n.date,
      category: n.category,
      url: n.url,
      isNew: n.isNew,
    })),
    resultNotices,
    allNoticesForMatching: allNotices,
    noticeSources: notices?.sourcePages ?? [
      "https://jkbote.ac.in/notice.php",
      "https://jkbote.ac.in/noticeExam.php",
      "https://jkbote.ac.in/noticeResult.php",
    ],
    ok: Boolean(notices?.ok || status?.ok || dates?.ok),
    notes,
  };
}

export async function loadAssistantLiveContext(): Promise<AssistantLiveContext> {
  const now = Date.now();
  if (liveMemory && now - liveMemory.at < LIVE_MEMORY_TTL_MS) {
    return liveMemory.value;
  }
  if (liveInflight) return liveInflight;

  liveInflight = fetchAssistantLiveContext()
    .then((value) => {
      liveMemory = { at: Date.now(), value };
      return value;
    })
    .finally(() => {
      liveInflight = null;
    });

  return liveInflight;
}

/**
 * Notices-only fast path — skips portal/dates HTTP when the full live bundle
 * is not already warm in memory.
 */
export async function loadAssistantNoticesQuick(): Promise<AssistantLiveContext> {
  const now = Date.now();
  if (liveMemory && now - liveMemory.at < LIVE_MEMORY_TTL_MS) {
    return liveMemory.value;
  }

  const fetchedAt = new Date().toISOString();
  try {
    const notices = await getLiveJkboteNotices({ limit: 16 });
    const allNotices = notices.notices ?? [];
    const partial: AssistantLiveContext = {
      fetchedAt,
      admissionPortal: {
        status: "unknown",
        portalUrl: "https://admission.jkbote.ac.in/",
        checkedAt: fetchedAt,
        ok: false,
      },
      admissionDates: {
        ok: false,
        portalStatus: "unknown",
        portalUrl: "https://admission.jkbote.ac.in/",
        latestNotice: null,
        rows: [],
      },
      recentNotices: allNotices.slice(0, 10).map((n) => ({
        title: n.title,
        date: n.date,
        category: n.category,
        url: n.url,
        isNew: n.isNew,
      })),
      resultNotices: allNotices
        .filter(
          (n) =>
            n.category === "Results" ||
            /result|re-?evaluation|gazette/i.test(n.title) ||
            /noticeResult/i.test(n.sourcePage),
        )
        .slice(0, 12)
        .map((n) => ({
          title: n.title,
          date: n.date,
          publishedAt: n.publishedAt,
          category: n.category,
          url: n.url,
          sourcePage: n.sourcePage,
        })),
      allNoticesForMatching: allNotices,
      noticeSources: notices.sourcePages ?? [
        "https://jkbote.ac.in/notice.php",
        "https://jkbote.ac.in/noticeExam.php",
        "https://jkbote.ac.in/noticeResult.php",
      ],
      ok: Boolean(notices.ok),
      notes: notices.ok ? [] : [notices.error ?? "Partial JKBOTE notice sync."],
    };
    /* Keep a short memory so follow-up notice asks stay instant. */
    liveMemory = { at: Date.now(), value: partial };
    return partial;
  } catch (error) {
    console.warn("[GPWS Assistant] Quick notices load failed:", error);
    return loadAssistantLiveContext();
  }
}

export function serializeLiveContextForPrompt(live: AssistantLiveContext): string {
  const { allNoticesForMatching: _omit, ...safe } = live;
  return JSON.stringify(safe);
}
