import * as React from "react";

export interface BarrelBackdropProps {
  opacity?: number;
  style?: React.CSSProperties;
}

const COLUMNS: [number, number, number][] = [
  [0,    720, 610],
  [170,  585, 495],
  [340,  400, 340],
  [510,  260, 220],
  [760,  260, 220],
  [930,  400, 340],
  [1100, 585, 495],
  [1270, 720, 610],
];

export function BarrelBackdrop({ opacity = 0.9, style }: BarrelBackdropProps) {
  return (
    <div
      aria-hidden
      style={{
        position: "absolute",
        inset: 0,
        opacity,
        pointerEvents: "none",
        overflow: "hidden",
        ...style,
      }}
    >
      <svg
        viewBox="0 0 1440 720"
        preserveAspectRatio="xMidYMid slice"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
      >
        <defs>
          <linearGradient id="lemma-barrel-outer" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFC3A7" />
            <stop offset="100%" stopColor="#FFC3A7" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="lemma-barrel-inner" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFDCCB" />
            <stop offset="100%" stopColor="#FFDCCB" stopOpacity="0" />
          </linearGradient>
        </defs>
        {COLUMNS.map(([x, hOuter, hInner], i) => (
          <g key={i}>
            <rect x={x} y={0} width={170} height={hOuter} fill="url(#lemma-barrel-outer)" />
            <rect x={x} y={0} width={170} height={hInner} fill="url(#lemma-barrel-inner)" />
          </g>
        ))}
      </svg>
    </div>
  );
}
