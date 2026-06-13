import * as React from "react";

/**
 * Square icon-only companion to <Button/>. Defaults to a +arrow.
 */
export interface IconButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "size"> {
  variant?: "primary" | "accent" | "ghost" | "deep";
  size?: "sm" | "md" | "lg" | "xl";
  href?: string;
  /** Accessible name. */
  ariaLabel?: string;
  /** Override the default arrow glyph. */
  children?: React.ReactNode;
}

export function IconButton(props: IconButtonProps): JSX.Element;
