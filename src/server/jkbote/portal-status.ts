import { JKBOTE_ADMISSION_PORTAL_URL } from "@/lib/jkbote-admission-dates";
import {
  emptyAdmissionStatusPayload,
  JKBOTE_ADMISSION_STATUS_TTL_MS,
  type JkboteAdmissionPortalStatus,
  type JkboteAdmissionStatusPayload,
} from "@/lib/jkbote-admission-status";
import {
  readPortalStatusCache,
  writePortalStatusCache,
} from "@/server/jkbote/portal-status-cache";

/** Probe https://admission.jkbote.ac.in/ for open / closed signals from official HTML only. */
export async function fetchPortalStatus(): Promise<{
  status: JkboteAdmissionPortalStatus;
  error?: string;
}> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 15_000);
  try {
    const res = await fetch(JKBOTE_ADMISSION_PORTAL_URL, {
      signal: controller.signal,
      headers: {
        "User-Agent": "GPW-Srinagar-Website/1.0 (+official admission portal status)",
        Accept: "text/html,application/xhtml+xml",
      },
      cache: "no-store",
    });
    if (!res.ok) return { status: "unknown", error: `Portal HTTP ${res.status}` };
    const html = await res.text();
    const text = html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").toLowerCase();
    if (/portal closed|deadline for form submission has passed|no longer accepting/i.test(text)) {
      return { status: "closed" };
    }
    if (/apply|registration|login|submit/i.test(text) && !/portal closed/i.test(text)) {
      return { status: "open" };
    }
    return { status: "unknown" };
  } catch (error) {
    return {
      status: "unknown",
      error: error instanceof Error ? error.message : "Portal fetch failed",
    };
  } finally {
    clearTimeout(timer);
  }
}

function withCheckedAt(
  base: JkboteAdmissionStatusPayload,
  checkedAt: string,
  overrides?: Partial<JkboteAdmissionStatusPayload>,
): JkboteAdmissionStatusPayload {
  return {
    ...base,
    checkedAt,
    officialSource: "JKBOTE",
    portalUrl: JKBOTE_ADMISSION_PORTAL_URL,
    ...overrides,
  };
}

/**
 * Central JKBOTE admission portal status for all Apply Online CTAs.
 * Never hardcodes open/closed — always derived from the official portal (or last known).
 */
export async function getJkboteAdmissionPortalStatus(options?: {
  force?: boolean;
}): Promise<JkboteAdmissionStatusPayload> {
  const existing = readPortalStatusCache();
  const now = Date.now();
  const checkedAt = new Date().toISOString();
  const fetchedAtMs = existing?.fetchedAt ? Date.parse(existing.fetchedAt) : 0;

  if (
    !options?.force &&
    existing?.ok &&
    existing.refreshed &&
    Number.isFinite(fetchedAtMs) &&
    now - fetchedAtMs < JKBOTE_ADMISSION_STATUS_TTL_MS
  ) {
    return withCheckedAt(existing, checkedAt);
  }

  try {
    const portal = await fetchPortalStatus();

    if (portal.error) {
      if (existing) {
        return withCheckedAt(existing, checkedAt, {
          ok: false,
          refreshed: false,
          error: portal.error,
        });
      }
      return emptyAdmissionStatusPayload({
        checkedAt,
        fetchedAt: checkedAt,
        ok: false,
        refreshed: false,
        status: "unknown",
        error: portal.error,
      });
    }

    const payload: JkboteAdmissionStatusPayload = {
      fetchedAt: checkedAt,
      checkedAt,
      ok: true,
      refreshed: true,
      status: portal.status,
      portalUrl: JKBOTE_ADMISSION_PORTAL_URL,
      officialSource: "JKBOTE",
    };
    writePortalStatusCache(payload);
    return payload;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Portal status sync failed";
    if (existing) {
      return withCheckedAt(existing, checkedAt, {
        ok: false,
        refreshed: false,
        error: message,
      });
    }
    return emptyAdmissionStatusPayload({
      checkedAt,
      fetchedAt: checkedAt,
      ok: false,
      refreshed: false,
      error: message,
    });
  }
}

/** Persist portal status when another JKBOTE sync already probed the portal. */
export function rememberPortalStatus(
  status: JkboteAdmissionPortalStatus,
  options?: { error?: string; ok?: boolean },
): void {
  const now = new Date().toISOString();
  const refreshed = !options?.error && options?.ok !== false;
  writePortalStatusCache({
    fetchedAt: now,
    checkedAt: now,
    ok: refreshed,
    refreshed,
    status,
    portalUrl: JKBOTE_ADMISSION_PORTAL_URL,
    officialSource: "JKBOTE",
    ...(options?.error ? { error: options.error } : {}),
  });
}
