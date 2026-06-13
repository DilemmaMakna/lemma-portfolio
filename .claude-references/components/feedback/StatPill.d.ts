import * as React from "react";

/**
 * Inline stat — icon on top, right-aligned medium-weight number underneath.
 * Used in the hero stat row.
 */
export interface StatPillProps {
  icon?: React.ReactNode;
  value: React.ReactNode;
  /** Add a left hairline divider — use for all but the first stat in a row. */
  dividerBefore?: boolean;
  style?: React.CSSProperties;
}

export function StatPill(props: StatPillProps): JSX.Element;
