"use client";

import { useServicesCopy } from "./useServicesCopy";

export default function Engagement() {
  const e = useServicesCopy().engagement;

  return (
    <section className="section section-raised" aria-labelledby="engagement-title">
      <div className="wrap">
        <div className="grid12 gap-y-8">
          <h2
            id="engagement-title"
            data-reveal="title"
            className="h-section col-span-full lg:col-span-6"
          >
            {e.title}
          </h2>
          <p data-reveal className="lead col-span-full lg:col-span-5 lg:col-start-8">
            {e.body}
          </p>
        </div>

        <ol className="mt-16 grid gap-px overflow-hidden rounded-[4px] border border-line bg-line md:mt-24 md:grid-cols-2 lg:grid-cols-4">
          {e.steps.map((s, i) => (
            <li key={s.title} data-reveal className="flex flex-col gap-4 bg-bg-raised p-6 md:p-8">
              <span className="mono text-accent">0{i + 1}.</span>
              <h3 className="h-card">
                {s.title}
              </h3>
              <p className="text-fg-muted">{s.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
