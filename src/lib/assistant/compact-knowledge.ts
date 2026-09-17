/**
 * Shrink live website knowledge for Groq/OpenAI free-tier token limits.
 * Keeps facts the assistant needs; drops long CMS prose and duplicate lists.
 */

const MAX_KNOWLEDGE_CHARS = 14_000;
const MAX_LIVE_CHARS = 2_500;

function clip(text: unknown, max: number): string | undefined {
  if (typeof text !== "string") return undefined;
  const t = text.trim();
  if (!t) return undefined;
  return t.length <= max ? t : `${t.slice(0, max - 1)}…`;
}

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;
}

export function compactKnowledgeForPrompt(knowledgeJson: string): string {
  let raw: unknown;
  try {
    raw = JSON.parse(knowledgeJson);
  } catch {
    return knowledgeJson.slice(0, MAX_KNOWLEDGE_CHARS);
  }

  const k = asRecord(raw);
  if (!k) return knowledgeJson.slice(0, MAX_KNOWLEDGE_CHARS);

  const college = asRecord(k.college);
  const admissions = asRecord(k.admissions);
  const contact = asRecord(k.contact);
  const location = asRecord(k.location);
  const downloads = asRecord(k.downloads);
  const placements = asRecord(k.placements);
  const facilities = asRecord(k.facilities);

  const departments = Array.isArray(k.departments)
    ? k.departments.map((d) => {
        const row = asRecord(d);
        if (!row) return null;
        return {
          name: row.name,
          slug: row.slug,
          page: row.page,
          duration: row.duration,
          intake: row.intake,
          eligibility: row.eligibility,
          stream: row.stream,
          summary: clip(row.summary, 160),
        };
      }).filter(Boolean)
    : [];

  const programmes = Array.isArray(admissions?.programmes)
    ? admissions.programmes.map((p) => {
        const row = asRecord(p);
        if (!row) return null;
        return {
          name: row.name,
          duration: row.duration,
          seats: row.seats,
          page: row.page,
          specialNote: row.specialNote || undefined,
        };
      }).filter(Boolean)
    : [];

  const compact = {
    college: college
      ? {
          name: college.name,
          shortName: college.shortName,
          established: college.established,
          tagline: clip(college.tagline, 120),
          type: college.type,
          location: college.location,
          affiliation: college.affiliation,
          principal: college.principal,
          principalRole: college.principalRole,
        }
      : undefined,
    official_sources: k.official_sources,
    admissions: admissions
      ? {
          authority: admissions.authority,
          applyUrl: admissions.applyUrl,
          admissionPortal: admissions.admissionPortal,
          eligibilitySummary: clip(admissions.eligibilitySummary ?? admissions.eligibilityIntro, 420),
          eligibilityNote: clip(admissions.eligibilityNote, 200),
          programmes,
          applicationProcess: Array.isArray(admissions.applicationProcess)
            ? admissions.applicationProcess.slice(0, 8)
            : undefined,
          requiredDocuments: Array.isArray(admissions.requiredDocuments)
            ? admissions.requiredDocuments.slice(0, 12)
            : undefined,
          reference_qa: Array.isArray(admissions.reference_qa)
            ? admissions.reference_qa.slice(0, 8).map((f) => {
                const row = asRecord(f);
                return row
                  ? {
                      question: row.question,
                      answer: clip(row.answer, 220),
                    }
                  : null;
              }).filter(Boolean)
            : undefined,
          fees: admissions.fees,
          feeNote: clip(admissions.feeNote, 160),
          importantDates_from_cms: admissions.importantDates_from_cms,
          applySection: admissions.applySection,
          disclaimer: clip(admissions.disclaimer, 180),
        }
      : undefined,
    departments,
    downloads: downloads
      ? {
          page: downloads.page,
          jkbotePortal: downloads.jkbotePortal,
          boardSemesterCurriculum: Array.isArray(downloads.boardSemesterCurriculum)
            ? downloads.boardSemesterCurriculum.map((s) => {
                const row = asRecord(s);
                return row
                  ? { semester: row.semester, label: row.label, href: row.href }
                  : null;
              }).filter(Boolean)
            : undefined,
          note: "Open /downloads for programme-wise Sem 1–6 links. Board PDFs are multi-branch.",
        }
      : undefined,
    facilities: facilities
      ? {
          page: facilities.page,
          items: Array.isArray(facilities.verified)
            ? facilities.verified.slice(0, 10).map((f) => {
                const row = asRecord(f);
                return row ? { name: row.name, description: clip(row.description, 100) } : null;
              }).filter(Boolean)
            : undefined,
        }
      : undefined,
    library: k.library,
    hostel: k.hostel,
    student_welfare: k.student_welfare,
    examination: k.examination,
    results: k.results,
    academic_calendar: k.academic_calendar,
    notices: asRecord(k.notices)
      ? { page: (k.notices as { page?: string }).page, summary: clip((k.notices as { summary?: string }).summary, 180) }
      : undefined,
    placements: placements
      ? {
          page: placements.page,
          summary: clip(placements.summary, 200),
          disclaimer: clip(placements.disclaimer, 140),
        }
      : undefined,
    contact,
    faculty: asRecord(k.faculty)
      ? {
          page: (k.faculty as { page?: string }).page,
          principal: (k.faculty as { principal?: unknown }).principal,
          verifiedContacts: Array.isArray((k.faculty as { verifiedContacts?: unknown }).verifiedContacts)
            ? (k.faculty as { verifiedContacts: unknown[] }).verifiedContacts.slice(0, 8)
            : undefined,
          directoryNote: clip((k.faculty as { directoryNote?: string }).directoryNote, 220),
          externalOfficialSource: (k.faculty as { externalOfficialSource?: string })
            .externalOfficialSource,
        }
      : undefined,
    location,
    website_navigation: Array.isArray(k.website_navigation)
      ? k.website_navigation.map((r) => {
          const row = asRecord(r);
          return row ? { label: row.label, path: row.path } : null;
        }).filter(Boolean)
      : undefined,
    common_questions: Array.isArray(k.common_questions)
      ? k.common_questions.slice(0, 6).map((f) => {
          const row = asRecord(f);
          return row
            ? { question: row.question, answer: clip(row.answer, 180) }
            : null;
        }).filter(Boolean)
      : undefined,
  };

  let json = JSON.stringify(compact);
  if (json.length > MAX_KNOWLEDGE_CHARS) {
    json = json.slice(0, MAX_KNOWLEDGE_CHARS - 1) + "…";
  }
  return json;
}

export function compactLiveContextForPrompt(live: unknown): string {
  const row = asRecord(live);
  if (!row) return "";

  const portal = asRecord(row.admissionPortal);
  const dates = asRecord(row.admissionDates);
  const notices = Array.isArray(row.recentNotices) ? row.recentNotices.slice(0, 6) : [];
  const results = Array.isArray(row.resultNotices) ? row.resultNotices.slice(0, 8) : [];

  const compact = {
    fetchedAt: row.fetchedAt,
    admissionPortal: portal
      ? { status: portal.status, portalUrl: portal.portalUrl, ok: portal.ok }
      : undefined,
    admissionDates: dates
      ? {
          portalStatus: dates.portalStatus,
          portalUrl: dates.portalUrl,
          latestNotice: dates.latestNotice,
          rows: Array.isArray(dates.rows) ? dates.rows.slice(0, 6) : [],
        }
      : undefined,
    recentNotices: notices.map((n) => {
      const notice = asRecord(n);
      return notice
        ? {
            title: clip(notice.title, 120),
            date: notice.date,
            category: notice.category,
            url: notice.url,
          }
        : null;
    }).filter(Boolean),
    resultNotices: results.map((n) => {
      const notice = asRecord(n);
      return notice
        ? {
            title: clip(notice.title, 140),
            date: notice.date,
            publishedAt: notice.publishedAt,
            url: notice.url,
          }
        : null;
    }).filter(Boolean),
    ok: row.ok,
  };

  let json = JSON.stringify(compact);
  if (json.length > MAX_LIVE_CHARS) {
    json = json.slice(0, MAX_LIVE_CHARS - 1) + "…";
  }
  return json;
}
