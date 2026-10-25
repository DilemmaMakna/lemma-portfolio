"use client";
import ProtectedContact from "@/components/ui/ProtectedContact";

import Button from "@/components/ui/Button";
import { useContactModal } from "@/components/ui/ContactModal";
import SocialLinks from "@/components/ui/SocialLinks";
import { useAboutCopy } from "./useAboutCopy";

export default function AboutCta() {
  const c = useAboutCopy().cta;
  const { open: openContact } = useContactModal();

  return (
    <section id="contact" className="section bg-bg" aria-labelledby="about-cta-title">
      <div className="wrap">
        <div
          data-reveal
          className="relative overflow-hidden rounded-[4px] border border-line-strong bg-surface p-8 md:p-14 lg:p-20"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-24 -top-24 h-[360px] w-[480px] rounded-full bg-accent/10 blur-[120px]"
          />

          <div className="grid12 relative items-end gap-y-12">
            <div className="col-span-full lg:col-span-7">
              <h2 id="about-cta-title" className="h-section max-w-[18ch]">
                {c.title}
              </h2>
              <p className="lead mt-6 max-w-[44ch]">{c.sub}</p>
            </div>

            <div className="col-span-full flex flex-col items-start gap-4 lg:col-span-4 lg:col-start-9">
              <Button id="about-cta" onClick={() => openContact("about")}>
                {c.button}
              </Button>
              <Button id="about-cta-services" variant="ghost" href="/services">
                {c.secondary}
              </Button>
              <p className="mono mono-2xs mt-4 text-fg-dim !normal-case">{c.or}</p>
              <ProtectedContact
                channel="email"
                id="about-cta-email"
                className="mono !normal-case text-fg underline decoration-line-strong decoration-1 underline-offset-8 transition-colors hover:decoration-accent"
              >
              </ProtectedContact>
              <SocialLinks label size="sm" className="mt-6" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
