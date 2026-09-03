import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireAdmin } from "@/server/cma/auth";

const tokenSchema = z.object({ accessToken: z.string().min(1) });

function withAdmin<T extends z.ZodTypeAny>(payloadSchema: T) {
  return tokenSchema.extend({ payload: payloadSchema });
}

function withAdminId<T extends z.ZodTypeAny>(payloadSchema: T) {
  return tokenSchema.extend({ id: z.string().uuid(), payload: payloadSchema });
}

const idOnlySchema = tokenSchema.extend({ id: z.string().uuid() });

// ---------------------------------------------------------------------------
// Notices
// ---------------------------------------------------------------------------
const noticePayload = z.object({
  title: z.string().min(1),
  category: z.string().default("Notices"),
  tag: z.string().default("Notice"),
  published_at: z.string(),
  priority: z.enum(["Urgent", "Important", "General"]).default("General"),
  file_label: z.string().nullable().optional(),
  file_url: z.string().nullable().optional(),
  is_pinned: z.boolean().default(false),
  is_published: z.boolean().default(true),
  sort_order: z.number().int().default(0),
});

export const cmaCreateNotice = createServerFn({ method: "POST" })
  .validator(withAdmin(noticePayload))
  .handler(async ({ data }) => {
    const { supabase } = await requireAdmin(data.accessToken);
    const { data: row, error } = await supabase.from("notices").insert(data.payload).select().single();
    if (error) throw error;
    return row;
  });

export const cmaUpdateNotice = createServerFn({ method: "POST" })
  .validator(withAdminId(noticePayload.partial()))
  .handler(async ({ data }) => {
    const { supabase } = await requireAdmin(data.accessToken);
    const { data: row, error } = await supabase
      .from("notices")
      .update(data.payload)
      .eq("id", data.id)
      .select()
      .single();
    if (error) throw error;
    return row;
  });

export const cmaDeleteNotice = createServerFn({ method: "POST" })
  .validator(idOnlySchema)
  .handler(async ({ data }) => {
    const { supabase } = await requireAdmin(data.accessToken);
    const { error } = await supabase.from("notices").delete().eq("id", data.id);
    if (error) throw error;
    return { ok: true };
  });

// ---------------------------------------------------------------------------
// Events
// ---------------------------------------------------------------------------
const eventPayload = z.object({
  title: z.string().min(1),
  event_date: z.string().min(1),
  venue: z.string().default(""),
  description: z.string().default(""),
  is_published: z.boolean().default(true),
  sort_order: z.number().int().default(0),
});

export const cmaCreateEvent = createServerFn({ method: "POST" })
  .validator(withAdmin(eventPayload))
  .handler(async ({ data }) => {
    const { supabase } = await requireAdmin(data.accessToken);
    const { data: row, error } = await supabase.from("events").insert(data.payload).select().single();
    if (error) throw error;
    return row;
  });

export const cmaUpdateEvent = createServerFn({ method: "POST" })
  .validator(withAdminId(eventPayload.partial()))
  .handler(async ({ data }) => {
    const { supabase } = await requireAdmin(data.accessToken);
    const { data: row, error } = await supabase
      .from("events")
      .update(data.payload)
      .eq("id", data.id)
      .select()
      .single();
    if (error) throw error;
    return row;
  });

export const cmaDeleteEvent = createServerFn({ method: "POST" })
  .validator(idOnlySchema)
  .handler(async ({ data }) => {
    const { supabase } = await requireAdmin(data.accessToken);
    const { error } = await supabase.from("events").delete().eq("id", data.id);
    if (error) throw error;
    return { ok: true };
  });

// ---------------------------------------------------------------------------
// Departments
// ---------------------------------------------------------------------------
const careerAreasField = z
  .union([z.array(z.string()), z.string()])
  .optional()
  .transform((val) => {
    if (val === undefined) return undefined;
    if (Array.isArray(val)) return val;
    return val
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);
  });

const departmentPayload = z.object({
  slug: z.string().min(1),
  name: z.string().min(1),
  summary: z.string().default(""),
  head_name: z.string().nullable().optional(),
  overview: z.string().optional(),
  category_label: z.string().optional(),
  duration: z.string().optional(),
  eligibility: z.string().optional(),
  program_type: z.string().optional(),
  stream: z.string().optional(),
  icon: z.string().optional(),
  has_departmental_labs: z.boolean().optional(),
  career_areas: careerAreasField,
  image_asset_key: z.string().nullable().optional(),
  image_alt: z.string().optional(),
  sort_order: z.number().int().default(0),
  is_active: z.boolean().default(true),
});

export const cmaCreateDepartment = createServerFn({ method: "POST" })
  .validator(withAdmin(departmentPayload))
  .handler(async ({ data }) => {
    const { supabase } = await requireAdmin(data.accessToken);
    const { data: row, error } = await supabase.from("departments").insert(data.payload).select().single();
    if (error) throw error;
    return row;
  });

export const cmaUpdateDepartment = createServerFn({ method: "POST" })
  .validator(withAdminId(departmentPayload.partial()))
  .handler(async ({ data }) => {
    const { supabase } = await requireAdmin(data.accessToken);
    const { data: row, error } = await supabase
      .from("departments")
      .update(data.payload)
      .eq("id", data.id)
      .select()
      .single();
    if (error) throw error;
    return row;
  });

export const cmaDeleteDepartment = createServerFn({ method: "POST" })
  .validator(idOnlySchema)
  .handler(async ({ data }) => {
    const { supabase } = await requireAdmin(data.accessToken);
    const { error } = await supabase.from("departments").delete().eq("id", data.id);
    if (error) throw error;
    return { ok: true };
  });

// ---------------------------------------------------------------------------
// Programs
// ---------------------------------------------------------------------------
const programPayload = z.object({
  department_id: z.string().uuid().nullable().optional(),
  name: z.string().min(1),
  dept_label: z.string().min(1),
  duration: z.string().default("3 Years"),
  eligibility: z.string().default(""),
  seats: z.string().default(""),
  stream: z.string().default("Engineering"),
  overview: z.string().default(""),
  sort_order: z.number().int().default(0),
  is_active: z.boolean().default(true),
});

export const cmaCreateProgram = createServerFn({ method: "POST" })
  .validator(withAdmin(programPayload))
  .handler(async ({ data }) => {
    const { supabase } = await requireAdmin(data.accessToken);
    const { data: row, error } = await supabase.from("programs").insert(data.payload).select().single();
    if (error) throw error;
    return row;
  });

export const cmaUpdateProgram = createServerFn({ method: "POST" })
  .validator(withAdminId(programPayload.partial()))
  .handler(async ({ data }) => {
    const { supabase } = await requireAdmin(data.accessToken);
    const { data: row, error } = await supabase
      .from("programs")
      .update(data.payload)
      .eq("id", data.id)
      .select()
      .single();
    if (error) throw error;
    return row;
  });

export const cmaDeleteProgram = createServerFn({ method: "POST" })
  .validator(idOnlySchema)
  .handler(async ({ data }) => {
    const { supabase } = await requireAdmin(data.accessToken);
    const { error } = await supabase.from("programs").delete().eq("id", data.id);
    if (error) throw error;
    return { ok: true };
  });

// ---------------------------------------------------------------------------
// Homepage — stats, spotlights, academic units, FAQs
// ---------------------------------------------------------------------------
const statPayload = z.object({
  value: z.number(),
  label: z.string().min(1),
  prefix: z.string().default(""),
  suffix: z.string().default(""),
  sort_order: z.number().int().default(0),
  is_active: z.boolean().default(true),
});

export const cmaCreateStat = createServerFn({ method: "POST" })
  .validator(withAdmin(statPayload))
  .handler(async ({ data }) => {
    const { supabase } = await requireAdmin(data.accessToken);
    const { data: row, error } = await supabase.from("institute_stats").insert(data.payload).select().single();
    if (error) throw error;
    return row;
  });

export const cmaUpdateStat = createServerFn({ method: "POST" })
  .validator(withAdminId(statPayload.partial()))
  .handler(async ({ data }) => {
    const { supabase } = await requireAdmin(data.accessToken);
    const { data: row, error } = await supabase
      .from("institute_stats")
      .update(data.payload)
      .eq("id", data.id)
      .select()
      .single();
    if (error) throw error;
    return row;
  });

export const cmaDeleteStat = createServerFn({ method: "POST" })
  .validator(idOnlySchema)
  .handler(async ({ data }) => {
    const { supabase } = await requireAdmin(data.accessToken);
    const { error } = await supabase.from("institute_stats").delete().eq("id", data.id);
    if (error) throw error;
    return { ok: true };
  });

const spotlightPayload = z.object({
  title: z.string().min(1),
  subtitle: z.string().default(""),
  link_path: z.string().default("/"),
  sort_order: z.number().int().default(0),
  is_active: z.boolean().default(true),
});

export const cmaCreateSpotlight = createServerFn({ method: "POST" })
  .validator(withAdmin(spotlightPayload))
  .handler(async ({ data }) => {
    const { supabase } = await requireAdmin(data.accessToken);
    const { data: row, error } = await supabase.from("institute_spotlights").insert(data.payload).select().single();
    if (error) throw error;
    return row;
  });

export const cmaUpdateSpotlight = createServerFn({ method: "POST" })
  .validator(withAdminId(spotlightPayload.partial()))
  .handler(async ({ data }) => {
    const { supabase } = await requireAdmin(data.accessToken);
    const { data: row, error } = await supabase
      .from("institute_spotlights")
      .update(data.payload)
      .eq("id", data.id)
      .select()
      .single();
    if (error) throw error;
    return row;
  });

export const cmaDeleteSpotlight = createServerFn({ method: "POST" })
  .validator(idOnlySchema)
  .handler(async ({ data }) => {
    const { supabase } = await requireAdmin(data.accessToken);
    const { error } = await supabase.from("institute_spotlights").delete().eq("id", data.id);
    if (error) throw error;
    return { ok: true };
  });

const unitPayload = z.object({
  title: z.string().min(1),
  subtitle: z.string().default(""),
  link_path: z.string().default("/academics"),
  sort_order: z.number().int().default(0),
  is_active: z.boolean().default(true),
});

export const cmaCreateAcademicUnit = createServerFn({ method: "POST" })
  .validator(withAdmin(unitPayload))
  .handler(async ({ data }) => {
    const { supabase } = await requireAdmin(data.accessToken);
    const { data: row, error } = await supabase.from("academic_units").insert(data.payload).select().single();
    if (error) throw error;
    return row;
  });

export const cmaUpdateAcademicUnit = createServerFn({ method: "POST" })
  .validator(withAdminId(unitPayload.partial()))
  .handler(async ({ data }) => {
    const { supabase } = await requireAdmin(data.accessToken);
    const { data: row, error } = await supabase
      .from("academic_units")
      .update(data.payload)
      .eq("id", data.id)
      .select()
      .single();
    if (error) throw error;
    return row;
  });

export const cmaDeleteAcademicUnit = createServerFn({ method: "POST" })
  .validator(idOnlySchema)
  .handler(async ({ data }) => {
    const { supabase } = await requireAdmin(data.accessToken);
    const { error } = await supabase.from("academic_units").delete().eq("id", data.id);
    if (error) throw error;
    return { ok: true };
  });

const faqPayload = z.object({
  question: z.string().min(1),
  answer: z.string().min(1),
  sort_order: z.number().int().default(0),
  is_active: z.boolean().default(true),
});

export const cmaCreateHomeFaq = createServerFn({ method: "POST" })
  .validator(withAdmin(faqPayload))
  .handler(async ({ data }) => {
    const { supabase } = await requireAdmin(data.accessToken);
    const { data: row, error } = await supabase.from("home_faqs").insert(data.payload).select().single();
    if (error) throw error;
    return row;
  });

export const cmaUpdateHomeFaq = createServerFn({ method: "POST" })
  .validator(withAdminId(faqPayload.partial()))
  .handler(async ({ data }) => {
    const { supabase } = await requireAdmin(data.accessToken);
    const { data: row, error } = await supabase
      .from("home_faqs")
      .update(data.payload)
      .eq("id", data.id)
      .select()
      .single();
    if (error) throw error;
    return row;
  });

export const cmaDeleteHomeFaq = createServerFn({ method: "POST" })
  .validator(idOnlySchema)
  .handler(async ({ data }) => {
    const { supabase } = await requireAdmin(data.accessToken);
    const { error } = await supabase.from("home_faqs").delete().eq("id", data.id);
    if (error) throw error;
    return { ok: true };
  });

// ---------------------------------------------------------------------------
// Admissions
// ---------------------------------------------------------------------------
const cyclePayload = z.object({
  year: z.number().int(),
  title: z.string().min(1),
  intro: z.string().default(""),
  strip_text: z.string().default(""),
  apply_url: z.string().default(""),
  apply_label: z.string().default(""),
  fee_amount: z.string().default(""),
  fee_note: z.string().default(""),
  notice_url: z.string().default(""),
  notice_label: z.string().default(""),
  eligibility_intro: z.string().default(""),
  eligibility_note: z.string().default(""),
  documents_note: z.string().default(""),
  programmes_note: z.string().default(""),
  assistant_title: z.string().default(""),
  assistant_body: z.string().default(""),
  assistant_label: z.string().default(""),
  is_active: z.boolean().default(true),
});

export const cmaUpdateAdmissionCycle = createServerFn({ method: "POST" })
  .validator(withAdminId(cyclePayload.partial()))
  .handler(async ({ data }) => {
    const { supabase } = await requireAdmin(data.accessToken);
    const { data: row, error } = await supabase
      .from("admission_cycles")
      .update(data.payload)
      .eq("id", data.id)
      .select()
      .single();
    if (error) throw error;
    return row;
  });

const stepPayload = z.object({
  cycle_id: z.string().uuid(),
  step_number: z.number().int(),
  title: z.string().min(1),
  description: z.string().default(""),
  sort_order: z.number().int().default(0),
});

export const cmaCreateAdmissionStep = createServerFn({ method: "POST" })
  .validator(withAdmin(stepPayload))
  .handler(async ({ data }) => {
    const { supabase } = await requireAdmin(data.accessToken);
    const { data: row, error } = await supabase.from("admission_steps").insert(data.payload).select().single();
    if (error) throw error;
    return row;
  });

export const cmaUpdateAdmissionStep = createServerFn({ method: "POST" })
  .validator(withAdminId(stepPayload.partial()))
  .handler(async ({ data }) => {
    const { supabase } = await requireAdmin(data.accessToken);
    const { data: row, error } = await supabase
      .from("admission_steps")
      .update(data.payload)
      .eq("id", data.id)
      .select()
      .single();
    if (error) throw error;
    return row;
  });

export const cmaDeleteAdmissionStep = createServerFn({ method: "POST" })
  .validator(idOnlySchema)
  .handler(async ({ data }) => {
    const { supabase } = await requireAdmin(data.accessToken);
    const { error } = await supabase.from("admission_steps").delete().eq("id", data.id);
    if (error) throw error;
    return { ok: true };
  });

const docPayload = z.object({
  cycle_id: z.string().uuid(),
  label: z.string().min(1),
  detail: z.string().default(""),
  sort_order: z.number().int().default(0),
});

export const cmaCreateAdmissionDocument = createServerFn({ method: "POST" })
  .validator(withAdmin(docPayload))
  .handler(async ({ data }) => {
    const { supabase } = await requireAdmin(data.accessToken);
    const { data: row, error } = await supabase.from("admission_documents").insert(data.payload).select().single();
    if (error) throw error;
    return row;
  });

export const cmaUpdateAdmissionDocument = createServerFn({ method: "POST" })
  .validator(withAdminId(docPayload.partial()))
  .handler(async ({ data }) => {
    const { supabase } = await requireAdmin(data.accessToken);
    const { data: row, error } = await supabase
      .from("admission_documents")
      .update(data.payload)
      .eq("id", data.id)
      .select()
      .single();
    if (error) throw error;
    return row;
  });

export const cmaDeleteAdmissionDocument = createServerFn({ method: "POST" })
  .validator(idOnlySchema)
  .handler(async ({ data }) => {
    const { supabase } = await requireAdmin(data.accessToken);
    const { error } = await supabase.from("admission_documents").delete().eq("id", data.id);
    if (error) throw error;
    return { ok: true };
  });

const datePayload = z.object({
  cycle_id: z.string().uuid(),
  label: z.string().min(1),
  date_value: z.string().default("To be announced"),
  sort_order: z.number().int().default(0),
});

export const cmaCreateAdmissionDate = createServerFn({ method: "POST" })
  .validator(withAdmin(datePayload))
  .handler(async ({ data }) => {
    const { supabase } = await requireAdmin(data.accessToken);
    const { data: row, error } = await supabase.from("admission_dates").insert(data.payload).select().single();
    if (error) throw error;
    return row;
  });

export const cmaUpdateAdmissionDate = createServerFn({ method: "POST" })
  .validator(withAdminId(datePayload.partial()))
  .handler(async ({ data }) => {
    const { supabase } = await requireAdmin(data.accessToken);
    const { data: row, error } = await supabase
      .from("admission_dates")
      .update(data.payload)
      .eq("id", data.id)
      .select()
      .single();
    if (error) throw error;
    return row;
  });

export const cmaDeleteAdmissionDate = createServerFn({ method: "POST" })
  .validator(idOnlySchema)
  .handler(async ({ data }) => {
    const { supabase } = await requireAdmin(data.accessToken);
    const { error } = await supabase.from("admission_dates").delete().eq("id", data.id);
    if (error) throw error;
    return { ok: true };
  });

const admissionFaqPayload = z.object({
  cycle_id: z.string().uuid(),
  question: z.string().min(1),
  answer: z.string().min(1),
  sort_order: z.number().int().default(0),
});

export const cmaCreateAdmissionFaq = createServerFn({ method: "POST" })
  .validator(withAdmin(admissionFaqPayload))
  .handler(async ({ data }) => {
    const { supabase } = await requireAdmin(data.accessToken);
    const { data: row, error } = await supabase.from("admission_faqs").insert(data.payload).select().single();
    if (error) throw error;
    return row;
  });

export const cmaUpdateAdmissionFaq = createServerFn({ method: "POST" })
  .validator(withAdminId(admissionFaqPayload.partial()))
  .handler(async ({ data }) => {
    const { supabase } = await requireAdmin(data.accessToken);
    const { data: row, error } = await supabase
      .from("admission_faqs")
      .update(data.payload)
      .eq("id", data.id)
      .select()
      .single();
    if (error) throw error;
    return row;
  });

export const cmaDeleteAdmissionFaq = createServerFn({ method: "POST" })
  .validator(idOnlySchema)
  .handler(async ({ data }) => {
    const { supabase } = await requireAdmin(data.accessToken);
    const { error } = await supabase.from("admission_faqs").delete().eq("id", data.id);
    if (error) throw error;
    return { ok: true };
  });

const programmePayload = z.object({
  cycle_id: z.string().uuid(),
  name: z.string().min(1),
  credential: z.string().default("Diploma"),
  duration: z.string().default("3 Years"),
  seats: z.number().int().default(30),
  category: z.string().default(""),
  slug: z.string().default(""),
  badge: z.string().default(""),
  badge_note: z.string().default(""),
  sort_order: z.number().int().default(0),
  is_active: z.boolean().default(true),
});

export const cmaCreateAdmissionProgramme = createServerFn({ method: "POST" })
  .validator(withAdmin(programmePayload))
  .handler(async ({ data }) => {
    const { supabase } = await requireAdmin(data.accessToken);
    const { data: row, error } = await supabase.from("admission_programmes").insert(data.payload).select().single();
    if (error) throw error;
    return row;
  });

export const cmaUpdateAdmissionProgramme = createServerFn({ method: "POST" })
  .validator(withAdminId(programmePayload.partial()))
  .handler(async ({ data }) => {
    const { supabase } = await requireAdmin(data.accessToken);
    const { data: row, error } = await supabase
      .from("admission_programmes")
      .update(data.payload)
      .eq("id", data.id)
      .select()
      .single();
    if (error) throw error;
    return row;
  });

export const cmaDeleteAdmissionProgramme = createServerFn({ method: "POST" })
  .validator(idOnlySchema)
  .handler(async ({ data }) => {
    const { supabase } = await requireAdmin(data.accessToken);
    const { error } = await supabase.from("admission_programmes").delete().eq("id", data.id);
    if (error) throw error;
    return { ok: true };
  });

const eligibilityGroupPayload = z.object({
  cycle_id: z.string().uuid(),
  heading: z.string().min(1),
  body: z.string().min(1),
  sort_order: z.number().int().default(0),
});

export const cmaCreateAdmissionEligibilityGroup = createServerFn({ method: "POST" })
  .validator(withAdmin(eligibilityGroupPayload))
  .handler(async ({ data }) => {
    const { supabase } = await requireAdmin(data.accessToken);
    const { data: row, error } = await supabase
      .from("admission_eligibility_groups")
      .insert(data.payload)
      .select()
      .single();
    if (error) throw error;
    return row;
  });

export const cmaUpdateAdmissionEligibilityGroup = createServerFn({ method: "POST" })
  .validator(withAdminId(eligibilityGroupPayload.partial()))
  .handler(async ({ data }) => {
    const { supabase } = await requireAdmin(data.accessToken);
    const { data: row, error } = await supabase
      .from("admission_eligibility_groups")
      .update(data.payload)
      .eq("id", data.id)
      .select()
      .single();
    if (error) throw error;
    return row;
  });

export const cmaDeleteAdmissionEligibilityGroup = createServerFn({ method: "POST" })
  .validator(idOnlySchema)
  .handler(async ({ data }) => {
    const { supabase } = await requireAdmin(data.accessToken);
    const { error } = await supabase.from("admission_eligibility_groups").delete().eq("id", data.id);
    if (error) throw error;
    return { ok: true };
  });

// ---------------------------------------------------------------------------
// Site page sections + explore cards
// ---------------------------------------------------------------------------
const pageSectionPayload = z.object({
  eyebrow: z.string().nullable().optional(),
  title: z.string().min(1),
  body: z.string().default(""),
  cta_label: z.string().nullable().optional(),
  cta_href: z.string().nullable().optional(),
  sort_order: z.number().int().optional(),
  is_active: z.boolean().optional(),
});

export const cmaUpdatePageSection = createServerFn({ method: "POST" })
  .validator(
    z.object({
      accessToken: z.string().min(1),
      sectionKey: z.string().min(1),
      payload: pageSectionPayload,
    }),
  )
  .handler(async ({ data }) => {
    const { supabase } = await requireAdmin(data.accessToken);
    const { data: row, error } = await supabase
      .from("page_sections")
      .update(data.payload)
      .eq("section_key", data.sectionKey)
      .select()
      .single();
    if (error) throw error;
    return row;
  });

const exploreCardPayload = z.object({
  slug: z.string().min(1),
  category: z.string().default(""),
  title: z.string().min(1),
  description: z.string().default(""),
  cta: z.string().default(""),
  href: z.string().default("/"),
  image_key: z.string().default("campus-main"),
  image_alt: z.string().default(""),
  image_position: z.enum(["left", "right"]).default("left"),
  sort_order: z.number().int().default(0),
  is_active: z.boolean().default(true),
  is_priority: z.boolean().default(false),
});

export const cmaCreateExploreCard = createServerFn({ method: "POST" })
  .validator(withAdmin(exploreCardPayload))
  .handler(async ({ data }) => {
    const { supabase } = await requireAdmin(data.accessToken);
    const { data: row, error } = await supabase.from("explore_cards").insert(data.payload).select().single();
    if (error) throw error;
    return row;
  });

export const cmaUpdateExploreCard = createServerFn({ method: "POST" })
  .validator(withAdminId(exploreCardPayload.partial()))
  .handler(async ({ data }) => {
    const { supabase } = await requireAdmin(data.accessToken);
    const { data: row, error } = await supabase
      .from("explore_cards")
      .update(data.payload)
      .eq("id", data.id)
      .select()
      .single();
    if (error) throw error;
    return row;
  });

export const cmaDeleteExploreCard = createServerFn({ method: "POST" })
  .validator(idOnlySchema)
  .handler(async ({ data }) => {
    const { supabase } = await requireAdmin(data.accessToken);
    const { error } = await supabase.from("explore_cards").delete().eq("id", data.id);
    if (error) throw error;
    return { ok: true };
  });

// ---------------------------------------------------------------------------
// Auth
// ---------------------------------------------------------------------------
export const cmaVerifySession = createServerFn({ method: "POST" })
  .validator(tokenSchema)
  .handler(async ({ data }) => {
    const { profile, user } = await requireAdmin(data.accessToken);
    return { id: user.id, email: profile.email, role: profile.role };
  });
