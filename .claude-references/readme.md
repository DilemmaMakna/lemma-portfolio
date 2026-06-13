# Lemma Design System

> *Creative-First, System-Oriented.*
> The design system for **Lemma**, an Indonesian venture studio (Bogor/IPB) building creative, data, and digital solutions for organizations, businesses, and student communities.

This project is the source of truth for Lemma's visual + interaction language: tokens, typography, color, the brand's signature decorative motifs (the **barrel pattern**, the **halo card**), the reusable component library, and a full landing-page UI kit. Consuming projects import `styles.css`, drop `_ds_bundle.js`, and use `window.LemmaDesignSystem_e5b9a2`.

---

## Brand at a glance

| | |
|---|---|
| **Name** | Lemma |
| **Tagline** | Creative-First, System-Oriented |
| **Slogan** | Empower your value, and bring it to the world |
| **Business model** | Venture Studio — Studio Services (Creative, Data, Digital) + Venture Building (NATA) |
| **Audience** | BEM / Himpunan / UKM organizations, startups, communities — Indonesia-wide |
| **Language** | Bahasa Indonesia (primary) · English (secondary, for UI affordances) |
| **PIC** | Lizzilmi (Chief Marketing) · WhatsApp +62 822-9747-7878 · IG @lemma.bercerita |

**Source materials referenced for this build:**
- `uploads/Desktop - 7@2x.png` — high-resolution Figma export of the landing page (2880×13532, the master visual reference).
- Brand notes (model, voice, services, portfolio) pasted into the project brief.

---

## Content fundamentals

**Voice.** Profesional tapi hangat — never corporate-stiff, never over-eager. Lemma writes as a **partner, not a vendor**. The point of view is collective ("kami / kita"), the reader is addressed second-person familiar ("kamu / Anda"). English ships only in chrome (button labels: "Start a project", "Selected work", "Work with us").

**Tone signatures.**
- System-aware: solutions are described as systems ("sistem yang utuh", "berkelanjutan"), not features.
- Honest about stage: no "terbaik / terbesar" claims. Lemma is early-stage and says so.
- Light, not jokey: humor is dry, not winking.

**Casing.** Sentence case everywhere except section eyebrows ("Identitas Visual — 2025") which are Title Case with em-dash + year. **No SHOUTY CAPS** anywhere. The signature display lockup mixes weights INSIDE a word (`**D**igital` `**P**artner`); titles capitalize the first letter of each noun-y word using a weight contrast rather than uppercase.

**Yes:**
- "Kami bantu menyusun sistemnya, bukan cuma desainnya."
- "Solusi yang baik bukan soal tampilan, tapi juga soal kemudahan dipakai dan keberlanjutan sistemnya."
- "Kami bekerja maksimal saat memahami masalah dahulu."

**No:**
- ❌ Heavy jargon without context ("AI-driven scalable cloud-native…")
- ❌ "PT Lemma" (not yet incorporated)
- ❌ "Terbaik di kelasnya"
- ❌ Emoji — Lemma never uses them
- ❌ Over-confident pricing or timeline claims without team confirmation

---

## Visual foundations

**Surface.** Lemma sits on **warm paper** — `--surface-paper` (#fff8f3) and `--beige-100` (#f7f5f1) — almost never plain white. The cream is what makes the orange feel quiet and confident rather than aggressive.

**Primary color.** A single signature orange `--orange-500` (#F97316), with a deep brown `--orange-900` (#46200A) as its closing chord. The "hero radial" `--grad-orange-radial` (D76300 → D72F00) is the load-bearing brand surface — used on the Prinsip section, the footer, and the immersive service-tile backdrops.

**Accents.** Three service-only colors — **magenta** (Kreatif), **teal** (Analitik), **olive** (Digital) — applied EXCLUSIVELY on full-bleed service tiles under a 68% black veil. They never appear on UI controls.

**Typography.** One family, **General Sans**, used everywhere. Three weights only: 300 (numerical chrome), 400 (body, defaults), 500 (medium — display + section titles). The signature display move is **mixed weight inside a single word**: the first letter is 500, the rest is 400. Section titles use this at 56 px; the hero at 196 px.

**Spacing.** 4 px base. Marketing sections use 64 px gutters, 42 px vertical rhythm. Page max-width 1440; content inner 1312.

**Radii.** Buttons 12 px; project cards 25 px; service tiles 0 (full-bleed); pills 999. Index badges are 8 (idle) / 9.6 (active).

**Backgrounds.** Three load-bearing motifs:
1. **Barrel pattern** — paired peach/cream vertical gradients tapering from edges (full height) to center (short). Renders behind any orange section.
2. **Halo card** — a tilted red rectangle behind an orange-gradient card with a 7 px translucent outer ring. The hero artwork.
3. **Footer wordmark** — oversized "Lemma" at 240+ px in deep brown-on-orange, with a vertical fade to `--orange-900`.

Full-bleed photography is rare; when used, it's warm and lightly grainy. The brand's "imagery" is mostly its own decorative gradients.

**Animation.** Calm and intentional, never showy.
- Hover: warm darken by one shade (`var(--orange-500)` → `var(--orange-600)`), 160 ms `--ease-out`.
- Press: scale 0.98, 80 ms.
- Section reveals: 680 ms fade-up, `--ease-emphasized`.
- The production site uses **GSAP** for hero reveals; the design system tokens (`--duration-*`, `--ease-*`) describe the curves.
- `prefers-reduced-motion` — entrance animations gate on the negative form.

**Borders / shadows.** Borders are hairlines (1 px `rgba(14,13,12,0.12)`). Shadows are rare — the only signature shadow is the **halo outer ring** on the hero card (`box-shadow: 0 0 0 7px rgba(249,124,22,0.15)`). Project cards are flat with a hairline outline; no drop shadow.

**Transparency / blur.** The nav uses a 2 px backdrop blur over a 10% white wash — barely there, but enough to separate from scrolling content. Service tiles use a 68% black veil (`--veil-service`) over decorative geometry — that's where the brand uses translucency boldly.

**Color vibe of imagery.** Warm. Orange-leaning. Even when project artwork is "cool" (a green or blue), it's photographed/treated to feel lit by the same warm sun.

---

## Iconography

Lemma uses a small set of **stroked line icons**, 1.5–1.7 px weight, 24 px (`StatPill` icons) or 16 px (button affordances). The brand does NOT use emoji, and does not use a CDN icon font.

What lives in `assets/icons/` and is referenced by the kit:
- `arrow-up-right.svg` — the +arrow on the IconButton companion (the most-used glyph)
- `chart.svg` — used on the "701K+" stat
- `projects.svg` — used on the "4 project" stat
- `shield.svg` — used on the "IPB" stat

**Substitution flag.** The four icons above are hand-authored to match the brand's stroke + corner style; they don't come from a public icon set. If the developer adds new icons, follow Lucide / Heroicons outline conventions (1.5 px stroke, round caps and joins, 24 px box). Do not mix fill + stroke styles. **Ask the user for additional icon files if a new glyph is needed** — never substitute emoji.

The brand mark itself lives at `assets/lemma-wordmark.svg` and `assets/lemma-mark.svg` (square favicon variant). The "barrel pattern" backdrop is also distributed as an asset (`assets/barrel-pattern.svg`) AND inlined inside `<BarrelBackdrop>` so it has no file dependency at runtime.

---

## Font substitution flag

`General Sans` is loaded from **Fontshare's free CDN** (`api.fontshare.com`). This is the official distribution channel — no substitution. If shipping fully offline, please grab `.woff2` files from <https://www.fontshare.com/fonts/general-sans> and update `tokens/fonts.css` to local `@font-face` declarations.

---

## Index

```
/
├── styles.css               ← consumer entry, list of @imports
├── tokens/
│   ├── fonts.css            ← Fontshare General Sans
│   ├── colors.css           ← neutrals · orange · cream · service accents · gradients
│   ├── typography.css       ← scale · weights · semantic role variables
│   ├── spacing.css          ← 4-base scale · radii · borders · layout heights
│   ├── effects.css          ← shadows · halo · veil · blur
│   └── motion.css           ← durations · easings · transforms
├── assets/
│   ├── lemma-wordmark.svg
│   ├── lemma-mark.svg
│   ├── barrel-pattern.svg
│   └── icons/{arrow-up-right, chart, projects, shield}.svg
├── components/
│   ├── buttons/             Button, IconButton
│   ├── navigation/          Navbar
│   ├── feedback/            Eyebrow, IndexBadge, IndexBadgeRow, StatPill
│   ├── cards/               ProjectCard, HaloCard
│   └── sections/            BarrelBackdrop, ServiceTile
├── guidelines/              foundation specimen cards (color · type · spacing · brand)
├── ui_kits/
│   └── website/             full Lemma landing-page recreation
├── readme.md                ← this file
├── SKILL.md                 ← Agent Skill cross-compat manifest
└── agents.md                ← Next.js + GSAP implementation guide
```

**Consumers** load `styles.css` once, drop `_ds_bundle.js` (compiled automatically at end of turn), and read components from `window.LemmaDesignSystem_e5b9a2`.

**Components available** (12): `Button`, `IconButton`, `Navbar`, `Eyebrow`, `IndexBadge`, `IndexBadgeRow`, `StatPill`, `ProjectCard`, `HaloCard`, `BarrelBackdrop`, `ServiceTile`. Each component directory has a `.prompt.md` with usage notes, a `.d.ts` props contract, and a `*.card.html` thumbnail.

**UI kits.** One kit at `ui_kits/website/` — a full landing-page recreation of the Lemma site. The starting point is the index.html.

---

## Caveats

- **General Sans loaded via CDN.** If you need it offline, download `.woff2` from Fontshare and swap `tokens/fonts.css` to local `@font-face` rules.
- **Project artwork is stand-in.** The four case-study covers in the website kit use colored placeholders, not the real client artwork — paste in the real cover images when you have them.
- **Service-tile decorations.** The rings/lozenges/blobs behind the magenta / teal / olive service tiles are simplified vectors, not pixel-matched to the Figma source.
- **No icon font yet.** Only four glyphs ship — if the brand grows the icon set, please supply files or pick a CDN library (Lucide is the closest stylistic match).
