# Lighthouse results after dithered art

- Date: 2026-10-23
- Command: `scripts/lighthouse.sh` (same as `baseline.md` and `after-perf.md`)
- Compared with: `after-perf.md` (the run before the dithered images)
- Raw JSON: `docs/lighthouse/raw/` (gitignored)
- One lab run with a fresh profile. Noise band used below: about 1 to 3 Performance points and a few hundredths of a second of LCP (this comparison uses 0.05s as the LCP band).

## 1. Scores (this run)

| page-form        | Performance | Accessibility | Best Practices | SEO | LCP   | CLS   | TBT   |
| ---------------- | ----------- | ------------- | -------------- | --- | ----- | ----- | ----- |
| home-mobile      | 86          | 100           | 100            | 100 | 4.18s | 0.000 | 76ms  |
| about-mobile     | 88          | 96            | 100            | 100 | 3.80s | 0.000 | 85ms  |
| services-mobile  | 87          | 96            | 100            | 100 | 3.85s | 0.000 | 128ms |
| work-mobile      | 85          | 92            | 100            | 100 | 4.26s | 0.000 | 45ms  |
| contact-mobile   | 92          | 96            | 100            | 100 | 3.41s | 0.000 | 14ms  |
| home-desktop     | 98          | 100           | 100            | 100 | 1.03s | 0.000 | 0ms   |
| about-desktop    | 100         | 100           | 100            | 100 | 0.80s | 0.000 | 0ms   |
| services-desktop | 99          | 96            | 100            | 100 | 0.82s | 0.000 | 0ms   |
| work-desktop     | 99          | 96            | 100            | 100 | 0.99s | 0.000 | 0ms   |
| contact-desktop  | 99          | 96            | 100            | 100 | 0.82s | 0.000 | 0ms   |

Which categories reach 100 in this run:

- Best Practices: 100 on all 10 pages.
- SEO: 100 on all 10 pages.
- Accessibility: 100 on 3 of 10 pages (home mobile, home desktop, about desktop). It is 92 to 96 on the other pages.
- Performance: 100 on 1 of 10 pages (about desktop). It is 98 to 99 on the other desktop pages and 85 to 92 on mobile.

The score of 100 is not reached in every category on every page. Only Best Practices and SEO are at 100 on all pages.

## 2. Comparison with `after-perf.md`

Each cell is `before -> now (delta)`.

| page-form        | Performance    | Accessibility  | LCP                     | CLS                    |
| ---------------- | -------------- | -------------- | ----------------------- | ---------------------- |
| home-mobile      | 86 -> 86 (0)   | 100 -> 100 (0) | 4.17s -> 4.18s (+0.01s) | 0.000 -> 0.000 (0.000) |
| about-mobile     | 89 -> 88 (-1)  | 96 -> 96 (0)   | 3.65s -> 3.80s (+0.15s) | 0.000 -> 0.000 (0.000) |
| services-mobile  | 87 -> 87 (0)   | 96 -> 96 (0)   | 3.84s -> 3.85s (+0.01s) | 0.000 -> 0.000 (0.000) |
| work-mobile      | 85 -> 85 (0)   | 92 -> 92 (0)   | 4.27s -> 4.26s (-0.01s) | 0.000 -> 0.000 (0.000) |
| contact-mobile   | 91 -> 92 (+1)  | 96 -> 96 (0)   | 3.41s -> 3.41s (0.00s)  | 0.000 -> 0.000 (0.000) |
| home-desktop     | 98 -> 98 (0)   | 100 -> 100 (0) | 1.02s -> 1.03s (+0.01s) | 0.000 -> 0.000 (0.000) |
| about-desktop    | 100 -> 100 (0) | 100 -> 100 (0) | 0.82s -> 0.80s (-0.02s) | 0.000 -> 0.000 (0.000) |
| services-desktop | 99 -> 99 (0)   | 96 -> 96 (0)   | 0.82s -> 0.82s (0.00s)  | 0.000 -> 0.000 (0.000) |
| work-desktop     | 99 -> 99 (0)   | 92 -> 96 (+4)  | 0.98s -> 0.99s (+0.01s) | 0.000 -> 0.000 (0.000) |
| contact-desktop  | 100 -> 99 (-1) | 96 -> 96 (0)   | 0.82s -> 0.82s (0.00s)  | 0.000 -> 0.000 (0.000) |

## 3. Regression check

- **Performance:** the largest drop is 1 point (about mobile and contact desktop). This is inside the 1 to 3 point noise band. No Performance regression beyond noise.
- **Accessibility:** no page dropped. Work desktop rose from 92 to 96. The other pages are unchanged.
- **LCP:** 9 of 10 pages moved by 0.02s or less, except about mobile. About mobile moved from 3.65s to 3.80s (+0.15s). That is above the few-hundredths band, so it is not confirmed as noise. The new images cannot explain it: the dithered art is only rendered by the home page components (`components/home/About.tsx` and `components/home/Products.tsx`, imported by `app/page.tsx`), and `/about` does not render them. Its Performance score moved only 1 point in the same run. One more run of `scripts/lighthouse.sh` would settle whether the LCP change is variance.

No metric regressed beyond normal noise on Performance, Accessibility or CLS. One LCP value (about mobile, +0.15s) is outside the band and is not explained by the new images.

## 4. Effect of the dithered images

- **CLS:** still 0.000 on all 10 pages at three decimals. The raw values on services mobile (0.00016) and services desktop (0.00005) are non-zero but round to 0.000. Those pages do not render the new images. Home mobile and home desktop are 0 in the raw JSON.
- **Layout:** both new images are `loading="lazy"` and sit in boxes that reserve their size (`aspect-[5/2]` with width and height in `About.tsx`, and an absolutely positioned fill inside a fixed card in `Products.tsx`). They do not push content.
- **LCP element:** both images are below the fold on the home page and lazy loaded, so they are not LCP candidates on first paint. On home desktop, the raw JSON gives the LCP node as `section#top > div.wrap > div.flex > img.absolute`, which is the hero logo recorded in `fixes.md`. This run's raw JSON does not expose the LCP node for the other pages, so their LCP element was not re-extracted. The element table in `fixes.md` remains the last record for those pages.

## 5. Open items

Open audits in Performance and Accessibility are unchanged from `after-perf.md` section 3. This run did not re-audit them.
