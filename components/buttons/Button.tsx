"use client";
import * as React from "react";

export interface ButtonProps {
  variant?: "primary" | "accent" | "ghost" | "deep";
  size?: "sm" | "md" | "lg" | "xl";
  href?: string;
  type?: "button" | "submit" | "reset";
  children?: React.ReactNode;
  trailingIcon?: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement | HTMLAnchorElement>;
  disabled?: boolean;
  style?: React.CSSProperties;
  className?: string;
}

const VARIANTS = {
  primary: { bg: "var(--action-primary-bg)", hover: "var(--neutral-800)", fg: "var(--action-primary-fg)", border: "var(--action-primary-border)" },
  accent:  { bg: "var(--action-accent-bg)",  hover: "var(--orange-600)",   fg: "var(--action-accent-fg)",  border: "var(--action-accent-border)" },
  ghost:   { bg: "transparent",              hover: "rgba(14,13,12,0.04)", fg: "var(--action-ghost-fg)",   border: "var(--action-ghost-border)" },
  deep:    { bg: "var(--action-on-deep-bg)", hover: "var(--orange-700)",   fg: "var(--neutral-0)",         border: "var(--action-on-deep-border)" },
};

const SIZES = {
  sm: { fs: 14, pad: "4px 12px" },
  md: { fs: 16, pad: "4px 16px" },
  lg: { fs: 18, pad: "8px 20px" },
  xl: { fs: 20, pad: "10px 24px" },
};

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
}: ButtonProps & Record<string, unknown>) {
  const Tag = href ? "a" : "button";
  const v = VARIANTS[variant] || VARIANTS.primary;
  const s = SIZES[size] || SIZES.md;

  const css: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    fontFamily: "var(--font-sans)",
    fontWeight: 400,
    fontSize: s.fs,
    lineHeight: 1.625,
    padding: s.pad,
    borderRadius: "var(--radius-md)",
    border: `1.12px solid ${v.border}`,
    background: v.bg,
    color: v.fg,
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.5 : 1,
    textDecoration: "none",
    transition: "background var(--duration-fast) var(--ease-out), transform var(--duration-fast) var(--ease-out)",
    whiteSpace: "nowrap",
    ...style,
  };

  return (
    <Tag
      {...(rest as Record<string, unknown>)}
      href={href}
      type={href ? undefined : type}
      onClick={disabled ? undefined : (onClick as React.MouseEventHandler<HTMLButtonElement & HTMLAnchorElement>)}
      className={className}
      style={css}
      onMouseEnter={(e: React.MouseEvent<HTMLElement>) => { if (!disabled) (e.currentTarget as HTMLElement).style.background = v.hover; }}
      onMouseLeave={(e: React.MouseEvent<HTMLElement>) => { if (!disabled) (e.currentTarget as HTMLElement).style.background = v.bg; }}
      onMouseDown={(e: React.MouseEvent<HTMLElement>) => { if (!disabled) (e.currentTarget as HTMLElement).style.transform = "scale(0.98)"; }}
      onMouseUp={(e: React.MouseEvent<HTMLElement>) => { (e.currentTarget as HTMLElement).style.transform = "scale(1)"; }}
    >
      <span>{children}</span>
      {trailingIcon ? <span style={{ display: "inline-flex", alignItems: "center" }}>{trailingIcon}</span> : null}
    </Tag>
  );
}
