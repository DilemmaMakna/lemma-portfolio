"use client";

import Link from "next/link";
import { useLocale } from "@/components/providers/LocaleProvider";
import { projects, isOpenable, studioStats } from "@/lib/content/work";
import AsciiMenu from "./AsciiMenu";

export type MenuKey = "services" | "work" | "products" | "about";
export const MENU_KEYS: readonly string[] = ["services", "work", "products", "about"];

const row =
  "group flex items-baseline gap-3 rounded-[4px] px-3 py-2.5 transition-colors hover:bg-surface-2 focus-visible:bg-surface-2";

// Isi panel megamenu: daftar tautan di kiri, ilustrasi ASCII di kanan. Semua teks dari messages.ts
// dan data proyek, tidak ada copy baru di sini.
export default function MegaMenu({ menu, onNavigate }: { menu: MenuKey; onNavigate: () => void }) {
  const { t, locale } = useLocale();
  const featured = projects.filter((p) => p.featured && isOpenable(p)).slice(0, 5);

  let heading: string = t.nav[menu];
  let all: { href: string; label: string } = { href: `/${menu}`, label: t.nav[menu] };
  let list: React.ReactNode;

  if (menu === "services") {
    all = { href: "/services", label: t.services.all };
    list = t.services.items.map((s, i) => (
      <Link key={s.name} href={`/services#service-0${i + 1}`} onClick={onNavigate} className={row}>
        <span className="mono w-5 shrink-0 text-fg-dim group-hover:text-accent">0{i + 1}</span>
        <span>
          <span className="block text-[15px] font-medium leading-tight">{s.name}</span>
          <span className="mt-0.5 block text-[13px] leading-snug text-fg-muted">{s.summary}</span>
        </span>
      </Link>
    ));
  } else if (menu === "work") {
    all = { href: "/work", label: t.work.all };
    heading = t.work.highlight;
    list = featured.map((p) => (
      <Link key={p.slug} href={`/work?p=${p.slug}`} onClick={onNavigate} className={row}>
        <span className="mono w-5 shrink-0 text-fg-dim group-hover:text-accent">{p.n}</span>
        <span>
          <span className="block text-[15px] font-medium leading-tight">{p.name}</span>
          <span className="mono mono-2xs mt-1 block !normal-case text-fg-dim">
            {p.category} / {p.year}
          </span>
        </span>
      </Link>
    ));
  } else if (menu === "products") {
    all = { href: "/#products", label: t.nav.products };
    list = t.products.items.map((p) => (
      <Link key={p.name} href="/nataku" onClick={onNavigate} className={row}>
        <span className="mono w-5 shrink-0 text-accent">01</span>
        <span>
          <span className="flex items-center gap-2 text-[15px] font-medium leading-tight">
            {p.name}
            <span className="mono mono-2xs rounded-full border border-line-strong px-2 py-0.5 !normal-case text-fg-dim">
              {p.badge}
            </span>
          </span>
          <span className="mt-0.5 block text-[13px] leading-snug text-fg-muted">{p.desc}</span>
        </span>
      </Link>
    ));
  } else {
    all = { href: "/about", label: t.about.link };
    heading = t.about.title;
    const stats = studioStats(t.about.stats);
    list = (
      <div className="px-3 py-2">
        <p className="max-w-[44ch] text-[13px] leading-relaxed text-fg-muted">{t.about.body}</p>
        <dl className="mt-5 flex gap-8">
          {stats.map((s) => (
            <div key={s.label}>
              <dt className="mono mono-2xs !normal-case text-fg-dim">{s.label}</dt>
              <dd className="mt-1 text-2xl font-medium tracking-[-0.03em] tabular-nums text-accent">{s.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    );
  }

  return (
    <div lang={locale} className="grid grid-cols-[minmax(0,1fr)_auto] gap-6 p-3">
      <div className="flex min-w-0 flex-col">
        <div className="mono px-3 pb-2 pt-3 text-fg-dim">{heading}</div>
        <div className="flex flex-col">{list}</div>
        <Link
          href={all.href}
          onClick={onNavigate}
          className="mono mt-3 flex items-center justify-between border-t border-line px-3 pt-4 text-fg-muted transition-colors hover:text-accent"
        >
          {all.label}
          <span aria-hidden="true">-&gt;</span>
        </Link>
      </div>
      <div className="flex w-[330px] items-center justify-center self-stretch overflow-hidden rounded-[4px] border border-line bg-bg p-3 min-[1360px]:w-[372px]">
        <AsciiMenu scene={menu} className="w-full" />
      </div>
    </div>
  );
}
