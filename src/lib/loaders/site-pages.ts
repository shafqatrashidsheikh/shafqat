import { NOTICES } from "@/lib/notices-data";
import type { NoticeItem } from "@/lib/notices-data";

export async function loadNoticesData(): Promise<NoticeItem[]> {
  // Verified JKBOTE notices are the public source of truth.
  return NOTICES;
}

import { loadMediaUrlMap, fetchDepartments, fetchHomepageBlocks, fetchPrograms } from "@/server/cda/content";
import { GPW_DEPARTMENTS, resolveEligibility } from "@/lib/departments-data";
import { mapDbDepartmentToGpw } from "@/lib/departments-cms";
import { PROGRAMS, ACADEMIC_UNITS } from "@/lib/site-data";

export async function loadAcademicsData() {
  try {
    const [programs, departments, blocks, mediaMap] = await Promise.all([
      fetchPrograms({ data: {} }),
      fetchDepartments({ data: {} }),
      fetchHomepageBlocks({ data: {} }),
      loadMediaUrlMap(),
    ]);

    return {
      programs:
        programs.length > 0
          ? programs.map((p) => {
              const dept = departments.find((d) => d.id === p.department_id);
              const staticMatch = PROGRAMS.find((s) => s.slug === dept?.slug);
              const slug = dept?.slug ?? staticMatch?.slug ?? p.name.toLowerCase().replace(/\s+/g, "-");
              return {
                name: p.name,
                categoryLabel: p.dept_label,
                duration: p.duration,
                eligibility: resolveEligibility(slug, p.eligibility),
                programType: staticMatch?.programType ?? "Full-time Diploma",
                stream: p.stream as "Engineering & Technology" | "Applied / Health Sciences" | "Management & Services",
                overview: p.overview,
                slug,
              };
            })
          : PROGRAMS,
      academicUnits:
        blocks?.academicUnits?.length
          ? blocks.academicUnits.map((u) => ({
              title: u.title,
              subtitle: u.subtitle,
              to: u.link_path,
            }))
          : ACADEMIC_UNITS.map((u) => ({ title: u.title, subtitle: u.subtitle, to: u.to })),
      departments:
        departments.length > 0
          ? departments.map((d) => {
              const mapped = mapDbDepartmentToGpw(d, mediaMap);
              return {
                slug: mapped.slug,
                name: mapped.name,
                summary: mapped.summary,
                categoryLabel: mapped.categoryLabel,
                duration: mapped.duration,
              };
            })
          : GPW_DEPARTMENTS,
    };
  } catch {
    return {
      programs: PROGRAMS,
      academicUnits: ACADEMIC_UNITS.map((u) => ({ title: u.title, subtitle: u.subtitle, to: u.to })),
      departments: GPW_DEPARTMENTS,
    };
  }
}
