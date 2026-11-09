import {
  ACADEMIC_UNITS,
  CAMPUS_EVENTS,
  HOME_FAQS,
  INSTITUTE_SPOTLIGHTS,
  PROGRAMS,
  STATS,
} from "@/lib/site-data";
import { ANNOUNCEMENTS } from "@/lib/notices-data";
import {
  ADMISSIONS_APPLY_LABEL,
  ADMISSIONS_ASSISTANT_BODY,
  ADMISSIONS_ASSISTANT_LABEL,
  ADMISSIONS_ASSISTANT_TITLE,
  ADMISSIONS_DATES,
  ADMISSIONS_DOCUMENTS,
  ADMISSIONS_DOCUMENTS_NOTE,
  ADMISSIONS_ELIGIBILITY_GROUPS,
  ADMISSIONS_ELIGIBILITY_INTRO,
  ADMISSIONS_ELIGIBILITY_NOTE,
  ADMISSIONS_FAQS,
  ADMISSIONS_FEE_AMOUNT,
  ADMISSIONS_FEE_NOTE,
  ADMISSIONS_INTRO,
  ADMISSIONS_NOTICE_HREF,
  ADMISSIONS_NOTICE_LABEL,
  ADMISSIONS_PROGRAMMES,
  ADMISSIONS_PROGRAMMES_NOTE,
  ADMISSIONS_STEPS,
  ADMISSIONS_STRIP,
  ADMISSIONS_TITLE,
  ADMISSIONS_YEAR,
  JKBOTE_APPLY_URL,
  serializeEligibilityGroup,
} from "@/lib/admissions-data";
import {
  getStaticExploreCards,
  getStaticPageSections,
} from "@/lib/site-content";
import type { AdmissionsData, DbAdmissionCycle, HomepageData } from "@/lib/supabase/types";

export function getStaticHomepageData(): HomepageData {
  return {
    announcements: ANNOUNCEMENTS.map((a) => ({ tag: a.tag, date: a.date, title: a.title })),
    events: CAMPUS_EVENTS.map((e) => ({ title: e.title, date: e.date, place: e.place })),
    stats: STATS.map((s) => ({ value: s.value, label: s.label, prefix: s.prefix, suffix: s.suffix })),
    spotlights: INSTITUTE_SPOTLIGHTS.map((s) => ({ title: s.title, subtitle: s.subtitle, to: s.to })),
    academicUnits: ACADEMIC_UNITS.map((u) => ({ title: u.title, subtitle: u.subtitle, to: u.to })),
    faqs: HOME_FAQS.map((f) => ({ q: f.q, a: f.a })),
    programs: PROGRAMS.map((p) => ({
      name: p.name,
      dept: p.categoryLabel,
      duration: p.duration,
      eligibility: p.eligibility,
      seats: p.seats ?? "",
      stream: p.stream,
      overview: p.overview,
    })),
    sections: getStaticPageSections(),
    exploreCards: getStaticExploreCards().map((c) => ({
      id: c.id,
      category: c.category,
      title: c.title,
      description: c.description,
      cta: c.cta,
      href: c.href,
      image: c.image,
      imageAlt: c.imageAlt,
      imagePosition: c.imagePosition,
      imageObjectClass: c.imageObjectClass,
      priority: c.priority,
    })),
    source: "static",
  };
}

export function getStaticAdmissionCycle(id = "static"): DbAdmissionCycle {
  return {
    id,
    year: ADMISSIONS_YEAR,
    title: ADMISSIONS_TITLE,
    intro: ADMISSIONS_INTRO,
    strip_text: ADMISSIONS_STRIP,
    apply_url: JKBOTE_APPLY_URL,
    apply_label: ADMISSIONS_APPLY_LABEL,
    fee_amount: ADMISSIONS_FEE_AMOUNT,
    fee_note: ADMISSIONS_FEE_NOTE,
    notice_url: ADMISSIONS_NOTICE_HREF,
    notice_label: ADMISSIONS_NOTICE_LABEL,
    eligibility_intro: ADMISSIONS_ELIGIBILITY_INTRO,
    eligibility_note: ADMISSIONS_ELIGIBILITY_NOTE,
    documents_note: ADMISSIONS_DOCUMENTS_NOTE,
    programmes_note: ADMISSIONS_PROGRAMMES_NOTE,
    assistant_title: ADMISSIONS_ASSISTANT_TITLE,
    assistant_body: ADMISSIONS_ASSISTANT_BODY,
    assistant_label: ADMISSIONS_ASSISTANT_LABEL,
    is_active: true,
  };
}

export function getStaticAdmissionsData(): AdmissionsData {
  return {
    cycle: getStaticAdmissionCycle(),
    steps: ADMISSIONS_STEPS.map((s, i) => ({
      id: String(i + 1),
      cycle_id: "static",
      step_number: i + 1,
      title: s.t,
      description: s.d,
      sort_order: i + 1,
    })),
    documents: ADMISSIONS_DOCUMENTS.map((d, i) => ({
      id: String(i + 1),
      cycle_id: "static",
      label: d.label,
      detail: d.detail,
      sort_order: i + 1,
    })),
    dates: ADMISSIONS_DATES.map((d, i) => ({
      id: String(i + 1),
      cycle_id: "static",
      label: d.label,
      date_value: d.date_value,
      sort_order: i + 1,
    })),
    faqs: ADMISSIONS_FAQS.map((f, i) => ({
      id: String(i + 1),
      cycle_id: "static",
      question: f.q,
      answer: f.a,
      sort_order: i + 1,
    })),
    programmes: ADMISSIONS_PROGRAMMES.map((p, i) => ({
      id: String(i + 1),
      cycle_id: "static",
      name: p.name,
      credential: p.credential,
      duration: p.duration,
      seats: p.seats,
      category: p.category,
      slug: p.slug,
      badge: p.badge,
      badge_note: p.badge_note,
      sort_order: i + 1,
      is_active: true,
    })),
    eligibilityGroups: ADMISSIONS_ELIGIBILITY_GROUPS.map((g, i) => ({
      id: String(i + 1),
      cycle_id: "static",
      heading: g.heading,
      body: serializeEligibilityGroup(g),
      sort_order: i + 1,
    })),
    source: "static",
  };
}

function formatDate(iso: string): string {
  const dateOnly = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  const d = dateOnly
    ? new Date(Number(dateOnly[1]), Number(dateOnly[2]) - 1, Number(dateOnly[3]))
    : new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export { formatDate };
