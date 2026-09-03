import { getStaticAdmissionsData, getStaticHomepageData } from "@/lib/supabase/fallback";
import { fetchAdmissionsData } from "@/server/cda/content";
import { fetchHomepageData } from "@/server/cda/homepage";

export async function loadHomepageData() {
  try {
    return await fetchHomepageData();
  } catch (error) {
    console.error("[home loader] fetch failed, using static fallback:", error);
    return getStaticHomepageData();
  }
}

export async function loadAdmissionsData() {
  try {
    return await fetchAdmissionsData();
  } catch (error) {
    console.error("[admissions loader] fetch failed, using static fallback:", error);
    return getStaticAdmissionsData();
  }
}
