import * as React from "react";

/**
 * Lemma's signature decorative columnar gradient backdrop — peach paired
 * stripes that taper from full-height edges to shortest centre columns.
 * Absolutely positions itself to fill its closest positioned ancestor.
 */
export interface BarrelBackdropProps {
  /** 0–1. Default 0.9. */
  opacity?: number;
  style?: React.CSSProperties;
}

export function BarrelBackdrop(props: BarrelBackdropProps): JSX.Element;
