import React from "react";

/**
 * Inline stat with leading 24px icon and tabular-light number. Used in the
 * hero "4 project · 701K+ · IPB" row. Right-aligned, hairline-divided.
 */
export function StatPill({ icon, value, dividerBefore = false, style }) {
  return (
    <div
      style={{
        display: "inline-flex",
        flexDirection: "column",
        alignItems: "flex-end",
        gap: 14,
        paddingInline: 16,
        paddingBlock: 9,
        borderLeft: dividerBefore ? "1px solid var(--border-hairline)" : "none",
        ...style,
      }}
    >
      {icon ? (
        <div style={{ width: 24, height: 24, color: "var(--neutral-700)", display: "inline-flex" }}>{icon}</div>
      ) : null}
      <div
        style={{
          font: "var(--type-stat)",
          textAlign: "right",
          color: "var(--neutral-700)",
          fontWeight: 500,
          fontSize: 24,
          lineHeight: 1.45,
          whiteSpace: "nowrap",
        }}
      >
        {value}
      </div>
    </div>
  );
}
