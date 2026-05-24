"use client";

import { useEffect } from "react";
import { datadogRum } from "@datadog/browser-rum";

const APPLICATION_ID = "dc66a380-f8e2-44ad-aa5e-1e8a63bc2868";
const CLIENT_TOKEN = "pub791691ff0c9b18d73563fa76640c0796";

export function DatadogInit() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (datadogRum.getInitConfiguration()) return;

    datadogRum.init({
      applicationId: APPLICATION_ID,
      clientToken: CLIENT_TOKEN,
      site: "datadoghq.com",
      service: "seven-five",
      env: "prod",
      version: process.env.NEXT_PUBLIC_DD_VERSION ?? "dev",
      sessionSampleRate: 100,
      sessionReplaySampleRate: 100,
      trackResources: true,
      trackLongTasks: true,
      trackUserInteractions: true,
      defaultPrivacyLevel: "mask-user-input",
    });
  }, []);

  return null;
}
