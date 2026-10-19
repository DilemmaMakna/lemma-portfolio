# Lemma Website

Landing page for Lemma (PT Masih Dilemma Makna), a venture studio in Jakarta. Built with Next.js (App Router), React, TypeScript, Tailwind CSS, GSAP, and Lenis.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Create a production build |
| `npm run start` | Serve the production build |
| `npm run lint` | Run ESLint |

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
