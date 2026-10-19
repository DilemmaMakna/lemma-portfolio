"use client";

import AsciiStage, { clamp01, text, type Put, type Variant } from "@/components/ui/AsciiStage";

// Roda Lemma: client -> lemma -> product -> kembali ke client. Jalur lintasan digambar dulu,
// lalu tiga paket data berputar tiga putaran dan menyalakan node yang sedang dilewati.
// Label sengaja netral bahasa (ASCII); terjemahan lengkap ada di legenda di samping.
const TOP = 4;
const BOT = 17;
const LEFT = 1;
const RIGHT = 44;
const LAPS = 3;

type Cell = { x: number; y: number; ch: string };

// Urutan sel searah jarum jam: atas (kiri->kanan), kanan (turun), bawah (kanan->kiri), kiri (naik).
const PATH: Cell[] = (() => {
  const a: Cell[] = [];
  for (let x = LEFT; x <= RIGHT; x++) a.push({ x, y: TOP, ch: x === LEFT || x === RIGHT ? "+" : "-" });
  for (let y = TOP + 1; y < BOT; y++) a.push({ x: RIGHT, y, ch: "|" });
  for (let x = RIGHT; x >= LEFT; x--) a.push({ x, y: BOT, ch: x === LEFT || x === RIGHT ? "+" : "-" });
  for (let y = BOT - 1; y > TOP; y--) a.push({ x: LEFT, y, ch: "|" });
  return a;
})();
const L = PATH.length;

// Panah arah tiap 7 sel supaya putarannya terbaca.
function glyph(i: number, c: Cell) {
  if (i % 7 !== 3) return c.ch;
  if (c.ch === "-") return c.y === TOP ? ">" : "<";
  if (c.ch === "|") return c.x === RIGHT ? "v" : "^";
  return c.ch;
}

const NODES = [
  { label: "[ client ]", x: 3, accent: false },
  { label: "[ lemma ]", x: 19, accent: true },
  { label: "[ product ]", x: 33, accent: false },
].map((n) => ({ ...n, from: n.x - LEFT, to: n.x - LEFT + n.label.length - 1 }));

const inNode = (idx: number) => NODES.some((n) => idx >= n.from && idx <= n.to);

function write(put: Put, s: string, x: number, y: number, layer: 0 | 1 | 2) {
  for (let j = 0; j < s.length; j++) put(x + j, y, s[j], layer);
}

const cycleVariant: Variant = {
  name: "flywheel",
  region: (x, y) => x >= 3 && x <= 42 && y >= 6 && y <= 15,
  render: (p, put) => {
    const reveal = Math.floor(clamp01((p - 0.02) / 0.25) * L);
    for (let i = 0; i < reveal; i++) put(PATH[i].x, PATH[i].y, glyph(i, PATH[i]), 1);

    // Paket data: tiga titik berjarak sama, berputar LAPS kali.
    const run = clamp01((p - 0.3) / 0.65);
    const packets: number[] = [];
    if (p > 0.3 && p <= 0.95) {
      for (let k = 0; k < 3; k++) packets.push(Math.floor(run * LAPS * L + (k * L) / 3) % L);
    }

    for (const n of NODES) {
      if (reveal <= n.from) continue;
      const lit = packets.some((idx) => idx >= n.from && idx <= n.to);
      write(put, n.label, n.x, TOP, lit || n.accent ? 2 : 1);
    }

    for (const idx of packets) if (!inNode(idx)) put(PATH[idx].x, PATH[idx].y, "*", 2);

    if (p > 0.28) {
      text(put, "revenue", 11, TOP - 2, 7);
      text(put, "research", 27, TOP - 2, 8);
      text(put, "lessons back", 16, BOT + 2, 12);
    }

    if (p > 0.3) {
      const lap = Math.min(LAPS, Math.floor(run * LAPS) + 1);
      write(put, `lap 0${lap}/0${LAPS}`, 17, 10, 2);
    }
  },
};

const VARIANTS: Variant[] = [cycleVariant];

export default function AsciiCycle({ className = "" }: { className?: string }) {
  return (
    <AsciiStage
      variants={VARIANTS}
      scale={1.6}
      cycleMs={12000}
      fadeStop={55}
      sizeClass="text-[8px] min-[400px]:text-[9px] md:text-[11px]"
      className={className}
    />
  );
}
