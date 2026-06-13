import * as React from "react";

/**
 * Numbered step indicator used as a sequence cluster on service tiles.
 * Active step is a solid filled capsule; others are hairline-outlined.
 */
export interface IndexBadgeProps {
  value: number;
  active?: boolean;
  /** Color tone — "dark" for use on dark/colored tiles, "light" for cream surfaces. */
  tone?: "dark" | "light";
  onClick?: () => void;
  style?: React.CSSProperties;
}

export function IndexBadge(props: IndexBadgeProps): JSX.Element;

export interface IndexBadgeRowProps {
  count?: number;
  active?: number;
  tone?: "dark" | "light";
  onSelect?: (value: number) => void;
}

export function IndexBadgeRow(props: IndexBadgeRowProps): JSX.Element;
