"use client";

import Image from "next/image";
import { useLocale } from "@/components/LocaleProvider";
import SectionLabel from "@/components/ui/SectionLabel";
import Button from "@/components/ui/Button";
import { studioStats } from "@/lib/work";

export default function About() {
  const { t } = useLocale();
  const a = t.about;
  return (
    <section id="about" className="section bg-bg" aria-labelledby="about-title">
      <div className="wrap">
        <SectionLabel>{a.label}</SectionLabel>
        <div className="grid12 gap-y-14">
          <div className="col-span-full lg:col-span-7">
            <h2 id="about-title" data-reveal="title" className="h-section max-w-[18ch]">
              {a.title}
            </h2>
            <p data-reveal className="lead mt-8 max-w-[52ch]">
              {a.body}
            </p>
            <div className="mt-10" data-reveal>
              <Button variant="ghost" href="/about">
                {a.link}
              </Button>
            </div>
            <div data-reveal className="relative mt-12 aspect-[3/2] overflow-hidden rounded-[4px] border border-line">
              <Image
                src="/dithered/hand-collab.webp"
                width={1600}
                height={1067}
                sizes="(min-width: 1024px) 58vw, 100vw"
                loading="lazy"
                alt=""
                aria-hidden="true"
                unoptimized
                className="h-full w-full object-cover"
              />
            </div>
          </div>

          <dl className="col-span-full flex flex-col lg:col-span-4 lg:col-start-9">
            {studioStats(a.stats).map((s, i) => (
              <div
                key={i}
                data-reveal
                className="flex items-baseline justify-between gap-6 border-t border-line py-6 last:border-b"
              >
                <dd className="text-[clamp(3rem,6vw,4.5rem)] font-medium leading-none tracking-[-0.04em] tabular-nums">
                  {s.value}
                </dd>
                <dt className="mono text-fg-dim">{s.label}</dt>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
