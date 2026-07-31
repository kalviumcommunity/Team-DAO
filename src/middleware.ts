import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { checkRateLimit } from "@/backend/middleware/rate-limit";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only apply rate limiting to API routes
  if (pathname.startsWith("/api")) {
    const forwardedFor = request.headers.get("x-forwarded-for");
    const realIp = request.headers.get("x-real-ip");
    const clientIp = forwardedFor ? forwardedFor.split(",")[0].trim() : realIp || "127.0.0.1";

    const rateLimit = checkRateLimit(clientIp, pathname, request.method);

    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          error: "Too many requests. Please try again later.",
          retryAfterSeconds: rateLimit.resetSeconds,
        },
        {
          status: 429,
          headers: {
            "Content-Type": "application/json",
            "Retry-After": rateLimit.resetSeconds.toString(),
            "X-RateLimit-Limit": rateLimit.limit.toString(),
            "X-RateLimit-Remaining": "0",
            "X-RateLimit-Reset": rateLimit.resetSeconds.toString(),
          },
        }
      );
    }

    const response = NextResponse.next();
    response.headers.set("X-RateLimit-Limit", rateLimit.limit.toString());
    response.headers.set("X-RateLimit-Remaining", rateLimit.remaining.toString());
    response.headers.set("X-RateLimit-Reset", rateLimit.resetSeconds.toString());
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/api/:path*",
};
