import { ImageResponse } from "next/og";

export const alt = "75 Hard Tracker — Run the challenge your way";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px 96px",
          backgroundColor: "#050810",
          backgroundImage:
            "radial-gradient(ellipse 60% 50% at 50% 0%, rgba(45,212,191,0.25), transparent 70%)",
          fontFamily: "system-ui, sans-serif",
          color: "white",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div
            style={{
              width: 8,
              height: 36,
              borderRadius: 4,
              background: "linear-gradient(180deg, #34d399, #2dd4bf, #22d3ee)",
            }}
          />
          <div
            style={{
              fontSize: 22,
              fontWeight: 800,
              letterSpacing: "0.28em",
              color: "rgba(255,255,255,0.7)",
            }}
          >
            75 HARD
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div
            style={{
              fontSize: 120,
              fontWeight: 900,
              letterSpacing: "-0.05em",
              lineHeight: 1,
              color: "white",
            }}
          >
            Run the challenge
          </div>
          <div
            style={{
              fontSize: 120,
              fontWeight: 900,
              letterSpacing: "-0.05em",
              lineHeight: 1,
              backgroundImage: "linear-gradient(135deg, #34d399, #2dd4bf, #22d3ee)",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            your way.
          </div>
          <div
            style={{
              fontSize: 32,
              fontWeight: 500,
              color: "rgba(255,255,255,0.6)",
              marginTop: 8,
              maxWidth: 800,
            }}
          >
            Standard rules pre-filled. Customize before you start, then lock in. Daily checklist,
            calendar, progress grid.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 24,
            fontWeight: 600,
            color: "rgba(255,255,255,0.5)",
          }}
        >
          <span>sevenfivehard.com</span>
          <span>Free · No ads</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
