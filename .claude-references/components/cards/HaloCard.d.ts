import * as React from "react";

/**
 * The brand's signature hero artwork: a tilted red "shadow" rectangle behind
 * an orange-gradient card overlaid with the barrel pattern. Used between
 * "Digital" and "Partner" on the landing hero.
 */
export interface HaloCardProps {
  width?: number;
  height?: number;
  /** Degrees to rotate the back rectangle. Default 13. */
  rotate?: number;
  variant?: "orange" | "magenta" | "olive";
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

export function HaloCard(props: HaloCardProps): JSX.Element;
