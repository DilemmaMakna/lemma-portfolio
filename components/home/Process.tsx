"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale } from "@/components/providers/LocaleProvider";
import SectionLabel from "@/components/ui/SectionLabel";
import TechMarquee from "@/components/ui/TechMarquee";
import { PROCESS_STACK } from "@/lib/content/tech-stack";
import AsciiProcess from "./AsciiProcess";

export default function Process() {
  const { t } = useLocale();
  const p = t.process;
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.i));
        });
      },
      { rootMargin: "-40% 0px -45% 0px" },
    );
    refs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <section id="process" className="section section-raised" aria-label={p.label}>
      <div className="wrap">
        <SectionLabel rule={false}>{p.label}</SectionLabel>
        <div className="grid12 gap-y-12">
          <div className="col-span-full lg:col-span-4">
            <div className="lg:sticky lg:top-[20vh]">
              <div
                className="font-medium leading-none tracking-[-0.04em] tabular-nums text-[clamp(5rem,14vw,12rem)] text-accent"
                aria-hidden="true"
              >
                0{active + 1}
              </div>
              {/* Adegan ASCII di bawah angka; berganti mengikuti langkah aktif (desktop saja). */}
              <AsciiProcess active={active} className="mt-6 hidden lg:block" />
              <div className="mono mt-4 text-fg-dim">
                {p.steps.map((_, i) => (
                  <span key={i} className={`mr-3 transition-colors ${i === active ? "text-accent" : ""}`}>
                    0{i + 1}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <ol className="col-span-full flex flex-col lg:col-span-8">
            {p.steps.map((s, i) => (
              <li
                key={i}
                ref={(el) => {
                  refs.current[i] = el;
                }}
                data-i={i}
                className="border-t border-line py-14 lg:min-h-[60vh] lg:py-20"
              >
                <div className={`mono transition-colors ${i === active ? "text-accent" : "text-fg-dim"}`}>
                  0{i + 1}
                </div>
                <h3
                  data-reveal
                  className="mt-6 max-w-[22ch] text-[clamp(1.75rem,3.4vw,3rem)] font-medium leading-[1.08] tracking-[-0.03em]"
                >
                  {s.title}
                </h3>
                <p data-reveal className="mt-6 max-w-[44ch] text-fg-muted">
                  {s.body}
                </p>
                <ul data-reveal className="mt-6 flex flex-wrap gap-2">
                  {s.tags.map((tag) => (
                    <li
                      key={tag}
                      className="mono mono-2xs !normal-case rounded-full border border-line-strong px-3 py-1 text-fg-dim"
                    >
                      {tag}
                    </li>
                  ))}
                </ul>
                {/* Alat yang relevan dengan langkah ini; bergeser pelan, ujungnya larut lewat mask. */}
                <div data-reveal className="mt-10">
                  <TechMarquee items={PROCESS_STACK[i]} duration={[75, 85, 70][i] ?? 75} reverse={i === 1} label={s.title} />
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
