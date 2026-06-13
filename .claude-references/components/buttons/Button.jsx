import React from "react";

/**
 * Lemma's primary action button. Three variants for three contexts:
 *  - "primary"  → dark slate ink, used on cream surfaces (the nav "Start a project")
 *  - "accent"   → orange, used as the active CTA (Layanan card CTAs)
 *  - "ghost"    → outline only, used inline next to a heading ("Selected work")
 *  - "deep"     → dark-orange-on-deep-orange, used on the footer CTA
 *
 * Pair with <IconButton/> for a +arrow secondary tap target right next to it.
 */
export function Button({
  variant = "primary",
  size = "md",
  href,
  type = "button",
  children,
  trailingIcon,
  onClick,
  disabled,
  style,
  className,
  ...rest
}) {
  const Tag = href ? "a" : "button";
  const v = VARIANTS[variant] || VARIANTS.primary;
  const s = SIZES[size] || SIZES.md;
  const css = {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    fontFamily: "var(--font-sans)",
    fontWeight: 400,
    fontSize: s.fs,
    lineHeight: 1.625,
    padding: s.pad,
    borderRadius: "var(--radius-md)",
    border: `${"var(--border-soft)" } solid ${v.border}`,
    background: v.bg,
    color: v.fg,
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.5 : 1,
    textDecoration: "none",
    transition: "background var(--duration-fast) var(--ease-out), transform var(--duration-fast) var(--ease-out), color var(--duration-fast) var(--ease-out)",
    whiteSpace: "nowrap",
    ...style,
  };
  return (
    <Tag
      {...rest}
      href={href}
      type={href ? undefined : type}
      onClick={disabled ? undefined : onClick}
      className={className}
      style={css}
      onMouseEnter={(e) => {
        if (disabled) return;
        e.currentTarget.style.background = v.hover;
      }}
      onMouseLeave={(e) => {
        if (disabled) return;
        e.currentTarget.style.background = v.bg;
      }}
      onMouseDown={(e) => {
        if (disabled) return;
        e.currentTarget.style.transform = "scale(0.98)";
      }}
      onMouseUp={(e) => {
        e.currentTarget.style.transform = "scale(1)";
      }}
    >
      <span>{children}</span>
      {trailingIcon ? <span style={{ display: "inline-flex", alignItems: "center" }}>{trailingIcon}</span> : null}
    </Tag>
  );
}

const VARIANTS = {
  primary: {
    bg: "var(--action-primary-bg)",
    hover: "var(--neutral-800)",
    fg: "var(--action-primary-fg)",
    border: "var(--action-primary-border)",
  },
  accent: {
    bg: "var(--action-accent-bg)",
    hover: "var(--orange-600)",
    fg: "var(--action-accent-fg)",
    border: "var(--action-accent-border)",
  },
  ghost: {
    bg: "transparent",
    hover: "rgba(14,13,12,0.04)",
    fg: "var(--action-ghost-fg)",
    border: "var(--action-ghost-border)",
  },
  deep: {
    bg: "var(--action-on-deep-bg)",
    hover: "var(--orange-700)",
    fg: "var(--neutral-0)",
    border: "var(--action-on-deep-border)",
  },
};

const SIZES = {
  sm: { fs: 14, pad: "4px 12px" },
  md: { fs: 16, pad: "4px 16px" },
  lg: { fs: 18, pad: "8px 20px" },
  xl: { fs: 20, pad: "10px 24px" },
};
