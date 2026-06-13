# AGENTS.md — Implementing Lemma in Next.js + GSAP

This file is the cross-agent build guide for shipping Lemma as a production Next.js site with GSAP-driven motion. It pairs with `readme.md` (the design rules) and `SKILL.md` (the agent invocation manifest).

## 1. Project bootstrap

```bash
pnpm create next-app@latest lemma-site --typescript --app --tailwind=false --src-dir
cd lemma-site
pnpm add gsap @gsap/react
```

Lemma intentionally does **not** use Tailwind. The whole system runs on CSS custom properties + a small set of React components — that's it.

## 2. Wiring the tokens

1. Copy this design system's `styles.css` and `tokens/` folder into `src/styles/`.
2. Update `styles.css`'s imports to be relative to the new location.
3. In `src/app/layout.tsx`:

```tsx
import "@/styles/styles.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
```

All tokens are now reachable as `var(--orange-500)`, `font: var(--type-section-title)`, etc.

## 3. Components

Copy each `components/<group>/<Name>.jsx` + `.d.ts` into `src/components/<group>/`. Rename `.jsx` → `.tsx` and type the props from the sibling `.d.ts`. Drop the `window.LemmaDesignSystem_e5b9a2` lookup — these are now first-class imports.

```tsx
// src/components/buttons/Button.tsx
"use client";
import * as React from "react";
import type { ButtonProps } from "./Button.types";

export function Button({ variant = "primary", ... }: ButtonProps) { ... }
```

## 4. Fonts

`tokens/fonts.css` loads General Sans from Fontshare's CDN. For prod, prefer `next/font/local`:

```tsx
import localFont from "next/font/local";
const generalSans = localFont({
  src: [
    { path: "../fonts/GeneralSans-Light.woff2",   weight: "300" },
    { path: "../fonts/GeneralSans-Regular.woff2", weight: "400" },
    { path: "../fonts/GeneralSans-Medium.woff2",  weight: "500" },
  ],
  variable: "--font-sans-runtime",
  display: "swap",
});
```

Then in `globals.css` reassign `--font-sans: var(--font-sans-runtime, "General Sans"), system-ui, ...`.

Grab `.woff2` files from <https://www.fontshare.com/fonts/general-sans>.

## 5. GSAP motion patterns

Lemma's hero is the marquee motion target. Use the `@gsap/react` `useGSAP` hook and ScrollTrigger for everything below the fold.

### Hero — split-headline reveal
The "Digital" + "Partner" pair stagger in from below with the halo card cross-fading between them.

```tsx
"use client";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

useGSAP(() => {
  const tl = gsap.timeline({ defaults: { ease: "expo.out", duration: 0.9 } });
  tl.from(".hero-digital", { y: 80, opacity: 0 })
    .from(".hero-halo",    { scale: 0.85, opacity: 0, rotate: 0 }, "-=0.5")
    .from(".hero-partner", { y: 80, opacity: 0 }, "-=0.6")
    .from(".hero-stats > *", { y: 20, opacity: 0, stagger: 0.08 }, "-=0.5");
});
```

### Section pinning — service stack
Each immersive service tile pins for the duration of its own height, with the badge auto-incrementing:

```tsx
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

useGSAP(() => {
  document.querySelectorAll<HTMLElement>(".service-tile").forEach((tile, i) => {
    ScrollTrigger.create({
      trigger: tile, start: "top top", end: "+=100%",
      pin: true, pinSpacing: true,
      onEnter:    () => setActive(i + 1),
      onEnterBack:() => setActive(i + 1),
    });
  });
}, []);
```

### Section reveals — fade-up
Generic ScrollTrigger reveal for paragraphs:

```tsx
gsap.utils.toArray<HTMLElement>(".reveal-up").forEach((el) => {
  gsap.from(el, {
    y: 24, opacity: 0, duration: 0.68, ease: "power3.out",
    scrollTrigger: { trigger: el, start: "top 80%" },
  });
});
```

### Curtain effect on the footer wordmark
The 240px "Lemma" scales from 0.92 → 1 on enter, while the fade-to-deep gradient sweeps up:

```tsx
useGSAP(() => {
  gsap.from(".footer-wordmark", {
    scale: 0.92, opacity: 0, duration: 1.0, ease: "expo.out",
    scrollTrigger: { trigger: ".footer-wordmark", start: "top 90%" },
  });
});
```

### Reduced motion
Always wrap reveals in `gsap.matchMedia`:

```tsx
gsap.matchMedia().add({
  reducedMotion: "(prefers-reduced-motion: reduce)",
  normalMotion:  "(prefers-reduced-motion: no-preference)",
}, (ctx) => {
  if (ctx.conditions?.normalMotion) {
    // attach scroll triggers
  }
  // else: leave end-state visible, no animation
});
```

## 6. Routing & content

Single page, anchor-based nav. The four nav links scroll to sections, not separate routes:

```tsx
const NAV = [
  { id: "about",    label: "About"    },
  { id: "services", label: "Services" },
  { id: "work",     label: "Work"     },
  { id: "clients",  label: "Clients"  },
];
```

For the work showcase, expand to `app/work/[slug]/page.tsx` later.

## 7. Image handling

- Use `next/image` for all real client artwork. Cover photos render at 1268×400 (project cards in the 2-column grid).
- Decorative SVGs (`barrel-pattern.svg`, `lemma-wordmark.svg`) ship from `/public` — they're tiny.
- Avoid full-bleed photography in section headers; the brand's "imagery" is its own decorative gradients.

## 8. Accessibility

- Maintain 4.5:1 contrast on body copy. The cream `--surface-paper` + `--neutral-800` body pair passes.
- The "white text on orange radial" combo on Prinsip/footer is ~4.6:1 against the lighter parts of the gradient — keep paragraph weight at 400, not 300.
- Keyboard nav: `<Navbar>` already renders semantic `<a>` tags; `IndexBadge` is a `<button>`.
- `prefers-reduced-motion` respected throughout — gate every GSAP timeline on `gsap.matchMedia`.

## 9. Lint / formatting

Use the generated `_adherence.oxlintrc.json` for component adherence. Pair with Biome or ESLint + Prettier per team preference.

## 10. Open questions for the user

- **Real client logos / artwork** for the four showcase projects — please drop into `/public/work/<slug>/cover.jpg`.
- **Font hosting** — keep Fontshare CDN or self-host? (Recommend self-host for prod.)
- **Service tile decorations** — current vector backdrops are simplified. Replace with refined SVGs if a designer can produce them.
- **CMS plans** — the brief mentions "easy-to-update without code". Sanity / Payload / Tina would all suit; ask the user which.
