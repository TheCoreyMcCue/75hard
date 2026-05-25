import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const allowedBots = [
    "GPTBot",
    "ChatGPT-User",
    "OAI-SearchBot",
    "Anthropic-AI",
    "ClaudeBot",
    "Claude-User",
    "PerplexityBot",
    "Perplexity-User",
    "Google-Extended",
    "Googlebot",
    "Bingbot",
    "Applebot",
    "Applebot-Extended",
    "DuckDuckBot",
    "CCBot",
    "FacebookBot",
    "facebookexternalhit",
    "Twitterbot",
  ];

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/setup", "/history", "/calendar"],
      },
      ...allowedBots.map((userAgent) => ({
        userAgent,
        allow: "/",
        disallow: ["/api/", "/setup", "/history", "/calendar"],
      })),
    ],
    sitemap: "https://sevenfivehard.com/sitemap.xml",
    host: "https://sevenfivehard.com",
  };
}
