"use client";

import TechTile from "@/components/ui/TechTile";
import { SERVICE_STACK } from "@/lib/content/tech-stack";
import { useServicesCopy } from "./useServicesCopy";

export default function ServiceList() {
  const { services, labels } = useServicesCopy();

  return (
    <section id="services" className="bg-bg pb-[clamp(4rem,10vw,8rem)]" aria-label="Services">
      <div className="wrap">
        {services.map((s) => (
          <article
            key={s.index}
            id={`service-${s.index}`}
            className="grid12 gap-y-10 border-t border-line py-14 last:border-b md:py-20"
          >
            <header className="col-span-full lg:col-span-5">
              <div className="lg:sticky lg:top-28">
                <span className="mono text-accent">{s.index}.</span>
                <h2
                  data-reveal="title"
                  className="mt-4 h-section"
                >
                  {s.name}
                </h2>
                <p data-reveal className="mt-3 text-fg-muted">
                  {s.summary}
                </p>
              </div>
            </header>

            <div className="col-span-full flex flex-col gap-12 lg:col-span-6 lg:col-start-7">
              <p data-reveal className="lead">
                {s.body}
              </p>

              <div data-reveal>
                <h3 className="mono text-fg-dim">{labels.deliverables}</h3>
                <ul className="mt-4">
                  {s.deliverables.map((d) => (
                    <li
                      key={d}
                      className="flex gap-4 border-t border-line py-3.5 text-fg last:border-b"
                    >
                      <span aria-hidden="true" className="mono text-accent">
                        +
                      </span>
                      {d}
                    </li>
                  ))}
                </ul>
              </div>

              <div data-reveal>
                <h3 className="mono text-fg-dim">{labels.fit}</h3>
                <p className="mt-3 max-w-[52ch] text-fg-muted">{s.fit}</p>
              </div>

              {SERVICE_STACK[s.index] && (
                <div data-reveal>
                  <h3 className="mono text-fg-dim">{labels.stack}</h3>
                  <ul className="mt-4 flex flex-wrap gap-3">
                    {SERVICE_STACK[s.index].map((it) => (
                      <li key={it.name}>
                        <TechTile item={it} size="sm" />
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
