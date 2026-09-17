import type { DbDepartment } from "@/lib/supabase/types";
import type { GpwDepartment, ProgramCategory, ProgramIcon } from "@/lib/departments-data";
import {
  getDepartmentBySlug,
  PROGRAMME_ACADEMIC_AUTHORITY,
  resolveEligibility,
} from "@/lib/departments-data";
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

  const learningAreas =
    row.career_areas?.length
      ? row.career_areas
      : fallback?.learningAreas ?? fallback?.careerAreas ?? [];

  const imageAlt = row.image_alt || fallback?.image?.alt || row.name;
  const image =
    resolvedSrc && imageAlt
      ? { src: resolvedSrc, alt: imageAlt }
      : fallback?.image;

  return {
    slug: row.slug,
    name: row.name || fallback?.name || row.slug,
    summary: row.summary || fallback?.summary || "",
    heroIntro: fallback?.heroIntro || row.overview || row.summary || "",
    overview: row.overview || fallback?.overview || row.summary || "",
    categoryLabel: row.category_label || fallback?.categoryLabel || row.name,
    duration: row.duration || fallback?.duration || "3 Years",
    intake: fallback?.intake || "30 Seats",
    studyMode: fallback?.studyMode || "Full-time",
    award: fallback?.award || "Diploma",
    academicAuthority: fallback?.academicAuthority || PROGRAMME_ACADEMIC_AUTHORITY,
    eligibility: resolveEligibility(row.slug, row.eligibility),
    programType: row.program_type || fallback?.programType || "Full-time Diploma",
    stream: asStream(row.stream ?? fallback?.stream),
    icon: asIcon(row.icon ?? fallback?.icon),
    hasDepartmentalLabs: row.has_departmental_labs ?? fallback?.hasDepartmentalLabs ?? true,
    learningAreas,
    practicalPoints: fallback?.practicalPoints ?? [],
    practicalLearning:
      fallback?.practicalLearning ||
      fallback?.practicalPoints?.join(" ") ||
      DEPARTMENT_PRACTICAL_FALLBACK,
    careerPathways: fallback?.careerPathways ?? learningAreas,
    careerAreas: learningAreas,
    ...(image ? { image } : {}),
    sortOrder: row.sort_order ?? fallback?.sortOrder ?? 99,
  };
}

const DEPARTMENT_PRACTICAL_FALLBACK =
  "Students undertake department-related practical training, hands-on technical exercises and practical laboratory or workshop work as applicable to the programme.";

/** Resolve bundled image keys when media library has no match */
export function resolveAssetImage(
  assetKey: string | null | undefined,
  mediaUrlByKey?: Record<string, string>,
): string | undefined {
  if (!assetKey) return undefined;
  if (mediaUrlByKey?.[assetKey]) return mediaUrlByKey[assetKey];
  return EXPLORE_IMAGE_BY_KEY[assetKey];
}
