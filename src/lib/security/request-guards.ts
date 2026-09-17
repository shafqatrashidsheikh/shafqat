/**
 * Edge checks for the plain HTTP route handlers under /api. Server functions get
 * CSRF protection from TanStack Start; these routes need it applied by hand.
 */

import { consumeRateLimit, RATE_LIMITS } from "./rate-limit";

/** Per-IP bucket key. Falls back to a shared key so limits still apply. */
export function getClientKey(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() ?? "unknown";
  return request.headers.get("x-real-ip") ?? "local";
}

/**
 * Rejects cross-site calls to state-changing endpoints. Modern browsers send
 * Sec-Fetch-Site; older ones only send Origin, so both are honoured and a
 * request with neither (server-to-server, curl) is treated as same-origin.
 */
export function isSameOriginRequest(request: Request): boolean {
  const fetchSite = request.headers.get("sec-fetch-site");
  if (fetchSite) return fetchSite === "same-origin" || fetchSite === "none";

  const origin = request.headers.get("origin");
  if (!origin) return true;

  try {
    return new URL(origin).host === new URL(request.url).host;
  } catch {
    return false;
  }
}

export function crossOriginBlockedResponse(): Response {
  return Response.json(
    {
      error: "cross_origin_blocked",
      message: "This endpoint only accepts requests from the website.",
    },
    { status: 403 },
  );
}

export function rateLimitedResponse(retryAfterMs: number): Response {
  return Response.json(
    { error: "rate_limit", message: "Too many requests. Please wait a moment and try again." },
    { status: 429, headers: { "Retry-After": String(Math.ceil(retryAfterMs / 1000)) } },
  );
}

/**
 * Throttle for the cached public JKBOTE endpoints. `refresh=1` skips the cache
 * and calls jkbote.ac.in, so it gets a much smaller budget of its own.
 *
 * Returns a response to send back, or null when the request may proceed.
 */
export function guardPublicApiRequest(
  request: Request,
  options: { upstreamRefresh: boolean },
): Response | null {
  const clientKey = getClientKey(request);

  const general = consumeRateLimit(clientKey, RATE_LIMITS.publicApi);
  if (!general.allowed) return rateLimitedResponse(general.retryAfterMs);

  if (options.upstreamRefresh) {
    const refresh = consumeRateLimit(clientKey, RATE_LIMITS.upstreamRefresh);
    if (!refresh.allowed) return rateLimitedResponse(refresh.retryAfterMs);
  }

  return null;
}
