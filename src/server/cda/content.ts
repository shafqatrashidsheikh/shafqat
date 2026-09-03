import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { isSupabaseConfigured } from "@/lib/env";
import {
  ADMISSIONS_APPLY_LABEL,
  ADMISSIONS_ASSISTANT_BODY,
  ADMISSIONS_ASSISTANT_LABEL,
  ADMISSIONS_ASSISTANT_TITLE,
  ADMISSIONS_DOCUMENTS_NOTE,
  ADMISSIONS_ELIGIBILITY_INTRO,
  ADMISSIONS_ELIGIBILITY_NOTE,
  ADMISSIONS_FEE_AMOUNT,
  ADMISSIONS_FEE_NOTE,
  ADMISSIONS_INTRO,
  ADMISSIONS_NOTICE_HREF,
  ADMISSIONS_NOTICE_LABEL,
  ADMISSIONS_PROGRAMMES_NOTE,
  ADMISSIONS_STRIP,
  ADMISSIONS_TITLE,
  JKBOTE_APPLY_URL,
} from "@/lib/admissions-data";
import { formatDate, getStaticAdmissionsData } from "@/lib/supabase/fallback";
import type { NoticeItem } from "@/lib/notices-data";
import { getSupabaseServer } from "@/lib/supabase/server";
import { requireAdmin } from "@/server/cma/auth";
import type {
  AdmissionsData,
  DbAdmissionCycle,
  DbAdmissionDocument,
  DbAdmissionEligibilityGroup,
  DbAdmissionProgramme,
} from "@/lib/supabase/types";

function asText(value: unknown, fallback: string): string {
  return typeof value === "string" && value.trim() ? value : fallback;
}

function asCycle(row: Record<string, unknown>): DbAdmissionCycle {
  return {
    id: String(row["id"]),
    year: Number(row["year"]),
    title: asText(row["title"], ADMISSIONS_TITLE),
    intro: asText(row["intro"], ADMISSIONS_INTRO),
    strip_text: asText(row["strip_text"], ADMISSIONS_STRIP),
    apply_url: asText(row["apply_url"], JKBOTE_APPLY_URL),
    apply_label: asText(row["apply_label"], ADMISSIONS_APPLY_LABEL),
    fee_amount: asText(row["fee_amount"], ADMISSIONS_FEE_AMOUNT),
    fee_note: asText(row["fee_note"], ADMISSIONS_FEE_NOTE),
    notice_url: asText(row["notice_url"], ADMISSIONS_NOTICE_HREF),
    notice_label: asText(row["notice_label"], ADMISSIONS_NOTICE_LABEL),
    eligibility_intro: asText(row["eligibility_intro"], ADMISSIONS_ELIGIBILITY_INTRO),
    eligibility_note: asText(row["eligibility_note"], ADMISSIONS_ELIGIBILITY_NOTE),
    documents_note: asText(row["documents_note"], ADMISSIONS_DOCUMENTS_NOTE),
    programmes_note: asText(row["programmes_note"], ADMISSIONS_PROGRAMMES_NOTE),
    assistant_title: asText(row["assistant_title"], ADMISSIONS_ASSISTANT_TITLE),
    assistant_body: asText(row["assistant_body"], ADMISSIONS_ASSISTANT_BODY),
    assistant_label: asText(row["assistant_label"], ADMISSIONS_ASSISTANT_LABEL),
    is_active: Boolean(row["is_active"]),
  };
}

function asDocuments(rows: Record<string, unknown>[] | null): DbAdmissionDocument[] {
  return (rows ?? []).map((row) => ({
    id: String(row["id"]),
    cycle_id: String(row["cycle_id"]),
    label: String(row["label"] ?? ""),
    detail: typeof row["detail"] === "string" ? row["detail"] : "",
    sort_order: Number(row["sort_order"] ?? 0),
  }));
}

function asProgrammes(rows: Record<string, unknown>[] | null): DbAdmissionProgramme[] {
  return (rows ?? []).map((row) => ({
    id: String(row["id"]),
    cycle_id: String(row["cycle_id"]),
    name: String(row["name"] ?? ""),
    credential: asText(row["credential"], "Diploma"),
    duration: asText(row["duration"], "3 Years"),
    seats: Number(row["seats"] ?? 0),
    category: asText(row["category"], ""),
    slug: asText(row["slug"], ""),
    badge: asText(row["badge"], ""),
    badge_note: asText(row["badge_note"], ""),
    sort_order: Number(row["sort_order"] ?? 0),
    is_active: row["is_active"] !== false,
  }));
}

function asEligibility(rows: Record<string, unknown>[] | null): DbAdmissionEligibilityGroup[] {
  return (rows ?? []).map((row) => ({
    id: String(row["id"]),
    cycle_id: String(row["cycle_id"]),
    heading: String(row["heading"] ?? ""),
    body: String(row["body"] ?? ""),
    sort_order: Number(row["sort_order"] ?? 0),
  }));
}

async function adminOrPublicClient(accessToken?: string) {
  if (accessToken) {
    const { supabase } = await requireAdmin(accessToken);
    return supabase;
  }
  return getSupabaseServer();
}

/** CDA — read admissions content */
export const fetchAdmissionsData = createServerFn({ method: "GET" }).handler(
  async (): Promise<AdmissionsData> => {
    if (!isSupabaseConfigured()) return getStaticAdmissionsData();

    try {
      const supabase = getSupabaseServer();
      const { data: cycle, error: cycleError } = await supabase
        .from("admission_cycles")
        .select("*")
        .eq("is_active", true)
        .order("year", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (cycleError) {
        console.error("[CDA] fetchAdmissionsData cycle query failed:", cycleError);
        return getStaticAdmissionsData();
      }

      if (!cycle) {
        console.error("[CDA] fetchAdmissionsData: no active admission cycle, using static fallback");
        return getStaticAdmissionsData();
      }

      const [steps, documents, dates, faqs, programmes, eligibility] = await Promise.all([
        supabase.from("admission_steps").select("*").eq("cycle_id", cycle.id).order("sort_order"),
        supabase.from("admission_documents").select("*").eq("cycle_id", cycle.id).order("sort_order"),
        supabase.from("admission_dates").select("*").eq("cycle_id", cycle.id).order("sort_order"),
        supabase.from("admission_faqs").select("*").eq("cycle_id", cycle.id).order("sort_order"),
        supabase
          .from("admission_programmes")
          .select("*")
          .eq("cycle_id", cycle.id)
          .eq("is_active", true)
          .order("sort_order"),
        supabase.from("admission_eligibility_groups").select("*").eq("cycle_id", cycle.id).order("sort_order"),
      ]);

      const queryErrors = [
        steps.error,
        documents.error,
        dates.error,
        faqs.error,
        programmes.error,
        eligibility.error,
      ].filter(Boolean);
      if (queryErrors.length > 0) {
        console.error("[CDA] fetchAdmissionsData partial query failures:", queryErrors);
      }

      const result = {
        cycle: asCycle(cycle as Record<string, unknown>),
        steps: steps.error ? [] : (steps.data ?? []),
        documents: documents.error ? [] : asDocuments(documents.data as Record<string, unknown>[] | null),
        dates: dates.error ? [] : (dates.data ?? []),
        faqs: faqs.error ? [] : (faqs.data ?? []),
        programmes: programmes.error ? [] : asProgrammes(programmes.data as Record<string, unknown>[] | null),
        eligibilityGroups: eligibility.error
          ? []
          : asEligibility(eligibility.data as Record<string, unknown>[] | null),
      };

      const hasContent =
        result.steps.length > 0 ||
        result.documents.length > 0 ||
        result.dates.length > 0 ||
        result.faqs.length > 0 ||
        result.programmes.length > 0 ||
        result.eligibilityGroups.length > 0;

      if (!hasContent) {
        console.error("[CDA] fetchAdmissionsData returned no CMS rows, using static fallback");
        return getStaticAdmissionsData();
      }

      return { ...result, source: "supabase" as const };
    } catch (error) {
      console.error("[CDA] fetchAdmissionsData failed, using static fallback:", error);
      return getStaticAdmissionsData();
    }
  },
);

/** CDA — read all notices (public or admin with token) */
export const fetchNotices = createServerFn({ method: "GET" })
  .validator(z.object({ accessToken: z.string().optional() }).optional())
  .handler(async ({ data }) => {
    if (!isSupabaseConfigured()) return [];

    const supabase = await adminOrPublicClient(data?.accessToken);
    let query = supabase.from("notices").select("*").order("sort_order").order("published_at", { ascending: false });
    if (!data?.accessToken) query = query.eq("is_published", true);
    const { data: rows, error } = await query;
    if (error) throw error;
    return rows ?? [];
  });

/** CDA — read departments */
export const fetchDepartments = createServerFn({ method: "GET" })
  .validator(z.object({ accessToken: z.string().optional() }).optional())
  .handler(async ({ data }) => {
    if (!isSupabaseConfigured()) return [];

    const supabase = await adminOrPublicClient(data?.accessToken);
    let query = supabase.from("departments").select("*").order("sort_order");
    if (!data?.accessToken) query = query.eq("is_active", true);
    const { data: rows, error } = await query;
    if (error) throw error;
    return rows ?? [];
  });

/** CDA — read programs */
export const fetchPrograms = createServerFn({ method: "GET" })
  .validator(z.object({ accessToken: z.string().optional() }).optional())
  .handler(async ({ data }) => {
    if (!isSupabaseConfigured()) return [];

    const supabase = await adminOrPublicClient(data?.accessToken);
    let query = supabase.from("programs").select("*").order("sort_order");
    if (!data?.accessToken) query = query.eq("is_active", true);
    const { data: rows, error } = await query;
    if (error) throw error;
    return rows ?? [];
  });

/** CDA — read events */
export const fetchEvents = createServerFn({ method: "GET" })
  .validator(z.object({ accessToken: z.string().optional() }).optional())
  .handler(async ({ data }) => {
    if (!isSupabaseConfigured()) return [];

    const supabase = await adminOrPublicClient(data?.accessToken);
    let query = supabase.from("events").select("*").order("sort_order");
    if (!data?.accessToken) query = query.eq("is_published", true);
    const { data: rows, error } = await query;
    if (error) throw error;
    return rows ?? [];
  });

/** CDA — read homepage CMS blocks (admin token required for full list) */
export const fetchHomepageBlocks = createServerFn({ method: "GET" })
  .validator(z.object({ accessToken: z.string().optional() }).optional())
  .handler(async ({ data }) => {
    if (!isSupabaseConfigured()) return null;

    const supabase = data?.accessToken
      ? (await requireAdmin(data.accessToken)).supabase
      : getSupabaseServer();

    const statQuery = supabase.from("institute_stats").select("*").order("sort_order");
    const spotlightQuery = supabase.from("institute_spotlights").select("*").order("sort_order");
    const unitQuery = supabase.from("academic_units").select("*").order("sort_order");
    const faqQuery = supabase.from("home_faqs").select("*").order("sort_order");

    const [stats, spotlights, units, faqs] = await Promise.all([
      data?.accessToken ? statQuery : statQuery.eq("is_active", true),
      data?.accessToken ? spotlightQuery : spotlightQuery.eq("is_active", true),
      data?.accessToken ? unitQuery : unitQuery.eq("is_active", true),
      data?.accessToken ? faqQuery : faqQuery.eq("is_active", true),
    ]);

    return {
      stats: stats.data ?? [],
      spotlights: spotlights.data ?? [],
      academicUnits: units.data ?? [],
      faqs: faqs.data ?? [],
    };
  });

/** Map CMS notice row to public notices page item */
export function mapNoticeRow(row: {
  title: string;
  category: string;
  published_at: string;
  priority: "Urgent" | "Important" | "General";
  file_label: string | null;
  file_url: string | null;
}): NoticeItem {
  return {
    title: row.title,
    cat: row.category,
    date: formatDate(row.published_at),
    priority: row.priority,
    file: row.file_label ?? "Document",
    fileUrl: row.file_url,
  };
}

/** CDA — public notices list for /notices page */
export const fetchPublicNotices = createServerFn({ method: "GET" }).handler(async (): Promise<NoticeItem[]> => {
  const rows = await fetchNotices({ data: {} });
  if (!rows?.length) return [];
  return rows.map(mapNoticeRow);
});

/** CDA — page sections (public or admin) */
export const fetchPageSections = createServerFn({ method: "GET" })
  .validator(z.object({ accessToken: z.string().optional() }).optional())
  .handler(async ({ data }) => {
    if (!isSupabaseConfigured()) return [];

    const supabase = data?.accessToken
      ? (await requireAdmin(data.accessToken)).supabase
      : getSupabaseServer();

    let query = supabase.from("page_sections").select("*").order("sort_order");
    if (!data?.accessToken) query = query.eq("is_active", true);
    const { data: rows, error } = await query;
    if (error) throw error;
    return rows ?? [];
  });

/** CDA — explore carousel cards */
export const fetchExploreCards = createServerFn({ method: "GET" })
  .validator(z.object({ accessToken: z.string().optional() }).optional())
  .handler(async ({ data }) => {
    if (!isSupabaseConfigured()) return [];

    const supabase = data?.accessToken
      ? (await requireAdmin(data.accessToken)).supabase
      : getSupabaseServer();

    let query = supabase.from("explore_cards").select("*").order("sort_order");
    if (!data?.accessToken) query = query.eq("is_active", true);
    const { data: rows, error } = await query;
    if (error) throw error;
    return rows ?? [];
  });

/** CDA — media library (images, videos, PDFs) */
export const fetchMediaAssets = createServerFn({ method: "GET" })
  .validator(z.object({ accessToken: z.string().optional() }).optional())
  .handler(async ({ data }) => {
    if (!isSupabaseConfigured()) return [];

    const supabase = data?.accessToken
      ? (await requireAdmin(data.accessToken)).supabase
      : getSupabaseServer();

    let query = supabase.from("media_assets").select("*").order("created_at", { ascending: false });
    if (!data?.accessToken) query = query.eq("is_active", true);
    const { data: rows, error } = await query;
    if (error) throw error;
    return rows ?? [];
  });

/** Build asset_key → public_url map for image resolution */
export function buildMediaUrlMap(
  assets: { asset_key: string | null; public_url: string; is_active: boolean }[],
): Record<string, string> {
  return Object.fromEntries(
    assets
      .filter((a) => a.is_active && a.asset_key && a.public_url)
      .map((a) => [a.asset_key as string, a.public_url]),
  );
}

/** CDA — read admissions admin data */
export const fetchAdmissionsAdmin = createServerFn({ method: "GET" })
  .validator(z.object({ accessToken: z.string() }))
  .handler(async ({ data }) => {
    if (!isSupabaseConfigured()) return getStaticAdmissionsData();

    const { supabase } = await requireAdmin(data.accessToken);
    const { data: cycle } = await supabase
      .from("admission_cycles")
      .select("*")
      .eq("is_active", true)
      .order("year", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (!cycle) return getStaticAdmissionsData();

    const [steps, documents, dates, faqs, programmes, eligibility] = await Promise.all([
      supabase.from("admission_steps").select("*").eq("cycle_id", cycle.id).order("sort_order"),
      supabase.from("admission_documents").select("*").eq("cycle_id", cycle.id).order("sort_order"),
      supabase.from("admission_dates").select("*").eq("cycle_id", cycle.id).order("sort_order"),
      supabase.from("admission_faqs").select("*").eq("cycle_id", cycle.id).order("sort_order"),
      supabase.from("admission_programmes").select("*").eq("cycle_id", cycle.id).order("sort_order"),
      supabase.from("admission_eligibility_groups").select("*").eq("cycle_id", cycle.id).order("sort_order"),
    ]);

    return {
      cycle: asCycle(cycle as Record<string, unknown>),
      steps: steps.data ?? [],
      documents: asDocuments(documents.data as Record<string, unknown>[] | null),
      dates: dates.data ?? [],
      faqs: faqs.data ?? [],
      programmes: asProgrammes(programmes.data as Record<string, unknown>[] | null),
      eligibilityGroups: asEligibility(eligibility.data as Record<string, unknown>[] | null),
      source: "supabase" as const,
    };
  });
