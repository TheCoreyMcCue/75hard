"use client";

import { useEffect } from "react";
import { datadogRum } from "@datadog/browser-rum";
import { datadogLogs } from "@datadog/browser-logs";

const APPLICATION_ID = "dc66a380-f8e2-44ad-aa5e-1e8a63bc2868";
const CLIENT_TOKEN = "pub791691ff0c9b18d73563fa76640c0796";
const VERSION = process.env.NEXT_PUBLIC_DD_VERSION ?? "dev";

export function DatadogInit() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    if (!datadogRum.getInitConfiguration()) {
      datadogRum.init({
        applicationId: APPLICATION_ID,
        clientToken: CLIENT_TOKEN,
        site: "datadoghq.com",
        service: "seven-five",
        env: "prod",
        version: VERSION,
        sessionSampleRate: 100,
        sessionReplaySampleRate: 100,
        trackResources: true,
        trackLongTasks: true,
        trackUserInteractions: true,
        defaultPrivacyLevel: "mask-user-input",
      });
    }

    if (!datadogLogs.getInitConfiguration()) {
      datadogLogs.init({
        clientToken: CLIENT_TOKEN,
        site: "datadoghq.com",
        service: "seven-five",
        env: "prod",
        version: VERSION,
        forwardErrorsToLogs: true,
        forwardConsoleLogs: ["info", "warn", "error"],
        sessionSampleRate: 100,
      });
      datadogLogs.logger.info("frontend.session_start", {
        path: window.location.pathname,
      });
    }
  }, []);

  return null;
}
