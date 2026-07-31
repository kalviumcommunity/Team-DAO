/**
 * In-Memory Sliding Window Rate Limiter for Next.js API Routes
 */

interface RateLimitRecord {
  timestamps: number[];
}

// In-memory store mapping IP + bucket to request timestamps
const rateLimitStore = new Map<string, RateLimitRecord>();

// Cleanup stale rate limit records every 5 minutes
setInterval(() => {
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minute

  for (const [key, record] of rateLimitStore.entries()) {
    record.timestamps = record.timestamps.filter((t) => now - t < windowMs);
    if (record.timestamps.length === 0) {
      rateLimitStore.delete(key);
    }
  }
}, 5 * 60 * 1000);

export interface RateLimitResult {
  allowed: boolean;
  limit: number;
  remaining: number;
  resetSeconds: number;
}

export function checkRateLimit(
  ip: string,
  path: string,
  method: string
): RateLimitResult {
  const now = Date.now();
  const windowMs = 60 * 1000; // 60 seconds

  // Tiered thresholds
  let limit = 100; // Default read API limit
  let bucketKey = "general";

  if (path.startsWith("/api/auth")) {
    limit = 10; // Strict limit for auth endpoints (login, register)
    bucketKey = "auth";
  } else if (["POST", "PUT", "DELETE", "PATCH"].includes(method.toUpperCase())) {
    limit = 30; // Moderate limit for mutation operations
    bucketKey = "mutation";
  }

  const key = `${ip}:${bucketKey}`;
  const record = rateLimitStore.get(key) || { timestamps: [] };

  // Filter timestamps within the current 60s window
  record.timestamps = record.timestamps.filter((t) => now - t < windowMs);

  const requestCount = record.timestamps.length;
  const oldestTimestamp = record.timestamps[0] || now;
  const resetSeconds = Math.ceil((oldestTimestamp + windowMs - now) / 1000);

  if (requestCount >= limit) {
    return {
      allowed: false,
      limit,
      remaining: 0,
      resetSeconds: Math.max(1, resetSeconds),
    };
  }

  // Record current request timestamp
  record.timestamps.push(now);
  rateLimitStore.set(key, record);

  return {
    allowed: true,
    limit,
    remaining: Math.max(0, limit - record.timestamps.length),
    resetSeconds: Math.max(1, resetSeconds),
  };
}
