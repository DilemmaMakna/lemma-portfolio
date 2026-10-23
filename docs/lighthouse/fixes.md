# Lighthouse failures to fix

Fresh run: 2026-10-23, `scripts/lighthouse.sh` (next build, next start, Lighthouse on 5 pages x mobile and desktop).
Raw JSON: `docs/lighthouse/raw/` (gitignored). Lab runs use a fresh profile, so the intro plays on every run and the default dark theme is audited.
Contrast values are read from the raw `explanation` strings. Token contrast values were computed with the WCAG formula.

## Scores (fresh run)

| page-form        | Perf | A11y | BP  | SEO | LCP   | CLS   | TBT   |
| ---------------- | ---- | ---- | --- | --- | ----- | ----- | ----- |
| home-mobile      | 86   | 95   | 100 | 100 | 4.17s | 0.000 | 73ms  |
| about-mobile     | 89   | 94   | 100 | 100 | 3.66s | 0.000 | 86ms  |
| services-mobile  | 87   | 90   | 100 | 100 | 3.85s | 0.000 | 128ms |
| work-mobile      | 82   | 90   | 100 | 100 | 4.83s | 0.000 | 40ms  |
| contact-mobile   | 92   | 95   | 100 | 100 | 3.41s | 0.000 | 14ms  |
| home-desktop     | 98   | 95   | 100 | 100 | 1.03s | 0.000 | 0ms   |
| about-desktop    | 100  | 94   | 100 | 100 | 0.82s | 0.000 | 0ms   |
| services-desktop | 99   | 90   | 100 | 100 | 0.83s | 0.000 | 0ms   |
| work-desktop     | 94   | 90   | 100 | 100 | 1.57s | 0.000 | 0ms   |
| contact-desktop  | 100  | 95   | 100 | 100 | 0.82s | 0.000 | 0ms   |

Against `baseline.md`: A11y and desktop Perf are unchanged. Mobile Perf moved 1 to 3 points down (home 88 to 86, services 90 to 87, work 83 to 82, contact 93 to 92). Services-mobile TBT rose from 62ms to 128ms; not investigated.
BP and SEO are 100 on every page, so they have no failures to fix.

## Accessibility

### color-contrast (fails on all 10 runs)

Two separate causes. Cause A is static and comes from one token. Cause B is the reveal animation caught mid-transition.

**A. Static: dark `--fg-dim` is too dim.** `app/styles/tokens.css:9` sets `--fg-dim: #6e6b65`. On the sampled surfaces it gives 3.35 to 3.73:1 (needs 4.5:1). `#858178` gives 4.58 on `#211511`, 4.70 on `#151515` and 4.90 on `#101010`.

Failing nodes (dark theme, unless noted):

- `components/home/Footer.tsx` (every page): phone link `div.flex > div.mt-8 > div.mono > a` "+62 (851) 4492 2167" 3.58 on `#101010`; column headings `h4.mono` "NAVIGATION" 3.58 and "PRODUCTS" 3.35 on `#211511`; "STEALTH" `span.mono` 3.35 and 3.58; copyright `span` 3.35; year "2026" 3.35; `button#footer-lang-id` "[ID]" 3.35.
- `components/work/WorkWall.tsx` (work-mobile, work-desktop): "№ 01" 3.58, "№ 07" 3.72, "REDACTED UNTIL READY" 3.72, "BRAND & VISUAL IDENTITY" `span.truncate` 3.58.
- Work index header "PROJECT", "CATEGORY", "YEAR", "STATUS" `span` 3.72 (work-desktop only; `w.index.cols` copy in `lib/work.ts`).
- `// 03 / SERVICES` `span.text-fg-dim` 3.43 on `#151515` (services; eyebrow from `lib/services.ts:112`). "WHAT YOU RECEIVE" `p.mono` 3.43 at 11px (services-desktop).
- Contact form labels `span.mono.text-xs.text-fg-dim` "NAME" etc.: 2.91 (mobile) and 3.15 (desktop) on `#0f0f0f`. Source: `components/ui/ContactForm.tsx:72-84`. The form also sits under a `data-intro="fade"` wrapper (`components/contact/ContactPage.tsx:93`), so part of the gap is the fade.
- services-desktop `div.absolute > div.space-y-1.5 > p.flex > span.truncate` "Brand & Visual Identity": fg `#403f3d` on `#151515` = 1.73. Looks like a faded preview; not traced further.

**B. Reveal artifacts (state at audit time, not the final design).**

- `button#nav-cta` "START A PROJECT" (`components/nav/NavPill.tsx:148`, `.btn-primary` in `app/globals.css:186-189`): fg/bg pairs are near-identical (1.01 contact-desktop, 1.63 work-mobile, 3.75 about-mobile, 4.46 about-desktop). The wrapper is `data-intro="fade"` (`NavPill.tsx:141`), so the button is still fading in. Final pair `#0a0a0a` on `#ff5a1f` is 6.35:1 and passes.
- Services intro lines `p#services-intro > div.intro-line` and spans "UX, HCI, data," and "one flow" (1.12 to 1.22:1). Lines start at `opacity: 0.1` (`components/services/ServicesIntro.tsx:80`) and only reveal on scroll. Lighthouse does not scroll.

### heading-order (fails on all 10 runs)

- Node: `div.relative > div.grid > div > h4.mono` "NAVIGATION", `components/home/Footer.tsx:175`. It is the first `h4` after an `h2` (on home, `components/home/ContactCta.tsx:20`), so the level jumps h2 to h4. The other two footer `h4`s (`Footer.tsx:195`, `:214`) are not flagged.
- Fix: change the three footer column headings to `h3`. No bare `h3` or `h4` rules exist in `app/globals.css` or `app/styles/tokens.css`, so the look should not change.

### aria-prohibited-attr (services-mobile, services-desktop)

- Node: `p#services-intro` (`components/services/ServicesIntro.tsx:122-123`). Attribute: `aria-label` (full paragraph text), on a `<p>` with no role.
- Cause: GSAP SplitText defaults to `aria: "auto"`, which writes `aria-label` from the element's text (`node_modules/gsap/src/SplitText.ts:373`).
- Fix: pass `aria: "none"` in the `SplitText.create` call (`ServicesIntro.tsx`, around line 62). With `"none"`, SplitText adds neither `aria-label` nor `aria-hidden` (`SplitText.ts:149`), so the text is read once.

### target-size (work-mobile, work-desktop)

- Nodes: category chips `div.wrap > div.mb-6 > div.flex > button.mono` "BRAND & VISUAL IDENTITY 5" and "UX, HCI & PRODUCT DESIGN 3". Each is 31px tall and is partly covered by project tiles.
- Overlapping targets (sub-items): `button.group` tiles "01 · 2025 LPJ Ormawa IPB 2025" and "03 · 2025 JalanSiswa". Smallest gap: 12px (needs 24px).
- Fix: give the chip row `relative z-10` in `components/work/WorkExplorer.tsx` (chip row near line 52), or add spacing above the tile grid. Keep the 44px touch rule from PR 7 in mind.

### label-content-name-mismatch (work-mobile, work-desktop)

- Nodes (three per page): project tiles `button.group` with `aria-label` that drops the visible text. Examples: `aria-label="LPJ Ormawa IPB 2025. A report read for its content."` while the visible text starts "№ 01 2025 LPJ Ormawa IPB 2025"; `JalanSiswa`, `Himpro HKSA SKHB IPB...`, `NATA...`, `BEM FAHUTAN...`, and the cover tile "Lemma Website".
- Source: `components/work/WorkWall.tsx:74` builds `label = "${p.name}. ${p.hook}"`; it is applied at lines 81, 107 and 130.
- Fix: remove `aria-label` on those buttons so the visible text forms the name, or start the label with the visible text.

## Performance

### LCP element and breakdown (fresh run)

| page             | LCP element (source)                           | LCP   | Render delay | TTFB |
| ---------------- | ---------------------------------------------- | ----- | ------------ | ---- |
| home-mobile      | `p.lead` hero copy (`Hero.tsx:61`)             | 4.17s | 2011ms       | 5ms  |
| home-desktop     | `img` hero logo (`Hero.tsx:51`)                | 1.03s | 1889ms       | 3ms  |
| about-mobile     | `button#nav-cta` (`NavPill.tsx:148`)           | 3.66s | 2301ms       | 7ms  |
| about-desktop    | ASCII `pre` in the about hero                  | 0.82s | 2296ms       | 3ms  |
| services-mobile  | `p.lead` (`ServicesHero.tsx:213`)              | 3.85s | 1983ms       | 5ms  |
| services-desktop | h1 word "disciplines," (`ServicesHero.tsx:35`) | 0.83s | 1139ms       | 4ms  |
| work-mobile      | `h1#work-hero-title` (`WorkHero.tsx:30`)       | 4.83s | 1999ms       | 9ms  |
| work-desktop     | `h1#work-hero-title`                           | 1.57s | 2025ms       | 4ms  |
| contact-mobile   | `h1#contact-page-title` (`ContactPage.tsx:38`) | 3.41s | 1972ms       | 7ms  |
| contact-desktop  | `h1#contact-page-title`                        | 0.82s | 1964ms       | 3ms  |

The subparts in the raw `lcp-breakdown-insight` do not add up to the LCP value (home-mobile: 5 + 2011ms vs 4172ms; desktop render delays exceed the whole LCP). Treat render delay as indicative until a trace confirms it.

### Render-blocking

- `/_next/static/chunks/14-l75y9kzx79.css` (14.6 KB): 154ms wasted on home-mobile, 302ms about-mobile, 153ms services-mobile, 152ms work-mobile, 301ms contact-mobile. Not listed on desktop.
- Critical chain on home-mobile: `/` (17ms, 15.6 KB) with two children, `/manifest.webmanifest` (68ms, 873 B) and the CSS chunk (24ms).

### Unused and legacy JavaScript

- Unused JS: only one URL is listed on every run, `/_next/static/chunks/1s37vwjm584j-.js` (72.0 KB, 25 to 27 KB unused). No other URL crosses the audit threshold.
- Legacy JS: the same chunk, about 14 KB of wasted legacy polyfills, on all pages.

### Forced reflow

- home and services only: `1s37vwjm584j-.js:1` (37 to 41ms) and `1yjlxtldiyyjp.js:3` (17 to 25ms).

### Image delivery

- work-desktop: 1,111 KB wasted, all in WorkWall tiles (`div.will-change-transform > div.flex > button.group > img.h-auto`). Largest: `/work-photos/nata-launch-campaign/03.webp` (138 KB) and `/work-photos/lpj-ormawa-ipb-2025/03.webp` (126 KB).
- home-desktop: 524 KB wasted, the largest `/work-photos/bem-fahutan-langkah-bermakna/05.webp` (246 KB). home-mobile: 197 KB, same file.

### Does the boot class explain the mobile render delay?

Mostly yes. First-visit chain:

1. `app/layout.tsx:58` boot script adds `is-booting`. On a first visit (no `sessionStorage` `lemma-intro`), line 59 also adds `is-loading`.
2. `app/globals.css:285`: `html.is-booting #page { visibility: hidden }`. Nothing on the page paints until React runs. It is removed in `components/Providers.tsx:23`, after `LocaleProvider` sets `ready` in a layout effect (`components/LocaleProvider.tsx:42-50`). So the page waits for the 72 KB chunk to run.
3. `app/globals.css:282`: `html.is-loading [data-intro] { opacity: 0 }`. The LCP copy on every page is `data-intro="fade"` (see the table above).
4. `lib/intro.ts:37-47`: the preloader slides out at 0.85s (0.7s long); words start at 1.0s; fades start at 1.5s (1.0s long, expo.out, blur plus opacity from 0).

So on a first visit the copy cannot show before about 1.5s after the intro starts, plus hydration time. The mobile render delay of 1.96 to 2.30s matches that schedule plus slower mobile hydration. This explains most of the mobile LCP gap (3.4 to 4.8s against about 1s on desktop).
Caveats: the desktop numbers (LCP 0.8 to 1.0s) do not fit the same schedule, so confirm with a trace before committing. Repeat visits skip `is-loading`, so these lab numbers overstate the repeat-visit delay (not measured).

## Ranked fixes

Estimates come from the raw audits. They are not measured. Mobile Perf and A11y are the lab scores.

1. **Token: dark `--fg-dim` to `#858178`** (`app/styles/tokens.css:9`). Fixes the static color-contrast failures on all 10 pages. Est. A11y +3 to +6 per page. Visible change: dim text is lighter. This is within the 3.4 contrast-tweak scope. Light theme `--fg-dim` (`tokens.css:100`, `#8a867e`, 3.21:1 on `#f3f1ec`) needs a darker value too; the lab run did not test light, so verify separately.
2. **Intro gates the LCP copy** (`lib/intro.ts:37-47`, `app/globals.css:282`). Start the copy fades with the preloader, or shorten the 1.0s and 1.5s waits, or keep the hero LCP element out of `data-intro` on first paint. Est. mobile LCP -1.5 to -2s, mobile Perf +5 to +10 on home, about, services, work and contact. **Needs lead decision**: it changes the intro animation. Confirm with a trace first (see the caveat above).
3. **Footer headings h4 to h3** (`components/home/Footer.tsx:175`, `:195`, `:214`). Fixes heading-order on all 10 runs. Est. A11y +1 to +2 per page. No visual change expected.
4. **Work tiles and chips** (`components/work/WorkWall.tsx:81`, `:107`, `:130`; chip row in `components/work/WorkExplorer.tsx` near line 52). Drop the `aria-label` on tiles, and raise the chip row above the tiles. Fixes label-content-name-mismatch and target-size on work. Est. work A11y +3 to +5.
5. **Services SplitText `aria: "none"`** (`components/services/ServicesIntro.tsx`, SplitText.create around line 62). Fixes aria-prohibited-attr on services. Est. services A11y +1 to +2.
6. **Work photo sizes** (`public/work-photos/**`, `components/work/WorkWall.tsx`). Resize the webp files or pass real `sizes`. Est. work-desktop Perf +2 to +4. **Needs file list update**: `public/` is not in PR 3's files list.
7. **Services intro starts at opacity 0.1** (`components/services/ServicesIntro.tsx:80-86`). Fixes the services intro contrast failures. Est. services A11y +1 to +3. **Needs lead decision**: it changes the scroll reveal.
8. **Legacy and unused JS in `1s37vwjm584j-.js`**: set a modern browserslist (`package.json`, outside PR 3's files list) to drop the 14 KB of polyfills. Est. Perf +1. Splitting the unused 27 KB is a larger change; skip for now.

Skipped: render-blocking CSS (14.6 KB, est. +1 mobile, not worth it) and forced reflow (not scored).
