"use client";

import Button from "@/components/ui/Button";
import SectionLabel from "@/components/ui/SectionLabel";
import { useContactModal } from "@/components/ui/ContactModal";
import AsciiCycle from "./AsciiCycle";
import { useAboutCopy } from "./useAboutCopy";

export default function Model() {
  const m = useAboutCopy().model;
  const { open: openContact } = useContactModal();
  const last = m.flow.nodes.length - 1;

  return (
    <section className="section bg-bg" aria-label={m.label}>
      <div className="wrap">
        <SectionLabel>{m.label}</SectionLabel>

        <ul className="mt-12 grid gap-px overflow-hidden rounded-[4px] border border-line bg-line md:mt-16 md:grid-cols-2">
          {m.items.map((item, i) => (
            <li
              key={item.title}
              data-reveal
              className="group flex flex-col gap-4 bg-bg p-6 transition-colors duration-500 hover:bg-surface md:p-10"
            >
              <span className="mono text-accent">0{i + 1}.</span>
              <h2 className="h-section">{item.title}</h2>
              <p className="max-w-[44ch] flex-1 text-fg-muted">{item.body}</p>
              <div className="pt-4">
                {i === 0 ? (
                  <Button id="about-model-client" onClick={() => openContact("about-client")}>
                    {item.action}
                  </Button>
                ) : (
                  <Button id="about-model-products" variant="ghost" href="/#products">
                    {item.action}
                  </Button>
                )}
              </div>
            </li>
          ))}
        </ul>

        {/* Roda: proyek klien -> riset & sistem -> produk -> pelajaran kembali ke klien.
            Tanpa latar: legenda di kiri, animasi ASCII memudar dari kiri ke kanan di sisi kanan. */}
        <div className="grid12 mt-16 items-center gap-y-10 md:mt-24">
          <ol className="col-span-full lg:col-span-5" data-reveal>
            {m.flow.nodes.map((node, i) => (
              <li
                key={node}
                className="flex items-baseline gap-4 border-t border-line py-4 last:border-b"
              >
                <span className="mono text-accent">0{i + 1}</span>
                <span className="h-card">{node}</span>
                <span className="mono mono-2xs ml-auto text-right text-fg-dim !normal-case">
                  {m.flow.edges[i]} {i < last ? "→" : "↺"}
                </span>
              </li>
            ))}
          </ol>

          <div className="col-span-full lg:col-span-7" data-reveal>
            <AsciiCycle />
          </div>
        </div>
      </div>
    </section>
  );
}
