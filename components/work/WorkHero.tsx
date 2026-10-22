"use client";

import { projects } from "@/lib/work";
import { useWorkCopy } from "./useWorkCopy";

// Hero ringkas karena dinding karya di bawahnya adalah pertunjukan utamanya.
// Beda dari hero lain: latar garis horizontal seperti kertas pembuktian, angka besar di kanan.
export default function WorkHero() {
  const { w } = useWorkCopy();
  const h = w.hero;
  const [head, tail] = h.title.split(", ");

  return (
    <section className="relative overflow-hidden bg-bg pb-12 pt-32 md:pb-16 md:pt-44" aria-labelledby="work-hero-title">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,var(--line)_1px,transparent_1px)] bg-[size:100%_2.5rem] opacity-50 [mask-image:linear-gradient(to_bottom,transparent,#000_35%,transparent)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 -top-32 h-[420px] w-[620px] rounded-full bg-accent/10 blur-[140px]"
      />

      <div className="wrap relative grid12 items-end gap-y-10">
        <div className="col-span-full lg:col-span-8">
          <div className="mono flex items-center gap-2 text-fg-dim" data-intro="fade">
            <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-accent" />
            {h.eyebrow}
          </div>
          <h1 id="work-hero-title" className="h-display mt-8" data-intro="fade">
            {head}
            {tail && (
              <>
                ,{" "}
                <span className="font-normal italic text-fg-muted" style={{ fontFamily: "var(--font-serif)" }}>
                  {tail}
                </span>
              </>
            )}
          </h1>
        </div>

        <div className="col-span-full flex flex-col gap-5 lg:col-span-4" data-intro="fade">
          <div className="flex items-baseline gap-3">
            <span className="font-mono text-[clamp(3rem,6vw,4.5rem)] font-medium leading-none tracking-[-0.04em] tabular-nums">
              {String(projects.length).padStart(2, "0")}
            </span>
            <span className="mono text-fg-dim">{h.count}</span>
          </div>
          <p className="lead max-w-[36ch]">{h.lead}</p>
        </div>
      </div>
    </section>
  );
}
