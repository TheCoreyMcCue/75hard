import "server-only";
import tracer from "dd-trace";

type Level = "info" | "warn" | "error" | "debug";
type Fields = Record<string, unknown>;

function traceContext(): Fields {
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

function emit(level: Level, event: string, fields: Fields = {}) {
  const entry = {
    "@timestamp": new Date().toISOString(),
    level,
    event,
    service: "seven-five",
    env: process.env.DD_ENV ?? "dev",
    version: process.env.DD_VERSION ?? "dev",
    ...fields,
    ...traceContext(),
  };
  const out = JSON.stringify(entry);
  if (level === "error" || level === "warn") console.error(out);
  else console.log(out);
}

export const log = {
  info: (event: string, fields?: Fields) => emit("info", event, fields ?? {}),
  warn: (event: string, fields?: Fields) => emit("warn", event, fields ?? {}),
  error: (event: string, fields?: Fields) => emit("error", event, fields ?? {}),
  debug: (event: string, fields?: Fields) => emit("debug", event, fields ?? {}),
};
