# Lighthouse results

- Date: 2026-10-24
- Command: `scripts/lighthouse.sh`, one full run: 5 pages x (mobile, desktop), 10 Lighthouse runs, run one at a time.
- Versions: Next.js 16.4.2 production build served with `next start`, Lighthouse 13.5.0 CLI.
- Raw JSON: `docs/lighthouse/raw/` (gitignored, rewritten by the script).
- Every number below is the single value from this run. Lab scores move between runs, so read differences of a few points as noise.

## Scores

| page-form        | Performance | Accessibility | Best Practices | SEO | LCP   | CLS   | TBT   |
| ---------------- | ----------- | ------------- | -------------- | --- | ----- | ----- | ----- |
| home-mobile      | 75          | 100           | 100            | 100 | 6.61s | 0.000 | 152ms |
| about-mobile     | 88          | 96            | 100            | 100 | 3.81s | 0.000 | 89ms  |
| services-mobile  | 87          | 100           | 100            | 100 | 3.85s | 0.000 | 132ms |
| work-mobile      | 85          | 96            | 100            | 100 | 4.27s | 0.000 | 46ms  |
| contact-mobile   | 91          | 96            | 100            | 100 | 3.41s | 0.000 | 14ms  |
| home-desktop     | 98          | 100           | 100            | 100 | 1.03s | 0.000 | 0ms   |
| about-desktop    | 100         | 100           | 100            | 100 | 0.79s | 0.000 | 0ms   |
| services-desktop | 99          | 96            | 100            | 100 | 0.82s | 0.000 | 0ms   |
| work-desktop     | 99          | 96            | 100            | 100 | 0.98s | 0.000 | 0ms   |
| contact-desktop  | 99          | 96            | 100            | 100 | 0.78s | 0.000 | 0ms   |

What this run reaches:

- Best Practices: 100 on all 10 pages.
- SEO: 100 on all 10 pages.
- Accessibility: 100 on 4 pages (home mobile, services mobile, home desktop, about desktop). The other 6 pages score 96.
- Performance: 100 on 1 page (about desktop). The other desktop pages score 98 to 99. No mobile page reaches 100; they score 75 to 91.
- CLS is 0.000 on all 10 pages.

Variance: home mobile scored 75 with LCP 6.61 s in this run. The 3-run profile in the earlier round recorded 75, 86 and 86 for the same page, so this page can swing by about 10 points between runs. The Accessibility scores of 96 or 100 depend on whether the nav button is caught mid-fade (see below).

## Remaining failures

### Accessibility: color-contrast

- `button#nav-cta` ("START A PROJECT") in the header, on about mobile, work mobile, work desktop, contact mobile and contact desktop. Lighthouse ratios: 3.33, 1.87, 4.22, 1.01 and 1.01. The required ratio is 4.5:1.
  - Cause: the button sits in the `data-intro="fade"` wrapper in `components/nav/NavPill.tsx`. The measured background is the accent color blended toward the page, so the button was captured while it was still fading in. This is an intro artifact, inferred from the colors and not confirmed in a browser.
  - The steady-state pair in the design tokens (`--on-accent` on `--accent`) computes to about 6.3:1. It was not measured in a browser.
- `span.truncate` in the services hover panel, 2 items ("Brand & Visual Identity", "UX, HCI & Product Design") on services desktop. Lighthouse ratio: 1.73 (`#403f3d` on `#151515`).
  - Cause: the panel is at `opacity-30` until the terminal typing in `components/services/ServicesHero.tsx` finishes. This is a mid-animation capture, inferred from the values. The same text computes to about 7.0:1 at full opacity.
- Not failing in this run: the work filter chips (`target-size`) that failed in the earlier round. Their overlap cause is still not identified.

### Performance

- Mobile LCP and TTI move together. In all 10 runs, LCP and TTI differ by 30 ms or less. Mobile LCP is 3.41 s to 4.27 s on four pages and 6.61 s on home (see Variance).
- The wait is main-thread script work and hydration (the earlier JavaScript profile, not re-measured here). Finding 6 also notes that `data-intro` copy waits for the intro. This run did not separate the two.
- `unused-javascript`: about 27 KiB estimated on home.
- `legacy-javascript`: about 14 KiB estimated, from the Next `polyfill-module` in the shared chunk. Flagged on all 10 pages.
- `render-blocking-insight`: flagged on all 10 pages. The cause is one render-blocking stylesheet, about 14.7 KB transferred, with 80 ms estimated on home mobile.
- `forced-reflow-insight`: flagged on home and services. The source is minified code in the shared chunks, not mapped to a file.

## JavaScript reduction: tried and discarded

- Browserslist modern target: no change. The first load of `/` stayed at 698,913 bytes raw. Next's `polyfill-module` is imported unconditionally, so no browserslist value removes the legacy code. Not committed.
- Lazy loading the below-fold canvas effects on home (`next/dynamic`, `ssr: false`): saved about 3.5 KB raw, but `/` LCP moved +0.15 s and TTI +0.17 s in one run. `/work`, a control that does not mount them, moved 0.15 s faster in the same run, so the difference is within drift. Reverted, not kept.
- Custom cursor loaded only for fine pointers: skipped. `Cursor.tsx` already returns early on touch.
- ScrollTrigger out of the shared chunk: discarded before any code change. `PageAnimations` runs on every route and sets its `from` states synchronously at mount. Deferring it would show content before its animated start state. ScrollTrigger stays in the shared chunk.
- Font trimming, forced-reflow reads and Server Component conversion: skipped (no payoff, or it needs a locale decision first).

## Not verified in a browser

- The intro choreography and its timing, including the fade behind the nav button.
- Scroll behavior with Lenis and ScrollTrigger (reveals and pinned sections).
- The look of the dithered images on home. They are lazy loaded inside reserved boxes, but their appearance was not checked.
- Hit areas: whether the nav button and the work filter chips are clickable at full size. The overlap that caused the earlier chip failure is not identified.
- The share card (`public/brand/share-card.jpg`) in a real social preview.

## INP

Lab Lighthouse does not measure INP. TBT is the lab proxy for main-thread blocking. TBT is 0 to 152 ms in this run. Field INP needs real-user data (RUM or CrUX), and this repo has none.

## How to rerun

Run `scripts/lighthouse.sh` from the repo root. It runs `next build`, starts `next start` on port 3100 (set `PORT` to change it), runs the 10 Lighthouse runs one at a time, writes the JSON to `docs/lighthouse/raw/`, prints the table and stops the server on exit. It takes about 4 minutes. Raw JSON is gitignored.
