import React from "react";

/**
 * Square companion button used next to a labeled Button — usually a +arrow.
 * Matches Button radius/border so they pair as a "split CTA" lockup.
 */
export function IconButton({
  variant = "accent",
  size = "md",
  href,
  type = "button",
  children,
  onClick,
  disabled,
  ariaLabel,
  style,
  ...rest
}) {
  const Tag = href ? "a" : "button";
  const v = VARIANTS[variant] || VARIANTS.accent;
  const s = SIZES[size] || SIZES.md;
  return (
    <Tag
      {...rest}
      href={href}
      type={href ? undefined : type}
      onClick={disabled ? undefined : onClick}
      aria-label={ariaLabel}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: s.size,
        height: s.size,
        padding: 0,
        borderRadius: "var(--radius-md)",
        background: v.bg,
        color: v.fg,
        border: `1.12px solid ${v.border}`,
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.5 : 1,
        transition: "background var(--duration-fast) var(--ease-out), transform var(--duration-fast) var(--ease-out)",
        ...style,
      }}
      onMouseEnter={(e) => !disabled && (e.currentTarget.style.background = v.hover)}
      onMouseLeave={(e) => !disabled && (e.currentTarget.style.background = v.bg)}
      onMouseDown={(e) => !disabled && (e.currentTarget.style.transform = "scale(0.96)")}
      onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
    >
      {children || <ArrowUpRight />}
    </Tag>
  );
}

function ArrowUpRight() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M7 17 17 7" />
      <path d="M7 7h10v10" />
    </svg>
  );
}

const VARIANTS = {
  primary: { bg: "var(--neutral-700)", hover: "var(--neutral-800)", fg: "var(--beige-100)", border: "var(--neutral-500)" },
  accent:  { bg: "var(--orange-500)",  hover: "var(--orange-600)",  fg: "var(--beige-100)", border: "var(--neutral-400)" },
  ghost:   { bg: "transparent",        hover: "rgba(14,13,12,0.04)", fg: "var(--neutral-ink)", border: "var(--neutral-400)" },
  deep:    { bg: "#ac3e04",            hover: "var(--orange-700)",  fg: "var(--beige-100)", border: "#cb4f0d" },
};
const SIZES = {
  sm: { size: 28 },
  md: { size: 36 },
  lg: { size: 44 },
  xl: { size: 52 },
};
