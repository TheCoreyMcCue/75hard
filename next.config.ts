import type { NextConfig } from "next";
import { execSync } from "node:child_process";

function gitSha(): string {
  try {
    return execSync("git rev-parse --short HEAD", { stdio: ["ignore", "pipe", "ignore"] })
      .toString()
      .trim();
  } catch {
    return "dev";
  }
}

const version = process.env.DD_VERSION ?? gitSha();

const nextConfig: NextConfig = {
  env: {
    DD_VERSION: version,
    NEXT_PUBLIC_DD_VERSION: version,
  },
  serverExternalPackages: ["dd-trace"],
  async rewrites() {
    return [
      { source: "/favicon.ico", destination: "/icon" },
    ];
  },
};

export default nextConfig;
