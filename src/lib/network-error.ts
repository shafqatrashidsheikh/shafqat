/**
 * Offline / connection copy — playful GPW campus tone.
 */

export const CONNECTION_ERROR_TIPS = [
  "Poke the Wi‑Fi (or reconnect)",
  "Check modem / router lights",
  "Switch airplane mode off",
  "Try mobile data for a moment",
] as const;

export const CONNECTION_ERROR_COPY = {
  brand: "GPW Srinagar · Offline Lounge",
  title: "Oops — the campus signal went for a chai break.",
  body: "No stress. Stretch your fingers, dodge a few textbooks, and try again when the network wakes up.",
  tryLabel: "Quick fixes",
  tips: CONNECTION_ERROR_TIPS,
  retry: "Shake the signal",
  home: "Escape to Home",
  errorCode: "ERR_CAMPUS_SIGNAL_AWOL",
  gameHint: "Space / ↑ / tap to jump · collect ★ for bonus points",
  gameTitle: "Campus Dash · Offline Arcade",
  gameReady: "Tap or press Space — let’s dash!",
  gameOver: "Ye textbook ne pakad liya!",
  gameRetry: "Space / tap to dash again",
  /** Legacy aliases */
  eyebrow: "GPW Srinagar",
  statusIndicator: "Offline",
  statusLabel: "GPW Srinagar · Offline Lounge",
  footerNote: "ERR_CAMPUS_SIGNAL_AWOL",
} as const;

export const OFFLINE_FAIL_QUIPS = [
  "Textbook tackle — ouch!",
  "Wi‑Fi ghost got you!",
  "Chai spill hazard!",
  "Lab report collision!",
  "Router rage quit!",
  "Almost… then physics!",
] as const;

export const OFFLINE_MILESTONES: { at: number; label: string }[] = [
  { at: 50, label: "Warm-up complete ✓" },
  { at: 100, label: "Semester unlocked!" },
  { at: 200, label: "Dean’s list energy" },
  { at: 350, label: "Campus legend!" },
  { at: 500, label: "Offline GOAT 🐐" },
];

export function isBrowserOffline(): boolean {
  if (typeof navigator === "undefined") return false;
  return navigator.onLine === false;
}

export function isNetworkLikeError(error: unknown): boolean {
  if (isBrowserOffline()) return true;
  if (error == null) return false;

  const message =
    error instanceof Error
      ? `${error.name} ${error.message}`
      : typeof error === "string"
        ? error
        : String(error);

  const status =
    typeof error === "object" && error !== null
      ? Number(
          ("status" in error && (error as { status?: unknown }).status) ??
            ("statusCode" in error && (error as { statusCode?: unknown }).statusCode) ??
            NaN,
        )
      : NaN;

  if (Number.isFinite(status) && (status === 0 || status === 408 || status === 429 || status >= 500)) {
    return true;
  }

  return /failed to fetch|networkerror|network request failed|load failed|timeout|timed out|aborted|econnrefused|econnreset|enotfound|offline|err_network|err_internet_disconnected|err_connection|503|502|504|cloudflare|temporarily unavailable|service unavailable|fetch failed/i.test(
    message,
  );
}
