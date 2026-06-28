"use client";
import * as React from "react";

type IndexBadgeTone = "dark" | "light";

export interface IndexBadgeProps {
  value: number;
  active?: boolean;
  tone?: IndexBadgeTone;
  onClick?: () => void;
  style?: React.CSSProperties;
}

const DARK = {
  active: { bg: "var(--neutral-0)", fg: "#111", border: "var(--neutral-0)" },
  idle:   { bg: "transparent", fg: "rgba(255,255,255,0.62)", border: "rgba(255,255,255,0.56)" },
};
const LIGHT = {
  active: { bg: "var(--neutral-ink)", fg: "var(--neutral-0)", border: "var(--neutral-ink)" },
  idle:   { bg: "transparent", fg: "var(--neutral-500)", border: "var(--neutral-300)" },
};

export function IndexBadge({ value, active = false, tone = "dark", onClick, style }: IndexBadgeProps) {
  const palette = tone === "light" ? LIGHT : DARK;
  const p = active ? palette.active : palette.idle;
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        appearance: "none",
        cursor: onClick ? "pointer" : "default",
        height: active ? 38.4 : 32,
        minWidth: active ? 38.4 : 32,
        paddingInline: active ? 9.6 : 8,
        paddingBlock: active ? 4.8 : 4,
        background: p.bg,
        border: `1px solid ${p.border}`,
        borderRadius: active ? 9.6 : 8,
        color: p.fg,
        font: "var(--type-button)",
        fontSize: active ? 21.6 : 18,
        fontWeight: 300,
        lineHeight: 1,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "all var(--duration-base) var(--ease-out)",
        ...style,
      }}
    >
      {String(value).padStart(2, "0")}
    </button>
  );
}

export interface IndexBadgeRowProps {
  count?: number;
  active?: number;
  tone?: IndexBadgeTone;
  onSelect?: (v: number) => void;
}

export function IndexBadgeRow({ count = 3, active = 1, tone = "dark", onSelect }: IndexBadgeRowProps) {
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
      {Array.from({ length: count }, (_, i) => i + 1).map((v) => (
        <IndexBadge key={v} value={v} active={v === active} tone={tone} onClick={onSelect ? () => onSelect(v) : undefined} />
      ))}
    </div>
  );
}
