import * as React from "react";

type EyebrowTone = "muted" | "warm" | "light" | "dark" | "accent";

export interface EyebrowProps {
  children: React.ReactNode;
  tone?: EyebrowTone;
  as?: keyof React.JSX.IntrinsicElements;
  style?: React.CSSProperties;
  className?: string;
}

const COLOR: Record<EyebrowTone, string> = {
  muted:  "rgba(14,13,12,0.5)",
  warm:   "#fadccb",
  light:  "rgba(255,255,255,0.8)",
  dark:   "var(--neutral-700)",
  accent: "var(--orange-600)",
};

export function Eyebrow({ children, tone = "muted", as: Tag = "div", style, ...rest }: EyebrowProps & Record<string, unknown>) {
  return (
    <Tag
      {...rest}
      style={{
        font: "var(--type-eyebrow)",
        letterSpacing: "var(--tracking-eyebrow)",
        textTransform: "uppercase" as const,
        color: COLOR[tone] || COLOR.muted,
        ...style,
      }}
    >
      {children}
    </Tag>
  );
}
