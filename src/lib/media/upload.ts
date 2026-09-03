import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { GPWS_MEDIA_BUCKET, MAX_UPLOAD_BYTES, type MediaFolder } from "@/lib/media/constants";
import { inferMediaKind } from "@/lib/media/kind";

function sanitizeFilename(name: string): string {
  return name.replace(/[^a-zA-Z0-9._-]/g, "-").replace(/-+/g, "-");
}

export type UploadResult = {
  storagePath: string;
  publicUrl: string;
  mimeType: string;
  mediaKind: ReturnType<typeof inferMediaKind>;
  byteSize: number;
  originalFilename: string;
};

/** Upload a file to the Content-GPWS bucket (requires authenticated admin session). */
export async function uploadMediaFile(file: File, folder: MediaFolder): Promise<UploadResult> {
  if (file.size > MAX_UPLOAD_BYTES) {
    throw new Error(`File is too large. Maximum size is ${Math.round(MAX_UPLOAD_BYTES / (1024 * 1024))} MB.`);
  }

  const mimeType = file.type || "application/octet-stream";
  const mediaKind = inferMediaKind(mimeType);
  const safeName = sanitizeFilename(file.name);
  const storagePath = `${folder}/${Date.now()}-${safeName}`;

  const client = getSupabaseBrowserClient();
  const { error } = await client.storage.from(GPWS_MEDIA_BUCKET).upload(storagePath, file, {
    cacheControl: "31536000",
    upsert: false,
    contentType: mimeType,
  });

  if (error) throw new Error(error.message);

  const { data: urlData } = client.storage.from(GPWS_MEDIA_BUCKET).getPublicUrl(storagePath);

  return {
    storagePath,
    publicUrl: urlData.publicUrl,
    mimeType,
    mediaKind,
    byteSize: file.size,
    originalFilename: file.name,
  };
}

/** Replace an existing object at the same storage path. */
export async function replaceMediaFile(storagePath: string, file: File): Promise<UploadResult> {
  if (file.size > MAX_UPLOAD_BYTES) {
    throw new Error(`File is too large. Maximum size is ${Math.round(MAX_UPLOAD_BYTES / (1024 * 1024))} MB.`);
  }

  const mimeType = file.type || "application/octet-stream";
  const client = getSupabaseBrowserClient();
  const { error } = await client.storage.from(GPWS_MEDIA_BUCKET).upload(storagePath, file, {
    cacheControl: "31536000",
    upsert: true,
    contentType: mimeType,
  });

  if (error) throw new Error(error.message);

  const { data: urlData } = client.storage.from(GPWS_MEDIA_BUCKET).getPublicUrl(storagePath);

  return {
    storagePath,
    publicUrl: urlData.publicUrl,
    mimeType,
    mediaKind: inferMediaKind(mimeType),
    byteSize: file.size,
    originalFilename: file.name,
  };
}
