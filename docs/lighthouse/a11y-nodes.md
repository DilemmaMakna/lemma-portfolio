# Failing accessibility nodes per page

Source of truth for subtasks 1.2 to 1.6 and 1.8.

Run: `scripts/lighthouse.sh`, 2026-10-24, 5 pages x (mobile, desktop), 10 runs.
Raw JSON: `docs/lighthouse/raw/<page>-<form>.json` (gitignored).

Only audits with a score below 1 are listed. Manual and not-applicable audits are skipped.
Ratios and colors are the values Lighthouse measured in that run. Each node is listed with
its selector, snippet, and the Lighthouse explanation (condensed). Source lines were found by
grepping the text and classes in `components/`.

## Accessibility score per run

| Page     | Mobile | Desktop |
| -------- | ------ | ------- |
| home     | 100    | 100     |
| about    | 96     | 100     |
| services | 96     | 96      |
| work     | 92     | 96      |
| contact  | 96     | 96      |

Runs with no failing audit: home-mobile, home-desktop, about-desktop.

## Audit summary

| Audit id       | Items (nodes) | Per run                                                                                                     | Source files                                                                                                                           |
| -------------- | ------------- | ----------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| color-contrast | 33            | about-mobile 1, services-mobile 11, work-mobile 1, contact-mobile 5, services-desktop 10, contact-desktop 5 | components/nav/NavPill.tsx, components/services/ServicesIntro.tsx, components/services/ServicesHero.tsx, components/ui/ContactForm.tsx |
| target-size    | 4             | work-mobile 2, work-desktop 2                                                                               | components/work/WorkExplorer.tsx, components/work/WorkWall.tsx                                                                         |

No other accessibility audit fails in any run. `heading-order` passes in all 10 runs.

## Unique nodes (for the fix subtasks)

| ID  | Element                                                                                 | Source                                                         | Runs and measured ratio                                                                 |
| --- | --------------------------------------------------------------------------------------- | -------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| N1  | `button#nav-cta` ("START A PROJECT")                                                    | components/nav/NavPill.tsx:148                                 | about-mobile 3.33, work-mobile 1.87, contact-mobile 1.01, contact-desktop 1.01          |
| N2  | services intro lines and words (`div.intro-line`, `span.relative`, `span[data-phrase]`) | components/services/ServicesIntro.tsx:65, :81, :163, :175      | services-mobile 8 lines + 3 spans, services-desktop 5 lines + 3 spans, all 1.12 or 1.22 |
| N3  | `span.truncate` in the hover service panel                                              | components/services/ServicesHero.tsx:265 (panel class at :185) | services-desktop 2 items, 1.73                                                          |
| N4  | contact form labels (`span.mono.text-xs.text-fg-dim`)                                   | components/ui/ContactForm.tsx:72, :76, :80, :84                | contact-mobile 3.94 (4 items), contact-desktop 4.45 (4 items)                           |
| N5  | work filter chips (`button.relative.mono-2xs`)                                          | components/work/WorkExplorer.tsx:66                            | work-mobile 2 items, work-desktop 2 items (target-size)                                 |

## color-contrast

Explanation format: ratio, foreground (fg), background (bg), font size, weight, expected ratio.

### about-mobile (1 node)

- `header.pointer-events-none > div.mx-auto > div.pointer-events-auto > button#nav-cta` (N1)
  - Snippet: `<button id="nav-cta" type="button" class="btn btn-primary hidden !h-10 md:inline-flex">`
  - Label: "START A PROJECT ↗"
  - Explanation: ratio 3.33, fg #36180e, bg #c6471a, 9.0pt (12px), normal weight, expected 4.5:1
  - Source: components/nav/NavPill.tsx:148

### services-mobile (11 nodes)

Intro lines (`div.intro-line`, 8 items), font 25.5pt (34px), ratio 1.12, fg #191918, bg #0a0a0a, expected 3:1 (large text):

- `div.wrap > div.relative > p#services-intro > div.intro-line`, label "UX, HCI, data, and"
- same selector, label "technology rarely work"
- same selector, label "together. At Lemma, all"
- same selector, label "four are designed as"
- same selector, label "one flow, so the result is"
- same selector, label "meaningful to the people"
- same selector, label "who use it, not just tidy in"
- same selector, label "a presentation."
- Snippet for all: `<div class="intro-line" style="position: relative; display: block; text-align: start; translate: none;">`
- Source: components/services/ServicesIntro.tsx:65 (`linesClass: "intro-line"`), start opacity 0.1 at :81

Intro words (3 items):

- `p#services-intro > div.intro-line > span.relative` `<span class="relative z-10 xl:pl-3">`, label "UX, HCI, data,", ratio 1.22, fg #212121, bg #0a0a0a, 25.5pt (34px), expected 3:1. Source: ServicesIntro.tsx:163
- `div.relative > p#services-intro > div.intro-line > span.relative` `<span data-phrase="0" class="relative inline-block whitespace-nowrap text-fg" ...>`, label "one flow", ratio 1.22, fg #212121, bg #0a0a0a, 29.1pt (38.76px), expected 3:1. Source: ServicesIntro.tsx:175
- same selector `<span data-phrase="1" ...>`, label "meaningful", ratio 1.22, fg #212121, bg #0a0a0a, 29.1pt (38.76px), expected 3:1. Source: ServicesIntro.tsx:175

### work-mobile (1 node)

- `header.pointer-events-none > div.mx-auto > div.pointer-events-auto > button#nav-cta` (N1)
  - Snippet: `<button id="nav-cta" type="button" class="btn btn-primary hidden !h-10 md:inline-flex">`
  - Label: "START A PROJECT ↗"
  - Explanation: ratio 1.87, fg #4d2010, bg #963816, 9.0pt (12px), normal weight, expected 4.5:1
  - Source: components/nav/NavPill.tsx:148

### contact-mobile (5 nodes)

- `header.pointer-events-none > div.mx-auto > div.pointer-events-auto > button#nav-cta` (N1)
  - Snippet: `<button id="nav-cta" type="button" class="btn btn-primary hidden !h-10 md:inline-flex">`
  - Label: "START A PROJECT ↗"
  - Explanation: ratio 1.01, fg #20110c, bg #23120c, 9.0pt (12px), normal weight, expected 4.5:1
  - Source: components/nav/NavPill.tsx:148
- Contact labels (N4), 4 items, all with the same explanation: ratio 3.94, fg #74716d, bg #0f0f0f, 9.0pt (12px), normal weight, expected 4.5:1
  - `div.rounded-[4px] > form.mt-8 > label.flex > span.mono`, snippet `<span class="mono text-xs text-fg-dim">`
  - Label "NAME": source components/ui/ContactForm.tsx:72
  - Label "EMAIL": source components/ui/ContactForm.tsx:76
  - Label "COMPANY (OPTIONAL)": source components/ui/ContactForm.tsx:80
  - Label "WHAT DO YOU WANT TO PROVE?": source components/ui/ContactForm.tsx:84

### services-desktop (10 nodes)

Hover panel labels (N3), 2 items, ratio 1.73, fg #403f3d, bg #151515, 9.0pt (12px), normal weight, expected 4.5:1:

- `div.absolute > div.space-y-1.5 > p.flex > span.truncate`, snippet `<span class="truncate">`, label "Brand & Visual Identity". Source: components/services/ServicesHero.tsx:265 (panel: ServicesHero.tsx:185)
- same selector, label "UX, HCI & Product Design". Source: components/services/ServicesHero.tsx:265

Intro lines (N2), 5 items, ratio 1.12, fg #191918, bg #0a0a0a, 36.0pt (48px), expected 3:1:

- `div.wrap > div.relative > p#services-intro > div.intro-line`, label "font-geist-mono UX, HCI, data, and technology"
- same selector, label "rarely work together. At Lemma, all"
- same selector, label "four are designed as one flow , so the"
- same selector, label "result is meaningful to the people who"
- same selector, label "use it, not just tidy in a presentation."
- Snippet: `<div class="intro-line" style="position: relative; display: block; text-align: start; translate: none;">`
- Source: components/services/ServicesIntro.tsx:65, start opacity at :81

Intro words (3 items):

- `p#services-intro > div.intro-line > span.relative > span.relative`, `<span class="relative z-10 xl:pl-3">`, label "UX, HCI, data,", ratio 1.22, fg #212121, bg #0a0a0a, 36.0pt (48px), expected 3:1. Source: ServicesIntro.tsx:163
- `span[data-phrase="0"]`, label "one flow", ratio 1.22, fg #212121, bg #0a0a0a, 41.0pt (54.72px), expected 3:1. Source: ServicesIntro.tsx:175
- `span[data-phrase="1"]`, label "meaningful", ratio 1.22, fg #212121, bg #0a0a0a, 41.0pt (54.72px), expected 3:1. Source: ServicesIntro.tsx:175

### contact-desktop (5 nodes)

- `button#nav-cta` (N1), label "START A PROJECT ↗"
  - Explanation: ratio 1.01, fg #24130d, bg #28140d, 9.0pt (12px), normal weight, expected 4.5:1
  - Source: components/nav/NavPill.tsx:148
- Contact labels (N4), 4 items, all with the same explanation: ratio 4.45, fg #7d7a75, bg #101010, 9.0pt (12px), normal weight, expected 4.5:1
  - Labels "NAME", "EMAIL", "COMPANY (OPTIONAL)", "WHAT DO YOU WANT TO PROVE?"
  - Snippet: `<span class="mono text-xs text-fg-dim">`
  - Source: components/ui/ContactForm.tsx:72, :76, :80, :84

## target-size

Explanation for every item: "Target has insufficient size because it is partially obscured (smallest space is 12px by 31.2px, should be at least 24px by 24px). Target has insufficient space to its closest neighbors. Safe clickable space has a diameter of 12px instead of at least 24px."

### work-mobile (2 nodes, N5)

- `div.wrap > div.mb-6 > div.relative > button.relative`, snippet `<button type="button" aria-pressed="false" class="relative mono mono-2xs flex items-center gap-2 rounded-full border px-3.5 …">`
  - Label "BRAND & VISUAL IDENTITY 5", box 207x31 at top 459, left 94
  - Neighbors: work tiles "01 · 2025 LPJ Ormawa IPB 2025" and "03 · 2025 JalanSiswa" (`data-cursor-label="OPEN"`, components/work/WorkWall.tsx:80 and :133)
  - Source: components/work/WorkExplorer.tsx:66
- same selector and snippet
  - Label "UX, HCI & PRODUCT DESIGN 3", box 214x31 at top 498, left 20
  - Neighbors: the same two work tiles (WorkWall.tsx:80 and :133)
  - Source: components/work/WorkExplorer.tsx:66

### work-desktop (2 nodes, N5)

- `div.wrap > div.mb-6 > div.relative > button.relative`, snippet as above
  - Label "BRAND & VISUAL IDENTITY 5", box 207x31 at top 415, left 128
  - Neighbors: work tiles "01 · 2025 LPJ Ormawa IPB 2025" and "06 · 2026 NATA" (WorkWall.tsx:80 and :133)
  - Source: components/work/WorkExplorer.tsx:66
- same selector and snippet
  - Label "UX, HCI & PRODUCT DESIGN 3", box 214x31 at top 415, left 343
  - Neighbors: "06 · 2026 NATA" (WorkWall.tsx:80 and :133) and the card `button.group` "№ 06 2026 NATA Five apps for one campus" (`class="group flex w-full flex-col gap-4 rounded-[4px] border ..."`, components/work/WorkWall.tsx:106)
  - Source: components/work/WorkExplorer.tsx:66

## Checked and not flagged

- `heading-order`: passes in all 10 runs. The stray `h4` at components/home/Services.tsx:329 has no Lighthouse node, so subtask 1.3 has no failing node in this list.
- Dim text in components/ui/AsciiStage.tsx:184 (`text-fg-dim/70`) and components/services/ServicesHero.tsx:305 (`text-fg-dim/60`) is not flagged in any run. Per the TODO rule, these are not in the list.
- The TODO cites `NavPill.tsx:141` for nav-cta. The button is at line 148 now (N1 above).
- No label-association audit fails. The contact issue is contrast only (N4).
