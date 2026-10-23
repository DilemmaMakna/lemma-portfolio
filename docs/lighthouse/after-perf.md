# Lighthouse results after optimization

- Date: 2026-10-23
- Command: `scripts/lighthouse.sh` (same as `baseline.md`)
- Raw JSON: `docs/lighthouse/raw/` (gitignored)
- One lab run with a fresh profile. Mobile scores move by a few points between runs, so small changes are not conclusive.

## 1. Scores (this run)

| page-form        | Performance | Accessibility | Best Practices | SEO | LCP   | CLS   | TBT   |
| ---------------- | ----------- | ------------- | -------------- | --- | ----- | ----- | ----- |
| home-mobile      | 86          | 100           | 100            | 100 | 4.17s | 0.000 | 67ms  |
| about-mobile     | 89          | 96            | 100            | 100 | 3.65s | 0.000 | 82ms  |
| services-mobile  | 87          | 96            | 100            | 100 | 3.84s | 0.000 | 121ms |
| work-mobile      | 85          | 92            | 100            | 100 | 4.27s | 0.000 | 49ms  |
| contact-mobile   | 91          | 96            | 100            | 100 | 3.41s | 0.000 | 14ms  |
| home-desktop     | 98          | 100           | 100            | 100 | 1.02s | 0.000 | 0ms   |
| about-desktop    | 100         | 100           | 100            | 100 | 0.82s | 0.000 | 0ms   |
| services-desktop | 99          | 96            | 100            | 100 | 0.82s | 0.000 | 0ms   |
| work-desktop     | 99          | 92            | 100            | 100 | 0.98s | 0.000 | 0ms   |
| contact-desktop  | 100         | 96            | 100            | 100 | 0.82s | 0.000 | 0ms   |

Which categories reach 100:

- Best Practices: 100 on all 10 pages.
- SEO: 100 on all 10 pages.
- Accessibility: 100 on 3 of 10 pages (home mobile, home desktop, about desktop). It is 92 to 96 on the other pages.
- Performance: 100 on 2 of 10 pages (about desktop, contact desktop). It is 98 to 99 on the other desktop pages and 85 to 91 on mobile.

Not all four categories are at 100. Lighthouse 100 on all four categories is not reached on every page.

## 2. Baseline (first run) vs this run

| page-form        | Perf base | Perf now | A11y base | A11y now | LCP base | LCP now |
| ---------------- | --------- | -------- | --------- | -------- | -------- | ------- |
| home-mobile      | 88        | 86       | 95        | 100      | 3.87s    | 4.17s   |
| home-desktop     | 98        | 98       | 95        | 100      | 1.01s    | 1.02s   |
| about-mobile     | 90        | 89       | 94        | 96       | 3.59s    | 3.65s   |
| about-desktop    | 100       | 100      | 94        | 100      | 0.82s    | 0.82s   |
| services-mobile  | 90        | 87       | 90        | 96       | 3.61s    | 3.84s   |
| services-desktop | 99        | 99       | 90        | 96       | 0.84s    | 0.82s   |
| work-mobile      | 83        | 85       | 90        | 92       | 4.62s    | 4.27s   |
| work-desktop     | 94        | 99       | 90        | 92       | 1.56s    | 0.98s   |
| contact-mobile   | 93        | 91       | 95        | 96       | 3.24s    | 3.41s   |
| contact-desktop  | 100       | 100      | 95        | 96       | 0.78s    | 0.82s   |

- Accessibility rose on all 10 pages, by 1 to 6 points.
- Mobile Performance is lower on 4 of 5 pages (by 1 to 3 points) and higher on work mobile (by 2 points).
- Mobile LCP did not improve. It is slower on 4 of 5 pages and faster on work mobile (4.62s to 4.27s).
- Desktop work improved most: LCP 1.56s to 0.98s and Performance 94 to 99.
- Task 3.6 (shorter first-visit intro wait) gave no gain and was reverted. The intro timing is the same as in the baseline.

## 3. Remaining Gaps

Every audit below 1 in Performance or Accessibility, per page. Best Practices and SEO have no audits below 1 on any page. Insight audits are included. An audit can be below 1 while the category still rounds to 100 (about desktop and contact desktop Performance).

### 3.1 Audits below 1, per page

**home-mobile** (Performance 86, Accessibility 100)

- Performance: `largest-contentful-paint` 0.45, `total-blocking-time` 0.99, `speed-index` 0.99, `forced-reflow-insight` 0, `image-delivery-insight` 0.5 (about 197 KiB), `legacy-javascript-insight` 0, `network-dependency-tree-insight` 0, `render-blocking-insight` 0, `interactive` 0.85, `max-potential-fid` 0.77, `unused-javascript` 0.
- Node for `image-delivery-insight`: `div.pointer-events-none > div.overflow-hidden > div.relative > img.object-cover` (lazy tile, alt "Brand & Visual Identity").

**home-desktop** (Performance 98, Accessibility 100)

- Performance: `largest-contentful-paint` 0.94, `speed-index` 0.99, `forced-reflow-insight` 0, `image-delivery-insight` 0.5 (about 96 KiB), `legacy-javascript-insight` 0.5, `network-dependency-tree-insight` 0, `render-blocking-insight` 0.5, `unused-javascript` 0.5.
- Node for `image-delivery-insight`: `div.pointer-events-none > div.overflow-hidden > div.relative > img.object-cover` (lazy tile).

**about-mobile** (Performance 89, Accessibility 96)

- Performance: `largest-contentful-paint` 0.59, `total-blocking-time` 0.99, `legacy-javascript-insight` 0, `network-dependency-tree-insight` 0, `render-blocking-insight` 0 (about 410 ms), `interactive` 0.91, `max-potential-fid` 0.93, `unused-javascript` 0.
- Accessibility: `color-contrast` 0. Node: `header.pointer-events-none > div.mx-auto > div.pointer-events-auto > button#nav-cta` ("START A PROJECT", 3.69:1).

**about-desktop** (Performance 100, Accessibility 100)

- Performance: `largest-contentful-paint` 0.98, `legacy-javascript-insight` 0.5, `network-dependency-tree-insight` 0, `render-blocking-insight` 0, `unused-javascript` 0.5.

**services-mobile** (Performance 87, Accessibility 96)

- Performance: `largest-contentful-paint` 0.54, `total-blocking-time` 0.97, `speed-index` 0.94, `forced-reflow-insight` 0, `legacy-javascript-insight` 0, `network-dependency-tree-insight` 0, `render-blocking-insight` 0 (about 130 ms), `interactive` 0.89, `max-potential-fid` 0.82, `unused-javascript` 0.
- Accessibility: `color-contrast` 0 on about 10 nodes, all in the services intro: `p#services-intro > div.intro-line` and its phrase spans (1.12 to 1.22:1).

**services-desktop** (Performance 99, Accessibility 96)

- Performance: `largest-contentful-paint` 0.98, `speed-index` 0.98, `forced-reflow-insight` 0, `legacy-javascript-insight` 0.5, `network-dependency-tree-insight` 0, `render-blocking-insight` 0.5, `unused-javascript` 0.5.
- Accessibility: `color-contrast` 0 on two nodes `div.absolute > div.space-y-1.5 > p.flex > span.truncate` ("Brand & Visual Identity", 1.73:1), and on the same services intro nodes as mobile (1.12 to 1.22:1).

**work-mobile** (Performance 85, Accessibility 92)

- Performance: `largest-contentful-paint` 0.43, `speed-index` 0.96, `legacy-javascript-insight` 0, `network-dependency-tree-insight` 0, `render-blocking-insight` 0 (about 100 ms), `interactive` 0.84, `max-potential-fid` 0.88, `unused-javascript` 0.
- Accessibility: `color-contrast` 0. Node: `button#nav-cta` (2.26:1). `target-size` 0 on two nodes `div.wrap > div.mb-6 > div.relative > button.relative` (category chips, "partially obscured").

**work-desktop** (Performance 99, Accessibility 92)

- Performance: `largest-contentful-paint` 0.95, `speed-index` 0.99, `legacy-javascript-insight` 0.5, `network-dependency-tree-insight` 0, `render-blocking-insight` 0.5, `unused-javascript` 0.5.
- Accessibility: `color-contrast` 0 on `button#nav-cta` (4.19:1). `target-size` 0 on the same two chip nodes as mobile.

**contact-mobile** (Performance 91, Accessibility 96)

- Performance: `largest-contentful-paint` 0.66, `speed-index` 0.99, `legacy-javascript-insight` 0, `network-dependency-tree-insight` 0, `render-blocking-insight` 0 (about 280 ms), `interactive` 0.93, `unused-javascript` 0.
- Accessibility: `color-contrast` 0 on `button#nav-cta` (1.01:1) and on four form label spans `div.rounded-[4px] > form.mt-8 > label.flex > span.mono` ("NAME" and others, 3.94:1).

**contact-desktop** (Performance 100, Accessibility 96)

- Performance: `largest-contentful-paint` 0.98, `legacy-javascript-insight` 0.5, `network-dependency-tree-insight` 0, `render-blocking-insight` 0 (about 80 ms), `unused-javascript` 0.5.
- Accessibility: `color-contrast` 0 on `button#nav-cta` (1.01:1) and on the same four form label spans (4.35:1).

### 3.2 Causes and status

**Largest Contentful Paint (all 5 mobile pages, score 0.43 to 0.66).** First-visit render delay of about 2 s. The HTML is hidden by `html.is-booting #page { visibility: hidden }` in `app/globals.css` until React hydrates. The LCP copy is `data-intro="fade"`, so it stays hidden until the intro fades in (`lib/intro.ts`). Task 3.6 showed that shortening the fade by 0.4 s changes nothing, so hydration is the gate, not the intro timing. Removing the gate risks a flash of unstyled or untranslated content before the preloader mounts. That needs a browser-verified experiment and a design decision. Status: open. Mobile LCP elements are hero copy or the page title (see the element table in `fixes.md`; not re-extracted in this run).

**Total Blocking Time, Interactive, Max Potential First Input Delay, Speed Index (mobile).** Scores 0.77 to 0.99. Main-thread work from hydrating the 72 KB shared chunk. Status: open, same root cause as LCP.

**Render-blocking requests (all pages, 80 to 410 ms est.).** Render-blocking CSS chunk `/_next/static/chunks/14-l75y9kzx79.css` (14.6 KB), loaded in the head. Not reduced. Earlier estimate was about +1 point on mobile, judged not worth it. Status: skipped.

**Legacy JavaScript (all pages, about 14 KiB est.).** Polyfills in `/_next/static/chunks/1s37vwjm584j-.js`. Cause: no `browserslist` in `package.json`. Not applied, because `package.json` is outside the PR 3 file list. Status: open.

**Unused JavaScript (all pages, 25 to 27 KiB est.).** Same 72 KB shared chunk. Splitting it is a larger change. Status: skipped.

**Network dependency tree (score 0 on all 10 pages).** Not traced in this pass. The earlier critical chain was HTML, then the CSS chunk and the web manifest (see `fixes.md`). Status: not investigated.

**Forced reflow (home and services, both form factors, not scored).** `1s37vwjm584j-.js:1` and `1yjlxtldiyyjp.js:3` (see `fixes.md`). Status: skipped.

**Image delivery (home mobile and desktop).** One lazy home tile image is larger than its display size (est. 197 KiB mobile, 96 KiB desktop). Images in `public/` are outside the PR 3 file list. Work desktop no longer has this finding, so the `sizes` change in task 3.5 helped there. Status: open for home.

**Color contrast, navigation CTA (`button#nav-cta`, about mobile, work mobile and desktop, contact mobile and desktop; 1.01 to 4.19:1).** The button sits in the `data-intro="fade"` wrapper (`components/nav/NavPill.tsx:141`), so the audit likely caught it mid-fade. The settled pair `#0a0a0a` on `#ff5a1f` is 6.35:1 and passes. Not confirmed in this run: a check with the intro finished is needed. Status: likely a measurement artifact, not verified.

**Color contrast, services intro (services mobile and desktop, 1.12 to 1.22:1).** Intro lines start at `opacity: 0.1` (`components/services/ServicesIntro.tsx:80`) and reveal on scroll. Lighthouse does not scroll, so the audit sees the start state. Fixing it changes the scroll reveal, so it needs a design decision. Status: open, needs decision.

**Color contrast, services "Brand & Visual Identity" (services desktop, 1.73:1).** Probably a faded preview element. Not traced. Status: open.

**Color contrast, contact form labels (contact mobile 3.94:1, desktop 4.35:1).** The token `--fg-dim` (`app/styles/tokens.css:9`, `#86837e`) computes to 4.7 to 5.2:1 on the dark surfaces, so the cause is probably the `data-intro` fade on the form (`components/contact/ContactPage.tsx:93`) or a different surface. Not verified. Status: open, not verified.

**Opacity variants still below 4.5:1.** `text-fg-dim/70` in `components/ui/AsciiStage.tsx:184` and `text-fg-dim/60` in `components/services/ServicesHero.tsx:305`. Not flagged by Lighthouse in this run. Status: open.

**Target size, work category chips (work mobile and desktop).** Two chip buttons are still reported as partly obscured by the tiles after the task 3.5 change. Not investigated further in this run. Status: open.

**Passing now.** `heading-order` (footer headings are `h3`), `aria-prohibited-attr` (services intro uses `aria: "none"`), `label-content-name-mismatch` (work tile labels), and `color-contrast` on home and about desktop. The brief notes one more `h4` on the services page outside the footer. The only `h4` found in source outside the footer is `components/home/Services.tsx:329`. `heading-order` passes on all 10 runs, so it is not failing the audit.

## 4. INP

Lab runs do not measure INP. Lighthouse uses Total Blocking Time (TBT) as the lab proxy for main-thread blocking during load. TBT in this run:

| page     | mobile | desktop |
| -------- | ------ | ------- |
| home     | 67ms   | 0ms     |
| about    | 82ms   | 0ms     |
| services | 121ms  | 0ms     |
| work     | 49ms   | 0ms     |
| contact  | 14ms   | 0ms     |

Field INP needs real-user data (RUM or the Chrome UX Report, CrUX). This repo has no RUM, so field INP is not known.

## Other notes

- Work photos now go through the Next image optimizer. `unoptimized` was removed from `components/work/WorkWall.tsx` and `SelectedWork`. This adds image optimizer usage on the hosting plan.
