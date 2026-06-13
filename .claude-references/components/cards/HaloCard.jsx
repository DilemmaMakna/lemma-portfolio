import React from "react";

/**
 * Hero-style "halo card" — an off-stage red rectangle tilted 13° behind
 * an orange-gradient card with a 7px halo outer ring. The decorative
 * artwork used on the landing-page hero between "Digital" and "Partner".
 */
export function HaloCard({
  width = 343,
  height = 220,
  rotate = 13,
  variant = "orange",
  children,
  style,
}) {
  const palette = variant === "magenta"
    ? { bg: "var(--grad-magenta-radial)", back: "var(--magenta-from)" }
    : variant === "olive"
    ? { bg: "var(--grad-olive-radial)", back: "var(--olive-from)" }
    : { bg: "var(--grad-orange-radial)", back: "var(--red-spot)" };
  return (
    <div
      style={{
        position: "relative",
        width,
        height,
        ...style,
      }}
    >
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
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            background: "url('../../assets/barrel-pattern.svg') center/cover no-repeat",
            opacity: 0.85,
            mixBlendMode: "screen",
          }}
        />
        {children}
      </div>
    </div>
  );
}
