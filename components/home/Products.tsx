"use client";

import Image from "next/image";
import { useLocale } from "@/components/LocaleProvider";
import SectionLabel from "@/components/ui/SectionLabel";
import Button from "@/components/ui/Button";
import Redacted from "@/components/ui/Redacted";

export default function Products() {
  const { t } = useLocale();
  const p = t.products;
  return (
    <section id="products" className="section section-raised" aria-labelledby="products-title">
      <div className="wrap">
        <SectionLabel>{p.label}</SectionLabel>
        <h2 id="products-title" data-reveal="title" className="h-section mb-14 max-w-[16ch] md:mb-20">
          {p.title}
        </h2>

        <div className="grid gap-6 md:grid-cols-2">
          {p.items.map((it, i) => {
            const stealth = it.status === "idle";
            return (
              <article
                key={i}
                data-reveal
                className={`group flex min-h-[22rem] flex-col justify-between rounded-[4px] border border-line bg-surface p-6 transition-colors duration-500 md:p-8 ${
                  stealth ? "relative overflow-hidden" : "hover:border-line-strong hover:bg-surface-2"
                }`}
              >
                {stealth ? (
                  <Image
                    src="/dithered/products-stealth.webp"
                    width={640}
                    height={640}
                    sizes="(min-width: 768px) 50vw, 100vw"
                    loading="lazy"
                    alt=""
                    aria-hidden="true"
                    unoptimized
                    className="dither-art pointer-events-none absolute inset-0 h-full w-full object-cover"
                  />
                ) : null}
                <div className="relative flex items-start justify-between gap-4">
                  <span className="mono text-fg-dim">0{i + 1}</span>
                  <span className={`badge ${stealth ? "" : "is-active"}`}>
                    <i />
                    {it.badge}
                  </span>
                </div>

                <div className="relative my-10">
                  <h3 className="text-[clamp(2.5rem,6vw,4.5rem)] font-medium leading-none tracking-[-0.04em]">
                    {stealth ? <Redacted className="text-fg-dim" /> : it.name}
                  </h3>
                  <p className="mt-5 max-w-[34ch] text-fg-muted">{it.desc}</p>
                </div>

                <div className="relative flex flex-wrap items-center justify-between gap-4">
                  <div className="flex flex-wrap gap-2">
                    {it.tags.map((tg) => (
                      <span key={tg} className="tag">
                        {tg}
                      </span>
                    ))}
                  </div>
                  <Button
                    id={stealth ? "product-arah" : "product-nata"}
                    variant={stealth ? "ghost" : "primary"}
                    disabled={stealth}
                    href={stealth ? undefined : "/products/nata"}
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
