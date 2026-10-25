"use client";
import ProtectedContact from "@/components/ui/ProtectedContact";

import { useLocale } from "@/components/providers/LocaleProvider";
import SectionLabel from "@/components/ui/SectionLabel";
import Button from "@/components/ui/Button";
import { useContactModal } from "@/components/ui/ContactModal";
import SocialLinks from "@/components/ui/SocialLinks";
import ProfileDownload from "@/components/ui/ProfileDownload";
import AsciiPrompt from "./AsciiPrompt";

export default function ContactCta() {
  const { t } = useLocale();
  const { open: openContact } = useContactModal();
  const c = t.contact;
  return (
    <section id="contact" className="section section-raised fade-top-only" aria-labelledby="contact-title">
      <div className="wrap relative">
        {/* Variasi: animasi prompt ASCII di sisi kanan (desktop saja; tampilan mobile tidak berubah). */}
        <AsciiPrompt className="pointer-events-none absolute bottom-0 right-[var(--grid-margin)] hidden w-[420px] lg:block" />
        <SectionLabel>{c.label}</SectionLabel>
        <h2
          id="contact-title"
          data-reveal="title"
          className="max-w-3xl text-[clamp(2.75rem,8vw,7.5rem)] font-medium leading-[0.98] tracking-[-0.04em]"
        >
          {c.title}
        </h2>
        <p data-reveal className="lead mt-8 max-w-[44ch]">{c.sub}</p>

        <ProtectedContact
          channel="email"
          id="contact-email"
          className="mono mt-14 inline-block !normal-case text-[clamp(1.125rem,3.2vw,1.5625rem)] tracking-[-0.02em] underline decoration-transparent decoration-2 underline-offset-8 transition-[text-decoration-color,color] duration-300 hover:text-accent hover:decoration-accent"
        >
        </ProtectedContact>

        <div className="mt-10 flex flex-wrap items-center gap-3" data-reveal>
          <Button id="contact-cta" onClick={() => openContact("contact")}>{c.cta}</Button>
          <ProfileDownload id="contact-profile" />
        </div>

        <div data-reveal>
          <SocialLinks label className="mt-14" />
        </div>
      </div>
    </section>
  );
}
