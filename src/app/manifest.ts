import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "75 Hard Tracker",
    short_name: "75 Hard",
    description: "Track your 75 Hard challenge — with your own rules.",
    start_url: "/",
    display: "standalone",
    background_color: "#fafafa",
    theme_color: "#10b981",
    icons: [
      {
        src: "/icon",
        sizes: "32x32",
        type: "image/png",
      },
      {
        src: "/apple-icon",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  };
}
