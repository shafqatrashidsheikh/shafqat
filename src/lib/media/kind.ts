import type { DbMediaAsset } from "@/lib/supabase/types";

export type MediaKind = DbMediaAsset["media_kind"];

export function inferMediaKind(mimeType: string): MediaKind {
  if (mimeType.startsWith("image/")) return "image";
  if (mimeType.startsWith("video/")) return "video";
  if (mimeType === "application/pdf") return "pdf";
  return "other";
}

export function defaultFolderForKind(kind: MediaKind): string {
  if (kind === "video") return "videos";
  if (kind === "pdf") return "documents";
  return "images";
}

export function formatByteSize(bytes: number | null | undefined): string {
  if (!bytes || bytes <= 0) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
