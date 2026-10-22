// Logika medan untuk TopographicalLines: tanpa DOM, murni angka, supaya bisa diuji di Node.
// Alurnya: heightfield -> definisi (seberapa "berbentuk") -> kontur (marching squares)
// -> bentuk (solid / putus-putus / titik) -> label -> rute (A*).
//
// Metafora: "Ada masalah yang belum punya bentuk." Di pusat peta, medan sudah terdefinisi
// (kontur utuh, elevasi terukur). Makin ke tepi, kontur putus jadi serpihan lalu tinggal
// titik-titik survei yang hanya mengisyaratkan bentuk, dan elevasinya masih "?".

export const LEVELS = 33; // jumlah kontur; tinggi ternormalisasi dibagi rata
export const BASE_M = 800; // elevasi dasar (meter) untuk label
export const INTERVAL_M = 50; // meter per kontur
export const INDEX_EVERY = 5; // setiap kontur ke-5 lebih tebal dan berlabel

export type Field = {
  data: Float32Array; // tinggi 0..1, baris demi baris
  cols: number;
  rows: number;
  cell: number; // ukuran sel dalam px CSS
  width: number;
  height: number;
};

export type Label = { x: number; y: number; angle: number; text: string; unknown: boolean };

export type Shaped = {
  solid: number[][]; // per level: ruas kontur yang digambar utuh
  dots: number[]; // x,y titik survei: sisa kontur yang belum berbentuk
};

export type Route = {
  pts: Float32Array; // x,y bergantian, sudah dihaluskan dan di-resample
  cum: Float32Array; // jarak kumulatif tiap titik
  length: number;
  start: { x: number; y: number };
  summit: { x: number; y: number; dist: number; meters: number };
  end: { x: number; y: number };
};

const clamp = (v: number, lo: number, hi: number) => (v < lo ? lo : v > hi ? hi : v);

const smooth01 = (a: number, b: number, x: number) => {
  const t = clamp((x - a) / (b - a), 0, 1);
  return t * t * (3 - 2 * t);
};

// ---------- noise ----------

const hash = (x: number, y: number) => {
  let h = (x * 374761393 + y * 668265263) | 0;
  h = ((h ^ (h >> 13)) * 1274126177) | 0;
  return ((h ^ (h >> 16)) >>> 0) / 4294967296;
};

// Value noise dengan fade quintic: kurva kontur jadi mulus tanpa patahan di kisi.
const noise = (x: number, y: number) => {
  const ix = Math.floor(x);
  const iy = Math.floor(y);
  const fx = x - ix;
  const fy = y - iy;
  const ux = fx * fx * fx * (fx * (fx * 6 - 15) + 10);
  const uy = fy * fy * fy * (fy * (fy * 6 - 15) + 10);
  const a = hash(ix, iy);
  const b = hash(ix + 1, iy);
  const c = hash(ix, iy + 1);
  const d = hash(ix + 1, iy + 1);
  return a + (b - a) * ux + (c - a) * uy + (a - b - c + d) * ux * uy;
};

// Rotasi + skala ~2 antar oktaf agar pola tidak sejajar sumbu.
const fbm = (x: number, y: number, octaves: number) => {
  let sum = 0;
  let amp = 0.5;
  let norm = 0;
  for (let i = 0; i < octaves; i++) {
    sum += amp * noise(x, y);
    norm += amp;
    amp *= 0.5;
    const nx = 1.6 * x - 1.2 * y + 3.1;
    y = 1.2 * x + 1.6 * y - 1.7;
    x = nx;
  }
  return sum / norm;
};

// Ridged multifractal: punggungan tajam dan lembah menyempit, seperti pegunungan nyata.
const ridged = (x: number, y: number, octaves: number) => {
  let sum = 0;
  let amp = 0.5;
  let weight = 1;
  let norm = 0;
  for (let i = 0; i < octaves; i++) {
    let n = 1 - Math.abs(noise(x, y) * 2 - 1);
    n *= n * weight;
    weight = clamp(n * 2, 0, 1);
    sum += n * amp;
    norm += amp;
    amp *= 0.5;
    const nx = 1.6 * x - 1.2 * y + 7.3;
    y = 1.2 * x + 1.6 * y + 2.9;
    x = nx;
  }
  return sum / norm;
};

// ---------- heightfield ----------

// Koordinat "dunia" 0..1; jendela yang tampil adalah bagian tengah (1 / zoom).
const PEAKS = [
  { x: 0.5, y: 0.52, h: 1.0, r: 0.2 },
  { x: 0.3, y: 0.38, h: 0.72, r: 0.15 },
  { x: 0.72, y: 0.62, h: 0.8, r: 0.16 },
  { x: 0.62, y: 0.28, h: 0.5, r: 0.12 },
  { x: 0.36, y: 0.74, h: 0.45, r: 0.12 },
] as const;

// Jarak kuadrat titik ke ruas garis, dipakai untuk punggungan yang menyambung dua puncak.
const segDist2 = (px: number, py: number, ax: number, ay: number, bx: number, by: number) => {
  const abx = bx - ax;
  const aby = by - ay;
  const t = clamp(((px - ax) * abx + (py - ay) * aby) / (abx * abx + aby * aby), 0, 1);
  const dx = px - (ax + abx * t);
  const dy = py - (ay + aby * t);
  return dx * dx + dy * dy;
};

// zoom > 1 memperbesar medan (bukan bitmap): garis tetap tajam dan bentuknya lebih lapang.
export function buildField(width: number, height: number, cell: number, zoom = 1): Field {
  const cols = Math.ceil(width / cell) + 1;
  const rows = Math.ceil(height / cell) + 1;
  const data = new Float32Array(cols * rows);
  const aspect = clamp(width / height, 1, 2.6);

  let min = Infinity;
  let max = -Infinity;

  for (let r = 0; r < rows; r++) {
    const ny = 0.5 + ((r * cell) / height - 0.5) / zoom;
    for (let c = 0; c < cols; c++) {
      const nx = 0.5 + ((c * cell) / width - 0.5) / zoom;

      // Koordinat noise memakai aspek kanvas supaya medan tidak melar di layar lebar.
      const ux = nx * aspect * 2.2;
      const uy = ny * 2.2;

      // Domain warp: bentuk lereng menikung, bukan kisi noise yang lurus.
      const wx = noise(ux * 0.9 + 11.3, uy * 0.9 + 4.7) - 0.5;
      const wy = noise(ux * 0.9 + 31.1, uy * 0.9 + 17.9) - 0.5;
      const px = ux + wx * 1.6;
      const py = uy + wy * 1.6;

      // Posisi massif ikut di-warp supaya puncaknya tidak berupa elips sempurna.
      const mx = nx + wx * 0.15;
      const my = ny + wy * 0.15;
      let massif = 0;
      for (const p of PEAKS) {
        const dx = (mx - p.x) * aspect;
        const dy = my - p.y;
        massif += p.h * Math.exp(-(dx * dx + dy * dy) / (2 * p.r * p.r));
      }
      const spine = segDist2(mx * aspect, my, 0.5 * aspect, 0.52, 0.72 * aspect, 0.62);
      massif += 0.4 * Math.exp(-spine / (2 * 0.1 * 0.1));

      const base = fbm(px * 0.8, py * 0.8, 5);
      const crest = ridged(px * 1.1, py * 1.1, 5);

      // Massif hanya menjadi selubung besar; punggungan dan lembah datang dari noise,
      // dan makin tegas di ketinggian.
      const env = Math.min(1, massif);
      const v = 0.34 * massif + 0.36 * crest * (0.25 + 0.75 * env) + 0.3 * base * (0.6 + 0.4 * env);
      data[r * cols + c] = v;
      if (v < min) min = v;
      if (v > max) max = v;
    }
  }

  const span = max - min || 1;
  for (let i = 0; i < data.length; i++) data[i] = (data[i] - min) / span;

  return { data, cols, rows, cell, width, height };
}

// Nilai grid di koordinat px (interpolasi bilinear). Dipakai untuk tinggi maupun definisi.
export function sample(f: Field, arr: Float32Array, x: number, y: number) {
  const gx = clamp(x / f.cell, 0, f.cols - 1.001);
  const gy = clamp(y / f.cell, 0, f.rows - 1.001);
  const c = gx | 0;
  const r = gy | 0;
  const fx = gx - c;
  const fy = gy - r;
  const i = r * f.cols + c;
  const a = arr[i];
  const b = arr[i + 1];
  const d = arr[i + f.cols];
  const e = arr[i + f.cols + 1];
  return a + (b - a) * fx + (d - a) * fy + (a - b - d + e) * fx * fy;
}

export const heightAt = (f: Field, x: number, y: number) => sample(f, f.data, x, y);

// Gradien (per sel) lewat selisih terpusat.
function gradient(f: Field, c: number, r: number, step = 1) {
  const c0 = clamp(c - step, 0, f.cols - 1);
  const c1 = clamp(c + step, 0, f.cols - 1);
  const r0 = clamp(r - step, 0, f.rows - 1);
  const r1 = clamp(r + step, 0, f.rows - 1);
  const gx = (f.data[r * f.cols + c1] - f.data[r * f.cols + c0]) / (c1 - c0 || 1);
  const gy = (f.data[r1 * f.cols + c] - f.data[r0 * f.cols + c]) / (r1 - r0 || 1);
  return { gx, gy };
}

// ---------- definisi ----------

// Seberapa "berbentuk" tiap titik: 1 di pusat (terdefinisi), 0 di tepi (belum punya bentuk).
// Batasnya diwarp noise supaya organik, bukan lingkaran sempurna.
export function definition(f: Field): Float32Array {
  const out = new Float32Array(f.cols * f.rows);
  const cx = f.width / 2;
  const cy = f.height / 2;
  for (let r = 0; r < f.rows; r++) {
    for (let c = 0; c < f.cols; c++) {
      const x = c * f.cell;
      const y = r * f.cell;
      const e = Math.hypot((x - cx) / cx, (y - cy) / cy);
      const wobble = (noise(x / 170 + 5.3, y / 170 + 9.1) - 0.5) * 0.5;
      out[r * f.cols + c] = 1 - smooth01(0.22, 0.85, e + wobble);
    }
  }
  return out;
}

// ---------- hillshade ----------

// Relief berbayang, sangat halus. Hasil RGBA (cols x rows) yang transparan: terang jadi putih
// beralpha, bayangan jadi hitam beralpha, sehingga cocok di atas latar #0a0a0a apa pun.
// Makin tidak terdefinisi, makin datar reliefnya.
export function hillshade(f: Field, def?: Float32Array) {
  const out = new Uint8ClampedArray(f.cols * f.rows * 4);
  const EX = 70; // eksagerasi vertikal
  const lx = -0.5;
  const ly = -0.5;
  const lz = 0.7;
  const ll = Math.hypot(lx, ly, lz);
  const flat = lz / ll;
  const BG = 10; // abu-abu latar halaman

  for (let r = 0; r < f.rows; r++) {
    for (let c = 0; c < f.cols; c++) {
      const i = r * f.cols + c;
      const { gx, gy } = gradient(f, c, r);
      const nx = -gx * EX;
      const ny = -gy * EX;
      const nl = Math.hypot(nx, ny, 1);
      const lambert = (nx * lx + ny * ly + 1 * lz) / (nl * ll);
      let v = clamp(16 + 70 * (lambert - flat) + 10 * f.data[i], 4, 52);
      if (def) v = BG + (v - BG) * (0.25 + 0.75 * def[i]);

      const o = i * 4;
      if (v >= BG) {
        out[o] = out[o + 1] = out[o + 2] = 255;
        out[o + 3] = ((v - BG) * 255) / (255 - BG);
      } else {
        out[o] = out[o + 1] = out[o + 2] = 0;
        out[o + 3] = ((BG - v) * 255) / BG;
      }
    }
  }
  return out;
}

// ---------- kontur ----------

// Marching squares satu lintasan: tiap sel hanya memeriksa level yang melewatinya
// (min..max sudut), bukan semua level. Saddle (kasus 5 dan 10) diputuskan lewat nilai tengah.
// Hasil: untuk tiap level k, array datar [x1,y1,x2,y2,...] dalam px CSS.
export function traceContours(f: Field): number[][] {
  const segs: number[][] = Array.from({ length: LEVELS + 1 }, () => []);
  const { data, cols, rows, cell } = f;

  for (let r = 0; r < rows - 1; r++) {
    for (let c = 0; c < cols - 1; c++) {
      const i = r * cols + c;
      const v0 = data[i]; // kiri atas
      const v1 = data[i + 1]; // kanan atas
      const v2 = data[i + cols + 1]; // kanan bawah
      const v3 = data[i + cols]; // kiri bawah

      const mn = Math.min(v0, v1, v2, v3);
      const mx = Math.max(v0, v1, v2, v3);
      const kLo = Math.max(1, Math.floor(mn * LEVELS) + 1);
      const kHi = Math.min(LEVELS, Math.floor(mx * LEVELS));

      for (let k = kLo; k <= kHi; k++) {
        const t = k / LEVELS;
        const state = (v0 >= t ? 8 : 0) | (v1 >= t ? 4 : 0) | (v2 >= t ? 2 : 0) | (v3 >= t ? 1 : 0);
        if (state === 0 || state === 15) continue;

        const topX = (c + (t - v0) / (v1 - v0)) * cell;
        const topY = r * cell;
        const rightX = (c + 1) * cell;
        const rightY = (r + (t - v1) / (v2 - v1)) * cell;
        const botX = (c + (t - v3) / (v2 - v3)) * cell;
        const botY = (r + 1) * cell;
        const leftX = c * cell;
        const leftY = (r + (t - v0) / (v3 - v0)) * cell;

        const out = segs[k];
        switch (state) {
          case 1:
          case 14:
            out.push(leftX, leftY, botX, botY);
            break;
          case 2:
          case 13:
            out.push(botX, botY, rightX, rightY);
            break;
          case 3:
          case 12:
            out.push(leftX, leftY, rightX, rightY);
            break;
          case 4:
          case 11:
            out.push(topX, topY, rightX, rightY);
            break;
          case 6:
          case 9:
            out.push(topX, topY, botX, botY);
            break;
          case 7:
          case 8:
            out.push(leftX, leftY, topX, topY);
            break;
          case 5:
            if ((v0 + v1 + v2 + v3) / 4 >= t) out.push(topX, topY, leftX, leftY, botX, botY, rightX, rightY);
            else out.push(topX, topY, rightX, rightY, leftX, leftY, botX, botY);
            break;
          case 10:
            if ((v0 + v1 + v2 + v3) / 4 >= t) out.push(topX, topY, rightX, rightY, leftX, leftY, botX, botY);
            else out.push(topX, topY, leftX, leftY, botX, botY, rightX, rightY);
            break;
        }
      }
    }
  }
  return segs;
}

// ---------- bentuk: solid, putus-putus, titik ----------

// Tiap ruas kontur bertahan utuh dengan peluang yang turun seiring definisi. Keputusan dibuat
// per "lari" ~22px (bukan per ruas) supaya potongan bertetangga bertahan atau hilang bersama,
// menghasilkan garis putus-putus yang wajar, bukan bintik acak. Ruas yang gugur sebagian
// ditinggalkan sebagai titik survei: bentuknya hanya diisyaratkan, belum digambar.
export function shapeContours(f: Field, contours: number[][], def: Float32Array): Shaped {
  const solid: number[][] = Array.from({ length: LEVELS + 1 }, () => []);
  const dots: number[] = [];

  for (let k = 1; k <= LEVELS; k++) {
    const s = contours[k];
    for (let i = 0; i < s.length; i += 4) {
      const mx = (s[i] + s[i + 2]) / 2;
      const my = (s[i + 1] + s[i + 3]) / 2;
      const d = sample(f, def, mx, my);
      const run = hash(Math.floor(mx / 22) + k * 131, Math.floor(my / 22) - k * 71);
      if (run < smooth01(0.12, 0.62, d)) {
        solid[k].push(s[i], s[i + 1], s[i + 2], s[i + 3]);
      } else if (d < 0.85 && hash(i, k + 500) < 0.2) {
        dots.push(mx, my);
      }
    }
  }
  return { solid, dots };
}

// ---------- label elevasi ----------

// Label di kontur indeks, miring mengikuti arah kontur, hanya di lereng yang cukup renggang
// supaya teks muat. Di zona terdefinisi labelnya angka elevasi; di zona belum berbentuk
// labelnya "?" (elevasi belum diketahui). Urutan kandidat diacak deterministik agar tersebar.
export function placeLabels(f: Field, contours: number[][], def: Float32Array): Label[] {
  const { width, height, cell } = f;
  const KNOWN_MAX = 9;
  const UNKNOWN_MAX = 5;
  const placed: Label[] = [];
  const levelOf: number[] = [];
  let known = 0;
  let unknown = 0;

  type Cand = { x: number; y: number; k: number; score: number };
  const cands: Cand[] = [];
  for (let k = INDEX_EVERY; k <= LEVELS; k += INDEX_EVERY) {
    const s = contours[k];
    for (let i = 0; i < s.length; i += 4) {
      cands.push({ x: (s[i] + s[i + 2]) / 2, y: (s[i + 1] + s[i + 3]) / 2, k, score: hash(i, k) });
    }
  }
  cands.sort((a, b) => a.score - b.score);

  for (const cd of cands) {
    if (known >= KNOWN_MAX && unknown >= UNKNOWN_MAX) break;
    if (cd.x < 40 || cd.y < 24 || cd.x > width - 40 || cd.y > height - 24) continue;

    const d = sample(f, def, cd.x, cd.y);
    const isKnown = d >= 0.6;
    const isUnknown = d >= 0.14 && d <= 0.42;
    if (isKnown ? known >= KNOWN_MAX : isUnknown ? unknown >= UNKNOWN_MAX : true) continue;

    let ok = true;
    for (let j = 0; j < placed.length; j++) {
      const dx = placed[j].x - cd.x;
      const dy = placed[j].y - cd.y;
      const min = levelOf[j] === cd.k ? 260 : 130;
      if (dx * dx + dy * dy < min * min) {
        ok = false;
        break;
      }
    }
    if (!ok) continue;

    const c = clamp(Math.round(cd.x / cell), 0, f.cols - 1);
    const r = clamp(Math.round(cd.y / cell), 0, f.rows - 1);
    const { gx, gy } = gradient(f, c, r, 2);
    const g = Math.hypot(gx, gy);
    if (g < 1e-6) continue;

    // Jarak antar kontur tetangga (px) = (1 / LEVELS) / gradien per px.
    const spacing = 1 / LEVELS / (g / cell);
    if (spacing < 15) continue;

    // Garis singgung tegak lurus gradien; balik agar teks tidak terbalik.
    let tx = -gy;
    let ty = gx;
    if (tx < 0) {
      tx = -tx;
      ty = -ty;
    }
    const angle = Math.atan2(ty, tx);
    if (Math.abs(angle) > 1.1) continue; // terlalu tegak untuk dibaca

    placed.push({
      x: cd.x,
      y: cd.y,
      angle,
      text: isKnown ? String(BASE_M + cd.k * INTERVAL_M) : "?",
      unknown: !isKnown,
    });
    levelOf.push(cd.k);
    if (isKnown) known++;
    else unknown++;
  }
  return placed;
}

// ---------- rute (A*) ----------

class MinHeap {
  private ids: number[] = [];
  private keys: number[] = [];
  get size() {
    return this.ids.length;
  }
  push(id: number, key: number) {
    let i = this.ids.length;
    this.ids.push(id);
    this.keys.push(key);
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (this.keys[p] <= this.keys[i]) break;
      this.swap(i, p);
      i = p;
    }
  }
  pop() {
    const top = this.ids[0];
    const lastId = this.ids.pop()!;
    const lastKey = this.keys.pop()!;
    if (this.ids.length) {
      this.ids[0] = lastId;
      this.keys[0] = lastKey;
      let i = 0;
      for (;;) {
        const l = 2 * i + 1;
        const r = l + 1;
        let m = i;
        if (l < this.ids.length && this.keys[l] < this.keys[m]) m = l;
        if (r < this.ids.length && this.keys[r] < this.keys[m]) m = r;
        if (m === i) break;
        this.swap(i, m);
        i = m;
      }
    }
    return top;
  }
  private swap(a: number, b: number) {
    [this.ids[a], this.ids[b]] = [this.ids[b], this.ids[a]];
    [this.keys[a], this.keys[b]] = [this.keys[b], this.keys[a]];
  }
}

const RELIEF_PX = 240; // seberapa "tinggi" medan terasa saat menghitung kemiringan
const STEEP = 3.5; // bobot penalti kemiringan; makin besar, makin banyak zig-zag (switchback)

// 8 arah biasa + 8 lompatan kuda: arah jalur lebih beragam sehingga tidak bergerigi.
const MOVES: [number, number][] = [
  [1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1],
  [2, 1], [2, -1], [-2, 1], [-2, -1], [1, 2], [1, -2], [-1, 2], [-1, -2],
];

// Jalur termurah antar dua titik px di grid kasar; lereng curam dihindari sehingga
// jalur menikung dan berkelok seperti jalur pendakian sungguhan.
function aStar(f: Field, step: number, sx: number, sy: number, gx: number, gy: number): [number, number][] {
  const nc = Math.ceil(f.width / step) + 1;
  const nr = Math.ceil(f.height / step) + 1;
  const n = nc * nr;
  const H = new Float32Array(n);
  for (let j = 0; j < nr; j++) for (let i = 0; i < nc; i++) H[j * nc + i] = heightAt(f, i * step, j * step);

  const start = clamp(Math.round(sy / step), 0, nr - 1) * nc + clamp(Math.round(sx / step), 0, nc - 1);
  const goal = clamp(Math.round(gy / step), 0, nr - 1) * nc + clamp(Math.round(gx / step), 0, nc - 1);
  const goalI = goal % nc;
  const goalJ = (goal / nc) | 0;

  const g = new Float32Array(n).fill(Infinity);
  const from = new Int32Array(n).fill(-1);
  const closed = new Uint8Array(n);
  const heap = new MinHeap();
  g[start] = 0;
  heap.push(start, 0);

  while (heap.size) {
    const cur = heap.pop();
    if (closed[cur]) continue;
    closed[cur] = 1;
    if (cur === goal) break;
    const ci = cur % nc;
    const cj = (cur / nc) | 0;

    for (const [di, dj] of MOVES) {
      const ni = ci + di;
      const nj = cj + dj;
      if (ni < 0 || nj < 0 || ni >= nc || nj >= nr) continue;
      const nxt = nj * nc + ni;
      if (closed[nxt]) continue;
      const dist = Math.hypot(di, dj) * step;
      const grade = (Math.abs(H[nxt] - H[cur]) * RELIEF_PX) / dist;
      const ng = g[cur] + dist * (1 + STEEP * grade * grade);
      if (ng < g[nxt]) {
        g[nxt] = ng;
        from[nxt] = cur;
        const h = Math.hypot(ni - goalI, nj - goalJ) * step;
        heap.push(nxt, ng + h);
      }
    }
  }

  const path: [number, number][] = [];
  for (let cur = goal; cur !== -1; cur = from[cur]) {
    path.push([(cur % nc) * step, ((cur / nc) | 0) * step]);
    if (cur === start) break;
  }
  return path.reverse();
}

// Titik terendah/tertinggi di sebuah jendela (pecahan lebar/tinggi kanvas).
function extreme(f: Field, x0: number, x1: number, y0: number, y1: number, high: boolean) {
  let best = high ? -Infinity : Infinity;
  let bx = 0;
  let by = 0;
  const s = f.cell * 2;
  for (let y = y0 * f.height; y <= y1 * f.height; y += s) {
    for (let x = x0 * f.width; x <= x1 * f.width; x += s) {
      const h = heightAt(f, x, y);
      if (high ? h > best : h < best) {
        best = h;
        bx = x;
        by = y;
      }
    }
  }
  return { x: bx, y: by, h: best };
}

// Douglas-Peucker: buang gerigi tangga dari grid; kelokan yang lebar tetap bertahan.
function simplify(pts: [number, number][], tol: number): [number, number][] {
  if (pts.length < 3) return pts;
  const [ax, ay] = pts[0];
  const [bx, by] = pts[pts.length - 1];
  const len = Math.hypot(bx - ax, by - ay) || 1;
  let worst = 0;
  let at = 0;
  for (let i = 1; i < pts.length - 1; i++) {
    const d = Math.abs((bx - ax) * (ay - pts[i][1]) - (ax - pts[i][0]) * (by - ay)) / len;
    if (d > worst) {
      worst = d;
      at = i;
    }
  }
  if (worst <= tol) return [pts[0], pts[pts.length - 1]];
  const left = simplify(pts.slice(0, at + 1), tol);
  const right = simplify(pts.slice(at), tol);
  return [...left.slice(0, -1), ...right];
}

// Chaikin: memotong sudut berulang kali sampai jalur grid kasar jadi kurva halus.
function chaikin(pts: [number, number][], rounds: number) {
  let p = pts;
  for (let k = 0; k < rounds; k++) {
    if (p.length < 3) break;
    const q: [number, number][] = [p[0]];
    for (let i = 0; i < p.length - 1; i++) {
      const [ax, ay] = p[i];
      const [bx, by] = p[i + 1];
      q.push([ax * 0.75 + bx * 0.25, ay * 0.75 + by * 0.25], [ax * 0.25 + bx * 0.75, ay * 0.25 + by * 0.75]);
    }
    q.push(p[p.length - 1]);
    p = q;
  }
  return p;
}

// Rute dari tepi yang belum berbentuk, lewat puncak di pusat, sampai tepi seberang.
export function findRoute(f: Field): Route {
  const step = Math.max(8, f.cell * 2);
  const start = extreme(f, 0.1, 0.26, 0.35, 0.7, false);
  const summit = extreme(f, 0.38, 0.62, 0.35, 0.65, true);
  const end = extreme(f, 0.74, 0.9, 0.35, 0.7, false);

  const leg1 = aStar(f, step, start.x, start.y, summit.x, summit.y);
  const leg2 = aStar(f, step, summit.x, summit.y, end.x, end.y);
  const summitNode = leg1.length - 1;
  // Marker puncak nanti di-snap ke titik rute terdekat, karena penghalusan memotong sudut simpul.
  const s1 = simplify(leg1, step * 0.9);
  const s2 = simplify(leg2, step * 0.9);
  const smooth = chaikin([...s1, ...s2.slice(1)], 3);

  // Resample tiap ~3px supaya animasi pejalan bergerak dengan kecepatan konstan.
  const SAMPLE = 3;
  const pts: number[] = [smooth[0][0], smooth[0][1]];
  const cum: number[] = [0];
  let acc = 0;
  let px = smooth[0][0];
  let py = smooth[0][1];
  let next = SAMPLE;
  for (let i = 1; i < smooth.length; i++) {
    const [x, y] = smooth[i];
    const seg = Math.hypot(x - px, y - py);
    while (seg > 0 && acc + seg >= next) {
      const t = (next - acc) / seg;
      pts.push(px + (x - px) * t, py + (y - py) * t);
      cum.push(next);
      next += SAMPLE;
    }
    acc += seg;
    px = x;
    py = y;
  }
  pts.push(px, py);
  cum.push(acc);

  // Jarak puncak di sepanjang rute = titik sampel terdekat dengan simpul puncak.
  const [sx, sy] = leg1[summitNode];
  let sIdx = 0;
  let sBest = Infinity;
  for (let i = 0; i < cum.length; i++) {
    const d = Math.hypot(pts[i * 2] - sx, pts[i * 2 + 1] - sy);
    if (d < sBest) {
      sBest = d;
      sIdx = i;
    }
  }

  return {
    pts: Float32Array.from(pts),
    cum: Float32Array.from(cum),
    length: acc,
    start: { x: pts[0], y: pts[1] },
    summit: {
      x: pts[sIdx * 2],
      y: pts[sIdx * 2 + 1],
      dist: cum[sIdx],
      meters: Math.round(BASE_M + heightAt(f, sx, sy) * LEVELS * INTERVAL_M),
    },
    end: { x: pts[pts.length - 2], y: pts[pts.length - 1] },
  };
}

// Posisi pada jarak d di sepanjang rute (pencarian biner pada jarak kumulatif).
export function pointAt(route: Route, d: number) {
  const { cum, pts } = route;
  let lo = 0;
  let hi = cum.length - 1;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (cum[mid] < d) lo = mid + 1;
    else hi = mid;
  }
  const i = Math.max(1, lo);
  const span = cum[i] - cum[i - 1] || 1;
  const t = clamp((d - cum[i - 1]) / span, 0, 1);
  return {
    x: pts[(i - 1) * 2] + (pts[i * 2] - pts[(i - 1) * 2]) * t,
    y: pts[(i - 1) * 2 + 1] + (pts[i * 2 + 1] - pts[(i - 1) * 2 + 1]) * t,
  };
}
