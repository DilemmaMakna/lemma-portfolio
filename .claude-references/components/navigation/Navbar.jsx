import React from "react";

/**
 * Top navigation. A glassy hairline-bordered bar with logo on the left,
 * link cluster in the middle, and a primary CTA on the right.
 *
 * Lemma's navbar sits flush over content (light tinted background +
 * 2px backdrop blur). Designed for the cream/white marketing pages.
 */
export function Navbar({
  logo,
  links = [],
  cta,
  current,
  onNavigate,
  variant = "light",
  style,
}) {
  const palette = variant === "dark" ? DARK : LIGHT;
  return (
    <nav
      style={{
        height: "var(--nav-height)",
        paddingInline: "var(--gutter)",
        paddingBlock: 12,
        background: palette.bg,
        borderBottom: `1px solid ${palette.border}`,
        backdropFilter: "var(--blur-nav)",
        WebkitBackdropFilter: "var(--blur-nav)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        fontFamily: "var(--font-sans)",
        color: palette.fg,
        ...style,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        {logo || <DefaultLogo variant={variant} />}
      </div>
      <ul
        style={{
          display: "flex",
          gap: 0,
          margin: 0,
          padding: 0,
          listStyle: "none",
          minWidth: 0,
          flex: "0 1 475px",
        }}
      >
        {links.map((l) => {
          const active = l.id === current || l.href === current;
          return (
            <li key={l.id || l.href} style={{ flex: 1, display: "flex", justifyContent: "center" }}>
              <a
                href={l.href || "#"}
                onClick={(e) => {
                  if (onNavigate) { e.preventDefault(); onNavigate(l); }
                }}
                style={{
                  padding: "1px 16px",
                  font: "var(--type-button)",
                  color: active ? palette.fg : palette.fgMuted,
                  textDecoration: "none",
                  transition: "color var(--duration-fast) var(--ease-out)",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = palette.fg)}
                onMouseLeave={(e) => (e.currentTarget.style.color = active ? palette.fg : palette.fgMuted)}
              >
                {l.label}
              </a>
            </li>
          );
        })}
      </ul>
      <div>{cta}</div>
    </nav>
  );
}

function DefaultLogo({ variant }) {
  return (
    <span
      style={{
        font: "var(--type-button)",
        fontSize: 24,
        fontWeight: 500,
        lineHeight: 1.25,
        letterSpacing: "-0.01em",
        color: variant === "dark" ? "var(--beige-100)" : "var(--neutral-ink)",
      }}
    >
      Lemma
    </span>
  );
}

const LIGHT = {
  bg: "rgba(245,245,245,0.10)",
  border: "rgba(14,13,12,0.12)",
  fg: "var(--neutral-ink)",
  fgMuted: "var(--neutral-600)",
};
const DARK = {
  bg: "rgba(20,12,4,0.40)",
  border: "rgba(255,255,255,0.16)",
  fg: "var(--beige-100)",
  fgMuted: "rgba(247,245,241,0.62)",
};
