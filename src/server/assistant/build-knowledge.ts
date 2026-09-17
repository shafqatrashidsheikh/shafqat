import {
  FORM_DOWNLOADS,
  INSTITUTE_DOWNLOADS,
  JKBOTE_PORTAL_URL,
} from "@/lib/downloads-data";
import { JKBOTE_SEMESTER_CURRICULUM_FALLBACK } from "@/lib/jkbote-syllabus";
import { getJkboteSyllabusLinks } from "@/server/jkbote/syllabus";
import { departmentDetailPath } from "@/lib/departments-data";
import {
  FACULTY_DIRECTORY_NOTE,
  FACULTY_LEADERSHIP,
  FACULTY_VERIFIED,
} from "@/lib/faculty-data";
import {
  GPW_WEBSITE_ROUTES,
  OFFICIAL_EXTERNAL_SOURCES,
  buildBaselineKnowledge,
} from "@/data/gpwKnowledge";
import { getStaticAdmissionsData, getStaticHomepageData } from "@/lib/supabase/fallback";
import { INSTITUTE } from "@/lib/site-data";
import { loadAcademicsData } from "@/lib/loaders/site-pages";
import { fetchAdmissionsData } from "@/server/cda/content";
import { fetchHomepageData } from "@/server/cda/homepage";
import {
  fetchAboutBlocks,
  fetchCampusContent,
  fetchInstituteSettings,
  fetchPrincipalProfile,
} from "@/server/cda/site-extended";
import {
  ASSISTANT_KNOWLEDGE_TTL_MS,
  getAssistantKnowledgeCache,
  invalidateAssistantKnowledgeCache,
  setAssistantKnowledgeCache,
} from "@/server/assistant/knowledge-cache";

export { invalidateAssistantKnowledgeCache };

// Drop any oversized in-memory knowledge from before prompt compaction shipped.
invalidateAssistantKnowledgeCache();

export async function getAssistantKnowledgeJson(options?: {
  force?: boolean;
}): Promise<string> {
  const now = Date.now();
  const cached = getAssistantKnowledgeCache();
  if (
    !options?.force &&
    cached &&
    now - cached.at < ASSISTANT_KNOWLEDGE_TTL_MS
  ) {
    return cached.json;
  }

  const knowledge = await buildLiveWebsiteKnowledge();
  const json = JSON.stringify(knowledge);
  setAssistantKnowledgeCache(json);
  return json;
}

export async function buildLiveWebsiteKnowledge(): Promise<Record<string, unknown>> {
  const baseline = buildBaselineKnowledge();

  const [admissions, homepage, institute, principal, campus, aboutBlocks, academics, boardSyllabus] =
    await Promise.all([
      fetchAdmissionsData().catch((error) => {
        console.warn("[GPWS Assistant] admissions knowledge fallback:", error);
        return getStaticAdmissionsData();
      }),
      fetchHomepageData().catch((error) => {
        console.warn("[GPWS Assistant] homepage knowledge fallback:", error);
        return getStaticHomepageData();
      }),
      fetchInstituteSettings().catch(() => INSTITUTE),
      fetchPrincipalProfile({ data: {} }).catch(() => null),
      fetchCampusContent({ data: {} }).catch(() => null),
      fetchAboutBlocks({ data: {} }).catch(() => null),
      loadAcademicsData(),
      getJkboteSyllabusLinks().catch(() => null),
    ]);

  const cycle = admissions.cycle;
  const principalName =
    principal && typeof principal.name === "string" && principal.name.trim()
      ? principal.name.trim()
      : null;

  return {
    ...baseline,
    _meta: {
      syncedAt: new Date().toISOString(),
      sources: {
        admissions: admissions.source,
        homepage: homepage.source,
        campus: campus?.source ?? "static",
        principal: principal?.source ?? "static",
        about: aboutBlocks?.length ? "supabase" : "static",
      },
      note:
        "This knowledge is auto-built from the live website CMS and static official programme data. Prefer LIVE_OFFICIAL_DATA for JKBOTE notices/dates/portal status.",
    },
    college: {
      name: institute.name || INSTITUTE.name,
      shortName: institute.shortName || INSTITUTE.shortName,
      established: institute.established || INSTITUTE.established,
      tagline: institute.tagline || INSTITUTE.tagline,
      type: "Government Polytechnic (diploma-level technical institution for women)",
      location: "Bemina, Srinagar, Jammu & Kashmir — 190018",
      affiliation: "Jammu & Kashmir Board of Technical Education (JKBOTE)",
      principal: principalName,
      principalRole: principal?.role ?? "Principal",
      principalPreview: principal?.preview
        ? String(principal.preview).slice(0, 180)
        : null,
    },
    official_sources: OFFICIAL_EXTERNAL_SOURCES,
    admissions: {
      authority: "Jammu & Kashmir Board of Technical Education (JKBOTE)",
      applyUrl: cycle?.apply_url ?? OFFICIAL_EXTERNAL_SOURCES.jkboteApplyUrl,
      admissionPortal: OFFICIAL_EXTERNAL_SOURCES.jkboteAdmissionPortal,
      eligibilityIntro: cycle?.eligibility_intro ?? null,
      eligibilityNote: cycle?.eligibility_note ?? null,
      eligibilityGroups: admissions.eligibilityGroups.slice(0, 6).map((g) => ({
        heading: g.heading,
        body: g.body.slice(0, 280),
      })),
      programmes: (
        admissions.programmes.length
          ? admissions.programmes.map((p) => ({
              name: p.name,
              credential: p.credential,
              duration: p.duration,
              seats: p.seats,
              category: p.category,
              page: p.slug ? `/academics/departments/${p.slug}` : "/admissions",
              specialNote: p.badge_note || undefined,
            }))
          : ((baseline.admissions as { programmes?: unknown[] }).programmes ?? [])
      ),
      applicationProcess: admissions.steps.map((s) => ({
        step: s.title,
        detail: s.description,
      })),
      requiredDocuments: admissions.documents.map((d) =>
        d.detail ? `${d.label} (${d.detail})` : d.label,
      ),
      reference_qa: admissions.faqs.map((f) => ({
        question: f.question,
        answer: f.answer,
      })),
      fees: cycle?.fee_amount ?? null,
      feeNote: cycle?.fee_note ?? null,
      importantDates_from_cms: admissions.dates.map((d) => ({
        label: d.label,
        value: d.date_value,
      })),
      noticeUrl: cycle?.notice_url ?? null,
      noticeLabel: cycle?.notice_label ?? null,
      applySection: "/admissions#apply",
      programmesSection: "/admissions#admission-overview",
      eligibilitySection: "/admissions#eligibility",
      processSection: "/admissions#application-process",
      datesSection: "/admissions#important-dates",
      documentsSection: "/admissions#required-documents",
      feeSection: "/admissions#fee-information",
      disclaimer:
        "Admission dates, fees and seat details change with each official notification. Prefer LIVE_OFFICIAL_DATA and verify on JKBOTE before applying.",
    },
    academics: {
      programType: "Three-year full-time diploma programmes",
      stats: homepage.stats.map((s) => ({
        label: s.label,
        value: `${s.prefix ?? ""}${s.value}${s.suffix ?? ""}`,
      })),
      academicUnits: (homepage.academicUnits.length
        ? homepage.academicUnits
        : academics.academicUnits
      ).map((u) => ({
        title: u.title,
        subtitle: u.subtitle,
        path: u.to,
      })),
      examinationPage: "/examination",
      academicCalendarPage: "/academic-calendar",
      downloadsPage: "/downloads",
    },
    homepage: {
      announcements: homepage.announcements.slice(0, 6).map((a) => ({
        tag: a.tag,
        date: a.date,
        title: a.title,
      })),
      events: homepage.events.slice(0, 4).map((e) => ({
        title: e.title,
        date: e.date,
      })),
    },
    departments: academics.departments.map((d) => ({
      name: d.name,
      slug: d.slug,
      summary: d.summary,
      duration: d.duration,
      intake: d.intake,
      eligibility: d.eligibility,
      stream: d.stream,
      page: departmentDetailPath(d.slug),
    })),
    downloads: {
      page: "/downloads",
      jkbotePortal: JKBOTE_PORTAL_URL,
      boardSemesterCurriculum: (boardSyllabus?.semesters ??
        JKBOTE_SEMESTER_CURRICULUM_FALLBACK.map((s) => ({ ...s, live: false }))
      ).map((s) => ({
        semester: s.semester,
        label: s.label,
        href: s.href,
        live: "live" in s ? s.live : false,
      })),
      note:
        "JKBOTE semester curriculum PDFs are multi-branch. See /downloads for Sem 1–6 links per programme.",
      instituteDocuments: INSTITUTE_DOWNLOADS.map((d) => ({
        title: d.title,
        path: d.href ?? null,
      })),
      forms: FORM_DOWNLOADS.map((d) => ({
        title: d.title,
        status: d.status,
        path: d.href ?? null,
      })),
    },
    campus: {
      overview: "Government Polytechnic for Women, Srinagar is located at Bemina, Srinagar.",
      spotlights: homepage.spotlights.map((s) => ({
        title: s.title,
        subtitle: s.subtitle,
        path: s.to,
      })),
      galleryAlts: (campus?.gallery ?? []).slice(0, 12).map((g) => g.alt).filter(Boolean),
      page: "/campus",
      source: campus?.source ?? "static",
    },
    facilities: {
      verified: (campus?.facilities ?? []).map((f) => ({
        name: f.name,
        description: f.description,
      })),
      note: "Confirm current availability with the institute office if needed.",
      page: "/campus#facilities",
    },
    about: {
      page: "/about",
      blocks: (aboutBlocks ?? []).slice(0, 4).map((b) => ({
        key: b.block_key,
        title: b.title,
        body: b.body.slice(0, 220),
      })),
    },
    contact: {
      address: institute.address || INSTITUTE.address,
      phone: institute.phone || INSTITUTE.phone,
      email: institute.email || INSTITUTE.email,
      page: "/contact",
      mapLink: institute.mapLink || INSTITUTE.mapLink,
      note: "Use the Contact page for the enquiry form and campus location map.",
    },
    faculty: {
      page: "/faculty",
      principal: {
        name: principalName ?? FACULTY_LEADERSHIP.name,
        role: principal?.role ?? FACULTY_LEADERSHIP.role,
      },
      verifiedContacts: FACULTY_VERIFIED.map((p) => ({
        name: p.name,
        designation: p.designation,
        department: p.department,
        phone: p.phone ?? null,
        source: p.source,
        sourceUrl: p.sourceUrl ?? null,
      })),
      directoryNote: FACULTY_DIRECTORY_NOTE,
      externalOfficialSource: "https://admission.jkbote.ac.in/intake.html",
    },
    location: {
      address: institute.address || INSTITUTE.address,
      area: "Bemina, Srinagar, Jammu & Kashmir",
      postalCode: "190018",
      mapLink: institute.mapLink || INSTITUTE.mapLink,
    },
    website_navigation: GPW_WEBSITE_ROUTES,
    common_questions: (
      homepage.faqs.length
        ? homepage.faqs.map((f) => ({ question: f.q, answer: f.a }))
        : ((baseline.common_questions as { question: string; answer: string }[]) ?? [])
    ),
  };
}
