const { execSync } = require("node:child_process");

function gitSha() {
  try {
    return execSync("git rev-parse --short HEAD", {
      cwd: __dirname,
      stdio: ["ignore", "pipe", "ignore"],
    })
      .toString()
      .trim();
  } catch {
    return "dev";
  }
}

module.exports = {
  apps: [
    {
      name: "75hard",
      cwd: __dirname,
      script: "npm",
      args: "start",
      env: {
        NODE_ENV: "production",
        DD_SERVICE: "seven-five",
        DD_ENV: "prod",
        DD_VERSION: process.env.DD_VERSION || gitSha(),
        DD_LOGS_INJECTION: "true",
        DD_RUNTIME_METRICS_ENABLED: "true",
        DD_TRACE_STARTUP_LOGS: "true",
        DD_TRACE_DEBUG: "true",
        DD_TRACE_AGENT_URL: "http://127.0.0.1:8126",
        AUTH_TRUST_HOST: "true",
      },
    },
  ],
};
