/**
 * Fixed-window rate limiting, in process memory. Enough to stop scripted abuse
 * of the public endpoints on a single-instance deployment; a shared store would
 * be needed once the site runs on more than one node.
 */

export type RateLimitRule = {
  /** Bucket name so different endpoints do not share a budget. */
  scope: string;
  windowMs: number;
  max: number;
};

export type RateLimitResult = { allowed: boolean; retryAfterMs: number };

const buckets = new Map<string, { count: number; resetAt: number }>();
/** Guards against unbounded growth if a host is hit from many addresses. */
const MAX_TRACKED_BUCKETS = 5_000;

function sweep(now: number): void {
  for (const [key, entry] of buckets) {
    if (now >= entry.resetAt) buckets.delete(key);
  }
}

export function consumeRateLimit(key: string, rule: RateLimitRule): RateLimitResult {
  const now = Date.now();
  const bucketKey = `${rule.scope}:${key}`;
  const entry = buckets.get(bucketKey);

  if (!entry || now >= entry.resetAt) {
    if (buckets.size >= MAX_TRACKED_BUCKETS) sweep(now);
    buckets.set(bucketKey, { count: 1, resetAt: now + rule.windowMs });
    return { allowed: true, retryAfterMs: 0 };
  }

  if (entry.count >= rule.max) {
    return { allowed: false, retryAfterMs: entry.resetAt - now };
  }

  entry.count += 1;
  return { allowed: true, retryAfterMs: 0 };
}

export const RATE_LIMITS = {
  /** Assistant chat — each reply costs an upstream AI call. */
  chat: { scope: "chat", windowMs: 60_000, max: 20 },
  /** Cached JKBOTE reads. */
  publicApi: { scope: "public-api", windowMs: 60_000, max: 60 },
  /** ?refresh=1 bypasses the cache and hits jkbote.ac.in, so keep it tight. */
  upstreamRefresh: { scope: "upstream-refresh", windowMs: 300_000, max: 5 },
} as const satisfies Record<string, RateLimitRule>;
