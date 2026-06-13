import React from "react";

/**
 * Immersive service tile — a full-bleed colored section with a dark veil,
 * IndexBadgeRow at the top, title + description on the bottom-left,
 * and a billing/scheme note on the bottom-right.
 *
 * The background is a decorative SVG element (rings, lozenges, dots —
 * whatever the brand uses for each service) covered by a 68% black veil.
 * Pass it as `decoration`.
 */
export function ServiceTile({
  index,
  count = 3,
  active,
  variant = "magenta",
  title,
  description,
  scheme,
  decoration,
  onSelect,
  style,
}) {
  const palette = PALETTES[variant] || PALETTES.magenta;
  return (
    <section
      style={{
        position: "relative",
        width: "100%",
        height: "var(--tile-h)",
        padding: "var(--gutter)",
        background: palette.bg,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        gap: 10,
        fontFamily: "var(--font-sans)",
        ...style,
      }}
    >
      {decoration ? (
        <div aria-hidden style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
          {decoration}
        </div>
      ) : null}
      {/* dark veil */}
      <div aria-hidden style={{ position: "absolute", inset: 0, background: "var(--veil-service)", pointerEvents: "none" }} />

      {/* badges (top) */}
      <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 8 }}>
        {Array.from({ length: count }, (_, i) => i + 1).map((v) => (
          <IndexCapsule key={v} value={v} active={v === (active ?? index)} onClick={onSelect ? () => onSelect(v) : undefined} />
        ))}
      </div>

      {/* footer (title + scheme) */}
      <div style={{ position: "relative", marginTop: "auto", display: "flex", alignItems: "flex-end", gap: 10 }}>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10 }}>
          <h3
            style={{
              margin: 0,
              font: "var(--type-tile-title)",
              fontSize: 42,
              fontWeight: 500,
              lineHeight: 1.05,
              color: "var(--beige-0)",
            }}
          >
            {title}
          </h3>
          <p
            style={{
              margin: 0,
              maxWidth: 447,
              fontSize: 18,
              fontWeight: 400,
              lineHeight: 1.625,
              color: "var(--beige-0)",
            }}
          >
            {description}
          </p>
        </div>
        {scheme ? (
          <div style={{ flex: 1, textAlign: "right", fontSize: 14, lineHeight: 1.625, color: "var(--beige-0)", opacity: 0.9 }}>
            {scheme}
          </div>
        ) : null}
      </div>
    </section>
  );
}

function IndexCapsule({ value, active, onClick }) {
  const label = String(value).padStart(2, "0");
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
        background: active ? "var(--neutral-0)" : "transparent",
        border: `1px solid ${active ? "var(--neutral-0)" : "rgba(255,255,255,0.56)"}`,
        borderRadius: active ? 9.6 : 8,
        color: active ? "#111" : "rgba(255,255,255,0.62)",
        fontFamily: "var(--font-sans)",
        fontWeight: 300,
        fontSize: active ? 21.6 : 18,
        lineHeight: 1,
        transition: "all var(--duration-base) var(--ease-out)",
      }}
    >
      {label}
    </button>
  );
}

const PALETTES = {
  magenta: { bg: "var(--grad-magenta-radial)" },
  teal:    { bg: "radial-gradient(ellipse 70.71% 53.85% at 50% 50%, var(--teal-from) 0%, var(--teal-to) 100%)" },
  olive:   { bg: "var(--grad-olive-radial)" },
  orange:  { bg: "var(--grad-orange-radial)" },
};
