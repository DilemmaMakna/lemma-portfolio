import React from "react";

/**
 * Numbered step indicator (01 / 02 / 03 …). Used as a horizontal cluster
 * on the service tiles to show position in a sequence. The current step
 * is a solid white capsule; others are hairline-outlined.
 */
export function IndexBadge({ value, active = false, tone = "dark", onClick, style }) {
  const palette = tone === "light" ? LIGHT : DARK;
  const activePalette = palette.active;
  const idlePalette = palette.idle;
  const p = active ? activePalette : idlePalette;
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

/** Convenience wrapper that renders a row of IndexBadges. */
export function IndexBadgeRow({ count = 3, active = 1, tone = "dark", onSelect }) {
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
      {Array.from({ length: count }, (_, i) => i + 1).map((v) => (
        <IndexBadge key={v} value={v} active={v === active} tone={tone} onClick={onSelect ? () => onSelect(v) : undefined} />
      ))}
    </div>
  );
}

const DARK = {
  active: { bg: "var(--neutral-0)", fg: "#111", border: "var(--neutral-0)" },
  idle:   { bg: "transparent", fg: "rgba(255,255,255,0.62)", border: "rgba(255,255,255,0.56)" },
};
const LIGHT = {
  active: { bg: "var(--neutral-ink)", fg: "var(--neutral-0)", border: "var(--neutral-ink)" },
  idle:   { bg: "transparent", fg: "var(--neutral-500)", border: "var(--neutral-300)" },
};
