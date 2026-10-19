"use client";

import Button from "@/components/ui/Button";
import { useContactModal } from "@/components/ui/ContactModal";
import SocialLinks from "@/components/ui/SocialLinks";
import AsciiFlow from "./AsciiFlow";
import { useServicesCopy } from "./useServicesCopy";

// Variasi CTA untuk Layanan: pilih layanan yang paling dekat (tiap pilihan membawa konteksnya
// ke form kontak), ditemani animasi alur ASCII.
export default function ServicesCta() {
  const copy = useServicesCopy();
  const c = copy.cta;
  const { open: openContact } = useContactModal();

  return (
    <section id="contact" className="section bg-bg" aria-labelledby="services-cta-title">
      <div className="wrap">
        <div
          data-reveal
          className="relative overflow-hidden rounded-[4px] border border-line-strong bg-surface"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -left-24 -top-24 h-[360px] w-[480px] rounded-full bg-accent/10 blur-[120px]"
          />

          <div className="grid12 relative items-center gap-y-10 p-8 md:p-14 lg:p-16">
            <div className="col-span-full lg:col-span-7">
              <h2 id="services-cta-title" className="h-section max-w-[18ch]">
                {c.title}
              </h2>
              <p className="lead mt-6 max-w-[44ch]">{c.sub}</p>

              {/* <p className="mono mono-2xs mt-10 text-fg-dim !normal-case">{c.pick}</p> */}
              <ul className="mt-4 flex flex-wrap gap-2">
                {copy.services.map((s) => (
                  <li key={s.index}>
                    <button
                      type="button"
                      id={`services-cta-${s.index}`}
                      onClick={() => openContact(`services-${s.index}`)}
                      className="mono !normal-case rounded-full border border-line-strong px-4 py-2 text-fg-muted transition-colors hover:border-accent hover:text-accent"
                    >
                      <span className="text-accent">{s.index}</span> {s.name}
                    </button>
                  </li>
                ))}
              </ul>

              <div className="mt-8">
                <Button id="services-cta" onClick={() => openContact("services")}>
                  {c.button}
                </Button>
              </div>

              <SocialLinks label className="mt-10" />
            </div>

            <div className="col-span-full lg:col-span-5">
              <AsciiFlow />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
