import * as React from "react";

export interface StatPillProps {
  icon?: React.ReactNode;
  value: string;
  label?: string;
  dividerBefore?: boolean;
  style?: React.CSSProperties;
}

export function StatPill({ icon, value, label, dividerBefore = false, style }: StatPillProps) {
  return (
    <div
      style={{
        display: "inline-flex",
        flexDirection: "column",
        alignItems: "flex-end",
        gap: 6,
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
      {label && (
        <div style={{ fontSize: 12, color: "var(--neutral-500)", textAlign: "right", lineHeight: 1.3 }}>
          {label}
        </div>
      )}
    </div>
  );
}
