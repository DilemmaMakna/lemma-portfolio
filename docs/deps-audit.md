# Dependency audit

Scope: every entry in `dependencies` and `devDependencies` in `package.json`.
Date: 2026-10-23. Branch: `feat/site-optimization`.

Lockfiles: `package-lock.json` (npm, the original lockfile) and `bun.lock` (added in subtask 2.2). Both are kept. `bun.lock` must include the oxlint and oxfmt platform binaries, which is checked in PR 2.

Method:

- Use sites: `grep` over `app`, `components`, `lib`, `scripts` and config files.
- Build size: `npm run build` (Next 16.4.2, Turbopack). Next 16 does not print "First Load JS", so the numbers below are gzip sums of the JS chunks referenced by each prerendered HTML page. Each file is compressed with default `gzip`, not Brotli. Lazy chunks loaded after mount are not counted.
- Package size: gzip of the minified UMD files in `node_modules`. These are estimates. Turbopack re-bundles and tree-shakes them, so the real shipped size differs.

## Summary

| Package                | Kind          | Ships to browser | Decision                                          |
| ---------------------- | ------------- | ---------------- | ------------------------------------------------- |
| next                   | dependency    | yes (runtime)    | keep                                              |
| react                  | dependency    | yes              | keep                                              |
| react-dom              | dependency    | yes              | keep                                              |
| gsap                   | dependency    | yes              | keep, lazy-load ScrollTrigger and SplitText (2.4) |
| @gsap/react            | dependency    | yes              | keep                                              |
| lenis                  | dependency    | yes              | keep, lazy-load (2.5)                             |
| tailwindcss            | devDependency | CSS only         | keep                                              |
| @tailwindcss/turbopack | devDependency | build only       | keep                                              |
| typescript             | devDependency | no               | keep                                              |
| @types/node            | devDependency | no               | keep                                              |
| @types/react           | devDependency | no               | keep                                              |
| @types/react-dom       | devDependency | no               | keep                                              |
| oxlint                 | devDependency | no               | keep                                              |
| oxfmt                  | devDependency | no               | keep                                              |
| sharp                  | devDependency | no               | keep                                              |

Nothing is removed in this audit. `eslint`, `eslint-config-next` and `prettier` are not in `package.json` any more. The oxc migration (PR 10) removed them. No `framer-motion` dependency or import exists, so there is nothing to swap for it.

## Runtime dependencies

### next (16.4.2, pinned)

- Purpose: framework, routing, prerendering, image and font helpers, build pipeline.
- Use sites: 20 files import from `next/*` (for example `next/navigation`, `next/link`, `next/image`, `next/font`). `next.config.ts`, `app/` routes.
- Shipped size: framework runtime is part of every page. Included in the baseline below.
- Alternatives: none in scope. Replacing the framework is out of scope.
- Decision: keep.

### react (19.3.0, pinned) and react-dom (19.3.0, pinned)

- Purpose: UI rendering. `react-dom` has no direct imports in app code. It is loaded by Next and the client runtime.
- Use sites: 25 files import from `react`. `react-dom` is used by the framework.
- Shipped size: part of the largest chunk (see baseline). That chunk contains `createRoot`, which points to React DOM client code. The chunk is not otherwise identified.
- Alternatives: none in scope.
- Decision: keep.

### gsap (^3.15.0, installed 3.15.0)

- Purpose: timeline tweens and scroll animation.
- Entry point: `lib/gsap.ts` imports `gsap`, `ScrollTrigger`, `SplitText` and `useGSAP`. It calls `gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP)` once at module load. It also exports `reducedMotion` and `isTouch`.
- Use sites: 20 files import from `lib/gsap` or `gsap` (outside `lib/gsap.ts`). This is lower than the "about 22" estimate in the TODO. The count comes from grep.
- Plugin use:
  - ScrollTrigger: 4 components (`components/PageAnimations.tsx`, `components/SmoothScroll.tsx`, `components/home/Services.tsx`, `components/ui/PageTransition.tsx`) plus `lib/gsap.ts`.
  - SplitText: 1 component (`components/services/ServicesIntro.tsx`) plus `lib/gsap.ts`.
  - `useGSAP` (through `@gsap/react`): 6 components plus `lib/gsap.ts`.
- Shipped size, estimated from `node_modules` (gzip):
  - core `gsap.min.js`: 72,927 B raw, 28,356 B gzip
  - `ScrollTrigger.min.js`: 44,575 B raw, 17,988 B gzip
  - `SplitText.min.js`: 7,732 B raw, 3,660 B gzip
- Measured in the build: the chunk that contains the GSAP core and ScrollTrigger is `3jvhxabayco_w.js` (136,346 B raw, 53,026 B gzip). It also includes app code. Its `SplitText` strings were not found, and minified names may hide them, so SplitText placement is not confirmed.
- Because `lib/gsap.ts` imports SplitText statically, SplitText ships on every page that loads `lib/gsap`, even though only the services page uses it.
- Alternatives considered:
  - CSS transitions, keyframes or Web Animations API: cover simple fades and transforms with no runtime cost. They do not cover the timelines and scroll-linked behavior in `PageAnimations`, `Services`, `PageTransition` and `ServicesIntro`. Rewriting them is about 20 files of change, so it is out of scope.
  - CSS scroll-driven animations (`animation-timeline: view()`): could replace simple reveal-on-enter cases. Browser support and exact timing parity are not verified, so they are not used.
  - IntersectionObserver: covers reveal-once cases only, not timeline or scroll-linked behavior.
  - Manual span split in React instead of SplitText: possible for `ServicesIntro`. Line and word break behavior would change, so it is not done here. SplitText costs 3,660 B gzip.
- Decision: keep gsap core. Lazy-load ScrollTrigger and SplitText in subtask 2.4, keeping animations identical.

### @gsap/react (^2.1.2, installed 2.1.2)

- Purpose: `useGSAP` hook, which runs GSAP setup and cleanup with React effects.
- Use sites: imported only in `lib/gsap.ts`. Other files get `useGSAP` through `lib/gsap`. Count: 6 components plus `lib/gsap.ts` use `useGSAP`.
- Shipped size, estimated from `node_modules`: `index.min.js` 1,382 B raw, 790 B gzip.
- Alternatives: `useEffect` with `gsap.context()` and manual cleanup. It saves under 1 KB gzip and changes every call site, so it is not worth it.
- Decision: keep.

### lenis (^1.3.26, installed 1.3.26)

- Purpose: smooth wheel and touch scrolling.
- Use sites:
  - `components/SmoothScroll.tsx` imports the package and creates the instance. It connects Lenis to the GSAP ticker and `ScrollTrigger.update`. It respects reduced motion (`reducedMotion()`) and stops scroll while the intro runs (`is-loading`).
  - `lib/lenis.ts` holds the instance (`setLenis`, `getLenis`) and `scrollToId`. It imports only the type.
  - 9 other files import `lib/lenis` helpers, not the package.
- Shipped size: `lenis.min.js` is 18,722 B raw, 5,444 B gzip (estimate). The lenis chunk in the home build (`07tejzy2aqx4n.js`) is 26,345 B raw, 8,036 B gzip (measured).
- Alternatives considered:
  - Native `scroll-behavior: smooth`: no easing or duration control. It does not drive the GSAP ticker or `ScrollTrigger.update`, and `scrollToId` relies on the Lenis `scrollTo` with an offset. Feel and anchor timing would change, so it is not used.
  - Removing smooth scroll: changes the site's behavior. Out of scope.
- Decision: keep. Lazy-load after idle in subtask 2.5. The reduced-motion fallback from PR 7.4 must stay.

## Build and dev dependencies

### tailwindcss (^4) and @tailwindcss/turbopack (^4)

- Purpose: utility CSS. `app/globals.css` has `@import "tailwindcss"`. `next.config.ts` maps `*.css` to the `@tailwindcss/turbopack` loader.
- Shipped size: the home page CSS chunk `14-l75y9kzx79.css` is 71,772 B raw, 14,058 B gzip (measured). `@tailwindcss/turbopack` is build time only.
- Alternatives: a PostCSS setup (`@tailwindcss/postcss`). Changing the build pipeline is not needed now.
- Decision: keep both.

### typescript (^5)

- Purpose: type checks. `npm run typecheck` runs `tsc --noEmit`. `next build` also runs a TypeScript pass.
- Shipped size: none.
- Decision: keep.

### @types/node (^20), @types/react (^19), @types/react-dom (^19)

- Purpose: type declarations only. No runtime code.
- Use sites: `tsconfig.json`, all `.ts` and `.tsx` files.
- Shipped size: none.
- Decision: keep. Versions match the runtime majors (Node 20 line, React 19).

### oxlint (^1.89.0)

- Purpose: linting. `npm run lint`, rules in `.oxlintrc.json`. Replaces `eslint` and `eslint-config-next` (PR 10).
- Shipped size: none.
- Decision: keep.

### oxfmt (^0.74.0)

- Purpose: formatting. `npm run format` and `npm run format:check`, options in `.oxfmtrc.json`. Replaces `prettier` (PR 10).
- Shipped size: none.
- Decision: keep.

### sharp (^0.35.5)

- Purpose: image processing for the work photo pipeline.
- Use sites: `scripts/optimize-work-photos.mjs` only.
- Shipped size: none. It runs in Node, not in the browser.
- Alternatives: ImageMagick or `squoosh` CLI. `sharp` is already used and is fast.
- Decision: keep as a devDependency.

## Baseline (for 2.4 and 2.5)

Measured on the `npm run build` output of this branch on 2026-10-23. The build ran on a working tree with unrelated uncommitted changes (`package.json` name, `.gitignore`). Those do not change client bundles.

Gzip sums of the JS chunks referenced by each prerendered page (default `gzip`):

| Page             | JS chunks  | JS raw (B) | JS gzip (B) |
| ---------------- | ---------- | ---------- | ----------- |
| `/` (index.html) | 12         | 837,279    | 271,716     |
| `/work`          | not listed | 828,654    | 267,691     |
| `/services`      | not listed | 803,076    | 260,680     |
| `/about`         | not listed | 810,785    | 262,785     |

Home page CSS: `14-l75y9kzx79.css`, 71,772 B raw, 14,058 B gzip. `/contact` was not measured.

Largest client chunks in `.next/static/chunks` (raw and gzip):

| Chunk              | Raw (B) | Gzip (B) | Contents                                                                     |
| ------------------ | ------- | -------- | ---------------------------------------------------------------------------- |
| `1s37vwjm584j-.js` | 229,627 | 71,939   | largest chunk, contains `createRoot` (React DOM client, not fully confirmed) |
| `0m70axqy79w95.js` | 163,489 | 45,302   | not identified                                                               |
| `3jvhxabayco_w.js` | 136,346 | 53,026   | GSAP core and ScrollTrigger, plus app code                                   |
| `0cz1d0mv5g_q7.js` | 112,594 | 39,490   | not identified                                                               |
| `07tejzy2aqx4n.js` | 26,345  | 8,036    | lenis (home page)                                                            |

Targets for 2.4 and 2.5: JS gzip for `/` is 271,716 B, and the lenis chunk on `/` is 8,036 B. Compare after each change with the same method.

## Actions

1. Subtask 2.4 (`perf(gsap): load scrolltrigger and splittext lazily`): change `lib/gsap.ts` to load ScrollTrigger and SplitText with dynamic import. Keep the GSAP core and `useGSAP` static. Expected saving: SplitText (3,660 B gzip estimate) from the initial load of every page, and ScrollTrigger (17,988 B gzip estimate) from the initial load wherever it is not needed at mount. Keep animations identical. Compare `/` JS gzip with the baseline (271,716 B).
2. Subtask 2.5 (`perf(scroll): lazy-load lenis`): in `components/SmoothScroll.tsx`, load Lenis with dynamic import after idle. Keep the reduced-motion fallback. Expected saving: up to the lenis chunk (8,036 B gzip measured on `/`). Compare with the baseline (lenis chunk 8,036 B).
3. No changes to the other dependencies in this PR.
