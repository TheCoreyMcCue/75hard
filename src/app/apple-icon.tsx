import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
          color: "white",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            fontSize: 108,
            fontWeight: 800,
            letterSpacing: "-0.06em",
            lineHeight: 1,
          }}
        >
          75
        </div>
        <div
          style={{
            fontSize: 22,
            fontWeight: 600,
            letterSpacing: "0.05em",
            marginTop: 6,
            opacity: 0.95,
          }}
        >
          HARD
        </div>
      </div>
    ),
    { ...size },
  );
}
