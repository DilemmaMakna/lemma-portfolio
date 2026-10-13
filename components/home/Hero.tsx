"use client";

import { useLocale } from "@/components/LocaleProvider";
import Button from "@/components/ui/Button";
import DotGrid from "@/components/ui/DotGrid";
import { scrollToId } from "@/lib/lenis";

export default function Hero() {
  const { t } = useLocale();
  const h = t.hero;
  const lines = [h.line1, h.line2, h.line3];

  return (
    <section
      id="top"
      className="relative flex min-h-[100svh] flex-col overflow-hidden bg-bg"
      aria-labelledby="hero-title"
    >
      <div className="absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,#000_40%,transparent_100%)]">
        <DotGrid />
      </div>

      <div className="wrap relative z-10 flex flex-1 flex-col pb-8 pt-16 md:pt-20">
        {/* <div className="mono flex items-center justify-between text-fg-dim" data-intro="fade">
          <span>{h.eyebrow}</span>
          <span>{h.place} &nbsp; GMT+7</span>
        </div> */}

        <div className="flex flex-1 items-center py-12">
          <h1 id="hero-title" className="h-hero">
            {lines.map((line, i) => (
              <span
                key={i}
                className="block"
                style={{ paddingLeft: `calc(${i} * clamp(1.25rem, 8.3vw, 8rem))` }}
              >
                {line.split(" ").map((word, j) => (
                  <span
                    key={j}
                    data-intro="word"
                    className={`inline-block pr-[0.22em] ${i === h.accent ? "text-accent" : ""}`}
                  >
                    {word}
                  </span>
                ))}
              </span>
            ))}
          </h1>
          <img src="/lemma-logo-hero.svg" alt="Hero Image" className="absolute top-40 right-20" />

        </div>

        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <p className="lead max-w-[34ch] md:max-w-[44ch]" data-intro="fade">
            {h.lead}
          </p>
          <div data-intro="fade">
            <Button id="hero-cta" href="#contact" onClick={(e) => { e.preventDefault(); scrollToId("contact"); }}>
              {t.nav.cta}
            </Button>
          </div>
        </div>

        <div className="mono mt-10 flex items-center justify-between text-fg-dim" data-intro="fade">
          <a
            href="#premise"
            onClick={(e) => { e.preventDefault(); scrollToId("premise"); }}
            className="transition-colors hover:text-accent"
          >
            ↓ {h.scroll}
          </a>
          <span className="hidden gap-3 sm:flex" aria-hidden="true">
            {["01", "02", "03", "04", "05", "06"].map((n) => (
              <span key={n}>{n}</span>
            ))}
          </span>
        </div>
      </div>
    </section>
  );
}
