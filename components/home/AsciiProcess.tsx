"use client";

import AsciiStage, { clamp01, fresh, hash, type Put, type Variant } from "@/components/ui/AsciiStage";

// Tiga adegan ASCII, satu per langkah di section Cara Kerja. Adegan berganti mengikuti langkah
// aktif dan diputar ulang setiap kali langkah berubah.
function write(put: Put, s: string, x: number, y: number, layer: 0 | 1 | 2 = 1) {
  for (let j = 0; j < s.length; j++) put(x + j, y, s[j], layer);
}

/* 01. Struktur: pohon sistem -> alur, arsitektur informasi, design system -------------- */
const KIDS = [
  { label: "[ flow ]", c: 6, leaves: ["goal", "path", "exit"] },
  { label: "[ ia ]", c: 21, leaves: ["nav", "tree", "map"] },
  { label: "[ ds ]", c: 35, leaves: ["type", "color", "grid"] },
];

const structure: Variant = {
  name: "structure",
  region: (x, y) => x >= 2 && x <= 42 && y >= 5 && y <= 17,
  render: (p, put) => {
    if (p > 0.04) write(put, "[ system ]", 16, 1, 2);
    if (p > 0.1) {
      put(21, 2, "|");
      put(21, 3, "|");
    }

    const bend = 6 + Math.floor(clamp01((p - 0.14) / 0.16) * 29);
    if (p > 0.14) {
      for (let x = 6; x <= bend; x++) put(x, 4, x === 6 || x === 21 || x === 35 ? "+" : "-");
    }

    KIDS.forEach((k, i) => {
      const t = 0.3 + i * 0.08;
      if (p < t) return;
      put(k.c, 5, "|");
      write(put, k.label, k.c - Math.floor(k.label.length / 2), 6, 1);

      k.leaves.forEach((w, j) => {
        const lt = 0.42 + i * 0.06 + j * 0.07;
        if (p < lt) return;
        for (let y = 7; y < 9 + j * 3; y++) put(k.c, y, "|");
        write(put, `+-- ${w}`, k.c, 9 + j * 3, fresh(p, lt));
      });
    });

    if (p > 0.88) write(put, "[ok] consistent", 2, 20, 2);
  },
};

/* 02. Tujuan: banyak ide menyempit jadi satu tujuan -------------------------------------- */
const FCX = 22;
const F_TOP = 4;
const F_BOT = 13;
const funnelHalf = (y: number) => Math.round(18 - ((y - F_TOP) * 16) / (F_BOT - F_TOP));
const QUESTION = "? what for";
const GOAL_LIST = ["- message", "- audience", "- metric"];

const purpose: Variant = {
  name: "purpose",
  region: (x, y) => y >= F_TOP && y <= F_BOT && Math.abs(x - FCX) < funnelHalf(y),
  render: (p, put) => {
    write(put, QUESTION.slice(0, Math.ceil(clamp01((p - 0.03) / 0.12) * QUESTION.length)), 2, 1, 2);

    for (let y = F_TOP; y <= F_BOT; y++) {
      if (p <= 0.12 + (y - F_TOP) * 0.03) continue;
      put(FCX - funnelHalf(y), y, "\\");
      put(FCX + funnelHalf(y), y, "/");
    }

    // Ide berjatuhan dan merapat ke tengah mengikuti bentuk corong.
    if (p > 0.18 && p < 0.78) {
      for (let k = 0; k < 10; k++) {
        const f = (p * 2.2 + k / 10) % 1;
        const y = F_TOP + Math.floor(f * (F_BOT - F_TOP + 1));
        const x0 = FCX + Math.round((hash(k, 1) - 0.5) * 2 * 16);
        const x = FCX + Math.round(((x0 - FCX) * funnelHalf(y)) / 18);
        put(x, y, y >= F_BOT - 1 ? "*" : "~", y >= F_BOT - 1 ? 2 : 1);
      }
    }

    if (p > 0.5) {
      for (let y = F_BOT + 1; y <= 14; y++) put(FCX, y, "|", 2);
      write(put, "[ goal ]", FCX - 4, 15, 2);
    }
    GOAL_LIST.forEach((s, i) => {
      const t = 0.62 + i * 0.08;
      if (p > t) write(put, s, 15, 17 + i, fresh(p, t));
    });
  },
};

/* 03. Serah-terima: dari kami ke tim kamu ------------------------------------------------ */
const CHECKS = [
  { s: "[x] tested", y: 13, t: 0.38 },
  { s: "[x] documented", y: 15, t: 0.52 },
  { s: "[x] ready to hand over", y: 17, t: 0.66 },
];

const handover: Variant = {
  name: "handover",
  region: (x, y) => x >= 2 && x <= 42 && y >= 6 && y <= 18,
  render: (p, put) => {
    const ready = p > 0.82;
    if (p > 0.05) {
      write(put, "+-------+", 2, 8);
      write(put, "| lemma |", 2, 9);
      write(put, "+-------+", 2, 10);
      write(put, "+-------+", 34, 8, ready ? 2 : 1);
      write(put, "|  you  |", 34, 9, ready ? 2 : 1);
      write(put, "+-------+", 34, 10, ready ? 2 : 1);
    }

    const pend = 11 + Math.floor(clamp01((p - 0.1) / 0.2) * 22);
    if (p > 0.1) for (let x = 11; x < pend; x++) put(x, 9, "=");
    if (p > 0.3) put(33, 9, ">", 2);

    if (p > 0.3 && p < 0.78) {
      for (let k = 0; k < 4; k++) {
        const f = (((p - 0.3) / 0.48) * 3 + k / 4) % 1;
        write(put, "[#]", 11 + Math.floor(f * 19), 9, 2);
      }
    }

    for (const c of CHECKS) if (p > c.t) write(put, c.s, 2, c.y, fresh(p, c.t));
    if (ready) write(put, "ours -> yours", 16, 6, 2);
  },
};

const VARIANTS: Variant[] = [structure, purpose, handover];

export default function AsciiProcess({ active, className = "" }: { active: number; className?: string }) {
  return (
    <AsciiStage
      variants={VARIANTS}
      activeIndex={Math.min(active, VARIANTS.length - 1)}
      scale={1}
      cycleMs={8000}
      fade={false}
      align="left"
      sizeClass="text-[9px] min-[400px]:text-[10px] xl:text-[11px]"
      className={className}
    />
  );
}
