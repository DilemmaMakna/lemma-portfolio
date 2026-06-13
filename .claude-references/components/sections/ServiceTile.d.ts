import * as React from "react";

/**
 * Immersive full-bleed service section. Numbered badges top-left,
 * decorative colored backdrop dimmed by a 68% black veil, then title +
 * description bottom-left with the billing scheme on the right.
 */
export interface ServiceTileProps {
  /** This tile's position (1-indexed). */
  index: number;
  /** Total count for the badge row. Default 3. */
  count?: number;
  /** Which badge is highlighted — defaults to `index`. */
  active?: number;
  /** Color family. */
  variant?: "magenta" | "teal" | "olive" | "orange";
  title: React.ReactNode;
  description?: React.ReactNode;
  /** Right-aligned note (e.g. "Skema: Berbasis Proyek"). */
  scheme?: React.ReactNode;
  /** Decorative backdrop element rendered behind the veil. */
  decoration?: React.ReactNode;
  onSelect?: (idx: number) => void;
  style?: React.CSSProperties;
}

export function ServiceTile(props: ServiceTileProps): JSX.Element;
