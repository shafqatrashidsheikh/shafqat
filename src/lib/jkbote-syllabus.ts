/**
 * Official JKBOTE diploma curriculum / syllabus by semester.
 * Board publishes multi-branch semester PDFs; programme pages deep-link into those.
 */

export const JKBOTE_HOME_URL = "https://jkbote.ac.in/";

/** Verified board curriculum PDFs (fallback when live homepage parse is unavailable). */
export const JKBOTE_SEMESTER_CURRICULUM_FALLBACK: readonly {
  semester: 1 | 2 | 3 | 4 | 5 | 6;
  label: string;
  href: string;
}[] = [
  { semester: 1, label: "Semester 1", href: "https://jkbote.ac.in/NEP-FIRST.pdf" },
  { semester: 2, label: "Semester 2", href: "https://jkbote.ac.in/2nd_Semester_Curriculum.pdf" },
  { semester: 3, label: "Semester 3", href: "https://jkbote.ac.in/3rdSemester.pdf" },
  { semester: 4, label: "Semester 4", href: "https://jkbote.ac.in/4thSemester.pdf" },
  { semester: 5, label: "Semester 5", href: "https://jkbote.ac.in/5thSemester.pdf" },
  { semester: 6, label: "Semester 6", href: "https://jkbote.ac.in/6thSemester.pdf" },
] as const;

export type JkboteSemesterLink = {
  semester: 1 | 2 | 3 | 4 | 5 | 6;
  label: string;
  href: string;
  /** true when URL came from a live JKBOTE homepage parse */
  live: boolean;
};

export type JkboteSyllabusPayload = {
  fetchedAt: string;
  ok: boolean;
  error?: string;
  sourcePage: string;
  semesters: JkboteSemesterLink[];
};

export const JKBOTE_SYLLABUS_TTL_MS = 6 * 60 * 60 * 1000;

/** Map a PDF filename / URL to semester 1–6 when possible. */
export function detectSemesterFromUrl(url: string): 1 | 2 | 3 | 4 | 5 | 6 | null {
  const u = url.toLowerCase();
  if (/nep[-_]?first|1st|first[_-]?sem|semester[_-]?1\b|sem[_-]?1\b/.test(u)) return 1;
  if (/2nd|second[_-]?sem|semester[_-]?2\b|sem[_-]?2\b/.test(u)) return 2;
  if (/3rd|third[_-]?sem|semester[_-]?3\b|sem[_-]?3\b/.test(u)) return 3;
  if (/4th|fourth[_-]?sem|semester[_-]?4\b|sem[_-]?4\b/.test(u)) return 4;
  if (/5th|fifth[_-]?sem|semester[_-]?5\b|sem[_-]?5\b/.test(u)) return 5;
  if (/6th|sixth[_-]?sem|semester[_-]?6\b|sem[_-]?6\b/.test(u)) return 6;
  return null;
}

export function emptyJkboteSyllabusPayload(error?: string): JkboteSyllabusPayload {
  return {
    fetchedAt: new Date().toISOString(),
    ok: false,
    error,
    sourcePage: JKBOTE_HOME_URL,
    semesters: JKBOTE_SEMESTER_CURRICULUM_FALLBACK.map((s) => ({
      ...s,
      live: false,
    })),
  };
}

/**
 * Institute override key convention for Media Library (folder: syllabus):
 *   asset_key = syllabus/{programme-slug}/sem-{1-6}
 * Example: syllabus/computer-engineering/sem-3
 */
export function syllabusOverrideAssetKey(slug: string, semester: number): string {
  return `syllabus/${slug}/sem-${semester}`;
}

export function parseSyllabusOverrideKey(
  assetKey: string | null | undefined,
): { slug: string; semester: 1 | 2 | 3 | 4 | 5 | 6 } | null {
  if (!assetKey) return null;
  const match = /^syllabus\/([a-z0-9-]+)\/sem-([1-6])$/i.exec(assetKey.trim());
  if (!match) return null;
  return {
    slug: match[1].toLowerCase(),
    semester: Number(match[2]) as 1 | 2 | 3 | 4 | 5 | 6,
  };
}
