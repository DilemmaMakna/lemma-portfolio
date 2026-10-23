// Ubah foto jadi dua warna (Bayer 4x4 ordered dither) untuk aset statis di public/dithered.
//
//   node scripts/dither-photos.mjs
//
// - Tiap job: crop cover -> grayscale -> normalise -> threshold Bayer -> RGBA (tinta #86837e atau transparan).
// - Output WebP lossless. File ditimpa setiap jalan, jadi aman dijalankan ulang.
// - Exit 1 kalau ada file di atas 30 KB.
import sharp from "sharp";
import fs from "node:fs";

const OUT_DIR = "public/dithered";
const MAX_BYTES = 30 * 1024;
const INK = { r: 0x86, g: 0x83, b: 0x7e };
const BAYER = [
  [0, 8, 2, 10],
  [12, 4, 14, 6],
  [3, 11, 1, 9],
  [15, 7, 13, 5],
];

const JOBS = [
  {
    src: "public/services/strategy.jpg",
    out: `${OUT_DIR}/products-stealth.webp`,
    w: 640,
    h: 640,
    position: "center",
  },
  {
    src: "public/work-photos/bem-fahutan-langkah-bermakna/03.webp",
    out: `${OUT_DIR}/about-atmosphere.webp`,
    w: 960,
    h: 384,
    position: "attention",
  },
];

async function dither({ src, out, w, h, position }) {
  const { data, info } = await sharp(src)
    .resize(w, h, { fit: "cover", position })
    .grayscale()
    .normalise()
    .raw()
    .toBuffer({ resolveWithObject: true });
  if (info.channels !== 1) throw new Error(`${src}: expected 1 channel, got ${info.channels}`);

  const px = Buffer.alloc(w * h * 4);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = y * w + x;
      const lit = data[i] / 255 > (BAYER[y % 4][x % 4] + 0.5) / 16;
      px.set([INK.r, INK.g, INK.b, lit ? 255 : 0], i * 4);
    }
  }

  await sharp(px, { raw: { width: w, height: h, channels: 4 } })
    .webp({ lossless: true, effort: 6 })
    .toFile(out);
  return fs.statSync(out).size;
}

fs.mkdirSync(OUT_DIR, { recursive: true });
let over = false;
for (const job of JOBS) {
  const size = await dither(job);
  console.log(`${job.out}: ${(size / 1024).toFixed(1)} KB`);
  if (size > MAX_BYTES) over = true;
}
if (over) {
  console.error(`Over ${MAX_BYTES / 1024} KB limit`);
  process.exit(1);
}
