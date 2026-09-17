import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { isSupabaseConfigured } from "@/lib/env";
import { INSTITUTE, HEADER_CTA_PILLS, UTILITY_STRIP } from "@/lib/site-data";
import { PRINCIPAL } from "@/lib/principal-data";
import { CAMPUS_FACILITIES, CAMPUS_GALLERY } from "@/lib/campus-data";
import { getSupabaseServer } from "@/lib/supabase/server";
import { requireAdmin } from "@/server/cma/auth";
import { loadMediaUrlMap } from "@/server/cda/content";
import { mapDbDepartmentToGpw, resolveAssetImage } from "@/lib/departments-cms";
import type {
  DbAboutBlock,
  DbCampusFacilityItem,
  DbCampusGalleryItem,
  DbHeaderNavGroup,
  DbHeaderNavItem,
  DbNavLink,
  DbPrincipalProfile,
  InstituteSettings,
} from "@/lib/supabase/types";
import type { HeaderCtaPill } from "@/lib/site-data";
import type { GpwDepartment } from "@/lib/departments-data";

async function adminOrPublicClient(accessToken?: string) {
  if (accessToken) {
    const { supabase } = await requireAdmin(accessToken);
    return supabase;
  }
  return getSupabaseServer();
}

const FOOTER_QUICK_STATIC = [
  { label: "About", to: "/about" },
  { label: "Admissions", to: "/admissions" },
  { label: "Academics", to: "/academics" },
  { label: "Campus", to: "/campus" },
  { label: "Downloads", to: "/downloads" },
  { label: "Examination", to: "/examination" },
  { label: "Contact", to: "/contact" },
];

const FOOTER_ACADEMIC_STATIC = [
  { label: "Diploma Programmes", to: "/academics#programmes" },
  { label: "Syllabus & Downloads", to: "/downloads" },
  { label: "Academic Calendar", to: "/academic-calendar" },
  { label: "Faculty & Staff", to: "/faculty" },
  { label: "Examination & Results", to: "/examination" },
];

/** CDA — department detail by slug */
export const fetchDepartmentBySlug = createServerFn({ method: "GET" })
  .validator(z.object({ slug: z.string(), accessToken: z.string().optional() }))
  .handler(async ({ data }): Promise<GpwDepartment | null> => {
    if (!isSupabaseConfigured()) return null;

    try {
      const supabase = await adminOrPublicClient(data.accessToken);
      let query = supabase.from("departments").select("*").eq("slug", data.slug);
      if (!data.accessToken) query = query.eq("is_active", true);
      const { data: row, error } = await query.maybeSingle();
      if (error || !row) return null;
      const mediaMap = await loadMediaUrlMap();
      return mapDbDepartmentToGpw(row, mediaMap);
    } catch {
      return null;
    }
  });

/** CDA — institute contact settings */
export const fetchInstituteSettings = createServerFn({ method: "GET" }).handler(
  async (): Promise<InstituteSettings> => {
    if (!isSupabaseConfigured()) return INSTITUTE;

    try {
      const supabase = getSupabaseServer();
      const { data, error } = await supabase
        .from("site_settings")
        .select("value")
        .eq("setting_key", "institute")
        .maybeSingle();
      if (error || !data?.value) return INSTITUTE;
      return data.value as InstituteSettings;
    } catch {
      return INSTITUTE;
    }
  },
);

/** CDA — principal profile for public pages */
export const fetchPrincipalProfile = createServerFn({ method: "GET" })
  .validator(z.object({ accessToken: z.string().optional() }).optional())
  .handler(async ({ data }) => {
    if (!isSupabaseConfigured()) {
      return {
        name: PRINCIPAL.name,
        role: PRINCIPAL.role,
        institute: PRINCIPAL.institute,
        portrait: PRINCIPAL.portrait,
        portraitAlt: PRINCIPAL.portraitAlt,
        preview: PRINCIPAL.preview,
        message: [...PRINCIPAL.message],
        source: "static" as const,
      };
    }

    try {
      const supabase = await adminOrPublicClient(data?.accessToken);
      let query = supabase.from("principal_profile").select("*").eq("id", "default");
      if (!data?.accessToken) query = query.eq("is_published", true);
      const { data: row, error } = await query.maybeSingle();
      if (error || !row) throw error;

      const mediaMap = await loadMediaUrlMap();
      const portraitUrl =
        resolveAssetImage(row.portrait_asset_key, mediaMap) ?? PRINCIPAL.portrait;

      return {
        name: row.name,
        role: row.role,
        institute: row.institute,
        portrait: portraitUrl,
        portraitAlt: row.portrait_alt,
        preview: row.preview,
        message: row.message_paragraphs as string[],
        source: "supabase" as const,
      };
    } catch {
      return {
        name: PRINCIPAL.name,
        role: PRINCIPAL.role,
        institute: PRINCIPAL.institute,
        portrait: PRINCIPAL.portrait,
        portraitAlt: PRINCIPAL.portraitAlt,
        preview: PRINCIPAL.preview,
        message: [...PRINCIPAL.message],
        source: "static" as const,
      };
    }
  });

/** CDA — about page blocks */
export const fetchAboutBlocks = createServerFn({ method: "GET" })
  .validator(z.object({ accessToken: z.string().optional() }).optional())
  .handler(async ({ data }) => {
    if (!isSupabaseConfigured()) return null;

    try {
      const supabase = await adminOrPublicClient(data?.accessToken);
      let query = supabase.from("about_blocks").select("*").order("sort_order");
      if (!data?.accessToken) query = query.eq("is_active", true);
      const { data: rows, error } = await query;
      if (error) throw error;
      return rows as DbAboutBlock[];
    } catch {
      return null;
    }
  });

/** CDA — navigation links by group */
export const fetchNavLinks = createServerFn({ method: "GET" })
  .validator(z.object({ accessToken: z.string().optional() }).optional())
  .handler(async ({ data }) => {
    if (!isSupabaseConfigured()) return null;

    try {
      const supabase = await adminOrPublicClient(data?.accessToken);
      let query = supabase.from("nav_links").select("*").order("sort_order");
      if (!data?.accessToken) query = query.eq("is_active", true);
      const { data: rows, error } = await query;
      if (error) throw error;
      return rows as DbNavLink[];
    } catch {
      return null;
    }
  });

/** CDA — header navigation pills with dropdown items */
export const fetchHeaderNav = createServerFn({ method: "GET" })
  .validator(z.object({ accessToken: z.string().optional() }).optional())
  .handler(async ({ data }): Promise<HeaderCtaPill[]> => {
    if (!isSupabaseConfigured()) return [...HEADER_CTA_PILLS];

    try {
      const supabase = await adminOrPublicClient(data?.accessToken);
      let groupQuery = supabase.from("header_nav_groups").select("*").order("sort_order");
      if (!data?.accessToken) groupQuery = groupQuery.eq("is_active", true);
      const { data: groups, error: groupError } = await groupQuery;
      if (groupError || !groups?.length) return [...HEADER_CTA_PILLS];

      const groupIds = groups.map((g: DbHeaderNavGroup) => g.id);
      let itemQuery = supabase
        .from("header_nav_items")
        .select("*")
        .in("group_id", groupIds)
        .order("sort_order");
      if (!data?.accessToken) itemQuery = itemQuery.eq("is_active", true);
      const { data: items, error: itemError } = await itemQuery;
      if (itemError) return [...HEADER_CTA_PILLS];

      const itemsByGroup = new Map<string, DbHeaderNavItem[]>();
      for (const item of (items ?? []) as DbHeaderNavItem[]) {
        const list = itemsByGroup.get(item.group_id) ?? [];
        list.push(item);
        itemsByGroup.set(item.group_id, list);
      }

      return (groups as DbHeaderNavGroup[]).map((group) => ({
        label: group.label,
        to: group.to_path,
        items: (itemsByGroup.get(group.id) ?? []).map((item) => ({
          label: item.label,
          to: item.to_path,
          primary: item.is_primary,
          comingSoon: item.coming_soon,
        })),
      }));
    } catch {
      return [...HEADER_CTA_PILLS];
    }
  });

/** CDA — campus gallery + facilities */
export const fetchCampusContent = createServerFn({ method: "GET" })
  .validator(z.object({ accessToken: z.string().optional() }).optional())
  .handler(async ({ data }) => {
    if (!isSupabaseConfigured()) {
      return {
        gallery: CAMPUS_GALLERY,
        facilities: CAMPUS_FACILITIES,
        source: "static" as const,
      };
    }

    try {
      const supabase = await adminOrPublicClient(data?.accessToken);
      const mediaMap = await loadMediaUrlMap();

      let galleryQuery = supabase.from("campus_gallery_items").select("*").order("sort_order");
      let facilityQuery = supabase.from("campus_facility_items").select("*").order("sort_order");
      if (!data?.accessToken) {
        galleryQuery = galleryQuery.eq("is_active", true);
        facilityQuery = facilityQuery.eq("is_active", true);
      }

      const [galleryRes, facilityRes] = await Promise.all([galleryQuery, facilityQuery]);
      const galleryRows = (galleryRes.data ?? []) as DbCampusGalleryItem[];
      const facilityRows = (facilityRes.data ?? []) as DbCampusFacilityItem[];

      if (!galleryRows.length && !facilityRows.length) {
        return {
          gallery: CAMPUS_GALLERY,
          facilities: CAMPUS_FACILITIES,
          source: "static" as const,
        };
      }

      return {
        gallery: galleryRows.map((row) => ({
          src: resolveAssetImage(row.image_asset_key, mediaMap) ?? "",
          alt: row.alt,
          width: row.width ?? undefined,
          height: row.height ?? undefined,
        })),
        facilities: CAMPUS_FACILITIES,
        source: "supabase" as const,
      };
    } catch {
      return {
        gallery: CAMPUS_GALLERY,
        facilities: CAMPUS_FACILITIES,
        source: "static" as const,
      };
    }
  });

/** CDA — admin fetch extended site content */
export const fetchSiteExtendedAdmin = createServerFn({ method: "GET" })
  .validator(z.object({ accessToken: z.string() }))
  .handler(async ({ data }) => {
    const { supabase } = await requireAdmin(data.accessToken);

    const [
      institute,
      principal,
      aboutBlocks,
      navLinks,
      headerGroups,
      headerItems,
      gallery,
      facilities,
    ] = await Promise.all([
      supabase.from("site_settings").select("*").eq("setting_key", "institute").maybeSingle(),
      supabase.from("principal_profile").select("*").eq("id", "default").maybeSingle(),
      supabase.from("about_blocks").select("*").order("sort_order"),
      supabase.from("nav_links").select("*").order("sort_order"),
      supabase.from("header_nav_groups").select("*").order("sort_order"),
      supabase.from("header_nav_items").select("*").order("sort_order"),
      supabase.from("campus_gallery_items").select("*").order("sort_order"),
      supabase.from("campus_facility_items").select("*").order("sort_order"),
    ]);

    return {
      institute: (institute.data?.value as InstituteSettings | undefined) ?? INSTITUTE,
      principal: (principal.data as DbPrincipalProfile | null) ?? null,
      aboutBlocks: (aboutBlocks.data ?? []) as DbAboutBlock[],
      navLinks: (navLinks.data ?? []) as DbNavLink[],
      headerGroups: (headerGroups.data ?? []) as DbHeaderNavGroup[],
      headerItems: (headerItems.data ?? []) as DbHeaderNavItem[],
      gallery: (gallery.data ?? []) as DbCampusGalleryItem[],
      facilities: (facilities.data ?? []) as DbCampusFacilityItem[],
    };
  });

export function getStaticFooterLinks() {
  return {
    utility: UTILITY_STRIP.map((l) => ({ label: l.label, href: l.to })),
    footerQuick: FOOTER_QUICK_STATIC.map((l) => ({ label: l.label, href: l.to })),
    footerAcademic: FOOTER_ACADEMIC_STATIC.map((l) => ({ label: l.label, href: l.to })),
    footerMandatory: [
      { label: "RTI", href: "/rti" },
      { label: "Mandatory Disclosures", href: "/mandatory-disclosures" },
      { label: "Student Welfare", href: "/student-welfare" },
      { label: "Privacy Policy", href: "/privacy-policy" },
      { label: "Website Policy", href: "/website-policy" },
    ],
  };
}
