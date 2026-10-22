"use client";

import { useRef } from "react";
import SectionLabel from "@/components/ui/SectionLabel";
import { gsap, useGSAP, reducedMotion } from "@/lib/gsap";
import { studioStats } from "@/lib/work";
import { useAboutCopy } from "./useAboutCopy";

// "4+" -> hitung naik ke 4 lalu tambahkan "+"; nilai non-angka tampil apa adanya.
function Stat({ value, label }: { value: string; label: string }) {
  const num = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const m = /^(\d+)(.*)$/.exec(value);
      if (!m || !num.current || reducedMotion()) return;
      const el = num.current;
      const counter = { v: 0 };
      el.textContent = `0${m[2]}`;
      gsap.to(counter, {
        v: Number(m[1]),
        duration: 1.8,
        ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 88%", once: true },
        onUpdate: () => {
          el.textContent = `${Math.round(counter.v)}${m[2]}`;
        },
      });
    },
    { scope: num, dependencies: [value] },
  );

  return (
    <div data-reveal className="flex flex-col gap-4 border-t border-line py-8 sm:border-l sm:border-t-0 sm:px-8 sm:first:border-l-0 sm:first:pl-0">
      <span
        ref={num}
        className="text-[clamp(3.5rem,8vw,7rem)] font-medium leading-none tracking-[-0.04em] tabular-nums"
      >
        {value}
      </span>
      <span className="mono text-fg-dim">{label}</span>
    </div>
  );
}

export default function Who() {
  const w = useAboutCopy().who;
  // Kalimat pertama jadi pernyataan besar; sisanya penjelasan.
  const [first, ...rest] = w.body.split(/(?<=\.)\s+/);

  return (
    <section className="section bg-bg" aria-label={w.label}>
      <div className="wrap">
        <SectionLabel >{w.label}</SectionLabel>

        <div className="mt-12 md:mt-16">
          <h2 data-reveal="title" className="h-section max-w-[24ch]">
            {first}
          </h2>
          <p data-reveal className="lead mt-8 max-w-[52ch]">
            {rest.join(" ")}
          </p>
        </div>

        <div className="mt-16 grid sm:grid-cols-3 md:mt-24">
          {studioStats(w.stats).map((s) => (
            <Stat key={s.label} value={s.value} label={s.label} />
          ))}
        </div>
      </div>
    </section>
  );
}
