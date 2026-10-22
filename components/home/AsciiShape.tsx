"use client";

import AsciiStage, { H, W, clamp01, fresh, hash, text, type Put, type Variant } from "@/components/ui/AsciiStage";

// Animasi ASCII untuk Premis Beranda: "ada masalah yang belum punya bentuk".
// Tiga adegan, semuanya bergerak dari tak-berbentuk ke terdefinisi:
// 1. converge  : tanda tanya berserakan berkumpul menjadi satu kontur tertutup.
// 2. structure : gumpalan kabur yang bergoyang mengendap menjadi kotak-kotak terhubung.
// 3. define    : pernyataan samar ditanya terus sampai menjadi definisi.
const CX = 22;
const CY = 10;
const ease = (t: number) => 1 - Math.pow(1 - t, 3);

// --- 1. converge -------------------------------------------------------------------------
const RX = 17;
const RY = 7;
const N = 160;

function outlineChar(theta: number) {
  // Arah garis singgung elips menentukan karakter garisnya (sumbu y ke bawah).
  const dx = -RX * Math.sin(theta);
  const dy = RY * Math.cos(theta);
  const slope = Math.abs(dx) < 1e-6 ? Infinity : dy / dx;
  if (Math.abs(slope) < 0.35) return "-";
  if (Math.abs(slope) > 2.2) return "|";
  return slope > 0 ? "\\" : "/";
}

const converge: Variant = {
  name: "converge",
  region: () => true,
  render: (p, put) => {
    for (let i = 0; i < N; i++) {
      const theta = (i / N) * Math.PI * 2;
      const tx = Math.round(CX + RX * Math.cos(theta));
      const ty = Math.round(CY + RY * Math.sin(theta));
      const sx = hash(i, 1) * (W - 1);
      const sy = hash(i, 2) * (H - 1);
      const start = 0.04 + hash(i, 3) * 0.3;
      const k = ease(clamp01((p - start) / 0.32));
      // Sebelum tiba: melayang sedikit, berupa tanda tanya.
      const wob = (1 - k) * Math.sin(p * 30 + i) * 1.2;
      const x = Math.round(sx + (tx - sx) * k + wob);
      const y = Math.round(sy + (ty - sy) * k);
      if (k < 1) put(x, y, hash(i, 4) < 0.6 ? "?" : ".", 0);
      else put(x, y, outlineChar(theta), fresh(p, start + 0.32));
    }

    if (p > 0.72) text(put, "problem", CX - 3, CY - 1, Math.ceil(((p - 0.72) / 0.06) * 7));
    if (p > 0.8) {
      const s = ":= defined";
      text(put, s, CX - 5, CY + 1, Math.ceil(((p - 0.8) / 0.08) * s.length));
    }
    if (p > 0.9) text(put, "QED", W - 4, H - 1, 3, true);
  },
};

// --- 2. structure ------------------------------------------------------------------------
const RAMP = " .:-=+*#";
const BOXES = [
  { x: 2, y: 3, w: 11, label: "user" },
  { x: 17, y: 3, w: 11, label: "need" },
  { x: 32, y: 3, w: 11, label: "flow" },
  { x: 2, y: 12, w: 11, label: "data" },
  { x: 17, y: 12, w: 11, label: "limit" },
  { x: 32, y: 12, w: 11, label: "proof" },
];
const BOX_H = 5;

function box(put: Put, b: (typeof BOXES)[number], k: number, i: number, p: number) {
  const cells: [number, number, string][] = [];
  for (let x = 0; x < b.w; x++) {
    const ch = x === 0 || x === b.w - 1 ? "+" : "-";
    cells.push([b.x + x, b.y, ch], [b.x + x, b.y + BOX_H - 1, ch]);
  }
  for (let y = 1; y < BOX_H - 1; y++) cells.push([b.x, b.y + y, "|"], [b.x + b.w - 1, b.y + y, "|"]);
  cells.forEach(([x, y, ch], j) => {
    if (hash(j, i + 9) < k) put(x, y, ch, k < 1 ? 2 : 1);
  });
  if (k >= 1) {
    const at = 0.62 + i * 0.03;
    const n = Math.ceil(clamp01((p - at) / 0.05) * b.label.length);
    text(put, b.label, b.x + Math.floor((b.w - b.label.length) / 2), b.y + 2, n);
  }
}

const structure: Variant = {
  name: "structure",
  region: (x, y) => y >= 1 && y < H - 1,
  render: (p, put) => {
    // Gumpalan: radius bergoyang terhadap sudut, memudar saat struktur muncul.
    const fadeOut = 1 - clamp01((p - 0.35) / 0.3);
    if (fadeOut > 0) {
      for (let y = 0; y < H; y++) {
        for (let x = 0; x < W; x++) {
          const dx = (x - CX) / 1.9;
          const dy = y - CY;
          const a = Math.atan2(dy, dx);
          const r = 7 * (1 + 0.28 * Math.sin(3 * a + p * 9) + 0.16 * Math.sin(5 * a - p * 7));
          const v = clamp01(1 - Math.hypot(dx, dy) / r) * fadeOut;
          if (v <= 0.02 || hash(x * 3 + Math.floor(p * 40), y) > v + 0.25) continue;
          put(x, y, RAMP[Math.min(RAMP.length - 1, 1 + Math.floor(v * (RAMP.length - 1)))], v > 0.6 ? 1 : 0);
        }
      }
    }

    BOXES.forEach((b, i) => box(put, b, clamp01((p - 0.38 - i * 0.03) / 0.16), i, p));

    // Penghubung antarkotak setelah semua berdiri.
    if (p > 0.8) {
      const k = clamp01((p - 0.8) / 0.08);
      for (const y of [5, 14]) {
        for (const x0 of [13, 28]) for (let x = 0; x < 4; x++) if (x / 4 < k) put(x0 + x, y, x === 3 ? ">" : "-", 2);
      }
      for (const x of [7, 22, 37]) for (let y = 8; y < 12; y++) if ((y - 8) / 4 < k) put(x, y, y === 11 ? "v" : "|", 2);
    }
    if (p > 0.9) text(put, "shape found", W - 12, H - 1, 11, true);
  },
};

// --- 3. define ---------------------------------------------------------------------------
const LINES: { s: string; y: number; at: number; layer: 0 | 1 | 2 }[] = [
  { s: 'let X = "we need an app"', y: 2, at: 0.04, layer: 1 },
  { s: "ask  why?", y: 5, at: 0.2, layer: 0 },
  { s: "     for whom?", y: 6, at: 0.28, layer: 0 },
  { s: "     what if not?", y: 7, at: 0.36, layer: 0 },
  { s: "X = { students,", y: 10, at: 0.5, layer: 1 },
  { s: "      tasks scattered,", y: 11, at: 0.56, layer: 1 },
  { s: "      one place }", y: 12, at: 0.62, layer: 1 },
  { s: "=> X is defined.", y: 15, at: 0.74, layer: 2 },
];

const DX = 9; // geser ke kanan supaya teks tidak tertutup mask kiri

const define: Variant = {
  name: "define",
  region: (x, y) => x >= 1 && x <= 40 && y >= 1 && y <= 17,
  render: (p, put) => {
    let caret: [number, number] | null = null;
    for (const l of LINES) {
      if (p < l.at) continue;
      const n = Math.ceil(clamp01((p - l.at) / 0.07) * l.s.length);
      text(put, l.s, DX, l.y, n);
      if (l.layer !== 1) for (let j = 0; j < n; j++) if (l.s[j] !== " ") put(DX + j, l.y, l.s[j], l.layer);
      if (n < l.s.length) caret = [DX + n, l.y];
    }
    // Pernyataan awal dicoret setelah pertanyaan diajukan.
    if (p > 0.46) {
      const k = clamp01((p - 0.46) / 0.06);
      for (let j = 8; j < 8 + Math.ceil(k * 16); j++) put(DX + j, 2, "~", 0);
    }
    if (caret && Math.floor(p * 70) % 2 === 0) put(caret[0], caret[1], "_", 2);
    if (p > 0.88) text(put, "QED", DX + 18, 15, 3, true);
  },
};

const VARIANTS: Variant[] = [converge, structure, define];

// --- Atur tampilan di sini --------------------------------------------------------------
// SCALE      : seberapa besar visual digambar.
// CYCLE_MS   : durasi satu adegan.
// FADE_START / FADE_STOP : mask kiri ke kanan (lihat AsciiStage).
const SCALE = 2;
const CYCLE_MS = 11000;
const FADE_START = 0;
const FADE_STOP = 15;

export default function AsciiShape({ className = "" }: { className?: string }) {
  return (
    <AsciiStage
      variants={VARIANTS}
      scale={SCALE}
      cycleMs={CYCLE_MS}
      fadeStart={FADE_START}
      fadeStop={FADE_STOP}
      // Font lebih kecil di ponsel supaya 45 kolom x SCALE muat di layar sempit tanpa terpotong.
      sizeClass="text-[6px] min-[400px]:text-[7px] sm:text-[9px] lg:text-[clamp(7px,0.95svh,10px)]"
      className={className}
    />
  );
}
