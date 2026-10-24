# Mobile JavaScript and main-thread profile

- Date: 2026-10-24
- Build: `npm run build` (Next 16.4.2, Turbopack), served with `next start -p 3330`.
- Lighthouse 13.5.0 CLI with the flags of `scripts/lighthouse.sh` (`--form-factor=mobile`, `--chrome-flags="--headless=new --no-sandbox"`), limited to the performance category, with `--output=json --save-assets`. Runs were sequential on a laptop under load.
- Runs: 3 for `/` and `/work`, 1 for `/services`.
- Raw traces, devtools logs and JSON are kept outside the repo (not committed). `docs/lighthouse/raw/` is gitignored.

## Baseline

Mobile, median of runs (each metric is the median across runs).

| Page        | Runs (Perf) | Perf | LCP    | TBT    | TTI    |
| ----------- | ----------- | ---- | ------ | ------ | ------ |
| `/`         | 75, 86, 86  | 86   | 4.16 s | 68 ms  | 4.20 s |
| `/work`     | 85, 86, 86  | 86   | 4.19 s | 50 ms  | 4.22 s |
| `/services` | 88 (1 run)  | 88   | 3.70 s | 133 ms | 3.71 s |

- `/` run 1 is an outlier (Perf 75, LCP 6.61 s). The median ignores it, but it shows the variance on this machine.
- FCP is 0.90 to 0.91 s on all three pages. CLS is 0.000 in every run.
- Three runs per page is a small sample. Treat differences of 1 to 2 points as noise.
- Field data (CrUX or RUM) is not available in this repo.

## Chunk attribution

Method:

- `npm run analyze` was run as `npm run analyze -- -o` (write only, no server, so port 4000 was not used). The analyzer's native step panicked in `nft.rs` but still wrote `.next/diagnostics/analyze/`.
- The analyzer module tree (1,390 modules) has no chunk membership. Its client chunk names come from its own analysis build, and only one served chunk name matches (`0cz1d0mv5g_q7.js`).
- The build emits no sourcemaps (0 `.map` files in `.next/static/chunks`).
- So package attribution inside a served chunk is a heuristic: counts of library and app signatures in the minified source. Chunk sizes are exact. Contents are not.

First-load JS on `/` (`.next/diagnostics/route-bundle-stats.json`): 698,913 bytes uncompressed. The chunks above 5 KB gzip, with what each one contains:

| Chunk               | Raw      | Gzip    | On `/` in Chrome               | Contents (heuristic)                                                                                                                                                      |
| ------------------- | -------- | ------- | ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `1s37vwjm584j-.js`  | 224.2 KB | 70.1 KB | yes (Lighthouse: 71,987 bytes) | React DOM, React core, scheduler, Next client runtime, app code. Not split further. Also holds the legacy polyfills (about 14 KB wasted per Lighthouse).                  |
| `1gcbhn0wmc6ve.js`  | 126.2 KB | 48.8 KB | yes                            | GSAP core and ScrollTrigger (static import in `lib/motion/gsap.ts`), some app code. The exact split is not measured.                                                      |
| `2j5x_ukdjbtxo.js`  | 159.7 KB | 44.1 KB | yes                            | React DOM and the Next app-router runtime.                                                                                                                                |
| `0cz1d0mv5g_q7.js`  | 110.0 KB | 38.5 KB | no                             | `noModule` polyfill bundle (`polyfill-nomodule.js`, 112.6 KB in the analyzer). Chrome does not request it: it is absent from the devtools request log of `/` and `/work`. |
| `12nbj0uwij2_s.js`  | 42.5 KB  | 14.6 KB | yes                            | Polyfill-like code (core-js or Intl signatures). Not mapped.                                                                                                              |
| `09hjk569tisjr.js`  | 29.1 KB  | 10.0 KB | yes                            | App code. Not mapped.                                                                                                                                                     |
| `3cv4bnxgq4591.js`  | 28.3 KB  | 9.0 KB  | yes                            | App code. Not mapped.                                                                                                                                                     |
| `0ssqr03lk-c8r.js`  | 34.0 KB  | 8.5 KB  | yes                            | React core and polyfill-like code. Not mapped.                                                                                                                            |
| `3w52rwbct666y.js`  | 21.4 KB  | 6.3 KB  | yes (all routes)               | App strings (locale and provider code likely). Not mapped.                                                                                                                |
| `2ri0ksxa86fsu.css` | 71.9 KB  | 14.0 KB | yes, render-blocking           | See Fonts and CSS.                                                                                                                                                        |

Chunks under 5 KB gzip, not attributed: `2_45n-mpnqtrf.js` (1.0 KB), `1ckvzn7sfprko.js` (2.0 KB), `turbopack-3-ry682tkyiqk.js` (3.9 KB).

Route-specific chunks above 5 KB gzip:

- `/work`: `2z-ptf0efu9z9.js` (18.0 KB gzip, app code), `3n1bdim1-u2rv.js` (12.3 KB, lenis reference and canvas or rAF code).
- `/services`: `1im0_2zp42ng3.js` (15.5 KB, GSAP reference and app code).
- `/about`: `2melrk-1t8l8z.js` (15.4 KB, app code).
- `/contact`: `3y5kqu509ln83.js` (10.7 KB, app code).
- Lenis: `2j9yyl5qtr4km.js` (5.3 KB gzip, the Lenis library, loaded by `import("lenis")` in `SmoothScroll.tsx`, requested on `/` and `/work`).

Per-package sizes that can be stated:

- Lenis: 5.3 KB gzip.
- Polyfills: 38.5 KB gzip in the noModule bundle (not downloaded by Chrome), plus about 14 KB of legacy code inside `1s37vwjm584j-.js` (Lighthouse `legacy-javascript-insight`, 13,958 bytes wasted).
- GSAP plus ScrollTrigger: most of `1gcbhn0wmc6ve.js` (48.8 KB gzip). ScrollTrigger alone is not measured.
- React DOM, React core and the Next runtime: spread over `1s37`, `2j5x`, `0ssq`. Not separable without sourcemaps.

Trace view (top-level script execution on the renderer main thread, from `FunctionCall` and `EvaluateScript` events):

- `/`: `1s37` 114 ms, `1gcbhn` 32 ms, `09hj` 4 ms, `2j5x` 3 ms. Total about 161 ms.
- `/work`: `1s37` 99 ms, `3n1bdim1` 74 ms, `1gcbhn` 31 ms. Total about 215 ms.
- `/services`: `1s37` 154 ms, `1gcbhn` 26 ms. Total about 197 ms.

Sourcemaps would be needed to finish the attribution of `1s37` and `2j5x`. Turning them on is a `next.config.ts` change, outside this PR's file list.

## Ranked findings

Payoff estimates are estimates, not measurements, unless stated.

| #   | Finding                                                                                                                   | Evidence                                                                                                                                   | Est. payoff                                                                      | Confidence                                                                  |
| --- | ------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| 1   | Legacy polyfills in the shared chunk (no browserslist)                                                                    | Lighthouse `legacy-javascript-insight`: 13,958 bytes wasted on every page                                                                  | Perf +0 to +1                                                                    | Medium. Also check whether the noModule bundle disappears.                  |
| 2   | Main-thread startup cost of the shared chunks (React, Next runtime, GSAP)                                                 | Top-level script time 114 ms (`/`) and 154 ms (`/services`) in `1s37`; long tasks of 169 ms and 65 ms, both in `1s37`                      | TBT and TTI. Not quantified; depends on how much client code moves to the server | Low to medium                                                               |
| 3   | Forced reflow inside the shared chunks                                                                                    | `forced-reflow-insight` on `/` and `/services`: `1s37` 39 to 42 ms; `1gcbhn` 17 to 25 ms (two entries) on `/`, 15 and 18 ms on `/services` | Not scored. About 40 ms or more of main thread on `/`                            | Medium (sources are minified)                                               |
| 4   | ScrollTrigger in the shared chunk on every route                                                                          | `lib/motion/gsap.ts` imports and registers it at module load; `Footer` (all five pages) and `PageAnimations` (all five pages) use it       | Perf +0 to +2 if the whole group lands. Size not measured                        | Low to medium; timing risk; not verified in a browser                       |
| 5   | One render-blocking CSS chunk, 14.0 KB gzip                                                                               | `render-blocking-insight`: 153 ms (`/` mobile), 152 ms (`/services` mobile), not flagged on desktop                                        | Perf +1 (earlier estimate in `fixes.md`)                                         | Low to medium. What fills the 72 KB raw file is not analyzed.               |
| 6   | LCP and TTI wait for hydration (`html.is-booting` hides the page until React runs; `data-intro` copy waits for the intro) | LCP 4.16 s on `/`, render delay of about 2 s (earlier analysis in `fixes.md`, not re-measured here)                                        | Large on LCP. Not a JS payload fix                                               | Medium. Needs a lead decision (it changes the intro). Out of PR 5 JS scope. |
| 7   | Below-fold ASCII canvases mounted and hydrated on their routes                                                            | AsciiShape, AsciiProcess, AsciiPrompt on `/`; AsciiCycle on `/about`; AsciiFlow on `/services`                                             | Perf +0 to +1. Not measured                                                      | Low                                                                         |
| 8   | Forced-reflow read after write in `ServicesIntro` (SplitText measure)                                                     | Source: `components/services/ServicesIntro.tsx` lines 41 to 55                                                                             | Part of finding 3 on `/services`                                                 | Low to medium                                                               |
| 9   | Dead code: four files are not imported anywhere                                                                           | `TopographicalLines.tsx`, `PixelReveal.tsx`, `AsciiPuzzle.tsx`, `lib/ui/topography.ts`                                                     | None. They are not in any bundle                                                 | High. Deleting them is a user decision.                                     |
| 10  | Font requests on `/`: four woff2, 91.9 KB                                                                                 | Devtools log; `/work` adds one 12.9 KB file                                                                                                | Small. Trimming preload could move LCP either way                                | Low                                                                         |
| 11  | Cursor loaded on every route, effect gated by `isTouch()`                                                                 | `components/providers/Providers.tsx` mounts it; `Cursor.tsx` returns early on touch                                                        | Under 1 KB estimated. Skip                                                       | High                                                                        |

## Server Component candidates

Method:

- 51 files contain `"use client"`: 48 `.tsx` components and 3 `.ts` copy hooks (`useAboutCopy.ts`, `useServicesCopy.ts`, `useWorkCopy.ts`). None are under `app/`. Of the 59 `.tsx` files in `app/` and `components/`, 48 are client components. The TODO's "51 of 59" counted the hook files too.
- Each file was checked with grep for: hook calls, React hook imports, JSX event handlers, `addEventListener`, browser globals, and client-only imports (gsap, lenis, providers, motion helpers).
- The imports and hook lines of the candidates were read. Whole files were not all read.

Strict candidates (no hooks, no handlers, no browser APIs, no client-only imports): none can become Server Components as they are.

- Six ASCII wrappers have no hooks and no handlers, but they pass `variants` objects with `region` and `render` functions into the client `AsciiStage`. Functions cannot cross the Server to Client boundary. They become candidates only after the variant functions move into a client module and the wrapper passes plain data:
  - `components/about/AsciiCycle.tsx`
  - `components/about/AsciiLemma.tsx`
  - `components/home/AsciiProcess.tsx`
  - `components/home/AsciiPrompt.tsx`
  - `components/home/AsciiShape.tsx`
  - `components/services/AsciiFlow.tsx`

Conditional candidates (their only client trigger is a locale copy hook: `useLocale()` or `useXCopy()`, with no handlers and no browser APIs). They need a server-side locale source before they can convert:

- `components/about/Beliefs.tsx` (useAboutCopy)
- `components/about/Name.tsx` (useAboutCopy)
- `components/services/Engagement.tsx` (useServicesCopy)
- `components/services/ServiceList.tsx` (useServicesCopy)
- `components/work/WorkHero.tsx` (useWorkCopy)
- `components/home/Premise.tsx` (useLocale; renders the client AsciiShape)
- `components/home/Products.tsx` (useLocale)
- `components/home/About.tsx` (useLocale)
- `components/home/SelectedWork.tsx` (useLocale)
- `components/contact/ContactPage.tsx` (useLocale)
- `components/ui/SocialLinks.tsx` (useLocale)

The locale is read on the client (cookie in `LocaleProvider`). A server version needs either a server-side read of the locale (`cookies()` under `cacheComponents` changes how the page is rendered, to be checked in the Next docs) or a locale prop from a server parent. That is a decision for the lead, so PR 5.4 cannot start until it is made.

Client by necessity (hooks, handlers, browser APIs or GSAP): the other 31 files (hooks, handlers, browser APIs or GSAP), for example `Hero`, `Services`, `Footer`, `Who`, `Process`, `ContactCta`, `ContactForm`, `ContactModal`, `NavPill`, `ProjectModal`, `WorkExplorer`, `WorkWall`, `ServicesHero`, `ServicesIntro`, `CollaborativeCursors`, `AboutCta`, `AboutHero`, `Model`, `ServicesCta`, `ThemeToggle`, `AsciiStage`, `AsciiPuzzle`, `DotGrid`, `PageTransition`, `PixelReveal`, `TopographicalLines`, `PageAnimations`, `SmoothScroll`, `LocaleProvider`, `Providers`, `Cursor`.

## Deferrable effects

| Effect               | Mounted in (route)                                               | Position                                            | Gate                                             | First-paint impact                                    | Note                                                          |
| -------------------- | ---------------------------------------------------------------- | --------------------------------------------------- | ------------------------------------------------ | ----------------------------------------------------- | ------------------------------------------------------------- |
| Cursor               | `Providers.tsx` (all routes)                                     | Fixed overlay                                       | Effect returns on touch or reduced motion        | None on touch devices. Module in the shared chunk     | Under 1 KB estimated. Skip.                                   |
| DotGrid              | `home/Hero.tsx` (`/`); `services/ServicesHero.tsx` (`/services`) | Above the fold (masked background)                  | IntersectionObserver; rAF loop runs on touch too | Canvas paints after hydration. Not LCP                | Medium-low. Visible change if deferred.                       |
| AsciiLemma           | `about/AboutHero.tsx` (`/about`)                                 | Above the fold                                      | None                                             | This is the LCP element on about desktop (`fixes.md`) | Do not defer.                                                 |
| AsciiCycle           | `about/Model.tsx` (`/about`)                                     | Below the fold                                      | IntersectionObserver                             | None on first paint                                   | Candidate for next/dynamic.                                   |
| AsciiShape           | `home/Premise.tsx` (`/`)                                         | Below the fold                                      | IntersectionObserver                             | None on first paint                                   | Candidate for next/dynamic.                                   |
| AsciiProcess         | `home/Process.tsx` (`/`)                                         | Below the fold, hidden below `lg` but still mounted | IntersectionObserver                             | None on first paint                                   | Candidate for next/dynamic.                                   |
| AsciiPrompt          | `home/ContactCta.tsx` (`/`)                                      | Below the fold, hidden below `lg` but still mounted | IntersectionObserver                             | None on first paint                                   | Candidate for next/dynamic.                                   |
| AsciiFlow            | `services/ServicesCta.tsx` (`/services`)                         | Below the fold                                      | IntersectionObserver                             | None on first paint                                   | Candidate for next/dynamic.                                   |
| CollaborativeCursors | `services/ServicesHero.tsx` (`/services`)                        | Above the fold, full-size overlay, 533 lines        | IntersectionObserver. No `isTouch()` gate found  | Hydration cost on every device                        | Read only by grep. Check touch behavior before any change.    |
| AsciiCover           | `work/WorkWall.tsx` tiles and `work/ProjectModal.tsx`            | Tiles below the hero; modal on open                 | None                                             | Static text, not canvas                               | Low payoff.                                                   |
| PageTransition       | `Providers.tsx` (all routes)                                     | Hidden until a click                                | Timeline runs on click only                      | None on first paint                                   | Module is in the shared chunk.                                |
| TopographicalLines   | Not mounted (no importer)                                        | None                                                | None                                             | None                                                  | Dead code. Skip.                                              |
| PixelReveal          | Not mounted (no importer)                                        | None                                                | None                                             | None                                                  | Dead code. Skip.                                              |
| AsciiPuzzle          | Not mounted (no importer)                                        | None                                                | None                                             | None                                                  | Dead code. Also referenced in `docs/BEST_PRACTICES.md`. Skip. |

The TODO names TopographicalLines and PixelReveal as candidates for PR 5.3. Neither is mounted, so they have no payoff.

## ScrollTrigger wiring

| File                                    | Lines             | Use                                                               | Setup timing                                | Routes                                           |
| --------------------------------------- | ----------------- | ----------------------------------------------------------------- | ------------------------------------------- | ------------------------------------------------ |
| `lib/motion/gsap.ts`                    | 2, 8, 13          | Static import, `registerPlugin` at module load, re-export         | Sync, in the shared chunk `1gcbhn`          | All                                              |
| `components/layout/SmoothScroll.tsx`    | 4, 22             | `lenis.on("scroll", ScrollTrigger.update)`                        | Inside the async `import("lenis")` callback | All (via Providers). Skipped with reduced motion |
| `components/ui/PageTransition.tsx`      | 6, 61             | `ScrollTrigger.refresh()` in the transition timeline `onComplete` | After a click-driven transition             | All (via Providers)                              |
| `components/layout/PageAnimations.tsx`  | 4, 21, 34, 45, 50 | `scrollTrigger` tweens and `refresh` in `useGSAP`                 | Sync at mount                               | `/`, `/about`, `/work`, `/contact`, `/services`  |
| `components/home/Services.tsx`          | 8, 25, 115        | `scrollTrigger` tween setup and `refresh` in `onComplete`         | Sync at mount                               | `/`                                              |
| `components/home/Footer.tsx`            | 55                | `scrollTrigger` option in `useGSAP`                               | Sync at mount                               | All five pages                                   |
| `components/about/Who.tsx`              | 24                | `scrollTrigger` option                                            | Sync at mount                               | `/about`                                         |
| `components/services/ServicesIntro.tsx` | 77                | `scrollTrigger` option, after SplitText                           | Sync at mount                               | `/services`                                      |

- ScrollTrigger is used on every route: through the shared chunk, through `Footer` (all pages) and through `PageAnimations` (all pages).
- `lib/motion/intro.ts` does not use ScrollTrigger.
- Races to check before any deferral (not verified in a browser): Lenis is created asynchronously in `SmoothScroll`, `PageTransition` calls `refresh` after transitions, and `PageAnimations` creates triggers at mount. Setups that run at mount and could race with Lenis or the intro stay sync and must be documented (per the TODO rules).

## Fonts and CSS

CSS:

- One render-blocking stylesheet in `<head>`: `2ri0ksxa86fsu.css`, 71.9 KB raw, 14.0 KB gzip.
- Lighthouse `render-blocking-insight`: 153 ms on `/` mobile, 152 ms on `/services` mobile, not flagged on desktop.
- What fills the 72 KB raw file (utilities or `globals.css`) is not analyzed in this pass.

Fonts (`lib/fonts.ts`):

| Font             | Setup                                                                          | Weights used in code                                                         | Notes                                                                                                  |
| ---------------- | ------------------------------------------------------------------------------ | ---------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| General Sans     | `localFont`, variable, `weight: "200 700"`, `display: swap`, one 38.1 KB woff2 | `font-light` (2), `font-normal` (2), `font-medium` (23), `font-semibold` (4) | All inside 200 to 700, so the variable file covers them. A static subset may be smaller; not measured. |
| Geist Mono       | `Geist_Mono`, `subsets: ["latin"]`, no weight option, `display: swap`          | Used in 39 files. Weights of mono text not counted                           | Loads the variable file.                                                                               |
| Instrument Serif | `Instrument_Serif`, `weight: "400"`, normal and italic                         | Italic used in 15 class or style spots                                       | Italic file needed on pages that use it.                                                               |

- On `/`, four woff2 files are requested: 38.1, 23.1, 15.7 and 15.0 KB (91.9 KB total). `/work` adds one 12.9 KB file. The three Google files are not mapped to Geist or Instrument by name.
- No `preload` option is set in `lib/fonts.ts`. The `next/font` default is not checked in the Next docs in this pass (check before PR 5.5).
- `display: swap` on all three. CLS is 0.000 in every run.

## Forced reflow

Lighthouse `forced-reflow-insight` (minified chunk and line):

| Chunk:line           | `/` (3 runs)              | `/services`              | Note                                   |
| -------------------- | ------------------------- | ------------------------ | -------------------------------------- |
| `1s37vwjm584j-.js:1` | 39 to 42 ms               | 39 ms                    | Not mapped                             |
| `1gcbhn0wmc6ve.js:3` | 17 to 25 ms (two entries) | 15 and 18 ms             | GSAP or ScrollTrigger code, not mapped |
| `1im0_2zp42ng3.js:5` | none                      | about 5 ms (six entries) | Services route chunk                   |
| `2j9yyl5qtr4km.js:0` | 0.1 to 0.2 ms             | none                     | Lenis                                  |

`/work` has no forced-reflow item (score 1).

Source sites (found by grep; only the first three were read):

| File                                           | Lines         | Pattern                                                                                                            | Status                                                        |
| ---------------------------------------------- | ------------- | ------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------- |
| `components/services/ServicesIntro.tsx`        | 41 to 55      | `getBoundingClientRect` on the wrapper and on each phrase, then `offsetWidth`, after SplitText has changed the DOM | Read. Read after write. `/services`                           |
| `components/home/Footer.tsx`                   | 87            | `getBoundingClientRect` in the mousemove handler                                                                   | Read. One read per mouse event. On all five pages             |
| `components/work/WorkWall.tsx`                 | 217           | `offsetHeight` in the scroll rAF loop, after transform writes                                                      | Read. Read after write, but not flagged in the `/work` traces |
| `components/services/CollaborativeCursors.tsx` | 253, 264, 395 | `getBoundingClientRect`                                                                                            | Grep only                                                     |
| `components/ui/DotGrid.tsx`                    | 37, 81        | `getBoundingClientRect` on the canvas                                                                              | Grep only                                                     |
| `components/home/Services.tsx`                 | 208 to 209    | `window.innerHeight` in a positioning branch                                                                       | Grep only. Handler not confirmed                              |
| `components/work/ProjectModal.tsx`             | 134 to 135    | `scrollHeight` and `clientHeight` in a scroll handler, after a `scrollTop` write at line 124                       | Grep only                                                     |

## Proposed order for PR 5

The TODO has no 5.7. Subtasks are listed as they appear in the TODO.

1. 5.1 `perf(build): target modern browsers`: do first. Best payoff per effort. Removes the legacy polyfill part of `1s37` (about 14 KB, per Lighthouse). Check whether the noModule bundle goes away. Check the Next docs for browserslist before editing. Expect Perf +0 to +1.
2. 5.6 `perf(layout): remove forced reflow reads`: fix the traced sites only: `ServicesIntro` measure (batch reads before writes) and `Footer` mousemove. Skip `WorkWall` (not traced). Do this before the ScrollTrigger group. Expect small TBT change; not scored directly.
3. 5.2 `perf(ui): load custom cursor only for fine pointers`: skip. No payoff: the effect is already gated by `isTouch()`, and the module is under 1 KB estimated.
4. 5.3 `perf(ui): lazy load below-fold canvas effects`: do only for AsciiShape, AsciiProcess and AsciiPrompt (`/`), AsciiCycle (`/about`) and AsciiFlow (`/services`), max 3 files per commit. Extra care: keep `AsciiLemma` (LCP on about desktop) and the hero DotGrid untouched. Keep `ssr` on so the markup stays (CLS). Skip TopographicalLines and PixelReveal: not mounted, no payoff. Deleting them is a separate decision for the user.
5. 5.4 `refactor(components): drop use client from leaf-less wrappers`: skip for now. There are no strict candidates. The 11 conditional files need a locale decision first (see Server Component candidates). Extra care: it changes how locale reaches the page.
6. 5.5 `perf(fonts): trim font loading`: low payoff. Keep only if measured neutral or better, and CLS stays 0. Extra care: `preload` changes can move LCP.
7. 5.8 to 5.12 ScrollTrigger group: last, with extra care. Order: 5.8 helper; 5.9 SmoothScroll and PageTransition; 5.10 PageAnimations and home Services; 5.11 Footer (all routes), Who and ServicesIntro (re-check after 5.6). 5.12 removes the static import only if `npm run analyze` shows ScrollTrigger leaving `1gcbhn`. Revert the group if Perf does not improve or LCP or CLS regress. Not verified in a browser.
8. 5.13 `docs(lighthouse): record javascript reduction results`: record before and after per group.

Not in the PR 5 list, for the lead:

- Render-blocking CSS (14.0 KB gzip, about 153 ms on mobile). Needs an analysis of what fills the 72 KB raw file before any change.
- Hydration gate for LCP and TTI (finding 6). Needs a lead decision.
- Dead files (`TopographicalLines.tsx`, `PixelReveal.tsx`, `AsciiPuzzle.tsx`, `lib/ui/topography.ts`) and their mentions in `README.md`, `.agents/DESIGN.md` and `docs/BEST_PRACTICES.md`. Deletion is a user decision.

## What could not be measured

- Field data (CrUX or RUM): none in the repo, so field LCP and INP are unknown.
- Module-level JS: no sourcemaps, and the analyzer's module tree has no chunk membership. Chunk contents are heuristic.
- ScrollTrigger's own size and time: not separable from GSAP core in the current chunks.
- Trace script times use top-level `FunctionCall` and `EvaluateScript` events, because these traces have no CPU profile samples. They are approximate.
- Forced-reflow entries are minified line and column. Source mapping was not possible; the source sites above are grep-based unless marked as read.
- Three runs per page on a loaded laptop. `/services` has one run only.
- Nothing here was changed in the app or verified in a browser. These are measurements and read-only analysis.
- Not checked in the Next docs in this pass: browserslist handling in Next 16, the `next/font` preload default, and the `cookies()` effect under `cacheComponents`.
- `fixes.md` names older chunk files (for example `1yjlxtldiyyjp.js`). The current build uses different names, so older per-chunk numbers do not carry over.

## PR 5 Results (batch 1)

Method: `npm run build` on the tree at `19e8f40` (the 5.3 commit), `./node_modules/.bin/next start -p 3330`, Lighthouse 13.5.0 mobile with the flags of `scripts/lighthouse.sh` (performance category only), 3 runs per page, median of runs. Raw JSON is outside the repo. The baseline is the table above.

Mobile, measured once after the 5.3 commit and before its revert:

| Page    | State              | Perf (runs) | Perf | LCP    | TBT   | TTI    | CLS   |
| ------- | ------------------ | ----------- | ---- | ------ | ----- | ------ | ----- |
| `/`     | baseline (profile) | 75, 86, 86  | 86   | 4.16 s | 68 ms | 4.20 s | 0.000 |
| `/`     | `19e8f40` (5.3)    | 75, 85, 85  | 85   | 4.31 s | 69 ms | 4.37 s | 0.000 |
| `/work` | baseline (profile) | 85, 86, 86  | 86   | 4.19 s | 50 ms | 4.22 s | 0.000 |
| `/work` | `19e8f40` (5.3)    | 86, 87, 87  | 87   | 4.04 s | 48 ms | 4.06 s | 0.000 |

`/work` does not mount the changed components, so it is the control. It moved 0.15 s in LCP and TTI in the opposite direction, which is about the same size as the `/` change. The difference is within run-to-run drift on this laptop.

Per change:

| Subtask                                                             | Result                                          | Evidence                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| ------------------------------------------------------------------- | ----------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 5.1 `perf(build): target modern browsers`                           | Skipped, no commit                              | `/` first load (prerendered HTML, `nomodule` excluded): 698,913 B raw, 223,489 B gzip, 11 chunks, before and after. Next 16 reads `browserslist` (a `chrome 50` probe build gave 724,796 B raw), but the modern list changed no output. The 14 KB legacy code is the Next module `polyfill-module.js`, imported unconditionally by `next/dist/client/app-globals.js`, so no browserslist value removes it. The `nomodule` bundle (`0cz1d0mv5g_q7.js`, 112,594 B) is not fetched by Chrome. |
| 5.2 `perf(ui): load custom cursor only for fine pointers`           | Skipped, no commit                              | `Cursor.tsx` already returns early on touch (`isTouch()`). Under 1 KB, no payoff.                                                                                                                                                                                                                                                                                                                                                                                                          |
| 5.3 `perf(ui): lazy load below-fold canvas effects`                 | Committed as `19e8f40`, then reverted (pending) | Home only: `Premise` (AsciiShape), `Process` (AsciiProcess), `ContactCta` (AsciiPrompt) via `next/dynamic` with `ssr: false`. Placeholders reserve the same box (`50.6em` and `25.3em`). `/` first load 698,913 to 695,446 B raw and 223,489 to 220,188 B gzip (11 to 10 chunks). `/` LCP +0.15 s and TTI +0.17 s in the single run, so the keep rule reverts it.                                                                                                                          |
| 5.4 `refactor(components): drop use client from leaf-less wrappers` | Skipped, no commit                              | No strict candidates. The conditional candidates need a locale decision first (see Server Component candidates above).                                                                                                                                                                                                                                                                                                                                                                     |
| 5.5 `perf(fonts): trim font loading`                                | Skipped, no commit                              | Low payoff. Not attempted in this batch.                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| 5.6 `perf(layout): remove forced reflow reads`                      | Skipped, no commit                              | `ServicesIntro` `measure()` only reads, and its first read follows the SplitText DOM split in `onSplit`. Footer `handleMouseMove` reads before its only style write. The reflow Lighthouse flags comes from writes that run before these functions. Removing it means changing when they run (timing), so no change was made.                                                                                                                                                              |

Not done in batch 1:

- About and services ASCII effects (`AsciiCycle`, `AsciiFlow`): not in the requested measurement. They need reserved boxes like the home ones.
- The revert of `19e8f40` is staged in the working tree but not committed. The dotagent commit-message hook refuses `Revert "..."`. Commit it with `git commit -m 'Revert "perf(ui): lazy load below-fold canvas effects"' -- components/home/Premise.tsx components/home/Process.tsx components/home/ContactCta.tsx` once the message is accepted, or keep 5.3 if the lead judges the difference as noise.
