import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireAdminWrite } from "@/server/cma/auth";
import type { InstituteSettings } from "@/lib/supabase/types";

const tokenSchema = z.object({ accessToken: z.string().min(1) });

function withAdmin<T extends z.ZodTypeAny>(payloadSchema: T) {
  return tokenSchema.extend({ payload: payloadSchema });
}

function withAdminId<T extends z.ZodTypeAny>(payloadSchema: T) {
  return tokenSchema.extend({ id: z.string().uuid(), payload: payloadSchema });
}

const idOnlySchema = tokenSchema.extend({ id: z.string().uuid() });

const messageParagraphsField = z
  .union([z.array(z.string()), z.string()])
  .transform((val) => {
    if (Array.isArray(val)) return val;
    return val
      .split("\n\n")
      .map((s) => s.trim())
      .filter(Boolean);
  });

export const cmaUpdateInstituteSettings = createServerFn({ method: "POST" })
  .validator(withAdmin(z.custom<InstituteSettings>()))
  .handler(async ({ data }) => {
    const { supabase } = await requireAdminWrite(data.accessToken);
    const { error } = await supabase.from("site_settings").upsert({
      setting_key: "institute",
      value: data.payload,
    });
    if (error) throw error;
    return { ok: true };
  });

export const cmaUpdatePrincipal = createServerFn({ method: "POST" })
  .validator(
    withAdmin(
      z.object({
        name: z.string().min(1),
        role: z.string().default("Principal"),
        institute: z.string(),
        portrait_asset_key: z.string().nullable().optional(),
        portrait_alt: z.string(),
        preview: z.string(),
        message_paragraphs: messageParagraphsField,
        is_published: z.boolean().default(true),
      }),
    ),
  )
  .handler(async ({ data }) => {
    const { supabase } = await requireAdminWrite(data.accessToken);
    const { error } = await supabase.from("principal_profile").upsert({
      id: "default",
      ...data.payload,
    });
    if (error) throw error;
    return { ok: true };
  });

export const cmaUpdateAboutBlock = createServerFn({ method: "POST" })
  .validator(
    tokenSchema.extend({
      blockKey: z.string(),
      payload: z.object({
        title: z.string().optional(),
        body: z.string().optional(),
        image_asset_key: z.string().nullable().optional(),
        sort_order: z.number().int().optional(),
        is_active: z.boolean().optional(),
      }),
    }),
  )
  .handler(async ({ data }) => {
    const { supabase } = await requireAdminWrite(data.accessToken);
    const { error } = await supabase
      .from("about_blocks")
      .update(data.payload)
      .eq("block_key", data.blockKey);
    if (error) throw error;
    return { ok: true };
  });

const navLinkPayload = z.object({
  link_group: z.string().min(1),
  label: z.string().min(1),
  href: z.string().default("/"),
  sort_order: z.number().int().default(0),
  is_active: z.boolean().default(true),
});

export const cmaCreateNavLink = createServerFn({ method: "POST" })
  .validator(withAdmin(navLinkPayload))
  .handler(async ({ data }) => {
    const { supabase } = await requireAdminWrite(data.accessToken);
    const { data: row, error } = await supabase.from("nav_links").insert(data.payload).select().single();
    if (error) throw error;
    return row;
  });

export const cmaUpdateNavLink = createServerFn({ method: "POST" })
  .validator(withAdminId(navLinkPayload.partial()))
  .handler(async ({ data }) => {
    const { supabase } = await requireAdminWrite(data.accessToken);
    const { data: row, error } = await supabase
      .from("nav_links")
      .update(data.payload)
      .eq("id", data.id)
      .select()
      .single();
    if (error) throw error;
    return row;
  });

export const cmaDeleteNavLink = createServerFn({ method: "POST" })
  .validator(idOnlySchema)
  .handler(async ({ data }) => {
    const { supabase } = await requireAdminWrite(data.accessToken);
    const { error } = await supabase.from("nav_links").delete().eq("id", data.id);
    if (error) throw error;
    return { ok: true };
  });

const headerGroupPayload = z.object({
  label: z.string().min(1),
  to_path: z.string().default("/"),
  sort_order: z.number().int().default(0),
  is_active: z.boolean().default(true),
});

export const cmaCreateHeaderNavGroup = createServerFn({ method: "POST" })
  .validator(withAdmin(headerGroupPayload))
  .handler(async ({ data }) => {
    const { supabase } = await requireAdminWrite(data.accessToken);
    const { data: row, error } = await supabase.from("header_nav_groups").insert(data.payload).select().single();
    if (error) throw error;
    return row;
  });

export const cmaUpdateHeaderNavGroup = createServerFn({ method: "POST" })
  .validator(withAdminId(headerGroupPayload.partial()))
  .handler(async ({ data }) => {
    const { supabase } = await requireAdminWrite(data.accessToken);
    const { data: row, error } = await supabase
      .from("header_nav_groups")
      .update(data.payload)
      .eq("id", data.id)
      .select()
      .single();
    if (error) throw error;
    return row;
  });

export const cmaDeleteHeaderNavGroup = createServerFn({ method: "POST" })
  .validator(idOnlySchema)
  .handler(async ({ data }) => {
    const { supabase } = await requireAdminWrite(data.accessToken);
    await supabase.from("header_nav_items").delete().eq("group_id", data.id);
    const { error } = await supabase.from("header_nav_groups").delete().eq("id", data.id);
    if (error) throw error;
    return { ok: true };
  });

const headerItemPayload = z.object({
  group_id: z.string().uuid(),
  label: z.string().min(1),
  to_path: z.string().default("/"),
  is_primary: z.boolean().default(false),
  coming_soon: z.boolean().default(false),
  sort_order: z.number().int().default(0),
  is_active: z.boolean().default(true),
});

export const cmaCreateHeaderNavItem = createServerFn({ method: "POST" })
  .validator(withAdmin(headerItemPayload))
  .handler(async ({ data }) => {
    const { supabase } = await requireAdminWrite(data.accessToken);
    const { data: row, error } = await supabase.from("header_nav_items").insert(data.payload).select().single();
    if (error) throw error;
    return row;
  });

export const cmaUpdateHeaderNavItem = createServerFn({ method: "POST" })
  .validator(withAdminId(headerItemPayload.partial()))
  .handler(async ({ data }) => {
    const { supabase } = await requireAdminWrite(data.accessToken);
    const { data: row, error } = await supabase
      .from("header_nav_items")
      .update(data.payload)
      .eq("id", data.id)
      .select()
      .single();
    if (error) throw error;
    return row;
  });

export const cmaDeleteHeaderNavItem = createServerFn({ method: "POST" })
  .validator(idOnlySchema)
  .handler(async ({ data }) => {
    const { supabase } = await requireAdminWrite(data.accessToken);
    const { error } = await supabase.from("header_nav_items").delete().eq("id", data.id);
    if (error) throw error;
    return { ok: true };
  });

const galleryPayload = z.object({
  image_asset_key: z.string().min(1),
  alt: z.string().default(""),
  width: z.number().int().nullable().optional(),
  height: z.number().int().nullable().optional(),
  sort_order: z.number().int().default(0),
  is_active: z.boolean().default(true),
});

export const cmaCreateCampusGalleryItem = createServerFn({ method: "POST" })
  .validator(withAdmin(galleryPayload))
  .handler(async ({ data }) => {
    const { supabase } = await requireAdminWrite(data.accessToken);
    const { data: row, error } = await supabase.from("campus_gallery_items").insert(data.payload).select().single();
    if (error) throw error;
    return row;
  });

export const cmaUpdateCampusGalleryItem = createServerFn({ method: "POST" })
  .validator(withAdminId(galleryPayload.partial()))
  .handler(async ({ data }) => {
    const { supabase } = await requireAdminWrite(data.accessToken);
    const { data: row, error } = await supabase
      .from("campus_gallery_items")
      .update(data.payload)
      .eq("id", data.id)
      .select()
      .single();
    if (error) throw error;
    return row;
  });

export const cmaDeleteCampusGalleryItem = createServerFn({ method: "POST" })
  .validator(idOnlySchema)
  .handler(async ({ data }) => {
    const { supabase } = await requireAdminWrite(data.accessToken);
    const { error } = await supabase.from("campus_gallery_items").delete().eq("id", data.id);
    if (error) throw error;
    return { ok: true };
  });

const facilityPayload = z.object({
  name: z.string().min(1),
  description: z.string().default(""),
  sort_order: z.number().int().default(0),
  is_active: z.boolean().default(true),
});

export const cmaCreateCampusFacility = createServerFn({ method: "POST" })
  .validator(withAdmin(facilityPayload))
  .handler(async ({ data }) => {
    const { supabase } = await requireAdminWrite(data.accessToken);
    const { data: row, error } = await supabase.from("campus_facility_items").insert(data.payload).select().single();
    if (error) throw error;
    return row;
  });

export const cmaUpdateCampusFacility = createServerFn({ method: "POST" })
  .validator(withAdminId(facilityPayload.partial()))
  .handler(async ({ data }) => {
    const { supabase } = await requireAdminWrite(data.accessToken);
    const { data: row, error } = await supabase
      .from("campus_facility_items")
      .update(data.payload)
      .eq("id", data.id)
      .select()
      .single();
    if (error) throw error;
    return row;
  });

export const cmaDeleteCampusFacility = createServerFn({ method: "POST" })
  .validator(idOnlySchema)
  .handler(async ({ data }) => {
    const { supabase } = await requireAdminWrite(data.accessToken);
    const { error } = await supabase.from("campus_facility_items").delete().eq("id", data.id);
    if (error) throw error;
    return { ok: true };
  });
