/** Supabase Storage bucket for site media (images, videos, PDFs). */
export const GPWS_MEDIA_BUCKET = "Content-GPWS";

export const MEDIA_FOLDERS = [
  { id: "images", label: "Images" },
  { id: "videos", label: "Videos" },
  { id: "documents", label: "Documents" },
  { id: "syllabus", label: "Syllabus" },
  { id: "timetables", label: "Timetables" },
] as const;

export type MediaFolder = (typeof MEDIA_FOLDERS)[number]["id"];

export const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
  "video/mp4",
  "video/webm",
  "video/quicktime",
  "application/pdf",
] as const;

export const MAX_UPLOAD_BYTES = 52_428_800; // 50 MB
