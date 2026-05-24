export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { default: tracer } = await import("dd-trace");
    tracer.init({
      service: "seven-five",
      env: "prod",
      version: process.env.DD_VERSION ?? "dev",
      logInjection: true,
      runtimeMetrics: true,
      profiling: false,
    });
  }
}
