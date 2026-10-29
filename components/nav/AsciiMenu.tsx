"use client";

import AsciiStage, { W, H, clamp01, fresh, hash, type Layer, type Put, type Variant } from "@/components/ui/AsciiStage";

// Ilustrasi ASCII untuk panel megamenu, satu adegan per menu. Memakai mesin AsciiStage yang sama
// dengan hero dan Cara Kerja. Setiap adegan memenuhi seluruh grid W x H (tanpa ruang kosong),
// dan diputar ulang tiap kali panel berganti.
function write(put: Put, s: string, x: number, y: number, layer: Layer = 1) {
  for (let j = 0; j < s.length; j++) put(x + j, y, s[j], layer);
}

const frame = (put: Put, x: number, y: number, w: number, h: number, layer: Layer = 1) => {
  write(put, `+${"-".repeat(w - 2)}+`, x, y, layer);
  for (let j = 1; j < h - 1; j++) write(put, `|${" ".repeat(w - 2)}|`, x, y + j, layer);
  write(put, `+${"-".repeat(w - 2)}+`, x, y + h - 1, layer);
};

const mid = (put: Put, s: string, x: number, w: number, y: number, layer: Layer = 1) =>
  write(put, s, x + Math.floor((w - s.length) / 2), y, layer);

const everywhere = () => true;

/* Layanan: empat disiplin mengalirkan bukti ke satu titik makna ------------------------- */
const DISC = [
  { x: 0, y: 0, a: "UX & HCI", b: "users" },
  { x: 27, y: 0, a: "DESIGN", b: "interaction" },
  { x: 0, y: 18, a: "DATA & AI", b: "evidence" },
  { x: 27, y: 18, a: "TECHNOLOGY", b: "systems" },
];

const services: Variant = {
  name: "services",
  region: everywhere,
  render: (p, put) => {
    DISC.forEach((d, i) => {
      const t = 0.04 + i * 0.08;
      if (p < t) return;
      const l = fresh(p, t);
      frame(put, d.x, d.y, 18, 4, l);
      mid(put, d.a, d.x, 18, d.y + 1, l);
      mid(put, d.b, d.x, 18, d.y + 2, 0);
    });

    // Garis antar kotak (atas dan bawah) lalu turun ke pusat.
    const reach = clamp01((p - 0.35) / 0.3);
    for (let k = 0; k < Math.floor(reach * 9); k++) {
      put(18 + k, 1, "-", 0);
      put(18 + k, 20, "-", 0);
    }
    for (let k = 0; k < Math.floor(reach * 12); k++) {
      for (const x of [9, 36]) {
        put(x, 4 + k, "|", 0);
      }
    }
    if (reach > 0.8) {
      for (let x = 10; x < 14; x++) put(x, 10, "-", 0);
      for (let x = 31; x < 36; x++) put(x, 10, "-", 0);
    }

    // Titik bukti mengalir dari tiap sudut ke pusat.
    if (p > 0.55 && p < 1) {
      for (let k = 0; k < 4; k++) {
        const f = (p * 2.4 + k / 4) % 1;
        const x = k % 2 === 0 ? 9 : 36;
        const y = k < 2 ? 4 + Math.floor(f * 6) : 17 - Math.floor(f * 6);
        put(x, y, "*", 2);
      }
    }
    if (p > 0.7) {
      frame(put, 11, 7, 23, 7, 2);
      mid(put, "M E A N I N G", 11, 23, 9, 2);
      mid(put, "ux + design", 11, 23, 11, 1);
      mid(put, "data + tech", 11, 23, 12, 1);
    }
  },
};

/* Karya: dinding tile yang terisi satu per satu ------------------------------------------ */
const work: Variant = {
  name: "work",
  region: everywhere,
  render: (p, put) => {
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 4; c++) {
        const k = r * 4 + c;
        const t = 0.04 + k * 0.05;
        if (p < t) continue;
        const x = c * 11;
        const y = r * 7;
        const hot = k === 6;
        const l: Layer = hot ? 2 : fresh(p, t);
        frame(put, x, y, 11, 7, l);

        // Isi tile: tiap tile punya pola berbeda, seperti pratinjau karya.
        const pat = Math.floor(hash(k, 3) * 4);
        for (let j = 0; j < 5; j++) {
          const row = y + 1 + j;
          if (pat === 0) write(put, "#########", x + 1, row, hot ? 2 : 1);
          if (pat === 1) write(put, j % 2 ? "=-=-=-=-=" : "-=-=-=-=-", x + 1, row, 1);
          if (pat === 2) write(put, j === 0 || j === 4 ? "+-------+" : "|  [ ]  |", x + 1, row, 1);
          if (pat === 3) write(put, j % 2 ? " / / / / /".slice(0, 9) : "/ / / / / ".slice(0, 9), x + 1, row, 1);
        }
      }
    }
    if (p > 0.8) write(put, "[ proven ] [ proven ] [ proven ] [ proven ]", 1, 21, 2);
  },
};

/* Produk: banyak aplikasi menyatu jadi satu ------------------------------------------------ */
const products: Variant = {
  name: "products",
  region: everywhere,
  render: (p, put) => {
    const merge = clamp01((p - 0.2) / 0.35);
    if (merge < 1) {
      for (let i = 0; i < 5; i++) {
        const t = 0.03 + i * 0.04;
        if (p < t) continue;
        const x = Math.round(merge * (16 + (i % 2) * 2));
        frame(put, x, i * 4 + 1, 13, 3, 1);
        mid(put, `app 0${i + 1}`, x, 13, i * 4 + 2, 1);
      }
    }
    if (p > 0.55) {
      const t = 0.55;
      frame(put, 14, 0, 31, 22, fresh(p, t));
      mid(put, "N A T A K U", 14, 31, 3, 2);
      for (let x = 16; x < 43; x++) put(x, 5, "-", 0);
      if (p > 0.65) mid(put, "1 app. 1 campus.", 14, 31, 7, fresh(p, 0.65));
      const tags = ["[ EdTech ]", "[ B2C ]", "[ Indonesia ]"];
      tags.forEach((s, i) => {
        const tt = 0.7 + i * 0.06;
        if (p > tt) mid(put, s, 14, 31, 10 + i * 2, fresh(p, tt));
      });
      for (let x = 16; x < 43; x++) put(x, 17, "-", 0);
      if (p > 0.88) mid(put, "[ active development ]", 14, 31, 19, 2);
    }
  },
};

/* Tentang: lemma dibuktikan dulu, teorema besar berdiri di atasnya -------------------------- */
const TIERS = [
  { x: 12, y: 2, w: 21, h: 5, a: "THEOREM", b: "the big claim", t: 0.55 },
  { x: 6, y: 8, w: 33, h: 5, a: "PREMISE", b: "what we hold true", t: 0.4 },
  { x: 0, y: 14, w: 45, h: 5, a: "PROOF", b: "evidence, tested and documented", t: 0.25 },
];

const about: Variant = {
  name: "about",
  region: everywhere,
  render: (p, put) => {
    if (p > 0.05) {
      for (let x = 0; x < W; x++) put(x, 20, "=", 1);
      mid(put, "[ LEMMA ]", 0, W, 21, 2);
    }
    for (const r of TIERS) {
      if (p <= r.t) continue;
      const l = fresh(p, r.t);
      frame(put, r.x, r.y, r.w, r.h, l);
      mid(put, r.a, r.x, r.w, r.y + 1, l);
      mid(put, r.b, r.x, r.w, r.y + 3, 0);
    }
    if (p > 0.8) mid(put, "Q . E . D", 0, W, 0, 2);
    // Sambungan vertikal antar tingkat.
    if (p > 0.6) for (let y = 7; y < H - 10; y++) if (y !== 8) put(22, y, ":", 0);
  },
};

export const MENU_SCENES: Record<string, Variant> = { services, work, products, about };
const KEYS = Object.keys(MENU_SCENES);
const VARIANTS = KEYS.map((k) => MENU_SCENES[k]);

export default function AsciiMenu({ scene, className = "" }: { scene: string; className?: string }) {
  const idx = Math.max(0, KEYS.indexOf(scene));
  return (
    <AsciiStage
      key={scene}
      variants={VARIANTS}
      activeIndex={idx}
      scale={1}
      cycleMs={7000}
      fade={false}
      align="left"
      sizeClass="text-[11px] min-[1360px]:text-[12.5px]"
      className={className}
    />
  );
}
