"use client";

import Image from "next/image";
import { useLocale } from "@/components/providers/LocaleProvider";
import Button from "@/components/ui/Button";

export default function Products() {
  const { t } = useLocale();
  const p = t.products;
  return (
    <section id="products" className="section section-raised" aria-labelledby="products-title">
      <div className="wrap">
        <h2 id="products-title" data-reveal="title" className="h-section mb-14 max-w-[16ch] md:mb-20">
          {p.title}
        </h2>

        <div className="grid gap-6">
          {p.items.map((it, i) => {
            return (
              <article
                key={i}
                data-reveal
                className={`group @container relative flex min-h-[22rem] flex-col justify-between overflow-hidden rounded-[4px] border border-line bg-surface p-6 transition-colors duration-500 md:p-8 hover:border-line-strong hover:bg-surface-2`}
              >
                <div className="relative z-10 flex flex-wrap items-center gap-3">
                  <span className="mono text-fg-dim">0{i + 1}</span>
                  <span className="badge is-active">
                    <i />
                    {it.badge}
                  </span>
                </div>

                {(
                  // Dekoratif: seluruh kartu adalah pemicu hover (group). Di kartu sempit (mobile) gambar dipotong rapat ke
                  // ponselnya (PNG aslinya punya tepi transparan lebar), tampil di alur normal, tanpa gerak hover.
                  // Di kartu lebar (>= 28rem) menempel di kanan; skala/rotasi/hover di sana disetel manual.
                  <div
                    aria-hidden="true"
                    className="pointer-events-none relative z-0 mx-auto my-4 aspect-[5/4] w-full overflow-hidden @md:absolute @md:-bottom-6 @md:-right-10 @md:top-auto @md:mx-0 @md:my-0 @md:aspect-auto @md:w-[62%] @md:overflow-visible"
                  >
                    <div className="absolute inset-[28%] rounded-full bg-accent/25 opacity-60 blur-[50px] @md:inset-[15%] @md:blur-[70px] transition-opacity duration-700 group-hover:opacity-100" />
                    <Image
                      src="/nata/assets/hero-right-phones.webp"
                      alt=""
                      width={1424}
                      height={1082}
                      sizes="(min-width: 768px) 30vw, 85vw"
                      className="relative -ml-[15%] -mt-[9%] h-auto w-[130%] max-w-none origin-bottom select-none transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] @md:ml-0 @md:mt-0 @md:w-full @md:scale-150 @md:-bottom-20 @md:-right-32 @md:-rotate-20 @md:motion-safe:group-hover:-translate-y-3 @md:motion-safe:group-hover:-rotate-32 @md:motion-safe:group-hover:scale-[1.56]"
                    />
                  </div>
                )}

                <div className={`relative z-10 my-4 @md:max-w-[55%]`}>
                  <h3 className="text-[clamp(2.5rem,6vw,4.5rem)] font-medium leading-none tracking-[-0.04em]">
                    {it.name}
                  </h3>
                  <p className="mt-5 max-w-[24ch] text-fg-muted">{it.desc}</p>
                </div>

                <div className={`relative z-10 flex flex-wrap items-center gap-8 @md:max-w-[55%]`}>
                  <div className="flex flex-wrap gap-2">
                    {it.tags.map((tg, j) => (
                      <span key={`${tg}-${j}`} className="tag">
                        {tg}
                      </span>
                    ))}
                  </div>
                  <Button
                    id="product-nata"
                    variant="primary"
                    href="/nataku"
                  >
                    {it.cta}
                  </Button>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
