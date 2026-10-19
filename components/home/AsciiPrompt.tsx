"use client";

import AsciiStage, { clamp01, type Put, type Variant } from "@/components/ui/AsciiStage";

// Animasi ASCII untuk CTA Beranda: satu pertanyaan diketik, pernyataan dibuktikan, lalu dikirim.
const LINES = [
  { s: "$ lemma start", y: 2, a: 0.05, b: 0.18, layer: 1 as const },
  { s: "? what do you want to prove?", y: 4, a: 0.2, b: 0.42, layer: 1 as const },
  { s: "> a => b", y: 6, a: 0.46, b: 0.58, layer: 2 as const },
];

const typed = (s: string, p: number, a: number, b: number) =>
  s.slice(0, Math.ceil(clamp01((p - a) / (b - a)) * s.length));

function write(put: Put, s: string, x: number, y: number, layer: 0 | 1 | 2 = 1) {
  for (let j = 0; j < s.length; j++) put(x + j, y, s[j], layer);
}

const promptVariant: Variant = {
  name: "prompt",
  region: (x, y) => x <= 32 && y >= 1 && y <= 16,
  render: (p, put) => {
    let caret: { x: number; y: number } | null = null;

    for (const l of LINES) {
      if (p < l.a) continue;
      const s = typed(l.s, p, l.a, l.b);
      write(put, s, 0, l.y, l.layer);
      if (p < l.b) caret = { x: s.length, y: l.y };
    }

    if (p > 0.6) {
      const dots = p < 0.74 ? ".".repeat(Math.floor((p - 0.6) / 0.035) % 4) : "... done";
      write(put, `  checking${dots}`, 0, 8);
    }
    if (p > 0.78) write(put, "  ok. brief received.", 0, 10, 2);

    if (p > 0.82) {
      write(put, "+--------+", 2, 13, 2);
      write(put, "| send > |", 2, 14, 2);
      write(put, "+--------+", 2, 15, 2);
    }

    if (caret && Math.floor(p * 70) % 2 === 0) put(caret.x, caret.y, "_", 2);
  },
};

export default function AsciiPrompt({ className = "" }: { className?: string }) {
  return (
    <AsciiStage
      variants={[promptVariant]}
      scale={1.4}
      cycleMs={9000}
      sizeClass="text-[10px] xl:text-[11px]"
      className={className}
    />
  );
}
