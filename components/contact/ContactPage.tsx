"use client";
import ProtectedContact from "@/components/ui/ProtectedContact";

import { useLocale } from "@/components/providers/LocaleProvider";
import ContactForm from "@/components/ui/ContactForm";
import SocialLinks from "@/components/ui/SocialLinks";
import ProfileDownload from "@/components/ui/ProfileDownload";
import { contactMessages } from "@/lib/content/contact";


// Halaman kontak: kiri pernyataan + kanal langsung + langkah berikutnya, kanan form dalam panel.
// Form yang sama dengan modal (ContactForm), tetapi `source` "contact-page" untuk pelacakan.
export default function ContactPage() {
  const { locale } = useLocale();
  const c = contactMessages[locale];
  const ch = c.channels;

  return (
    <section
      className="relative flex min-h-[100svh] flex-col overflow-hidden bg-bg pb-20 pt-32 md:pt-40"
      aria-labelledby="contact-page-title"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,var(--line)_1px,transparent_1px)] bg-[size:25%_100%] opacity-50 [mask-image:linear-gradient(to_bottom,#000,transparent_85%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-40 -right-32 h-[420px] w-[620px] rounded-full bg-accent/10 blur-[140px]"
      />

      <div className="wrap relative grid12 gap-y-14">
        <div className="col-span-full lg:col-span-6">
          <div className="mono flex items-center gap-2 text-fg-dim" data-intro="fade">
            <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-accent" />
            {c.hero.eyebrow}
          </div>
          <h1 id="contact-page-title" className="h-display mt-8 max-w-[14ch]" data-intro="fade">
            {c.hero.title}
          </h1>
          <p className="lead mt-6 max-w-[44ch]" data-intro="fade">
            {c.hero.lead}
          </p>

          <dl className="mt-12 grid gap-x-8 gap-y-6 border-t border-line pt-8 sm:grid-cols-2" data-intro="fade">
            <div>
              <dt className="mono mono-2xs text-fg-dim">{ch.email}</dt>
              <dd className="mt-2">
                <ProtectedContact id="contact-page-email" channel="email" className="mono !normal-case text-fg transition-colors hover:text-accent" />
              </dd>
            </div>
            <div>
              <dt className="mono mono-2xs text-fg-dim">{ch.business}</dt>
              <dd className="mt-2">
                <ProtectedContact id="contact-page-business" channel="business" className="mono !normal-case text-fg transition-colors hover:text-accent" />
              </dd>
            </div>
            <div>
              <dt className="mono mono-2xs text-fg-dim">{ch.whatsapp}</dt>
              <dd className="mt-2">
                <ProtectedContact id="contact-page-whatsapp" channel="whatsapp" className="mono !normal-case text-fg transition-colors hover:text-accent" />
              </dd>
            </div>
            <div>
              <dt className="mono mono-2xs text-fg-dim">{ch.studio}</dt>
              <dd className="mono mt-2 !normal-case text-fg">{ch.studioValue}</dd>
            </div>
          </dl>

          <div className="mt-10" data-intro="fade">
            <ProfileDownload id="contact-page-profile" />
          </div>

          <SocialLinks label size="sm" className="mt-10" />

          {/* <div className="mt-14 border-t border-line pt-8" data-intro="fade">
            <p className="mono mono-2xs text-fg-dim">{c.next.label}</p>
            <ol className="mt-5 flex flex-col gap-4">
              {c.next.steps.map((s, i) => (
                <li key={s.title} className="flex gap-4">
                  <span className="mono w-6 shrink-0 text-accent">0{i + 1}</span>
                  <p className="text-fg-muted">
                    <span className="text-fg">{s.title}</span> {s.body}
                  </p>
                </li>
              ))}
            </ol>
          </div> */}
        </div>

        <div className="col-span-full lg:col-span-5 lg:col-start-8" data-intro="fade">
          <div className="rounded-[4px] border border-line-strong bg-bg-raised p-6 md:p-8">
            <h2 className="text-[clamp(1.5rem,3vw,2rem)] font-medium leading-[1.05] tracking-[-0.03em]">{c.form.label}</h2>
            <p className="lead mt-3">{c.form.sub}</p>
            <ContactForm source="contact-page" />
          </div>
        </div>
      </div>
    </section>
  );
}
