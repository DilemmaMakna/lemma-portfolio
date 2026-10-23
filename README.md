# Lemma Website

Landing page for Lemma (PT Masih Dilemma Makna), a venture studio in Jakarta. Built with Next.js (App Router), React, TypeScript, Tailwind CSS, GSAP, and Lenis.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Bun is also supported (`bun.lock` is committed). npm stays supported with `package-lock.json`.

| npm | bun |
|---|---|
| `npm install` | `bun install` |
| `npm run dev` | `bun run dev` |
| `npm run build` | `bun run build` |
| `npm run lint` | `bun run lint` |

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Create a production build |
| `npm run start` | Serve the production build |
| `npm run lint` | Run ESLint |

## Deploy (Vercel)

Set these environment variables in Vercel (Project → Settings → Environment Variables):

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Production origin used for canonical URLs, sitemap, JSON-LD and `/llms.txt` (default `https://lemma.studio`). |
| `GOOGLE_SITE_VERIFICATION` | Token from Google Search Console ("HTML tag" method). Rendered as `<meta name="google-site-verification">`. |
| `CONTACT_WEBHOOK_URL` | Where the contact form is forwarded (e.g. a Make, Zapier, n8n or Formspree webhook that emails you). Server-only; never exposed to the browser. |

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
