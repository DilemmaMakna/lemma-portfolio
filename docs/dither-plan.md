# Dither plan

- Scope: PR 4, subtask 4.1. Planning only. No code and no image files yet.
- Design source: `.agents/DESIGN.md` (Indonesian) and `app/styles/tokens.css`.
- Goal: make the site feel more human in two quiet places, without changing the look.

## 1. Current Design

- Palette (dark, default): page `--bg` #0a0a0a, raised section `--bg-raised` #101010, cards `--surface` #151515, card hover `--surface-2` #1c1c1c.
- Text: `--fg` #f2f0eb (main), `--fg-muted` #a3a099 (body), `--fg-dim` #86837e (labels, metadata).
- Lines: `--line` #232323 and `--line-strong` #333333, 1px only.
- Accent: `--accent` #ff5a1f. DESIGN.md allows one accent only, for buttons, active states, status dots and key words. Long paragraphs never use it.
- Light theme: `html[data-theme="light"]` in `tokens.css` sets paper tones (`--bg` #f3f1ec, `--surface` #faf9f6, `--fg` #141414). The plan must work in both themes.
- Type: General Sans for headings and body, Geist Mono for labels, nav, numbers and tags. Pattern: small mono label above a large heading, for example `03 / LAYANAN`.
- Grid: 12 columns, gutter 1.5rem, margin `clamp(1.25rem, 4vw, 4rem)`, max width 1440px. Radius is 4px at most on cards and images.
- Imagery today: the home hero logo is an SVG loaded eagerly (LCP area). Work photos (`lib/work-photos.ts`) appear in `SelectedWork` and `WorkWall` with `alt=""`. Other visuals are procedural: `ui/PixelReveal.tsx` (already a Bayer 4x4 pixel reveal), `about/AboutHero` (`AsciiLemma`), `work/WorkWall` cover tiles (`AsciiCover`), `services/ServicesCta` (`AsciiFlow`). The `public/services/*.jpg` files are not referenced by any path in `components`, `app` or `lib`.
- Motion: GSAP reveals (opacity and `y` 24 to 0), Lenis smooth scroll, pixel mosaic on work hover. DESIGN.md says "meaning over motion".
- Language: the site already speaks in pixels, ASCII and mono labels. Dither fits this language if it stays small, quiet and dim.

## 2. Spots

### Spot A: Products, ARAH stealth card

- File and component: `components/home/Products.tsx`, the card where `stealth` is true (`article`, `min-h-[22rem]`, `bg-surface`, `border-line`).
- Current content: index `0N`, badge "Stealth", the name replaced by `Redacted` blocks, one muted description, tags, and a disabled ghost button. No image.
- Source photo: `public/services/strategy.jpg` (1376x768). It is a generic service image, not an ARAH asset. Confirm in 4.2 that the chosen crop shows no client or product detail.
- Dither style: Bayer 4x4 ordered dither, two tones. Lit dots are `#86837e` (`--fg-dim`, dark theme). Unlit pixels are transparent, so the card `--surface` shows through (the dark tone). No accent: stealth is a dim state, and the disabled button keeps its own styling.
- Output: `public/dithered/products-stealth.webp`, 640x640 (center crop), target under 30 KB.
- Placement: `next/image` absolutely positioned with `inset-0` and `object-cover`. Set `width={640} height={640}`, `sizes="(min-width: 768px) 50vw, 100vw"`, `loading="lazy"`, `alt=""` (decorative). The card gets `relative overflow-hidden`, and the text layer gets `relative` so it stays above the art. `Redacted` and all copy stay unchanged.
- Light and dark theme: one file for both. Dark theme uses opacity about 0.35. Light theme uses about 0.5 (one CSS rule in `app/globals.css`, tuned in 4.3). No second file and no blend mode.
- Why it is safe for Lighthouse: it is far below the first viewport, lazy, decorative, absolutely positioned inside a fixed-size card (no layout shift), tiny, and adds no JavaScript.

### Spot B: Home About (section 06), under the link

- File and component: `components/home/About.tsx`, left column (`lg:col-span-7`), below the ghost link button. Desktop has empty space under the button.
- Current content: section label, headline, lead paragraph, ghost button. Right column has three stats. No image.
- Source photo: `public/work-photos/bem-fahutan-langkah-bermakna/03.webp` (1080x1350). Changed in 4.2: `nata/01.webp` is a client app mockup with a full name, email and readable UI text, so it was dropped. The chosen photo is a teal line pattern with no text, no people and no client detail.
- Dither style: the same Bayer 4x4 two-tone style as Spot A (`#86837e` dots on transparent). Orange is not used.
- Output: `public/dithered/about-atmosphere.webp`, 960x384 (5:2 crop), target under 30 KB. Fallback if over: 800x320.
- Placement: a wrapper `relative mt-12 aspect-[5/2] overflow-hidden rounded-[4px] border border-line`, with `next/image` at `width={960} height={384}`, `sizes="(min-width: 1024px) 58vw, 100vw"`, `loading="lazy"`, `alt=""` (decorative). Use `unoptimized`, because Next image optimization would resample the dither pattern and blur it. The aspect box reserves the height. The wrapper gets `data-reveal` (fade only, no blur).
- Light and dark theme: same rule as Spot A.
- Why it is safe for Lighthouse: it is below the first viewport on every size, lazy, decorative, reserved by aspect ratio (CLS stays 0), and under 30 KB. It is not the LCP element.

### Excluded on purpose

- Hero on every page, and everything in the first viewport on mobile and desktop. This includes the home hero logo (`components/home/Hero.tsx`, eager with `fetchPriority="high"`), `about/AboutHero`, `services/ServicesHero`, and `work/WorkHero`. These are LCP candidates.
- Work photo tiles in `SelectedWork` and `WorkWall`. They are already real photos, and the first tiles may be LCP on `/work`.
- `WorkWall` cover tiles (`AsciiCover`), `ui/PixelReveal`, and `services/ServicesCta` (`AsciiFlow`). Replacing working ASCII or pixel art would change the style.

## 3. Non-goals

- No illustrations this round.
- No hero change: no change to the hero logo, hero dot grid or hero copy.
- No layout shift: every image sits in a box with fixed width and height or a reserved aspect ratio. No new section and no grid change.
- No new dependency. `sharp` is already in `package.json`. No new token unless 4.3 proves one is needed (then it goes to `app/styles/tokens.css`, per PR 6).
- No orange on dither art.
- No copy change. Copy comes only from the i18n messages, as DESIGN.md requires.

## 4. Script plan for 4.2

File: `scripts/dither-photos.mjs`, run with `node scripts/dither-photos.mjs`.

Input list (constant `JOBS` in the script):

| Input                                                     | Output                                  | Size    | Crop             |
| --------------------------------------------------------- | --------------------------------------- | ------- | ---------------- |
| `public/services/strategy.jpg`                            | `public/dithered/products-stealth.webp` | 640x640 | cover, center    |
| `public/work-photos/bem-fahutan-langkah-bermakna/03.webp` | `public/dithered/about-atmosphere.webp` | 960x384 | cover, attention |

Steps for each job:

1. `sharp(src).resize(w, h, { fit: "cover", position })`, then `.grayscale().normalise()`, then read raw single-channel pixels.
2. Bayer 4x4 threshold matrix. For pixel (x, y): `lit = value / 255 > (BAYER[y % 4][x % 4] + 0.5) / 16`.
3. Build raw RGBA. Lit pixels: `#86837e`, alpha 255. Unlit pixels: alpha 0.
4. `sharp(raw, { raw: { width, height, channels: 4 } }).webp({ lossless: true, effort: 6 }).toFile(out)`.
5. Create `public/dithered/` if missing. Overwrite on each run (idempotent).
6. Print each output size in KB. Exit with a non-zero code if any file is over 30 KB.

Verify in 4.2: `node scripts/dither-photos.mjs`, then `ls -l public/dithered` (both files exist, each under 30 KB), then a visual check in dev on both pages.
