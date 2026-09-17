/**
 * Link hardening for URLs that come from the CMS or from scraped JKBOTE pages.
 * React escapes text, but it happily renders href="javascript:…", so every
 * externally sourced link is filtered through here before it reaches the DOM.
 */

const SAFE_PROTOCOLS = new Set(["https:", "http:", "mailto:", "tel:"]);

/**
 * Returns the URL when it is safe to put in an href, otherwise undefined.
 * Site-relative paths are allowed; protocol-relative ("//evil.com") is not.
 */
export function safeHref(value: string | null | undefined): string | undefined {
  const raw = value?.trim();
  if (!raw) return undefined;

  if (raw.startsWith("//")) return undefined;
  if (raw.startsWith("/") || raw.startsWith("#")) return raw;

  try {
    const parsed = new URL(raw);
    return SAFE_PROTOCOLS.has(parsed.protocol) ? parsed.toString() : undefined;
  } catch {
    return undefined;
  }
}

/** Same check, with a trusted fallback for required links. */
export function safeHrefOr(value: string | null | undefined, fallback: string): string {
  return safeHref(value) ?? fallback;
}
