import * as React from "react";

/**
 * Small tracked label that sits above a title or in a card meta strip.
 */
export interface EyebrowProps extends React.HTMLAttributes<HTMLElement> {
  tone?: "muted" | "warm" | "light" | "dark" | "accent";
  /** Wrapper element. Default "div". */
  as?: keyof JSX.IntrinsicElements;
  children?: React.ReactNode;
}

export function Eyebrow(props: EyebrowProps): JSX.Element;
