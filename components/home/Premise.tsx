"use client";

import dynamic from "next/dynamic";
import { useLocale } from "@/components/providers/LocaleProvider";
import SectionLabel from "@/components/ui/SectionLabel";

// Client-only: the ASCII box is empty in SSR. The placeholder reserves the same height
// (22 rows x 1.15 line-height x scale 2, plus the mt-4 label) so nothing shifts on mount.
const AsciiShape = dynamic(() => import("./AsciiShape"), {
  ssr: false,
  loading: () => (
    <div aria-hidden="true">
      <div
        className="font-mono leading-[1.15] text-[6px] min-[400px]:text-[7px] sm:text-[9px] lg:text-[clamp(7px,0.95svh,10px)]"
        style={{ height: "50.6em" }}
      />
      <p className="mt-4" />
    </div>
  ),
});

export default function Premise() {
  const { t } = useLocale();
  const p = t.premise;
  return (
    <section id="premise" className="section bg-bg overflow-hidden lg:overflow-visible" aria-labelledby="premise-title">
      <div className="wrap">
        <SectionLabel>{p.label}</SectionLabel>
        <div className="grid12 items-center gap-y-12 lg:gap-y-0">
          {/* Left Column: Premise Statement */}
          <div className="col-span-full lg:col-span-6 xl:col-span-7 lg:pr-8">
            <h2
              id="premise-title"
              data-reveal="title"
              className="text-[clamp(2.25rem,5.2vw,5rem)] max-w-2xl font-medium leading-[1.02] tracking-[-0.035em]"
            >
              {p.title}
            </h2>
            <p
              data-reveal
              className="lead mt-8 max-w-[46ch] !text-[clamp(1.125rem,1.7vw,1.5rem)]"
            >
              {p.body}
            </p>
            <p
              data-reveal
              className="mt-12 max-w-[50ch] border-l border-line-strong pl-5 text-sm italic text-fg-dim leading-relaxed"
            >
              {p.closing}
            </p>
          </div>

          {/* Kolom kanan: ASCII dari tak-berbentuk menjadi terdefinisi (lihat AsciiShape). */}
          <div className="col-span-full lg:col-span-6 xl:col-span-5" data-reveal>
            <AsciiShape />
          </div>
        </div>
      </div>
    </section>
  );
}
