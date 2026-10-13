"use client";

import { useLocale } from "@/components/LocaleProvider";
import SectionLabel from "@/components/ui/SectionLabel";
import Button from "@/components/ui/Button";

export default function ContactCta() {
  const { t } = useLocale();
  const c = t.contact;
  return (
    <section id="contact" className="section bg-bg-raised" aria-labelledby="contact-title">
      <div className="wrap">
        <SectionLabel>{c.label}</SectionLabel>
        <h2
          id="contact-title"
          data-reveal="title"
          className="max-w-3xl text-[clamp(2.75rem,8vw,7.5rem)] font-medium leading-[0.98] tracking-[-0.04em]"
        >
          {c.title}
        </h2>
        <p data-reveal className="lead mt-8 max-w-[44ch]">{c.sub}</p>

        <a
          id="contact-email"
          data-reveal
          href={`mailto:${c.email}`}
          className="mono mt-14 inline-block !normal-case text-[clamp(1.125rem,3.2vw,1.5625rem)] tracking-[-0.02em] underline decoration-transparent decoration-2 underline-offset-8 transition-[text-decoration-color,color] duration-300 hover:text-accent hover:decoration-accent"
        >
          {c.email}
        </a>

        <div className="mt-10" data-reveal>
          <Button id="contact-cta" href={`mailto:${c.email}`}>{c.cta}</Button>
        </div>
      </div>
    </section>
  );
}
