"use client";

import { useEffect, useRef } from "react";
import { gsap, isTouch, reducedMotion } from "@/lib/motion/gsap";

const W = 480;
const H = 300;
const COLS = 12;
const ROWS = 8;
const BAYER = [
  [0, 8, 2, 10],
  [12, 4, 14, 6],
  [3, 11, 1, 9],
  [15, 7, 13, 5],
];

// Medan luminansi prosedural per seed: komposisi abstrak, bukan placeholder foto.
function field(seed: number, x: number, y: number) {
  const nx = x / W;
  const ny = y / H;
  const a = seed * 1.7 + 1;
  let v = 0;
  v += 0.5 + 0.5 * Math.sin(nx * (5 + a) + Math.cos(ny * (4 + seed)) * 2.2);
  v *= 0.55 + 0.45 * Math.sin(ny * (6 + seed * 2) - nx * 3 + a);
  const cx = 0.3 + 0.15 * seed;
  const d = Math.hypot((nx - cx) * 1.6, ny - 0.5);
  v += Math.max(0, 0.9 - d * 1.6) * 0.8;
  const rings = 0.5 + 0.5 * Math.cos(d * (18 + seed * 4));
  v = v * 0.7 + rings * 0.3 * Math.max(0, 1 - d);
  return Math.min(1, Math.max(0, v));
}

function paint(canvas: HTMLCanvasElement, seed: number, mono: boolean) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const img = ctx.createImageData(W, H);
  const px = 3;
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const f = field(seed, mono ? Math.floor(x / px) * px : x, mono ? Math.floor(y / px) * px : y);
      const i = (y * W + x) * 4;
      let r: number, g: number, b: number;
      if (mono) {
        const t = (BAYER[Math.floor(y / px) % 4][Math.floor(x / px) % 4] + 0.5) / 16;
        const on = f > t;
        [r, g, b] = on ? [150, 147, 141] : [16, 16, 16];
      } else {
        // duotone gelap -> oranye
        const k = Math.pow(f, 1.2);
        r = 21 + (255 - 21) * k;
        g = 21 + (90 - 21) * k;
        b = 21 + (31 - 21) * k;
      }
      img.data[i] = r;
      img.data[i + 1] = g;
      img.data[i + 2] = b;
      img.data[i + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
}

export default function PixelReveal({
  seed,
  className = "",
  label,
}: {
  seed: number;
  className?: string;
  label?: string;
}) {
  const color = useRef<HTMLCanvasElement>(null);
  const monoRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const c = color.current;
    const m = monoRef.current;
    if (!c || !m) return;
    paint(c, seed, false);

    if (isTouch() || reducedMotion()) {
      m.style.display = "none";
      return;
    }
    // cache layer mono pada offscreen canvas
    const cache = document.createElement("canvas");
    cache.width = W;
    cache.height = H;
    paint(cache, seed, true);
    const ctx = m.getContext("2d")!;
    const cw = W / COLS;
    const ch = H / ROWS;
    const order = gsap.utils.shuffle(Array.from({ length: COLS * ROWS }, (_, i) => i));

    const render = (n: number) => {
      ctx.clearRect(0, 0, W, H);
      ctx.drawImage(cache, 0, 0);
      for (let k = 0; k < n; k++) {
        const idx = order[k];
        ctx.clearRect((idx % COLS) * cw, Math.floor(idx / COLS) * ch, cw + 0.5, ch + 0.5);
      }
    };
    render(0);

    const state = { n: 0 };
    const to = (target: number) =>
      gsap.to(state, {
        n: target,
        duration: 0.6,
        ease: "power2.inOut",
        overwrite: true,
        onUpdate: () => render(Math.round(state.n)),
      });

    const host = m.closest<HTMLElement>("[data-pixel-host]") ?? m.parentElement!;
    const enter = () => to(COLS * ROWS);
    const leave = () => to(0);
    host.addEventListener("mouseenter", enter);
    host.addEventListener("mouseleave", leave);
    return () => {
      host.removeEventListener("mouseenter", enter);
      host.removeEventListener("mouseleave", leave);
      gsap.killTweensOf(state);
    };
  }, [seed]);

  return (
    <div
      className={`absolute inset-0 overflow-hidden bg-surface ${className}`}
      role="img"
      aria-label={label}
    >
      <canvas ref={color} width={W} height={H} className="absolute inset-0 h-full w-full object-cover" />
      <canvas
        ref={monoRef}
        width={W}
        height={H}
        className="absolute inset-0 h-full w-full object-cover"
        style={{ imageRendering: "pixelated" }}
      />
    </div>
  );
}
