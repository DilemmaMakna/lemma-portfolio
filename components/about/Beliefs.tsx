"use client";

import SectionLabel from "@/components/ui/SectionLabel";
import { useAboutCopy } from "./useAboutCopy";

const AXIOMS = ["I", "II", "III", "IV", "V"];

// Keyakinan ditulis sebagai aksioma: pernyataan pendek yang tidak dibuktikan, hanya dijalankan.
export default function Beliefs() {
  const b = useAboutCopy().beliefs;

  return (
    <section className="section section-raised" aria-label={b.label}>
      <div className="wrap">
        <SectionLabel>{b.label}</SectionLabel>
        <ol className="mt-12 md:mt-16">
          {b.items.map((item, i) => (
            <li
              key={item.title}
              className="group relative grid12 items-start gap-y-4 border-t border-line py-10 last:border-b md:py-14"
            >
              <span
                aria-hidden="true"
                className="col-span-2 hidden text-[clamp(4rem,8vw,7rem)] font-medium leading-none tracking-[-0.04em] text-transparent transition-[-webkit-text-stroke-color] duration-500 [-webkit-text-stroke:1px_var(--line-strong)] group-hover:[-webkit-text-stroke-color:var(--accent)] lg:block"
              >
                0{i + 1}
              </span>

              <div className="col-span-full lg:col-span-6 lg:col-start-3">
                <span data-reveal className="mono text-accent">
                  <span className="lg:hidden">0{i + 1} / </span>
                  AXIOM {AXIOMS[i]}
                </span>
                <h2
                  data-reveal="title"
                  className="h-section mt-4 max-w-[18ch] transition-transform duration-500 ease-out group-hover:translate-x-2"
                >
                  {item.title}
                </h2>
              </div>

              <p
                data-reveal
                className="col-span-full text-fg-muted transition-colors duration-500 group-hover:text-fg lg:col-span-3 lg:col-start-10 lg:pt-9"
              >
                {item.body}
              </p>

              <i
                aria-hidden="true"
                className="pointer-events-none absolute bottom-0 left-0 h-px w-full origin-left scale-x-0 bg-accent transition-transform duration-700 ease-out group-hover:scale-x-100"
              />
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
