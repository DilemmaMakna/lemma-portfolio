"use client";

import { useLocale } from "@/components/LocaleProvider";
import SectionLabel from "@/components/ui/SectionLabel";
import Button from "@/components/ui/Button";
import PixelReveal from "@/components/ui/PixelReveal";

type Item = { name: string; tag: string; year: string; hook: string };

const hookCls =
  "opacity-100 [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover:opacity-100 transition-opacity duration-500";

function Meta({ n, item, view, className = "" }: { n: number; item: Item; view: string; className?: string }) {
  return (
    <div className={`flex flex-col justify-between gap-8 ${className}`}>
      <div>
        <div className="mono text-fg-dim">PROJECT 0{n + 1}</div>
        <h3 className="mt-4 text-[clamp(1.75rem,3.6vw,3.25rem)] font-medium leading-[1.05] tracking-[-0.03em]">
          {item.name}
        </h3>
        <div className="mt-5 flex flex-wrap items-center gap-2">
          {item.tag.split(", ").map((tg) => (
            <span key={tg} className="tag">{tg}</span>
          ))}
          <span className="mono ml-1 text-fg-dim">{item.year}</span>
        </div>
      </div>
      <div className={hookCls}>
        <p className="max-w-[30ch] text-fg-muted">{item.hook}</p>
        <span className="mono mt-4 inline-block text-accent">{view} →</span>
      </div>
    </div>
  );
}

function Frame({ seed, label, view, aspect = "aspect-[16/10]" }: { seed: number; label: string; view: string; aspect?: string }) {
  return (
    <div className={`relative w-full ${aspect}`} data-cursor-label={view.toUpperCase()}>
      <PixelReveal seed={seed} label={label} />
    </div>
  );
}

export default function SelectedWork() {
  const { t } = useLocale();
  const w = t.work;
  const [a, b, c, d] = w.items;

  return (
    <section id="work" className="section bg-bg" aria-label={w.label}>
      <div className="wrap">
        <SectionLabel>{w.label}</SectionLabel>

        <div className="flex flex-col gap-20 md:gap-28">
          {/* 01: gambar 7 kolom kiri, meta 5 kolom kanan */}
          <article data-pixel-host data-reveal className="group grid12 items-stretch gap-y-6">
            <div className="col-span-full lg:col-span-7"><Frame seed={0} label={a.name} view={w.view} /></div>
            <Meta n={0} item={a} view={w.view} className="col-span-full lg:col-span-5 lg:pl-6" />
          </article>

          {/* 02: meta 4 kolom kiri, gambar 8 kolom kanan */}
          <article data-pixel-host data-reveal className="group grid12 items-stretch gap-y-6">
            <Meta n={1} item={b} view={w.view} className="order-2 col-span-full lg:order-1 lg:col-span-4 lg:pr-6" />
            <div className="order-1 col-span-full lg:order-2 lg:col-span-8"><Frame seed={1} label={b.name} view={w.view} /></div>
          </article>

          {/* 03: dua kolom setara */}
          <article data-pixel-host data-reveal className="group grid12 items-stretch gap-y-6">
            <div className="col-span-full lg:col-span-6"><Frame seed={2} label={c.name} view={w.view} aspect="aspect-[4/3]" /></div>
            <Meta n={2} item={c} view={w.view} className="col-span-full lg:col-span-6 lg:pl-10" />
          </article>

          {/* 04: gambar penuh dengan caption overlay */}
          <article data-pixel-host data-reveal className="group relative">
            <Frame seed={3} label={d.name} view={w.view} aspect="aspect-[16/9] md:aspect-[21/9]" />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col gap-3 p-5 md:flex-row md:items-end md:justify-between md:p-8">
              <div className="bg-bg/90 p-4 md:p-5">
                <div className="mono text-fg-dim">PROJECT 04</div>
                <h3 className="mt-2 text-[clamp(1.5rem,3vw,2.5rem)] font-medium leading-none tracking-[-0.03em]">{d.name}</h3>
                <div className="mt-3 flex items-center gap-3">
                  <span className="tag">{d.tag}</span>
                  <span className="mono text-fg-dim">{d.year}</span>
                </div>
              </div>
              <div className={`bg-bg/90 p-4 md:p-5 ${hookCls}`}>
                <p className="text-fg-muted">{d.hook}</p>
                <span className="mono mt-2 inline-block text-accent">{w.view} →</span>
              </div>
            </div>
          </article>
        </div>

        <div className="mt-16" data-reveal>
          <Button variant="ghost" href="/work">
            {w.all}
          </Button>
        </div>
      </div>
    </section>
  );
}
