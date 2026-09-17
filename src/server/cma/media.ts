import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { GPWS_MEDIA_BUCKET } from "@/lib/media/constants";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import { requireAdminWrite } from "@/server/cma/auth";

const tokenSchema = z.object({ accessToken: z.string().min(1) });

const mediaPayload = z.object({
  asset_key: z.string().nullable().optional(),
  storage_bucket: z.string().default(GPWS_MEDIA_BUCKET),
  storage_path: z.string().min(1),
  public_url: z.string().url(),
  original_filename: z.string().default(""),
  mime_type: z.string().min(1),
  media_kind: z.enum(["image", "video", "pdf", "other"]),
  folder: z.string().default("images"),
  title: z.string().default(""),
  alt_text: z.string().default(""),
  byte_size: z.number().int().nullable().optional(),
  tags: z.array(z.string()).default([]),
  is_active: z.boolean().default(true),
});

export const cmaCreateMediaAsset = createServerFn({ method: "POST" })
  .validator(tokenSchema.extend({ payload: mediaPayload }))
  .handler(async ({ data }) => {
    const { supabase, user } = await requireAdminWrite(data.accessToken);
    const { data: row, error } = await supabase
      .from("media_assets")
      .insert({ ...data.payload, uploaded_by: user.id })
      .select()
      .single();
    if (error) throw error;
    return row;
  });

export const cmaUpdateMediaAsset = createServerFn({ method: "POST" })
  .validator(
    tokenSchema.extend({
      id: z.string().uuid(),
      payload: mediaPayload.partial(),
    }),
  )
  .handler(async ({ data }) => {
    const { supabase } = await requireAdminWrite(data.accessToken);
    const { data: row, error } = await supabase
      .from("media_assets")
      .update(data.payload)
      .eq("id", data.id)
      .select()
      .single();
    if (error) throw error;
    return row;
  });

export const cmaDeleteMediaAsset = createServerFn({ method: "POST" })
  .validator(tokenSchema.extend({ id: z.string().uuid() }))
  .handler(async ({ data }) => {
    await requireAdminWrite(data.accessToken);

    const admin = getSupabaseAdmin();
    const { data: asset, error: fetchError } = await admin
      .from("media_assets")
      .select("storage_bucket, storage_path")
      .eq("id", data.id)
      .single();

    if (fetchError) throw fetchError;

    const { error: storageError } = await admin.storage
      .from(asset.storage_bucket)
      .remove([asset.storage_path]);

    if (storageError) {
      console.warn("[CMA] storage delete failed:", storageError.message);
    }

    const { error: dbError } = await admin.from("media_assets").delete().eq("id", data.id);
    if (dbError) throw dbError;

    return { ok: true as const };
  });

/** After client-side file replace — update metadata and remove old path if changed. */
export const cmaReplaceMediaAssetFile = createServerFn({ method: "POST" })
  .validator(
    tokenSchema.extend({
      id: z.string().uuid(),
      payload: z.object({
        storage_path: z.string().min(1),
        public_url: z.string().url(),
        original_filename: z.string(),
        mime_type: z.string(),
        media_kind: z.enum(["image", "video", "pdf", "other"]),
        byte_size: z.number().int(),
        previous_storage_path: z.string().optional(),
      }),
    }),
  )
  .handler(async ({ data }) => {
    await requireAdminWrite(data.accessToken);
    const admin = getSupabaseAdmin();

    const { data: row, error } = await admin
      .from("media_assets")
      .update({
        storage_path: data.payload.storage_path,
        public_url: data.payload.public_url,
        original_filename: data.payload.original_filename,
        mime_type: data.payload.mime_type,
        media_kind: data.payload.media_kind,
        byte_size: data.payload.byte_size,
      })
      .eq("id", data.id)
      .select()
      .single();

    if (error) throw error;

    if (
      data.payload.previous_storage_path &&
      data.payload.previous_storage_path !== data.payload.storage_path
    ) {
      await admin.storage.from(GPWS_MEDIA_BUCKET).remove([data.payload.previous_storage_path]);
    }

    return row;
  });
