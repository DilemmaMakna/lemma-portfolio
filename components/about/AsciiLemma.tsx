"use client";

import AsciiStage, {
  H,
  W,
  clamp01,
  fresh,
  hash,
  text,
  type Layer,
  type Variant,
} from "@/components/ui/AsciiStage";

// Lemma dalam arti matematis, empat sudut pandang yang bergantian tiap siklus:
//  1. lemma => teorema   : pernyataan kecil dibuktikan, teorema besar tersusun di atasnya
//  2. rantai implikasi   : domino L => P1 => ... => T jatuh berurutan
//  3. induksi            : tangga P(0), P(1), ... masing-masing bertumpu pada anak tangga sebelumnya
//  4. limit (epsilon)    : barisan berosilasi lalu masuk dan bertahan di dalam pita +-e

/* 1. Lemma => teorema ------------------------------------------------------------------- */
const CX = 22;
const CORE_X = 16;
const CORE_ROW = H - 4;
const CORE = ["+----------+", "|  a => b  |", "+----------+"];
const PROOF = "(A e>0)(E d>0) |x-a|<d => |f(x)-f(a)|<e  |-  QED  ";

type PyCell = { x: number; y: number; ch: string; tc: number; accent: boolean };
const pyramid: PyCell[] = (() => {
  const cells: PyCell[] = [];
  for (let y = 0; y < H; y++) {
    const half = Math.round((y / (H - 1)) * CX);
    for (let x = CX - half; x <= CX + half; x++) {
      const inCore = y >= CORE_ROW && y < CORE_ROW + 3 && x >= CORE_X && x < CORE_X + 12;
      if (inCore) {
        cells.push({ x, y, ch: CORE[y - CORE_ROW][x - CORE_X], tc: 0.04 + ((x - CORE_X) / 12) * 0.14, accent: true });
      } else if (y === 0) {
        cells.push({ x, y, ch: "*", tc: 0.92, accent: true });
      } else {
        const edge = Math.abs(x - CX) === half;
        const ch = y === H - 1 ? "=" : edge ? (x < CX ? "/" : "\\") : PROOF[(x + y * 7) % PROOF.length];
        cells.push({ x, y, ch, tc: 0.22 + 0.62 * ((H - 1 - y) / (H - 1)) + 0.05 * hash(x, y), accent: false });
      }
    }
  }
  return cells;
})();

const pyramidVariant: Variant = {
  name: "lemma => theorem",
  region: (x, y) => Math.abs(x - CX) <= Math.round((y / (H - 1)) * CX),
  render: (p, put) => {
    for (const c of pyramid) if (p >= c.tc) put(c.x, c.y, c.ch, c.accent ? 2 : fresh(p, c.tc));
  },
};

/* 2. Rantai implikasi (domino) ---------------------------------------------------------- */
const DOMINOES = 14;
const dominoX = (i: number) => 2 + i * 3;
const dominoFall = (i: number) => 0.2 + i * 0.045;
const CHAIN = "L => P1 => P2 => P3 => P4 => T";
const LAST_FALL = dominoFall(DOMINOES - 1);

const dominoVariant: Variant = {
  name: "implication chain",
  region: (_x, y) => y >= 7 && y <= 16,
  render: (p, put) => {
    for (let x = 0; x < W; x++) if (p > 0.03 + (x / W) * 0.12) put(x, 16, "=", 1);

    for (let i = 0; i < DOMINOES; i++) {
      if (p < 0.06 + i * 0.008) continue;
      const x = dominoX(i);
      const layer: Layer = i === 0 || i === DOMINOES - 1 ? 2 : 1;
      const s = p - dominoFall(i);
      for (let k = 0; k < 3; k++) {
        if (s < 0) put(x, 13 + k, "|", layer);
        else if (s < 0.035) put(x + k, 15 - k, "/", layer);
        else put(x + k, 15, "_", layer);
      }
    }

    const q = clamp01((p - 0.2) / (LAST_FALL - 0.2 + 0.035));
    text(put, CHAIN, 7, 9, Math.ceil(q * CHAIN.length), true);

    if (p > LAST_FALL + 0.04) {
      const x = dominoX(DOMINOES - 1) + 1;
      put(x, 11, "*", 2);
      put(x - 2, 12, "\\", 2);
      put(x + 2, 12, "/", 2);
      put(x, 10, "|", 2);
      text(put, "Q.E.D.", 19, 4, Math.ceil(((p - LAST_FALL - 0.04) / 0.08) * 6), false);
    }
  },
};

/* 3. Induksi (tangga) ------------------------------------------------------------------- */
const STEPS = 8;
const stepX = (i: number) => 2 + i * 5;
const stepY = (i: number) => 19 - i * 2;
const stepAt = (i: number) => 0.08 + i * 0.09;
const IND_END = "(A n) P(n)  QED";

const inductionVariant: Variant = {
  name: "induction",
  region: (x, y) => y >= stepY(Math.min(STEPS - 1, Math.max(0, Math.floor((x - 2) / 5)))),
  render: (p, put) => {
    for (let x = 0; x < W; x++) if (p > 0.03 + (x / W) * 0.1) put(x, 21, "=", 1);

    for (let i = 0; i < STEPS; i++) {
      const t = stepAt(i);
      if (p < t) continue;
      const layer: Layer = i === 0 ? 2 : fresh(p, t);
      const x = stepX(i);
      const y = stepY(i);
      for (let k = 1; k <= 4; k++) put(x + k, y, "_", layer);
      put(x, y, "|", layer);
      put(x, y + 1, "|", layer);
      const label = `P(${i})`;
      for (let k = 0; k < label.length; k++) put(x + 1 + k, y + 1, label[k], layer);
    }

    const t = stepAt(STEPS - 1) + 0.1;
    if (p > t) text(put, IND_END, 2, 2, Math.ceil(((p - t) / 0.1) * IND_END.length), false);
  },
};

/* 4. Limit (epsilon-delta) -------------------------------------------------------------- */
const PTS = 14;
const ptX = (i: number) => 3 + i * 3;
const ptY = (i: number) => 11 + Math.round(9 * Math.pow(-0.72, i));
const ptAt = (i: number) => 0.22 + i * 0.042;
const N_COL = 11;
const LIMIT_LEMMA = "n>N => |a_n-L|<e";

const limitVariant: Variant = {
  name: "limit (e, N)",
  region: (_x, y) => y >= 1 && y <= 20,
  render: (p, put) => {
    if (p > 0.8) {
      for (let y = 2; y <= 19; y++) put(N_COL, y, ":", 2);
      put(N_COL, 20, "N", 2);
    }

    for (let x = 0; x < W - 1; x++) {
      if (p <= 0.04 + (x / W) * 0.16) continue;
      put(x, 11, "-", 1);
      if (x % 2 === 0) {
        put(x, 8, ".", 0);
        put(x, 14, ".", 0);
      }
    }
    if (p > 0.2) {
      put(W - 1, 11, "L", 2);
      text(put, "+e", 0, 7, 2);
      text(put, "-e", 0, 15, 2);
    }

    for (let i = 0; i < PTS; i++) {
      if (p < ptAt(i)) continue;
      if (i > 0) {
        for (let k = 1; k <= 2; k++) {
          put(ptX(i - 1) + k, Math.round(ptY(i - 1) + ((ptY(i) - ptY(i - 1)) * k) / 3), ".", 0);
        }
      }
      put(ptX(i), ptY(i), "o", fresh(p, ptAt(i)));
    }

    const t = 0.84;
    if (p > t) {
      for (let j = 0; j < Math.ceil(((p - t) / 0.08) * LIMIT_LEMMA.length); j++) {
        if (j < LIMIT_LEMMA.length) put(28 + j, 0, LIMIT_LEMMA[j], 2);
      }
    }
  },
};

const VARIANTS: Variant[] = [pyramidVariant, dominoVariant, inductionVariant, limitVariant];

// --- Atur tampilan di sini --------------------------------------------------------------
// SCALE        : seberapa besar visual digambar (3 = 300%).
// LAYOUT_SCALE : tinggi ruang yang dipesan di layout. Biarkan 2 supaya tinggi hero tidak berubah;
//                kelebihan SCALE di atasnya meluap ke atas (ANCHOR "bottom") lalu terpotong hero.
// FADE_START   : % lebar tempat mask mulai terlihat (0 = dari tepi kiri).
// FADE_STOP    : % lebar tempat mask sudah penuh. Makin kecil = makin cepat jelas dari kiri;
//                makin besar = makin lama memudar. Contoh: START 20 / STOP 90 = fade lebih panjang.
const SCALE = 4;
const LAYOUT_SCALE = 2;
const ANCHOR = "bottom";
const FADE_START = 20;
const FADE_STOP = 90;

export default function AsciiLemma({ className = "" }: { className?: string }) {
  return (
    <AsciiStage
      variants={VARIANTS}
      scale={SCALE}
      layoutScale={LAYOUT_SCALE}
      anchor={ANCHOR}
      fadeStart={FADE_START}
      fadeStop={FADE_STOP}
      className={className}
    />
  );
}
