import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";

const ROOT = "public/images/work-photos";
const OUT = "lib/content/work-photos.ts";
const MAX_W = 1440;
const QUALITY = 78;

const FOLDERS = {
  "BEM Fahutan": "bem-fahutan-langkah-bermakna",
  Jalansiswa: "jalansiswa",
  LPJ: "lpj-ormawa-ipb-2025",
  Nataku: "nata",
  SKHB: "himpro-hksa-serenata",
  Sosmed: "nata-launch-campaign",
  SIMORMAWA: "simormawa",
};

const hex = (n) => n.toString(16).padStart(2, "0");

for (const dir of fs.readdirSync(ROOT)) {
  const slug = FOLDERS[dir];
  if (slug && slug !== dir) fs.renameSync(path.join(ROOT, dir), path.join(ROOT, slug));
}

const manifest = {};
let before = 0;
let after = 0;

for (const slug of fs.readdirSync(ROOT).sort()) {
  const dir = path.join(ROOT, slug);
  if (!fs.statSync(dir).isDirectory()) continue;

  const sources = fs.readdirSync(dir).filter((f) => /\.(png|jpe?g)$/i.test(f)).sort();
  let n = fs.readdirSync(dir).filter((f) => f.endsWith(".webp")).length;
  for (const f of sources) {
    const src = path.join(dir, f);
    const dst = path.join(dir, `${String(++n).padStart(2, "0")}.webp`);
    before += fs.statSync(src).size;
    await sharp(src)
      .resize({ width: MAX_W, withoutEnlargement: true })
      .webp({ quality: QUALITY, effort: 6, smartSubsample: true })
      .toFile(dst);
    after += fs.statSync(dst).size;
    fs.rmSync(src);
  }

  const photos = [];
  for (const f of fs.readdirSync(dir).filter((x) => x.endsWith(".webp")).sort()) {
    const fp = path.join(dir, f);
    const { width, height } = await sharp(fp).metadata();
    const { dominant: d } = await sharp(fp).stats();
    photos.push({ src: `/images/work-photos/${slug}/${f}`, w: width, h: height, color: `#${hex(d.r)}${hex(d.g)}${hex(d.b)}` });
  }
  if (photos.length) manifest[slug] = photos;
}

const body = `// Dibuat oleh scripts/optimize-work-photos.mjs. Jangan diedit manual; jalankan ulang skripnya.
export type WorkPhoto = { src: string; w: number; h: number; color: string };

export const workPhotos: Record<string, WorkPhoto[]> = ${JSON.stringify(manifest, null, 2)};
`;
fs.writeFileSync(OUT, body);

if (before) console.log(`Compressed ${(before / 1048576).toFixed(1)} MB -> ${(after / 1048576).toFixed(1)} MB`);
console.log(`Manifest: ${Object.keys(manifest).length} projects -> ${OUT}`);
