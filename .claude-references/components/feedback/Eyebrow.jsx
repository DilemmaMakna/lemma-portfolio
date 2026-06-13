import React from "react";

/**
 * Tracked sentence-case label that sits ABOVE a section title or
 * inside a card meta strip. Always lowercase or sentence case;
 * never ALL CAPS. Letter-spacing is what carries the visual identity.
 */
export function Eyebrow({ children, tone = "muted", as = "div", style, ...rest }) {
  const Tag = as;
  return (
    <Tag
      {...rest}
      style={{
        font: "var(--type-eyebrow)",
        letterSpacing: "var(--tracking-eyebrow)",
        color: COLOR[tone] || COLOR.muted,
        ...style,
      }}
    >
      {children}
    </Tag>
  );
}

const COLOR = {
  muted: "rgba(14,13,12,0.5)",
  warm:  "#fadccb",
  light: "rgba(255,255,255,0.8)",
  dark:  "var(--neutral-700)",
  accent: "var(--orange-600)",
};
