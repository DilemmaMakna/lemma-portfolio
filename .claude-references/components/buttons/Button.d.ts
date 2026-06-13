import * as React from "react";

/**
 * Lemma primary button. Inline-flex, capsule-ish 12px radius, 4-color variant system.
 */
export interface ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "size"> {
  /** Visual style. Default "primary". */
  variant?: "primary" | "accent" | "ghost" | "deep";
  /** Size token. Default "md". */
  size?: "sm" | "md" | "lg" | "xl";
  /** Render as an anchor when set. */
  href?: string;
  /** Optional trailing icon (ReactNode — usually a 16px arrow). */
  trailingIcon?: React.ReactNode;
  children?: React.ReactNode;
}

export function Button(props: ButtonProps): JSX.Element;
