import * as React from "react";

export interface HaloCardProps {
  width?: number;
  height?: number;
  rotate?: number;
  variant?: "orange" | "magenta" | "olive";
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

export function HaloCard({ width = 600, height = 400, rotate = 13, variant = "orange", children, style }: HaloCardProps) {
  const palette =
    variant === "magenta"
      ? { bg: "var(--grad-magenta-radial)", back: "var(--magenta-from)" }
      : variant === "olive"
        ? { bg: "var(--grad-olive-radial)", back: "var(--olive-from)" }
        : { bg: "var(--grad-orange-radial)", back: "var(--red-spot)" };

  return (
    <div style={{ position: "relative", width, height, ...style }}>
      {/* The tilted red backing card */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          left: -width * 0.12,
          top: height * 0.1,
          width: width * 0.78,
          height: height * 0.82,
          background: palette.back,
          borderRadius: 28.8,
          transform: `rotate(${rotate}deg)`,
          transformOrigin: "center",
          boxShadow: "var(--halo-orange-thin)",
        }}
      />
      {/* The main orange card */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: palette.bg,
          overflow: "hidden",
          borderRadius: 32,
          boxShadow: "var(--halo-orange)",
        }}
      >
        {/* Barrel texture overlay */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: "url('/barrel-pattern.svg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0.3,
            mixBlendMode: "screen",
          }}
        />
        {children}
      </div>
    </div>
  );
}
