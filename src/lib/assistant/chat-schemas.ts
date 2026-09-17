import { z } from "zod";

export const chatMessageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().trim().min(1).max(2000),
});

export const chatImageSchema = z.object({
  mimeType: z.enum(["image/jpeg", "image/png", "image/webp"]),
  /** Raw base64 without data: prefix — client compresses before upload. */
  dataBase64: z.string().min(32).max(1_200_000),
});

export const chatRequestSchema = z.object({
  /** Keep only the newest turns if the client overshoots the cap. */
  messages: z.preprocess(
    (value) => (Array.isArray(value) ? value.slice(-12) : value),
    z.array(chatMessageSchema).min(1).max(12),
  ),
  /** Optional Supabase access token — required for private hostel roster answers. */
  accessToken: z.preprocess(
    (value) => (typeof value === "string" && value.trim().length > 0 ? value.trim() : undefined),
    z.string().min(20).max(4096).optional(),
  ),
  /** Optional image attached to the latest user turn (vision). */
  image: chatImageSchema.optional(),
});

export type ChatMessage = z.infer<typeof chatMessageSchema>;
export type ChatImage = z.infer<typeof chatImageSchema>;

export function sanitizeAssistantText(text: string): string {
  return (
    text
      .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
      .replace(/<[^>]+>/g, "")
      // Strip markdown bold/italic leftovers that break the chat UI
      .replace(/\*\*([^*]+)\*\*/g, "$1")
      .replace(/\*([^*]+)\*/g, "$1")
      .replace(/__([^_]+)__/g, "$1")
      .trim()
  );
}

/** Internal site paths only — blocks javascript: and protocol-relative tricks */
export function isSafeInternalPath(path: string): boolean {
  if (!path.startsWith("/")) return false;
  if (path.startsWith("//")) return false;
  if (path.includes(":")) return false;
  return true;
}

/** Allow official HTTPS PDF / page links (JKBOTE + admission portal). */
export function isSafeExternalHttpsUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "https:") return false;
    const host = parsed.hostname.toLowerCase();
    const allowed = [
      "jkbote.ac.in",
      "www.jkbote.ac.in",
      "admission.jkbote.ac.in",
      "examination.jkbote.ac.in",
      "jksbotelive.com",
      "www.jksbotelive.com",
      "admission.jksbotelive.com",
    ];
    return allowed.some((h) => host === h || host.endsWith(`.${h}`));
  } catch {
    return false;
  }
}

export type ParsedSegment =
  | { type: "text"; value: string }
  | { type: "link"; label: string; href: string; external?: boolean };

const LINK_RE = /\[([^\]]+)\]\(([^)\s]+)\)/g;
/** Bare HTTPS URLs the model sometimes dumps without markdown. */
const BARE_HTTPS_RE = /https:\/\/[^\s<>"'`)\]}>]+/gi;

function shortExternalLinkLabel(href: string): string {
  try {
    const host = new URL(href).hostname.toLowerCase();
    if (host.includes("jkbote") || host.includes("jksbote")) {
      if (/result|ResultHome|noticeResult/i.test(href)) return "Open official result";
      if (/notice|datesheet|admission/i.test(href)) return "Open official notice";
      return "Open JKBOTE link";
    }
  } catch {
    /* fall through */
  }
  return "Open official link";
}

function pushSafeLink(
  segments: ParsedSegment[],
  label: string,
  href: string,
): void {
  if (isSafeInternalPath(href)) {
    segments.push({ type: "link", label, href, external: false });
  } else if (isSafeExternalHttpsUrl(href)) {
    segments.push({
      type: "link",
      label: label.trim() || shortExternalLinkLabel(href),
      href,
      external: true,
    });
  } else {
    segments.push({ type: "text", value: label.trim() || href });
  }
}

/** Turn leftover bare https://… URLs into short clickable chips. */
function linkifyBareUrlsInText(text: string): ParsedSegment[] {
  const parts: ParsedSegment[] = [];
  let last = 0;
  let match: RegExpExecArray | null;
  BARE_HTTPS_RE.lastIndex = 0;

  while ((match = BARE_HTTPS_RE.exec(text)) !== null) {
    if (match.index > last) {
      parts.push({ type: "text", value: text.slice(last, match.index) });
    }
    const raw = match[0] ?? "";
    const href = raw.replace(/[.,;:!?)]+$/g, "");
    const trailing = raw.slice(href.length);
    if (isSafeExternalHttpsUrl(href)) {
      parts.push({
        type: "link",
        label: shortExternalLinkLabel(href),
        href,
        external: true,
      });
      if (trailing) parts.push({ type: "text", value: trailing });
    } else {
      parts.push({ type: "text", value: raw });
    }
    last = match.index + raw.length;
  }

  if (last < text.length) {
    parts.push({ type: "text", value: text.slice(last) });
  }

  return parts.length ? parts : [{ type: "text", value: text }];
}

export function parseAssistantContent(content: string): ParsedSegment[] {
  const safe = sanitizeAssistantText(content);
  const segments: ParsedSegment[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  LINK_RE.lastIndex = 0;

  while ((match = LINK_RE.exec(safe)) !== null) {
    if (match.index > lastIndex) {
      segments.push(...linkifyBareUrlsInText(safe.slice(lastIndex, match.index)));
    }
    const label = match[1] ?? "";
    const href = (match[2] ?? "").trim();
    pushSafeLink(segments, label, href);
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < safe.length) {
    segments.push(...linkifyBareUrlsInText(safe.slice(lastIndex)));
  }

  return segments.length ? segments : [{ type: "text", value: safe }];
}
