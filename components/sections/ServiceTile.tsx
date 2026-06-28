"use client";
import * as React from "react";
import Image from "next/image";
import { IndexBadgeRow } from "@/components/feedback/IndexBadge";

type ServiceVariant = "magenta" | "teal" | "olive" | "orange";

export interface ServiceDetail {
  tags: string[];
  bullets: string[];
  tagline: string;
}

export interface ServiceTileProps {
  index: number;
  count?: number;
  active?: number;
  variant?: ServiceVariant;
  title: string;
  description: string;
  imageSrc?: string;
  detail?: ServiceDetail;
  onSelect?: (v: number) => void;
  style?: React.CSSProperties;
}

const ACCENT: Record<ServiceVariant, string> = {
  magenta: "rgba(215,0,212,0.25)",
  teal: "rgba(1,213,221,0.25)",
  olive: "rgba(208,215,0,0.25)",
  orange: "rgba(249,115,22,0.25)",
};

const PALETTES: Record<ServiceVariant, { bg: string }> = {
  magenta: { bg: "var(--grad-magenta-radial)" },
  teal: { bg: "radial-gradient(ellipse 70.71% 53.85% at 50% 50%, var(--teal-from) 0%, var(--teal-to) 100%)" },
  olive: { bg: "var(--grad-olive-radial)" },
  orange: { bg: "var(--grad-orange-radial)" },
};

export function ServiceTile({
  index, count = 3, active, variant = "magenta",
  title, description, imageSrc, detail, onSelect, style,
}: ServiceTileProps) {
  const palette = PALETTES[variant] || PALETTES.magenta;
  const accent = ACCENT[variant];

  return (
    <section
      className="service-tile"
      style={{
        position: "relative", width: "100%", height: "var(--tile-h)",
        background: palette.bg, overflow: "hidden",
        display: "grid", gridTemplateRows: "auto 1fr",
        fontFamily: "var(--font-sans)", ...style,
      }}
    >
      {/* Photo bg */}
      {imageSrc && (
        <div aria-hidden style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
          <Image src={imageSrc} alt="" fill style={{ objectFit: "cover", objectPosition: "center" }} sizes="100vw" priority />
        </div>
      )}

      {/* Colour veil over photo */}
      <div aria-hidden style={{ position: "absolute", inset: 0, background: "hsla(0, 0%, 0%, 0.07)", pointerEvents: "none" }} />

      {/* Giant background number */}
      <div aria-hidden style={{
        position: "absolute", right: "-0.05em", bottom: "-0.18em",
        fontSize: "clamp(200px, 26vw, 380px)", fontWeight: 700,
        color: "rgba(255,255,255,0.04)", lineHeight: 1, userSelect: "none",
        pointerEvents: "none", letterSpacing: "-0.04em",
      }}>
        {String(index).padStart(2, "0")}
      </div>

      {/* Accent glow on left edge */}
      <div aria-hidden style={{
        position: "absolute", left: 0, top: 0, bottom: 0, width: 3,
        background: accent, pointerEvents: "none",
      }} />

      {/* Full-height two-column content layout */}
      <div className="md-grid-1" style={{
        position: "absolute", inset: 0,
        paddingTop: "var(--gutter)",
        paddingRight: "var(--gutter)",
        paddingBottom: "var(--gutter)",
        paddingLeft: "var(--gutter)",
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "clamp(32px, 4vw, 64px)",
        boxSizing: "border-box",
      }}>
        {/* LEFT — index badge top, title + desc bottom */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <IndexBadgeRow count={count} active={active ?? index} tone="dark" onSelect={onSelect} />
          <div style={{ marginTop: "auto" }}>
            <h3
              className="tile-title"
              style={{
                margin: "0 0 clamp(12px, 1.5vw, 20px)",
                fontSize: "clamp(56px, 7.5vw, 112px)",
                fontWeight: 500,
                lineHeight: 0.92,
                letterSpacing: "-0.03em",
                color: "#fff",
              }}
            >
              {title}
            </h3>
            <p
              className="tile-desc"
              style={{
                margin: 0,
                fontSize: "clamp(15px, 1.3vw, 18px)",
                fontWeight: 400,
                lineHeight: 1.65,
                color: "rgba(255,255,255,0.78)",
                maxWidth: 420,
              }}
            >
              {description}
            </p>
          </div>
        </div>

        {/* RIGHT — detail panel, vertically centered, prinsip-row style */}
        {detail && (
          <div
            className="tile-detail"
            style={{
              display: "flex",
              alignItems: "center",
              paddingLeft: "clamp(24px, 3vw, 48px)",
            }}
          >
            <div style={{ width: "100%" }}>
              {/* Tagline */}
              <p style={{
                margin: "0 0 clamp(24px, 3vw, 40px)",
                width: "80%",
                fontSize: "clamp(18px, 2.5vw, 32px)",
                fontFamily: "var(--font-serif, Georgia, serif)",
                fontStyle: "italic",
                color: "rgba(255,255,255,0.9)",
                lineHeight: 1.4,
                letterSpacing: "-0.01em",
              }}>
                {detail.tagline}
              </p>

              {/* Minimalist Bullets with Hover Motion */}
              <div style={{ display: "flex", flexDirection: "column", borderTop: "1px solid rgba(255,255,255,0.15)" }}>
                {detail.bullets.map((b, bi) => (
                  <div
                    key={b}
                    className="group"
                    style={{
                      paddingBlock: "clamp(16px, 1.8vw, 24px)",
                      borderBottom: "1px solid rgba(255,255,255,0.15)",
                      display: "flex",
                      gap: 24,
                      alignItems: "flex-start",
                      cursor: "default",
                    }}
                  >
                    <span style={{ 
                      fontSize: 14, 
                      color: "rgba(255,255,255,0.4)", 
                      fontFamily: "var(--font-mono, monospace)",
                      paddingTop: 4 
                    }}>
                      {String(bi + 1).padStart(2, "0")}
                    </span>
                    <span 
                      style={{
                        fontSize: "clamp(16px, 1.8vw, 22px)",
                        color: "rgba(255,255,255,0.75)",
                        lineHeight: 1.4,
                        fontWeight: 400,
                        transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "translateX(12px)";
                        e.currentTarget.style.color = "#fff";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "translateX(0px)";
                        e.currentTarget.style.color = "rgba(255,255,255,0.75)";
                      }}
                    >
                      {b}
                    </span>
                  </div>
                ))}
              </div>

              {/* Minimalist Tags */}
              <div style={{ marginTop: "clamp(24px, 2.5vw, 32px)", display: "flex", flexWrap: "wrap", gap: 12 }}>
                {detail.tags.map((t) => (
                  <span key={t} style={{
                    fontSize: 13, 
                    fontWeight: 400, 
                    color: "rgba(255,255,255,0.6)",
                    display: "flex",
                    alignItems: "center",
                    gap: 6
                  }}>
                    <span style={{ width: 4, height: 4, borderRadius: "50%", background: accent }} />
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
