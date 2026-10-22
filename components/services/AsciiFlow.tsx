"use client";

import AsciiStage, { H, W, clamp01, text, type Variant } from "@/components/ui/AsciiStage";

// Animasi ASCII untuk CTA Layanan:
//  1. empat disiplin mengalir jadi satu alur lalu dikirim
//  2. daftar deliverable dicentang satu per satu sampai progres penuh

/* 1. Empat disiplin, satu alur ---------------------------------------------------------- */
const LANES = [
  { label: "brand", y: 3 },
  { label: "ux/hci", y: 8 },
  { label: "eng", y: 13 },
  { label: "ai/data", y: 18 },
];
const JOIN = 30;
const TRUNK_Y = 10;

const flowVariant: Variant = {
  name: "four disciplines, one flow",
  region: (x, y) => x >= 8 && y >= 2 && y <= 19,
  render: (p, put) => {
    LANES.forEach((l, k) => {
      const t0 = 0.04 + k * 0.05;
      if (p > t0) text(put, l.label, 0, l.y, l.label.length);
      const q = clamp01((p - t0 - 0.03) / 0.25);
      const end = 8 + Math.floor(q * (JOIN - 8));
      for (let x = 8; x < end; x++) put(x, l.y, "-", 1);
      if (q >= 1) put(JOIN, l.y, "+", 1);
    });

    if (p > 0.5) {
      for (let y = LANES[0].y; y <= LANES[LANES.length - 1].y; y++) {
        if (!LANES.some((l) => l.y === y)) put(JOIN, y, "|", 1);
      }
    }

    if (p > 0.52) put(JOIN, TRUNK_Y, "+", 2);
    const tq = clamp01((p - 0.52) / 0.18);
    const tend = JOIN + 1 + Math.floor(tq * (W - 2 - JOIN));
    for (let x = JOIN + 1; x < tend; x++) put(x, TRUNK_Y, "=", 2);
    if (tq >= 1) put(W - 1, TRUNK_Y, ">", 2);

    if (p > 0.7) text(put, "ONE FLOW", JOIN + 2, TRUNK_Y - 2, Math.ceil(((p - 0.7) / 0.06) * 8));
    if (p > 0.78) text(put, "ship", W - 5, TRUNK_Y + 2, 4);

    // Paket data yang mengalir: tiap jalur menuju titik temu, lalu batang utama.
    if (p > 0.74) {
      LANES.forEach((l, k) => {
        const f = (p - 0.74 - k * 0.04) / 0.12;
        if (f > 0 && f < 1) put(8 + Math.floor(f * (JOIN - 8)), l.y, "*", 2);
      });
      const f2 = (p - 0.86) / 0.1;
      if (f2 > 0 && f2 < 1) put(JOIN + 1 + Math.floor(f2 * (W - 2 - JOIN)), TRUNK_Y, "*", 2);
    }
  },
};

/* 2. Deliverable dicentang -------------------------------------------------------------- */
const ITEMS = ["logo system", "design system", "web app", "rag chatbot", "okr map"];

const checklistVariant: Variant = {
  name: "deliverables",
  region: (_x, y) => y >= 2 && y <= 17,
  render: (p, put) => {
    if (p > 0.02) text(put, "deliverables", 2, 0, 12);

    let done = 0;
    ITEMS.forEach((name, k) => {
      const y = 3 + k * 3;
      if (p > 0.04 + k * 0.03) text(put, `[ ] ${name}`, 2, y, 40);
      if (p >= 0.14 + k * 0.14) {
        done++;
        put(3, y, "x", 2);
        for (let x = 2; x <= 42; x++) put(x, y + 1, ".", 0);
      }
    });

    if (p > 0.1) {
      const f = Math.round((done / ITEMS.length) * 20);
      const pct = Math.round((done / ITEMS.length) * 100);
      text(put, `[${"#".repeat(f)}${".".repeat(20 - f)}] ${pct}%`, 2, 19, 40);
    }
    if (p > 0.86) {
      const s = "shipped.";
      for (let j = 0; j < s.length; j++) put(2 + j, H - 1, s[j], 2);
    }
  },
};

const VARIANTS: Variant[] = [flowVariant, checklistVariant];

export default function AsciiFlow({ className = "" }: { className?: string }) {
  return (
    <AsciiStage
      variants={VARIANTS}
      scale={1.5}
      cycleMs={11000}
      sizeClass="text-[9px] min-[400px]:text-[10px] lg:text-[11px]"
      className={className}
    />
  );
}
