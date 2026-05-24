import NextAuth from "next-auth";
import tracer from "dd-trace";
import { authConfig } from "./auth.config";

const auth = NextAuth(authConfig).auth;

function traceContext(): Record<string, unknown> {
  try {
    const span = tracer?.scope?.()?.active?.();
    if (!span) return {};
    const ctx = span.context();
    const trace_id = ctx?.toTraceId?.();
    const span_id = ctx?.toSpanId?.();
    if (!trace_id || !span_id) return {};
    return { dd: { trace_id, span_id, service: "seven-five", env: "prod" } };
  } catch {
    return {};
  }
}

export default auth(async function proxy(req) {
  const start = Date.now();
  const method = req.method;
  const path = req.nextUrl.pathname;
  const realIp =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const userAgent = req.headers.get("user-agent") ?? "";
  const userId = req.auth?.user?.id;

  const entry = {
    "@timestamp": new Date().toISOString(),
    level: "info",
    event: "request",
    service: "seven-five",
    env: process.env.DD_ENV ?? "dev",
    version: process.env.DD_VERSION ?? "dev",
    http: {
      method,
      path,
      authenticated: !!userId,
    },
    network: { client: { ip: realIp } },
    user: userId ? { id: userId } : undefined,
    useragent: userAgent,
    duration_ms: Date.now() - start,
    ...traceContext(),
  };
  console.log(JSON.stringify(entry));
});

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|icon|apple-icon|manifest.webmanifest|.*\\.svg$|.*\\.png$).*)",
  ],
};
