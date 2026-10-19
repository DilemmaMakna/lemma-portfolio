"use client";

import SectionLabel from "@/components/ui/SectionLabel";
import { useAboutCopy } from "./useAboutCopy";

const SERIF = 'var(--font-serif), "Instrument Serif", Georgia, serif';

// Nama dijelaskan seperti halaman buku matematika: Lemma, Teorema, Bukti, lalu penutup.
export default function Name() {
  const n = useAboutCopy().name;

  return (
    <section className="section section-raised overflow-hidden" aria-label={n.label}>
      <div className="wrap">
        <SectionLabel>{n.label}</SectionLabel>

        <div className="grid12 mt-12 items-center gap-y-12 md:mt-16">
          <p
            aria-hidden="true"
            data-reveal
            className="col-span-full text-accent lg:col-span-6"
            style={{
              fontFamily: SERIF,
              fontStyle: "italic",
              fontSize: "clamp(5rem, 15vw, 13rem)",
              lineHeight: 0.9,
              letterSpacing: "-0.03em",
            }}
          >
            lemma
          </p>

          <div className="col-span-full lg:col-span-5 lg:col-start-8">
            <p data-reveal className="lead max-w-[44ch]">
              {n.body}
            </p>

            <dl className="mt-10">
              {n.steps.map((s) => (
                <div
                  key={s.tag}
                  data-reveal
                  className="grid grid-cols-[6.5rem_1fr] items-baseline gap-4 border-t border-line py-4 last:border-b"
                >
                  <dt
                    className="text-xl text-accent"
                    style={{ fontFamily: SERIF, fontStyle: "italic" }}
                  >
                    {s.tag}
                  </dt>
                  <dd className="text-fg">{s.text}</dd>
                </div>
              ))}
            </dl>
            <p data-reveal aria-hidden="true" className="mt-4 text-right text-accent">
              ∎
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
