import { GPW_DEPARTMENTS, departmentDetailPath } from "@/lib/departments-data";
import {
  JKBOTE_HOME_URL,
  JKBOTE_SEMESTER_CURRICULUM_FALLBACK,
  parseSyllabusOverrideKey,
  syllabusOverrideAssetKey,
  type JkboteSemesterLink,
} from "@/lib/jkbote-syllabus";

/** Official JKBOTE portal — curriculum / syllabus documents are issued by the Board. */
export const JKBOTE_PORTAL_URL = JKBOTE_HOME_URL;

export type DownloadDoc = {
  title: string;
  description: string;
  href?: string;
  hash?: string;
  external?: boolean;
  status: "available" | "board-link" | "coming-soon";
};

export type SyllabusSemesterRow = {
  semester: 1 | 2 | 3 | 4 | 5 | 6;
  label: string;
  /** Official JKBOTE multi-branch semester curriculum PDF */
  boardHref: string;
  boardLive: boolean;
  /**
   * Institute-uploaded programme-specific PDF when present
   * (Media Library asset_key: syllabus/{slug}/sem-{n}).
   */
  instituteHref: string | null;
};

export type ProgrammeSyllabusBlock = {
  slug: string;
  name: string;
  stream: string;
  page: string;
  duration: string;
  award: string;
  semesters: SyllabusSemesterRow[];
};

export function buildProgrammeSyllabus(
  boardSemesters: readonly JkboteSemesterLink[] = JKBOTE_SEMESTER_CURRICULUM_FALLBACK.map(
    (s) => ({ ...s, live: false }),
  ),
  instituteOverrides: Record<string, string> = {},
): ProgrammeSyllabusBlock[] {
  const boardBySem = new Map(boardSemesters.map((s) => [s.semester, s]));

  return GPW_DEPARTMENTS.map((dept) => ({
    slug: dept.slug,
    name: dept.name,
    stream: dept.stream,
    page: departmentDetailPath(dept.slug),
    duration: dept.duration,
    award: dept.award,
    semesters: ([1, 2, 3, 4, 5, 6] as const).map((semester) => {
      const board = boardBySem.get(semester) ?? {
        semester,
        label: `Semester ${semester}`,
        href: JKBOTE_SEMESTER_CURRICULUM_FALLBACK.find((s) => s.semester === semester)!.href,
        live: false,
      };
      const overrideKey = syllabusOverrideAssetKey(dept.slug, semester);
      return {
        semester,
        label: board.label,
        boardHref: board.href,
        boardLive: board.live,
        instituteHref: instituteOverrides[overrideKey] ?? null,
      };
    }),
  }));
}

/** @deprecated Prefer buildProgrammeSyllabus — kept for knowledge-base compatibility */
export const PROGRAMME_SYLLABUS = GPW_DEPARTMENTS.map((dept) => ({
  slug: dept.slug,
  name: dept.name,
  stream: dept.stream,
  description: `Diploma scheme and syllabus for ${dept.name}, as prescribed by the J&K Board of Technical Education.`,
  pdfHref: undefined as string | undefined,
}));

export const INSTITUTE_DOWNLOADS: readonly DownloadDoc[] = [
  {
    title: "Academic Calendar",
    description: "Session schedule and academic milestones for the current diploma session.",
    href: "/academic-calendar",
    status: "available",
  },
  {
    title: "Examination & Results",
    description: "Date sheets, examination forms guidance and result notices.",
    href: "/examination",
    status: "available",
  },
  {
    title: "Official Notices",
    description: "Admissions, academics and examination circulars from JKBOTE and the institute.",
    href: "/updates/notices",
    status: "available",
  },
  {
    title: "Mandatory Disclosures",
    description: "Public information on programmes, affiliation and institutional particulars.",
    href: "/mandatory-disclosures",
    status: "available",
  },
  {
    title: "Right to Information (RTI)",
    description: "How to seek information under the RTI Act and institute contact details.",
    href: "/rti",
    status: "available",
  },
  {
    title: "Student Welfare & Anti-Ragging",
    description: "Campus welfare commitment, anti-ragging policy and how to report a concern.",
    href: "/student-welfare",
    status: "available",
  },
] as const;

/** Essential student / applicant guidance — links to live institute pages */
export const FORM_DOWNLOADS: readonly DownloadDoc[] = [
  {
    title: "Admission Information",
    description: "Eligibility, documents, fees guidance and Apply Online through JKBOTE.",
    href: "/admissions",
    status: "available",
  },
  {
    title: "Hostel Information",
    description: "Residential hostel for women students — allotment follows institute notification.",
    href: "/hostel",
    status: "available",
  },
  {
    title: "Examination Forms & Results",
    description: "Date sheets, form windows and result notices under JKBOTE.",
    href: "/examination",
    status: "available",
  },
  {
    title: "Certificates & Office Requests",
    description: "Bonafide, character and other certificates through the institute office.",
    href: "/contact",
    status: "available",
  },
] as const;

export function collectSyllabusOverridesFromMedia(
  assets: { asset_key: string | null; public_url: string; folder?: string; is_active?: boolean }[],
): Record<string, string> {
  const map: Record<string, string> = {};
  for (const asset of assets) {
    if (asset.is_active === false || !asset.public_url) continue;
    const parsed = parseSyllabusOverrideKey(asset.asset_key);
    if (!parsed) continue;
    map[syllabusOverrideAssetKey(parsed.slug, parsed.semester)] = asset.public_url;
  }
  return map;
}

export { syllabusOverrideAssetKey, parseSyllabusOverrideKey };
