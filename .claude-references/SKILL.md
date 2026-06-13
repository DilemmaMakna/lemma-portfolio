---
name: lemma-design
description: Use this skill to generate well-branded interfaces and assets for Lemma, either for production or throwaway prototypes/mocks/etc. Contains essential design guidelines, colors, type, fonts, assets, and UI kit components for prototyping.
user-invocable: true
---

Read the `readme.md` file within this skill, and explore the other available files.

If creating visual artifacts (slides, mocks, throwaway prototypes, etc), copy assets out and create static HTML files for the user to view. Link `styles.css` (which @imports the tokens), and either:
- For React surfaces: load `_ds_bundle.js` and read components from `window.LemmaDesignSystem_e5b9a2`, OR
- For plain HTML: use the CSS custom properties directly (`var(--orange-500)`, `var(--type-section-title)`, …) and rebuild small primitives inline.

If working on production code (Next.js + GSAP per the brand brief), copy the tokens into `app/globals.css` (or a CSS-module equivalent), pull the React components into your component library, and read the rules in `readme.md` and `agents.md` to become an expert in designing with this brand.

If the user invokes this skill without any other guidance, ask them what they want to build or design, ask some questions, and act as an expert designer who outputs HTML artifacts _or_ production code, depending on the need.

## Key things to remember

- **Color**: warm cream paper, never plain white. Signature orange `--orange-500`. Service accents (magenta / teal / olive) are reserved for the three full-bleed service tiles only — never for UI controls.
- **Type**: General Sans only. Three weights: 300 / 400 / 500. The signature display lockup is mixed weight inside one word — `**D**igital`, `**P**artner`.
- **Motion**: calm, intentional. 160 ms hover, 240 ms transitions, 680 ms section reveals. GSAP in production.
- **Voice**: Bahasa Indonesia primary, partner-not-vendor tone. No emoji. No "PT Lemma" (not yet incorporated).
- **Motifs**: the **barrel pattern** (`<BarrelBackdrop>`) and **halo card** (`<HaloCard>`) are signature — use them.
