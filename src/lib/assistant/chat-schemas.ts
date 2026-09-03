import { z } from "zod";

export const chatMessageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().trim().min(1).max(2000),
});

export const chatRequestSchema = z.object({
  messages: z.array(chatMessageSchema).min(1).max(12),
});

export type ChatMessage = z.infer<typeof chatMessageSchema>;

export function sanitizeAssistantText(text: string): string {
  return text
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
    .replace(/<[^>]+>/g, "")
    .trim();
}

/** Internal site paths only — blocks external javascript: links */
export function isSafeInternalPath(path: string): boolean {
  if (!path.startsWith("/")) return false;
  if (path.startsWith("//")) return false;
  if (path.includes(":")) return false;
  return true;
}

export type ParsedSegment =
  | { type: "text"; value: string }
  | { type: "link"; label: string; href: string };

const LINK_RE = /\[([^\]]+)\]\(([^)]+)\)/g;

export function parseAssistantContent(content: string): ParsedSegment[] {
  const safe = sanitizeAssistantText(content);
  const segments: ParsedSegment[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = LINK_RE.exec(safe)) !== null) {
    if (match.index > lastIndex) {
      segments.push({ type: "text", value: safe.slice(lastIndex, match.index) });
    }
    const label = match[1] ?? "";
    const href = match[2] ?? "";
    if (isSafeInternalPath(href)) {
      segments.push({ type: "link", label, href });
    } else {
      segments.push({ type: "text", value: match[0] ?? "" });
    }
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < safe.length) {
    segments.push({ type: "text", value: safe.slice(lastIndex) });
  }

  return segments.length ? segments : [{ type: "text", value: safe }];
}
