import { fetchHeaderNav, fetchInstituteSettings, fetchNavLinks } from "@/server/cda/site-extended";
import { fetchLiveJkboteNotices } from "@/server/cda/jkbote-notices";
import { INSTITUTE, HEADER_CTA_PILLS, UTILITY_STRIP } from "@/lib/site-data";
import type { HeaderCtaPill } from "@/lib/site-data";
import type { InstituteSettings } from "@/lib/supabase/types";
import type { DbNavLink } from "@/lib/supabase/types";
import type { JkboteCachePayload } from "@/lib/jkbote-live";

export type SiteChromeData = {
  institute: InstituteSettings;
  headerNav: HeaderCtaPill[];
  navLinks: DbNavLink[];
  liveNotices: JkboteCachePayload | null;
};

export async function loadSiteChrome(): Promise<SiteChromeData> {
  try {
    const [institute, headerNav, navLinks, liveNotices] = await Promise.all([
      fetchInstituteSettings(),
      fetchHeaderNav(),
      fetchNavLinks(),
      fetchLiveJkboteNotices({ data: { limit: 20 } }).catch(() => null),
    ]);

    return {
      institute: institute ?? INSTITUTE,
      headerNav: headerNav?.length ? headerNav : [...HEADER_CTA_PILLS],
      navLinks: navLinks ?? UTILITY_STRIP.map((l, i) => ({
        id: String(i),
        link_group: "utility_strip",
        label: l.label,
        href: l.to,
        sort_order: i + 1,
        is_active: true,
      })),
      liveNotices,
    };
  } catch {
    return {
      institute: INSTITUTE,
      headerNav: [...HEADER_CTA_PILLS],
      navLinks: [],
      liveNotices: null,
    };
  }
}

export function navLinksByGroup(links: DbNavLink[] | null | undefined, group: string) {
  return (links ?? [])
    .filter((l) => l.link_group === group && l.is_active)
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((l) => ({ label: l.label, to: l.href }));
}
