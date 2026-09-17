import {
  buildProgrammeSyllabus,
  collectSyllabusOverridesFromMedia,
  FORM_DOWNLOADS,
  INSTITUTE_DOWNLOADS,
} from "@/lib/downloads-data";
import { emptyJkboteSyllabusPayload } from "@/lib/jkbote-syllabus";
import { fetchJkboteSyllabus } from "@/server/cda/jkbote-syllabus";
import { fetchMediaAssets } from "@/server/cda/content";

export async function loadDownloadsPageData() {
  const [boardSyllabus, mediaAssets] = await Promise.all([
    fetchJkboteSyllabus({ data: {} }).catch((error) => {
      console.warn("[downloads] JKBOTE syllabus sync failed:", error);
      return emptyJkboteSyllabusPayload(
        error instanceof Error ? error.message : "Syllabus sync failed",
      );
    }),
    fetchMediaAssets({ data: {} }).catch(() => []),
  ]);

  const overrides = collectSyllabusOverridesFromMedia(mediaAssets ?? []);
  const programmes = buildProgrammeSyllabus(boardSyllabus.semesters, overrides);

  return {
    programmes,
    boardSyllabus,
    instituteDocs: INSTITUTE_DOWNLOADS,
    forms: FORM_DOWNLOADS,
  };
}
