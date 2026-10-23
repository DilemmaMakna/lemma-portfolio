import { ImageResponse } from "next/og";
import { ORG, SITE } from "@/lib/site";

// Warna dari .agents/DESIGN.md: --bg, --fg, --fg-dim, --accent.
export const alt = `${ORG.name} | ${ORG.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Font: General Sans (woff2) tidak didukung satori, jadi pakai sans bawaan next/og.
export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 80,
          background: "#0A0A0A",
          color: "#F2F0EB",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", fontSize: 40, fontWeight: 700, letterSpacing: "0.18em" }}>LEMMA</div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 88, fontWeight: 600, lineHeight: 1.05, letterSpacing: "-0.02em" }}>
            {ORG.tagline}
          </div>
          <div style={{ display: "flex", marginTop: 40, width: 120, height: 8, background: "#FF5A1F" }} />
        </div>
        <div style={{ display: "flex", fontSize: 24, color: "#6E6B65" }}>{SITE.replace(/^https?:\/\//, "")}</div>
      </div>
    ),
    { ...size },
  );
}
