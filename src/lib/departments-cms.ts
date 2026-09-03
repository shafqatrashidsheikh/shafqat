import type { DbDepartment } from "@/lib/supabase/types";
import type { GpwDepartment, ProgramCategory, ProgramIcon } from "@/lib/departments-data";
import { getDepartmentBySlug, resolveEligibility } from "@/lib/departments-data";
import { EXPLORE_IMAGE_BY_KEY, resolveExploreImage } from "@/lib/site-content";

const STREAMS = new Set<ProgramCategory>([
  "Engineering & Technology",
  "Applied / Health Sciences",
  "Management & Services",
]);

const ICONS = new Set<ProgramIcon>([
  "monitor",
  "circuit-board",
  "shirt",
  "layers",
  "briefcase",
  "flask",
  "microscope",
  "plane",
]);

function asStream(value: string | undefined): ProgramCategory {
  if (value && STREAMS.has(value as ProgramCategory)) return value as ProgramCategory;
  return "Engineering & Technology";
}

function asIcon(value: string | undefined): ProgramIcon {
  if (value && ICONS.has(value as ProgramIcon)) return value as ProgramIcon;
  return "monitor";
}

export function mapDbDepartmentToGpw(
  row: DbDepartment,
  mediaUrlByKey?: Record<string, string>,
): GpwDepartment {
  const fallback = getDepartmentBySlug(row.slug);
  const imageKey = row.image_asset_key ?? undefined;
  const resolvedSrc = imageKey
    ? resolveExploreImage(imageKey, mediaUrlByKey)
    : fallback?.image?.src;

  return {
    slug: row.slug,
    name: row.name,
    summary: row.summary || fallback?.summary || "",
    overview: row.overview || fallback?.overview || row.summary,
    categoryLabel: row.category_label || fallback?.categoryLabel || row.name,
    duration: row.duration || fallback?.duration || "3 Years",
    eligibility: resolveEligibility(row.slug, row.eligibility),
    programType: row.program_type || fallback?.programType || "Diploma Programme",
    stream: asStream(row.stream ?? fallback?.stream),
    icon: asIcon(row.icon ?? fallback?.icon),
    hasDepartmentalLabs: row.has_departmental_labs ?? fallback?.hasDepartmentalLabs ?? true,
    careerAreas: row.career_areas?.length
      ? row.career_areas
      : fallback?.careerAreas ?? [],
    image:
      resolvedSrc && (row.image_alt || fallback?.image?.alt)
        ? { src: resolvedSrc, alt: row.image_alt || fallback?.image?.alt || row.name }
        : fallback?.image,
    sortOrder: row.sort_order,
  };
}

/** Resolve bundled image keys when media library has no match */
export function resolveAssetImage(
  assetKey: string | null | undefined,
  mediaUrlByKey?: Record<string, string>,
): string | undefined {
  if (!assetKey) return undefined;
  if (mediaUrlByKey?.[assetKey]) return mediaUrlByKey[assetKey];
  return EXPLORE_IMAGE_BY_KEY[assetKey];
}
