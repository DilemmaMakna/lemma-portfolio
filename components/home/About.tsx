"use client";

import { useLocale } from "@/components/providers/LocaleProvider";
import Button from "@/components/ui/Button";
import { studioStats } from "@/lib/content/work";

export default function About() {
  const { t } = useLocale();
  const a = t.about;
  return (
    <section id="about" className="section bg-bg" aria-labelledby="about-title">
      <div className="wrap">
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
