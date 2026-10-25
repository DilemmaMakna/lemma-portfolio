"use client";

import { useEffect, useRef } from "react";
import { reducedMotion } from "@/lib/motion/gsap";

// Mesin animasi ASCII: grid W x H dengan tiga lapisan (samar, normal, aksen). Setiap varian
// hanya menggambar frame untuk fase p (0..1 = membangun, 1..SPAN = larut) lewat `put`.
// ASCII murni supaya grid monospace tidak bergeser oleh font cadangan.
export const W = 45;
export const H = 22;
const SPAN = 1.25;
const FRAME_MS = 70;
const LINE = 1.15; // line-height (em)
const NOISE = "0123456789+-=<>^|~*xyzabde";

export type Layer = 0 | 1 | 2; // 0 samar, 1 normal, 2 aksen
export type Put = (x: number, y: number, ch: string, layer?: Layer) => void;
export type Variant = {
  name: string;
  region: (x: number, y: number) => boolean;
  render: (p: number, put: Put) => void;
};

export const hash = (a: number, b: number) => {
  const s = Math.sin(a * 127.1 + b * 311.7) * 43758.5453;
  return s - Math.floor(s);
};
export const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
export const fresh = (p: number, t: number): Layer => (p - t < 0.03 ? 2 : 1);

/** Tulis teks mulai dari (x, y); huruf pertama dan terakhir bisa diberi aksen. */
export function text(put: Put, s: string, x: number, y: number, count: number, accentEnds = false) {
  for (let j = 0; j < Math.min(count, s.length); j++) {
    put(x + j, y, s[j], accentEnds && (j === 0 || j === s.length - 1) ? 2 : 1);
  }
}

function draw(
  p: number,
  tick: number,
  v: Variant,
  out: [HTMLPreElement, HTMLPreElement, HTMLPreElement],
) {
  const grids = [0, 1, 2].map(() => Array.from({ length: H }, () => Array<string>(W).fill(" ")));

  const put: Put = (x, y, ch, layer = 1) => {
    if (x < 0 || x >= W || y < 0 || y >= H) return;
    if (p > 1 && p >= 1 + 0.25 * hash(y, x)) return; // larut
    for (const g of grids) g[y][x] = " ";
    grids[layer][y][x] = ch;
  };
  v.render(p, put);

  // Simbol acak samar di area yang belum terbukti; makin jarang seiring bukti selesai.
  if (p < 1) {
    for (let y = 0; y < H; y++) {
      for (let x = 0; x < W; x++) {
        if (!v.region(x, y) || grids.some((g) => g[y][x] !== " ")) continue;
        if (hash(x * 13 + tick * 7, y * 5 + tick * 3) < 0.05 * (1 - p)) {
          grids[0][y][x] = NOISE[Math.floor(hash(x + tick, y) * NOISE.length)];
        }
      }
    }
  }

  grids.forEach((g, i) => {
    out[i].textContent = g.map((r) => r.join("")).join("\n");
  });
}

type Props = {
  variants: Variant[];
  /** Skala visual; tinggi wrapper ikut menyesuaikan supaya tidak menimpa konten lain. */
  scale?: number;
  /** Durasi satu varian (ms). */
  cycleMs?: number;
  /** Mask: transparan di kiri, penuh di kanan. */
  fade?: boolean;
  /** Persen lebar tempat mask MULAI terlihat (default 0). Naikkan untuk memperlebar area yang hilang di kiri. */
  fadeStart?: number;
  /** Persen lebar tempat mask sudah PENUH (default 75). Kecil = bagian kiri lebih cepat terbaca. */
  fadeStop?: number;
  /** Skala yang dipakai untuk menghitung tinggi layout (default = scale). Isi lebih kecil dari
   *  `scale` agar visual membesar tanpa menambah tinggi section; kelebihannya meluap ke `anchor`. */
  layoutScale?: number;
  /** Ke arah mana visual membesar secara vertikal: "top" meluap ke bawah, "bottom" meluap ke atas. */
  anchor?: "top" | "bottom";
  /** Kelas ukuran font (menentukan ukuran satu sel). */
  sizeClass?: string;
  /** Jika diisi, varian dikontrol dari luar (bukan bergantian otomatis) dan diputar ulang saat berubah. */
  activeIndex?: number;
  /** Sisi tempat visual menempel (dan titik skala). */
  align?: "left" | "right";
  className?: string;
};

export default function AsciiStage({
  variants,
  scale = 2,
  cycleMs = 13000,
  fade = true,
  fadeStart = 0,
  fadeStop = 75,
  layoutScale,
  anchor = "top",
  activeIndex,
  align = "right",
  sizeClass = "text-[9px] min-[400px]:text-[10px] lg:text-[clamp(7px,0.95svh,10px)]",
  className = "",
}: Props) {
  const dim = useRef<HTMLPreElement>(null);
  const base = useRef<HTMLPreElement>(null);
  const hot = useRef<HTMLPreElement>(null);
  const label = useRef<HTMLParagraphElement>(null);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const layers = [dim.current, base.current, hot.current];
    if (!layers[0] || !layers[1] || !layers[2] || !root.current) return;
    const out = layers as [HTMLPreElement, HTMLPreElement, HTMLPreElement];

    const setLabel = (i: number) => {
      if (label.current && variants.length > 1 && activeIndex === undefined) {
        label.current.textContent = `0${i + 1} / 0${variants.length}  ${variants[i].name}`;
      }
    };

    if (reducedMotion()) {
      setLabel(0);
      draw(0.97, 0, variants[activeIndex ?? 0], out);
      return;
    }

    let raf = 0;
    let visible = true;
    let last = 0;
    let shown = -1;
    const start = performance.now();
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      if (!visible || document.hidden || now - last < FRAME_MS) return;
      last = now;
      // Timestamp rAF bisa sedikit lebih awal dari `start`; jangan sampai negatif (indeks -1).
      const elapsed = Math.max(0, now - start);
      const idx = activeIndex ?? Math.floor(elapsed / cycleMs) % variants.length;
      if (idx !== shown) {
        shown = idx;
        setLabel(idx);
      }
      const p = ((elapsed % cycleMs) / cycleMs) * SPAN;
      draw(p, Math.floor(now / 110), variants[idx], out);
    };
    raf = requestAnimationFrame(loop);

    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(root.current);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, [variants, cycleMs, activeIndex]);

  const pre = "absolute inset-0 m-0 whitespace-pre";
  const gradient = `linear-gradient(to right, transparent ${fadeStart}%, #000 ${fadeStop}%)`;
  const reserve = layoutScale ?? scale;
  const mask = fade ? { maskImage: gradient, WebkitMaskImage: gradient } : {};
  return (
    <div ref={root} className={className}>
      <div
        aria-hidden="true"
        className={`pointer-events-none relative select-none font-mono leading-[1.15] ${sizeClass}`}
        style={{ height: `${H * LINE * reserve}em` }}
      >
        <div
          className={`absolute ${anchor === "bottom" ? "bottom-0" : "top-0"} ${align === "left" ? "left-0" : "right-0"}`}
          style={{
            ...mask,
            width: `${W}ch`,
            height: `${H * LINE}em`,
            transform: `scale(${scale})`,
            transformOrigin: `${anchor} ${align}`,
          }}
        >
          <pre ref={dim} className={`${pre} text-fg-dim/70`} />
          <pre ref={base} className={`${pre} text-fg-muted`} />
          <pre ref={hot} className={`${pre} text-accent`} />
        </div>
      </div>
      {variants.length > 1 && activeIndex === undefined && (
        <p ref={label} aria-hidden="true" className="mono mono-2xs mt-4 text-right text-fg-dim !normal-case" />
      )}
    </div>
  );
}
