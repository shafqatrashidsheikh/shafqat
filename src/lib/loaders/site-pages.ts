import { NOTICES } from "@/lib/notices-data";
import type { NoticeItem } from "@/lib/notices-data";
import { loadMediaUrlMap, fetchDepartments } from "@/server/cda/content";
import { GPW_DEPARTMENTS } from "@/lib/departments-data";
import { mapDbDepartmentToGpw } from "@/lib/departments-cms";
import { PROGRAMS, ACADEMIC_UNITS } from "@/lib/site-data";

export async function loadNoticesData(): Promise<NoticeItem[]> {
  // Verified JKBOTE notices are the public source of truth.
  return NOTICES;
}

/**
 * Academics page data — official GPW Srinagar programmes only.
 * Static GPW_DEPARTMENTS / PROGRAMS are the public source of truth.
 * CMS may supply media overlays for known official slugs; it must not
 * introduce programmes the institute does not offer (e.g. Civil / Electrical).
 */
export async function loadAcademicsData() {
  try {
    const [departments, mediaMap] = await Promise.all([
      fetchDepartments({ data: {} }),
      loadMediaUrlMap(),
    ]);

    const cmsBySlug = new Map(
      departments
        .map((d) => mapDbDepartmentToGpw(d, mediaMap))
        .filter((d) => GPW_DEPARTMENTS.some((s) => s.slug === d.slug))
        .map((d) => [d.slug, d] as const),
    );

    return {
      programs: PROGRAMS,
      academicUnits: ACADEMIC_UNITS.map((u) => ({
        title: u.title,
        subtitle: u.subtitle,
        to: u.to,
      })),
      departments: GPW_DEPARTMENTS.map((dept) => {
        const fromCms = cmsBySlug.get(dept.slug);
        return fromCms?.image ? { ...dept, image: fromCms.image } : dept;
      }),
    };
  } catch {
    return {
      programs: PROGRAMS,
      academicUnits: ACADEMIC_UNITS.map((u) => ({ title: u.title, subtitle: u.subtitle, to: u.to })),
      departments: [...GPW_DEPARTMENTS],
    };
  }
}
