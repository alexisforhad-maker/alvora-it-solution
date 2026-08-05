/**
 * Rate limiting — preparation, not a production-grade distributed
 * limiter. This in-memory sliding-window implementation works
 * correctly for a single server instance but resets on deploy and
 * doesn't share state across multiple instances/regions.
 *
 * For real production use behind Vercel (multiple serverless
 * instances), swap this for a shared store — Upstash Redis is the
 * common pairing (`@upstash/ratelimit` + `@upstash/redis`), used as a
 * drop-in replacement for the `hit()` function below without changing
 * any call site.
 */

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

export interface RateLimitResult {
  success: boolean;
  remaining: number;
  resetAt: number;
}

/**
 * Records a hit for `key` (typically an IP address or `${ip}:${route}`)
 * and reports whether it's within the allowed limit for the window.
 */
export function hit(key: string, limit: number, windowMs: number): RateLimitResult {
  const now = Date.now();
  const existing = buckets.get(key);

  if (!existing || existing.resetAt < now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { success: true, remaining: limit - 1, resetAt: now + windowMs };
  }

  existing.count += 1;
  const success = existing.count <= limit;
  return { success, remaining: Math.max(0, limit - existing.count), resetAt: existing.resetAt };
}

/** Extracts a best-effort client IP from standard proxy headers (Vercel sets x-forwarded-for). */
export function getClientIp(request: Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0]!.trim();
  return request.headers.get("x-real-ip") ?? "unknown";
}
