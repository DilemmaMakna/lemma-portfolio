"use client";

import { useEffect, useState } from "react";
import { useLocale } from "@/components/LocaleProvider";
import Button from "@/components/ui/Button";
import { getLenis, scrollToId } from "@/lib/lenis";

const LINKS = [
  { key: "work", id: "work" },
  { key: "about", id: "about" },
  { key: "services", id: "services" },
  { key: "products", id: "products" },
  { key: "contact", id: "contact" },
] as const;

function LangToggle({ className = "" }: { className?: string }) {
  const { locale, setLocale } = useLocale();
  return (
    <div className={`mono flex items-center gap-1 ${className}`} role="group" aria-label="Language">
      {(["id", "en"] as const).map((l, i) => (
        <span key={l} className="flex items-center gap-1">
          {i > 0 && <span className="text-fg-dim">/</span>}
          <button
            id={`lang-${l}`}
            type="button"
            aria-pressed={locale === l}
            onClick={() => setLocale(l)}
            className={`transition-colors ${locale === l ? "text-fg" : "text-fg-dim hover:text-fg-muted"}`}
          >
            [{l.toUpperCase()}]
          </button>
        </span>
      ))}
    </div>
  );
}

export default function NavPill() {
  const { t } = useLocale();
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string>("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    LINKS.forEach((l) => {
      const el = document.getElementById(l.id);
      if (el) io.observe(el);
    });
    return () => {
      window.removeEventListener("scroll", onScroll);
      io.disconnect();
    };
  }, []);

  useEffect(() => {
    const l = getLenis();
    if (open) l?.stop();
    else if (!document.documentElement.classList.contains("is-loading")) l?.start();
    document.body.style.overflow = open && !l ? "hidden" : "";
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [open]);

  const go = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    setOpen(false);
    requestAnimationFrame(() => scrollToId(id));
  };

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50">
      <div className="mx-auto flex max-w-[1440px] items-center justify-between px-[var(--grid-margin)] pt-4 md:pt-5">
        <a
          href="#top"
          onClick={go("top")}
          data-intro="fade"
          className="pointer-events-auto text-[15px] font-light uppercase tracking-[0.18em]"
          aria-label="LEMMA"
        >
          LEMMA
        </a>

        <nav
          aria-label="Primary"
          data-intro="fade"
          className="pointer-events-auto hidden items-center gap-1 rounded-full border border-line px-2 backdrop-blur-[12px] transition-all duration-500 md:flex"
          style={{
            background: "rgba(16,16,16,.7)",
            height: scrolled ? 44 : 52,
          }}
        >
          {LINKS.map((l) => (
            <a
              key={l.key}
              id={`nav-${l.key}`}
              href={`#${l.id}`}
              onClick={go(l.id)}
              className={`mono relative px-4 py-2 transition-colors ${active === l.id ? "text-accent" : "text-fg-muted hover:text-fg"
                }`}
            >
              {t.nav[l.key]}
              <span
                className={`absolute bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-accent transition-opacity ${active === l.id ? "opacity-100" : "opacity-0"
                  }`}
              />
            </a>
          ))}
        </nav>

        <div data-intro="fade" className="pointer-events-auto flex items-center gap-3 md:gap-4">
          <LangToggle className="hidden sm:flex" />
          <Button id="nav-cta" href="#contact" onClick={go("contact")} className="hidden !h-10 md:inline-flex">
            {t.nav.cta}
          </Button>
          <button
            id="nav-menu"
            type="button"
            aria-expanded={open}
            onClick={() => setOpen(true)}
            className="btn btn-ghost !h-10"
          >
            {t.nav.menu}
          </button>
        </div>
      </div>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          className="pointer-events-auto fixed inset-0 z-[65] flex flex-col bg-bg px-[var(--grid-margin)] pb-8 pt-5"
        >
          <div className="flex items-center justify-between">
            <span className="text-[15px] font-semibold uppercase tracking-[0.18em]">LEMMA</span>
            <button id="menu-close" type="button" onClick={() => setOpen(false)} className="btn btn-ghost">
              {t.nav.close}
            </button>
          </div>
          <ul className="mt-16 flex flex-1 flex-col gap-3">
            {LINKS.map((l, i) => (
              <li key={l.key}>
                <a
                  href={`#${l.id}`}
                  onClick={go(l.id)}
                  className="flex items-baseline gap-4 text-[clamp(2.5rem,12vw,4rem)] font-medium tracking-[-0.03em]"
                >
                  <span className="mono text-fg-dim">0{i + 1}</span>
                  {t.nav[l.key]}
                </a>
              </li>
            ))}
          </ul>
          <div className="flex items-center justify-between">
            <LangToggle />
            <Button href="#contact" onClick={go("contact")}>
              {t.nav.cta}
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
