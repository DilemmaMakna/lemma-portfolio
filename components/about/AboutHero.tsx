"use client";

import Button from "@/components/ui/Button";
import { useContactModal } from "@/components/ui/ContactModal";
import AsciiLemma from "./AsciiLemma";
import { useAboutCopy } from "./useAboutCopy";

// Hero editorial: rata kiri, judul satu baris mono, visualisasi ASCII di kanan. Sengaja berbeda
// dari hero Home (terpusat + dot grid) dan Services (terpusat + mockup editor).
// Desktop: tepat satu layar (100svh). Mobile: visualisasi dulu, lalu judul, tinggi mengikuti isi.
export default function AboutHero() {
  const { hero: h } = useAboutCopy();
  const { open: openContact } = useContactModal();

  return (
    <section
      className="relative flex min-h-[100svh] flex-col overflow-hidden bg-bg lg:h-[100svh] lg:min-h-[620px]"
      aria-labelledby="about-hero-title"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,var(--line)_1px,transparent_1px)] bg-[size:25%_100%] opacity-60 [mask-image:linear-gradient(to_bottom,transparent,#000_40%,#000)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-40 -left-32 h-[420px] w-[620px] rounded-full bg-accent/10 blur-[140px]"
      />

      <div className="wrap relative z-10 flex flex-1 flex-col justify-between gap-10 pb-12 pt-28 lg:pb-10">
        <div className="mono flex items-center gap-2 text-fg-dim" data-intro="fade">
          <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-accent" />
          {h.eyebrow}
        </div>

        <div className="grid12 items-end gap-y-10">
          <div className="relative z-10 col-span-full lg:col-span-7">
            <h1
              id="about-hero-title"
              className="whitespace-nowrap font-mono text-[min(4.1vw,2.6rem)] font-medium leading-tight tracking-[-0.03em] lg:text-[min(2.4vw,2.2rem)]"
              data-intro="fade"
            >
              {h.title}
            </h1>
            <p className="lead mt-6 max-w-[46ch]" data-intro="fade">
              {h.lead}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3" data-intro="fade">
              <Button id="about-hero-cta" onClick={() => openContact("about")}>
                {h.primary}
              </Button>
              <Button id="about-hero-services" variant="ghost" href="/services">
                {h.secondary}
              </Button>
            </div>
          </div>

          {/* Mobile: visualisasi tampil lebih dulu, baru judul (order-first). */}
          <aside
            className="order-first col-span-full lg:order-none lg:col-span-5"
            data-intro="fade"
          >
            <AsciiLemma />
            <div className="mt-4 max-w-[36ch] font-mono lg:ml-auto">
              <p className="mono mono-2xs flex flex-wrap gap-x-3 text-fg-dim !normal-case">
                <span className="text-accent">{h.term}</span>
                <span>{h.pron}</span>
                <span>{h.kind}</span>
              </p>
              <p className="mt-2 text-xs leading-relaxed text-fg-muted">
                {h.definition} <span className="text-accent">∎</span>
              </p>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
