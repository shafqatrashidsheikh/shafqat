import { getStaticAdmissionsData, getStaticHomepageData } from "@/lib/supabase/fallback";
import { emptyAdmissionDateRows, JKBOTE_ADMISSION_PORTAL_URL } from "@/lib/jkbote-admission-dates";
import type { JkboteAdmissionDatesPayload } from "@/lib/jkbote-admission-dates";
import { fetchAdmissionsData } from "@/server/cda/content";
import { fetchHomepageData } from "@/server/cda/homepage";
import { fetchJkboteAdmissionDates } from "@/server/cda/jkbote-admission-dates";

export async function loadHomepageData() {
  try {
    return await fetchHomepageData();
  } catch (error) {
    console.error("[home loader] fetch failed, using static fallback:", error);
    return getStaticHomepageData();
  }
}

function emptyLiveDates(): JkboteAdmissionDatesPayload {
  return {
    fetchedAt: new Date().toISOString(),
    ok: false,
    sourcePages: [],
    portalStatus: "unknown",
    portalUrl: JKBOTE_ADMISSION_PORTAL_URL,
    latestNotice: null,
    rows: emptyAdmissionDateRows(),
  };
}

export async function loadAdmissionsData() {
  const [admissions, liveDates] = await Promise.all([
    fetchAdmissionsData().catch((error) => {
      console.error("[admissions loader] fetch failed, using static fallback:", error);
      return getStaticAdmissionsData();
    }),
    fetchJkboteAdmissionDates({ data: {} }).catch((error) => {
      console.error("[admissions loader] JKBOTE dates fetch failed:", error);
      return emptyLiveDates();
    }),
  ]);

  return {
    ...admissions,
    liveDates,
  };
}
