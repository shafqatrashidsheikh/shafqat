import {
  formatAdmissionSourceUpdated,
  JKBOTE_ADMISSION_PORTAL_URL,
  type JkboteAdmissionPortalStatus,
} from "@/lib/jkbote-admission-dates";

export type { JkboteAdmissionPortalStatus };

/** Live portal status used by every Apply Online CTA */
export type JkboteAdmissionStatusPayload = {
  /** When the status value was last successfully determined (or last known) */
  fetchedAt: string;
  /** When this response was produced */
  checkedAt: string;
  ok: boolean;
  /** True when JKBOTE was reached for this response */
  refreshed: boolean;
  status: JkboteAdmissionPortalStatus;
  portalUrl: string;
  officialSource: "JKBOTE";
  error?: string;
};

/** Re-check the official portal at most this often between background syncs */
export const JKBOTE_ADMISSION_STATUS_TTL_MS = 30 * 60 * 1000;

export const GPW_ADMISSIONS_PATH = "/admissions";

export const ADMISSION_STATUS_COPY = {
  closedTitle: "Admissions are currently closed",
  closedBody:
    "The online admission window is not currently active. Please check the latest JKBOTE notification for the next admission cycle.",
  unknownTitle: "Confirm the latest JKBOTE admission status",
  unknownBody:
    "We could not confirm whether the online application window is active from the official JKBOTE portal right now. Please verify the latest JKBOTE notification before applying.",
  staleOpenTitle: "Verify before continuing",
  staleOpenBody:
    "Admission status could not be refreshed. The last known check suggested the portal may be open — please verify the latest JKBOTE notification.",
  refreshWarning:
    "Admission status could not be refreshed. Please verify the latest JKBOTE notification.",
  viewUpdates: "View JKBOTE Updates",
  backToGpw: "Back to GPW Admissions",
  continueToPortal: "Continue to JKBOTE Portal",
  officialSource: "Official source: JKBOTE",
} as const;

export function emptyAdmissionStatusPayload(
  overrides?: Partial<JkboteAdmissionStatusPayload>,
): JkboteAdmissionStatusPayload {
  const now = new Date().toISOString();
  return {
    fetchedAt: now,
    checkedAt: now,
    ok: false,
    refreshed: false,
    status: "unknown",
    portalUrl: JKBOTE_ADMISSION_PORTAL_URL,
    officialSource: "JKBOTE",
    ...overrides,
  };
}

export function formatAdmissionLastChecked(iso: string | undefined): string {
  return formatAdmissionSourceUpdated(iso);
}
