# Architecture

This guide explains how the Lemma website is organized and how to extend it. It is for people who change the code. Commands, branch names and commit rules are in [CONTRIBUTING.md](CONTRIBUTING.md).

This project runs Next.js 16.4.2. This version has breaking changes compared with older releases, so APIs, conventions and file structure may differ from what you remember. The reference is the documentation shipped with the package in `node_modules/next/dist/docs/`. Read the relevant guide there before you write Next.js code, and follow any deprecation notices it gives. `AGENTS.md` states the same rule.

## Folders by feature

Routes live in `app/`. Components are grouped by the page or feature they belong to. A feature folder holds only the components for that feature.

- `app/`: routes and route-level files. `app/page.tsx` is the home page. `about/`, `services/`, `work/` and `contact/` each hold a `page.tsx`. `api/contact/route.ts` is the contact form endpoint. `layout.tsx`, `sitemap.ts`, `robots.ts`, `manifest.ts` and the image routes sit directly in `app/`. `app/(machine)/` is a route group for the machine-readable routes `llms.txt`, `llms-full.txt` and `index.md`; the group name is not part of the URL. `styles/tokens.css` holds the design tokens.
- `components/home/`: sections of the home page, such as `Hero.tsx`, `Premise.tsx`, `Process.tsx`, `Services.tsx`, `SelectedWork.tsx`, `Products.tsx`, `About.tsx`, `ContactCta.tsx` and `Footer.tsx`.
- `components/nav/`: site navigation (`NavPill.tsx`).
- `components/about/`, `components/services/`, `components/work/` and `components/contact/`: sections for each page. Several of these folders also hold a small copy hook, such as `components/about/useAboutCopy.ts`.
- `components/ui/`: shared pieces used by more than one feature, such as `Button.tsx`, `ContactForm.tsx`, `ThemeToggle.tsx`, `Cursor.tsx` and `PageTransition.tsx`. Code in `components/ui/` must not import from a feature folder.
- `components/providers/`: app-wide providers, `Providers.tsx` and `LocaleProvider.tsx`.
- `components/layout/`: page-level helpers, `SmoothScroll.tsx`, `PageAnimations.tsx` and `JsonLd.tsx`.
- `lib/`: non-visual code. It holds configuration, text, data and helpers. `lib/content/` holds copy and data, `lib/motion/` holds GSAP, Lenis and intro setup, `lib/seo/` holds metadata, JSON-LD and the LLM text, and `lib/ui/` holds the theme and topography helpers. `lib/env.ts` and `lib/fonts.ts` (with its font file in `lib/fonts/`) sit at the top. See the layers section below.

## Layers: view, logic, data

The GreatFrontEnd front-end system design playbook describes a layered way to split a front end into view, logic and data: https://www.greatfrontend.com/front-end-system-design-playbook/framework. That playbook is a high-level framework for talking through a design in an interview. It is not a folder layout, so this repository does not copy its names. We use the three layers as a rule about dependencies.

- **View**: React components and route files (`app/**/page.tsx` and `components/**`). They render UI and receive their text and data through props, hooks or context.
- **Logic**: hooks, providers and helpers that connect the view to the data. Examples are `components/providers/LocaleProvider.tsx`, the `use*Copy.ts` hooks, and `lib/motion/gsap.ts`, `lib/motion/lenis.ts` and `lib/motion/intro.ts`.
- **Data**: static content and configuration in `lib/`, such as `lib/content/messages.ts`, `lib/content/work.ts`, `lib/content/services.ts`, `lib/seo/site.ts` and `lib/env.ts`. The contact endpoint in `app/api/contact/route.ts` is the only API route. The `llms` routes and the sitemap build their output from the same `lib/` data. There is no database and no data-fetching layer.

Dependencies point one way: view depends on logic, logic depends on data, and data never depends on the view. Today `lib/` does not import from `components/`, and that rule must hold.

## Server and client components

Components in the App Router are Server Components by default. A file marked with `"use client"` becomes a client boundary: that file and the modules it imports are sent to the browser. Add `"use client"` only to the smallest leaf that needs state, effects, event handlers or browser APIs. Do not add it to pages or layouts. `app/layout.tsx` and the page files are Server Components today.

For more detail, read the Server and Client Components guide in `node_modules/next/dist/docs/01-app/01-getting-started/05-server-and-client-components.md`.

## Imports

Import with the `@/` alias, which maps to the project root (`tsconfig.json`). For example, `import { env } from "@/lib/env";`.

Do not add barrel files (`index.ts` files that re-export a folder). They make tree shaking less reliable and make it easy to pull client code into server code by accident. Import each module by its own path.

## Configuration and environment

Read environment variables only in `lib/env.ts`. That module parses and checks them once when it loads, and the rest of the code imports the parsed `env` object. The variables are listed in `.env.example`.

`CONTACT_WEBHOOK_URL` is server-only. Never import `env.contactWebhookUrl` from a client component.

## Design tokens

Define design tokens only in `app/styles/tokens.css`. Components use the generated Tailwind utilities or `var(--name)`. Do not write new color values or a numeric `z-index` in a component.

- **Colors and theme**: base values are set in `:root`. Light theme values are set in `html[data-theme="light"]`.
- **Layers**: use the z-index utilities `z-grain`, `z-overlay`, `z-modal`, `z-transition`, `z-preloader` and `z-cursor`. Each one maps to a `--z-index-*` token.
- **Type scale**: use the `text-ds-*` utilities (`--text-ds-xs` to `--text-ds-2xl`). The bare names `--text-xs` to `--text-2xl` collide with Tailwind defaults, so they are kept only as the source of the aliases.
- **Other tokens**: spacing (`--spacing-gutter`, `--spacing-margin`), easing (`--ease-out-expo`) and radius are also defined there.

## Copy and text

User-facing text lives in `lib/content/messages.ts`, which holds the shared and home page copy in Indonesian (`id`) and English (`en`). Each section has its own copy file with the same two keys: `lib/content/about.ts`, `lib/content/contact.ts`, `lib/content/services.ts` and `lib/content/work.ts`. Components read copy through `useLocale` or a `use*Copy` hook. Do not write copy directly in a component.

## Pages and metadata

Each route is a folder under `app/` with a `page.tsx`. A page exports `metadata` built by `pageMeta(path, title, description)` from `lib/seo/site.ts`. `pageMeta` sets the absolute page title, the canonical URL and the Open Graph data, so include the site name yourself, for example `"About Us | Lemma"`. A page can also render JSON-LD with `pageJsonLd`, as `app/about/page.tsx` does.

## How to add a page

1. Create `app/<route>/page.tsx`. Keep it a Server Component, with no `"use client"`, and compose section components from `components/<route>/`.
2. Export `metadata = pageMeta("/<route>", title, description)`.
3. Add the public URL to the list in `app/sitemap.ts`.
4. Add a `[name, path, description]` row to the `pages` list in `lib/seo/llms.ts`. That list feeds both `/llms.txt` and `/llms-full.txt`.

## How to add a token

1. Add the value to `app/styles/tokens.css`. If the value changes with the theme, set the dark value in `:root` and the light value in `html[data-theme="light"]`.
2. If you need a Tailwind utility, declare the token in a `@theme` block. Use `@theme inline` when the token refers to another variable, and `@theme static` when the utility must always be generated, as for z-index, easing and type. For example, `--z-index-tooltip` in `@theme static` produces the `z-tooltip` utility.
3. Use the utility, or `var(--name)`, in components. Do not repeat the value.

## Open items

These are known gaps. They are not fixed by this guide.

- Most components are client components today. About 51 of the 87 `.ts` and `.tsx` files under `app/`, `components/` and `lib/` contain `"use client"`. Moving leaves that need no state to Server Components is open work.
- `components/home/Hero.tsx` uses a raw `<img>` element instead of `next/image`.
- `components/services/CollaborativeCursors.tsx` uses a numeric `z-[5]` instead of a token.
