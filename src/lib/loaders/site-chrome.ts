import { fetchHeaderNav, fetchInstituteSettings, fetchNavLinks } from "@/server/cda/site-extended";
import { fetchLiveJkboteNotices } from "@/server/cda/jkbote-notices";
import {
  INSTITUTE,
  HEADER_CTA_PILLS,
  UTILITY_STRIP,
  FOOTER_QUICK_LINKS,
  FOOTER_ACADEMIC_LINKS,
  FOOTER_MANDATORY_LINKS,
} from "@/lib/site-data";
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

/** Prefer current official Academics menu — drop legacy Programmes/Departments split from CMS. */
function normalizeHeaderNav(nav: HeaderCtaPill[]): HeaderCtaPill[] {
  const academicsCanonical = HEADER_CTA_PILLS.find((p) => p.label === "Academics");
  if (!academicsCanonical) return nav;

  return nav.map((pill) => {
    if (pill.label !== "Academics") return pill;
    return {
      ...pill,
      to: academicsCanonical.to,
      items: academicsCanonical.items.map((item) => ({ ...item })),
    };
  });
}

function canonicalFooterGroup(
  group: "footer_quick" | "footer_academic" | "footer_mandatory",
  items: readonly { label: string; to: string }[],
): DbNavLink[] {
  return items.map((item, i) => ({
    id: `${group}-canonical-${i}`,
    link_group: group,
    label: item.label,
    href: item.to,
    sort_order: i + 1,
    is_active: true,
  }));
}

/**
 * Keep utility/header CMS rows, but always publish the official footer link sets.
 * Prevents empty Quick Links / mandatory bar when CMS only has utility_strip rows.
 */
function normalizeNavLinks(links: DbNavLink[]): DbNavLink[] {
  const preserved = links.filter(
    (l) =>
      l.link_group !== "footer_quick" &&
      l.link_group !== "footer_academic" &&
      l.link_group !== "footer_mandatory",
  );

  return [
    ...preserved,
    ...canonicalFooterGroup("footer_quick", FOOTER_QUICK_LINKS),
    ...canonicalFooterGroup("footer_academic", FOOTER_ACADEMIC_LINKS),
    ...canonicalFooterGroup("footer_mandatory", FOOTER_MANDATORY_LINKS),
  ];
}

function utilityAsNavLinks(): DbNavLink[] {
  return UTILITY_STRIP.map((l, i) => ({
    id: String(i),
    link_group: "utility_strip",
    label: l.label,
    href: l.to,
    sort_order: i + 1,
    is_active: true,
  }));
}

export async function loadSiteChrome(): Promise<SiteChromeData> {
  try {
    const [institute, headerNav, navLinks, liveNotices] = await Promise.all([
      fetchInstituteSettings(),
      fetchHeaderNav(),
      fetchNavLinks(),
      fetchLiveJkboteNotices({ data: { limit: 20 } }).catch(() => null),
    ]);

    const resolvedNav = headerNav?.length ? headerNav : [...HEADER_CTA_PILLS];
    const resolvedLinks = navLinks?.length ? navLinks : utilityAsNavLinks();

    return {
      institute: institute ?? INSTITUTE,
      headerNav: normalizeHeaderNav(resolvedNav),
      navLinks: normalizeNavLinks(resolvedLinks),
      liveNotices,
    };
  } catch {
    return {
      institute: INSTITUTE,
      headerNav: [...HEADER_CTA_PILLS],
      navLinks: normalizeNavLinks(utilityAsNavLinks()),
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
