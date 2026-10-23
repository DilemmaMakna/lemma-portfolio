# Lighthouse baseline

- Date: 2026-10-23
- Command: `scripts/lighthouse.sh` (runs `next build` and `next start`, then `npx lighthouse` on / /about /services /work /contact, mobile and desktop)
- Raw JSON: `docs/lighthouse/raw/` (gitignored)

## Scores

| page-form | Perf | A11y | BP | SEO | LCP | CLS | TBT |
|---|---|---|---|---|---|---|---|
| home-mobile | 88 | 95 | 100 | 100 | 3.87s | 0.000 | 80ms |
| home-desktop | 98 | 95 | 100 | 100 | 1.01s | 0.000 | 0ms |
| about-mobile | 90 | 94 | 100 | 100 | 3.59s | 0.000 | 51ms |
| about-desktop | 100 | 94 | 100 | 100 | 0.82s | 0.000 | 0ms |
| services-mobile | 90 | 90 | 100 | 100 | 3.61s | 0.000 | 62ms |
| services-desktop | 99 | 90 | 100 | 100 | 0.84s | 0.000 | 0ms |
| work-mobile | 83 | 90 | 100 | 100 | 4.62s | 0.000 | 40ms |
| work-desktop | 94 | 90 | 100 | 100 | 1.56s | 0.000 | 0ms |
| contact-mobile | 93 | 95 | 100 | 100 | 3.24s | 0.000 | 15ms |
| contact-desktop | 100 | 95 | 100 | 100 | 0.78s | 0.000 | 0ms |

## Failing audits

Audits scoring below 1 in Performance and Accessibility (insight audits included).

### home-mobile

- Perf: `largest-contentful-paint` (Largest Contentful Paint), `total-blocking-time` (Total Blocking Time), `speed-index` (Speed Index), `forced-reflow-insight` (Forced reflow), `image-delivery-insight` (Improve image delivery), `legacy-javascript-insight` (Legacy JavaScript), `network-dependency-tree-insight` (Network dependency tree), `render-blocking-insight` (Render-blocking requests), `interactive` (Time to Interactive), `max-potential-fid` (Max Potential First Input Delay), `unused-javascript` (Reduce unused JavaScript); LCP element: `section#top > div.wrap > div.flex > p.lead` "An evidence-based venture studio. We do "
- A11y: `color-contrast` (Background and foreground colors do not have a sufficient contrast ratio.), `heading-order` (Heading elements are not in a sequentially-descending order)

### home-desktop

- Perf: `largest-contentful-paint` (Largest Contentful Paint), `speed-index` (Speed Index), `forced-reflow-insight` (Forced reflow), `image-delivery-insight` (Improve image delivery), `lcp-discovery-insight` (LCP request discovery), `legacy-javascript-insight` (Legacy JavaScript), `network-dependency-tree-insight` (Network dependency tree), `render-blocking-insight` (Render-blocking requests), `unused-javascript` (Reduce unused JavaScript); LCP element: `section#top > div.wrap > div.flex > img.absolute` "LEMMA"
- A11y: `color-contrast` (Background and foreground colors do not have a sufficient contrast ratio.), `heading-order` (Heading elements are not in a sequentially-descending order)

### about-mobile

- Perf: `largest-contentful-paint` (Largest Contentful Paint), `legacy-javascript-insight` (Legacy JavaScript), `network-dependency-tree-insight` (Network dependency tree), `render-blocking-insight` (Render-blocking requests), `interactive` (Time to Interactive), `max-potential-fid` (Max Potential First Input Delay), `unused-javascript` (Reduce unused JavaScript); LCP element: `header.pointer-events-none > div.mx-auto > div.pointer-events-auto > button#nav-cta` "START A PROJECT ↗"
- A11y: `color-contrast` (Background and foreground colors do not have a sufficient contrast ratio.), `heading-order` (Heading elements are not in a sequentially-descending order)

### about-desktop

- Perf: `largest-contentful-paint` (Largest Contentful Paint), `legacy-javascript-insight` (Legacy JavaScript), `network-dependency-tree-insight` (Network dependency tree), `render-blocking-insight` (Render-blocking requests), `unused-javascript` (Reduce unused JavaScript); LCP element: `div > div.pointer-events-none > div.absolute > pre.absolute` "…"
- A11y: `color-contrast` (Background and foreground colors do not have a sufficient contrast ratio.), `heading-order` (Heading elements are not in a sequentially-descending order)

### services-mobile

- Perf: `largest-contentful-paint` (Largest Contentful Paint), `speed-index` (Speed Index), `forced-reflow-insight` (Forced reflow), `legacy-javascript-insight` (Legacy JavaScript), `network-dependency-tree-insight` (Network dependency tree), `render-blocking-insight` (Render-blocking requests), `interactive` (Time to Interactive), `max-potential-fid` (Max Potential First Input Delay), `unused-javascript` (Reduce unused JavaScript); LCP element: `section#top > div.wrap > div.relative > p.lead` "We work on the parts you can't see: rese"
- A11y: `aria-prohibited-attr` (Elements use prohibited ARIA attributes), `color-contrast` (Background and foreground colors do not have a sufficient contrast ratio.), `heading-order` (Heading elements are not in a sequentially-descending order)

### services-desktop

- Perf: `largest-contentful-paint` (Largest Contentful Paint), `speed-index` (Speed Index), `forced-reflow-insight` (Forced reflow), `legacy-javascript-insight` (Legacy JavaScript), `network-dependency-tree-insight` (Network dependency tree), `render-blocking-insight` (Render-blocking requests), `unused-javascript` (Reduce unused JavaScript); LCP element: `div.mt-7 > h1#services-hero-title > span.block > span.inline-block` "disciplines,"
- A11y: `aria-prohibited-attr` (Elements use prohibited ARIA attributes), `color-contrast` (Background and foreground colors do not have a sufficient contrast ratio.), `heading-order` (Heading elements are not in a sequentially-descending order)

### work-mobile

- Perf: `largest-contentful-paint` (Largest Contentful Paint), `speed-index` (Speed Index), `legacy-javascript-insight` (Legacy JavaScript), `network-dependency-tree-insight` (Network dependency tree), `render-blocking-insight` (Render-blocking requests), `interactive` (Time to Interactive), `max-potential-fid` (Max Potential First Input Delay), `unused-javascript` (Reduce unused JavaScript), `mainthread-work-breakdown` (Minimize main-thread work); LCP element: `section.relative > div.wrap > div.col-span-full > h1#work-hero-title` "Proof, not claims."
- A11y: `color-contrast` (Background and foreground colors do not have a sufficient contrast ratio.), `heading-order` (Heading elements are not in a sequentially-descending order), `target-size` (Touch targets do not have sufficient size or spacing.), `label-content-name-mismatch` (Elements with visible text labels do not have matching accessible names.)

### work-desktop

- Perf: `largest-contentful-paint` (Largest Contentful Paint), `speed-index` (Speed Index), `image-delivery-insight` (Improve image delivery), `legacy-javascript-insight` (Legacy JavaScript), `network-dependency-tree-insight` (Network dependency tree), `render-blocking-insight` (Render-blocking requests), `interactive` (Time to Interactive), `unused-javascript` (Reduce unused JavaScript); LCP element: `section.relative > div.wrap > div.col-span-full > h1#work-hero-title` "Proof, not claims."
- A11y: `color-contrast` (Background and foreground colors do not have a sufficient contrast ratio.), `heading-order` (Heading elements are not in a sequentially-descending order), `target-size` (Touch targets do not have sufficient size or spacing.), `label-content-name-mismatch` (Elements with visible text labels do not have matching accessible names.)

### contact-mobile

- Perf: `largest-contentful-paint` (Largest Contentful Paint), `legacy-javascript-insight` (Legacy JavaScript), `network-dependency-tree-insight` (Network dependency tree), `render-blocking-insight` (Render-blocking requests), `interactive` (Time to Interactive), `unused-javascript` (Reduce unused JavaScript); LCP element: `section.relative > div.wrap > div.col-span-full > h1#contact-page-title` "What do you want to prove?"
- A11y: `color-contrast` (Background and foreground colors do not have a sufficient contrast ratio.), `heading-order` (Heading elements are not in a sequentially-descending order)

### contact-desktop

- Perf: `largest-contentful-paint` (Largest Contentful Paint), `legacy-javascript-insight` (Legacy JavaScript), `network-dependency-tree-insight` (Network dependency tree), `render-blocking-insight` (Render-blocking requests), `unused-javascript` (Reduce unused JavaScript); LCP element: `section.relative > div.wrap > div.col-span-full > h1#contact-page-title` "What do you want to prove?"
- A11y: `color-contrast` (Background and foreground colors do not have a sufficient contrast ratio.), `heading-order` (Heading elements are not in a sequentially-descending order)
