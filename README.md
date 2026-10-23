<div align="center">

<img src="./docs/assets/banner.png" alt="Lemma" width="900">
<br><br>

# Lemma Website

[Website](https://lemma.studio) &nbsp;&middot;&nbsp; [Instagram](https://www.instagram.com/lemma.bercerita/) &nbsp;&middot;&nbsp; [LinkedIn](https://www.linkedin.com/company/lemma-bercerita/) &nbsp;&middot;&nbsp; [Threads](https://www.threads.com/@lemma.bercerita)

![next.js](https://img.shields.io/static/v1?logo=nextdotjs&label=&message=next.js&color=36465D&logoColor=AAA&style=flat-square)
![react](https://img.shields.io/static/v1?logo=react&label=&message=react&color=36465D&logoColor=AAA&style=flat-square)
![typescript](https://img.shields.io/static/v1?logo=typescript&label=&message=typescript&color=36465D&logoColor=AAA&style=flat-square)
![tailwind](https://img.shields.io/static/v1?logo=tailwindcss&label=&message=tailwind&color=36465D&logoColor=AAA&style=flat-square)
![gsap](https://img.shields.io/static/v1?logo=greensock&label=&message=gsap&color=36465D&logoColor=AAA&style=flat-square)
![oxc](https://img.shields.io/static/v1?logo=oxc&label=&message=oxc&color=36465D&logoColor=AAA&style=flat-square)

</div>

## About

Lemma (PT Masih Dilemma Makna) is a venture studio in Jakarta. This repository is its landing page, built with [Next.js](https://nextjs.org) (App Router), [React](https://react.dev), [TypeScript](https://www.typescriptlang.org), [Tailwind CSS](https://tailwindcss.com), [GSAP](https://gsap.com) and [Lenis](https://lenis.darkroom.engineering).

- **Bilingual Copy**: Indonesian and English text, switched on the client and remembered in a `NEXT_LOCALE` cookie. All copy lives in `lib/messages.ts`.
- **Dark and Light Theme**: Dark by default. The choice is stored in `localStorage` under `lemma-theme` and applied before first paint.
- **Motion**: [GSAP](https://gsap.com) animations with [Lenis](https://lenis.darkroom.engineering) smooth scroll and page transitions.
- **Typed Environment**: Site settings are read and validated in one module, `lib/env.ts`.
- **SEO**: Per-page metadata and canonical URLs, sitemap, robots, Open Graph and Twitter images, JSON-LD, and `llms.txt` routes, all built on [Next.js](https://nextjs.org) metadata routes.
- **Contact API**: A same-origin JSON endpoint with a per-IP rate limit, a honeypot and a fill-time check. Messages go to an optional webhook, or the form falls back to a `mailto:` link.
- **Design Tokens**: Colors, type scale, radius and easing are CSS custom properties mapped into [Tailwind CSS](https://tailwindcss.com) 4 `@theme`.
- **Lighthouse Runner**: `scripts/lighthouse.sh` builds, starts and audits five pages on mobile and desktop. Results are recorded in `docs/lighthouse/`.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Bun is also supported (`bun.lock` is committed). npm stays supported with `package-lock.json`.

| npm             | bun             |
| --------------- | --------------- |
| `npm install`   | `bun install`   |
| `npm run dev`   | `bun run dev`   |
| `npm run build` | `bun run build` |
| `npm run lint`  | `bun run lint`  |

## Scripts

| Command         | What it does                 |
| --------------- | ---------------------------- |
| `npm run dev`   | Start the development server |
| `npm run build` | Create a production build    |
| `npm run start` | Serve the production build   |
| `npm run lint`  | Run ESLint                   |

## Deploy (Vercel)

Set these environment variables in Vercel (Project → Settings → Environment Variables):

| Variable                   | Purpose                                                                                                                                         |
| -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL`     | Production origin used for canonical URLs, sitemap, JSON-LD and `/llms.txt` (default `https://lemma.studio`).                                   |
| `GOOGLE_SITE_VERIFICATION` | Token from Google Search Console ("HTML tag" method). Rendered as `<meta name="google-site-verification">`.                                     |
| `CONTACT_WEBHOOK_URL`      | Where the contact form is forwarded (e.g. a Make, Zapier, n8n or Formspree webhook that emails you). Server-only; never exposed to the browser. |

Without it the form does not lose messages: it shows a pre-filled `mailto:` link instead.
The contact API only accepts same-origin JSON, rate-limits per IP, and silently drops bot submissions (honeypot + fill-time check).

## Work Photos

Put raw PNG/JPG files in `public/work-photos/<project-slug>/`, then run `node scripts/optimize-work-photos.mjs`. It converts them to WebP, deletes the originals and regenerates `lib/work-photos.ts`.

## Project Structure

- `app/` - root layout, home page, global styles, fonts
- `components/home/` - one component per home section
- `components/nav/` - floating nav pill and mobile menu
- `components/ui/` - shared UI pieces (buttons, cursor, canvas effects)
- `lib/` - GSAP and Lenis setup, intro animation, and `messages.ts` (all ID and EN text)
- `public/` - logo, service images, and other static assets

## Content and Design

- Copy source: `.copyw/lemma_home_copywriting.md`. Keep text in `lib/messages.ts` and do not hardcode strings in components.
- Design brief: `.agents/DESIGN.md`. Dark theme only, one orange accent, mono labels.
- Public pages must not show the full name or technical details of the ARAH product.
