"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocale } from "@/components/LocaleProvider";
import Button from "@/components/ui/Button";
import { useContactModal } from "@/components/ui/ContactModal";
import SocialLinks from "@/components/ui/SocialLinks";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { getLenis, scrollToId } from "@/lib/lenis";

// `id` links scroll to a section on the home page; `href` links open their own page.
const LINKS = [
  { key: "work", href: "/work" },
  { key: "about", href: "/about" },
  { key: "services", href: "/services" },
  { key: "products", id: "products" },
  { key: "contact", href: "/contact" },
] as const;

const hrefOf = (l: (typeof LINKS)[number]) => ("href" in l ? l.href : `/#${l.id}`);
const isCurrent = (l: (typeof LINKS)[number], pathname: string, active: string) =>
  "href" in l ? pathname === l.href : pathname === "/" && active === l.id;

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
  const { open: openContact } = useContactModal();
  const pathname = usePathname();
  const onHome = pathname === "/";
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
      if (!("id" in l)) return;
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

  // On the home page, section links scroll in place; everywhere else the Link navigates.
  const go = (id?: string) => (e: React.MouseEvent) => {
    setOpen(false);
    if (!id || !onHome) return;
    e.preventDefault();
    requestAnimationFrame(() => scrollToId(id));
  };

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50">
      <div className="mx-auto flex max-w-[1440px] items-center justify-between px-[var(--grid-margin)] pt-4 md:pt-5">
        <Link
          href="/"
          onClick={go("top")}
          data-intro="fade"
          className="pointer-events-auto text-[15px] font-light uppercase tracking-[0.18em]"
          aria-label="LEMMA"
        >
          LEMMA
        </Link>

        <nav
          aria-label="Primary"
          data-intro="fade"
          className="pointer-events-auto hidden items-center gap-1 rounded-full border border-line px-2 backdrop-blur-[12px] transition-all duration-500 md:flex"
          style={{
            background: "var(--glass)",
            height: scrolled ? 44 : 52,
          }}
        >
          {LINKS.map((l) => (
            <Link
              key={l.key}
              id={`nav-${l.key}`}
              href={hrefOf(l)}
              onClick={go("id" in l ? l.id : undefined)}
              className={`mono relative px-4 py-2 transition-colors ${isCurrent(l, pathname, active) ? "text-accent" : "text-fg-muted hover:text-fg"
                }`}
            >
              {t.nav[l.key]}
              <span
                className={`absolute bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-accent transition-opacity ${isCurrent(l, pathname, active) ? "opacity-100" : "opacity-0"
                  }`}
              />
            </Link>
          ))}
        </nav>

        {/* md+: latar kaca seperti pil tengah, supaya konten di belakangnya (mis. ASCII hero /about) tidak bertabrakan. */}
        <div
          data-intro="fade"
          className={`pointer-events-auto flex items-center gap-3 transition-all duration-500 md:rounded-full md:border md:border-line md:pl-4 md:backdrop-blur-[12px] md:[background:var(--glass)] ${
            scrolled ? "md:py-0.5 md:pr-0.5" : "md:py-1.5 md:pr-1.5"
          }`}
        >
          <LangToggle className="hidden sm:flex" />
          <ThemeToggle className="hidden sm:grid" />
          <Button id="nav-cta" onClick={() => openContact("nav")} className="hidden !h-10 md:inline-flex">
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
          className="pointer-events-auto fixed inset-0 z-[65] flex flex-col overflow-y-auto bg-bg px-[var(--grid-margin)] pb-8 pt-5"
        >
          <div className="flex items-center justify-between">
            <span className="text-[15px] font-semibold uppercase tracking-[0.18em]">LEMMA</span>
            <button id="menu-close" type="button" onClick={() => setOpen(false)} className="btn btn-ghost">
              {t.nav.close}
            </button>
          </div>
          {/* 1. Tautan: baris berpembatas, halaman aktif diberi warna aksen. */}
          <ul className="mt-10 flex-1 border-t border-line">
            {LINKS.map((l, i) => {
              const current = isCurrent(l, pathname, active);
              return (
                <li key={l.key} className="border-b border-line">
                  <Link
                    href={hrefOf(l)}
                    onClick={go("id" in l ? l.id : undefined)}
                    className={`flex items-baseline gap-4 py-3 text-[clamp(2.25rem,10vw,3.5rem)] font-medium leading-tight tracking-[-0.03em] transition-colors hover:text-accent ${
                      current ? "text-accent" : "text-fg"
                    }`}
                  >
                    <span className={`mono w-6 shrink-0 ${current ? "text-accent" : "text-fg-dim"}`}>
                      0{i + 1}
                    </span>
                    {t.nav[l.key]}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* 2. Media sosial. 3. Bahasa dan ajakan kontak. */}
          <div className="mt-8 flex flex-col gap-6">
            <SocialLinks label size="sm" />
            <div className="flex items-center justify-between gap-4 border-t border-line pt-6">
              <div className="flex items-center gap-4">
                <LangToggle />
                <ThemeToggle />
              </div>
              <Button
                onClick={() => {
                  setOpen(false);
                  openContact("nav-mobile");
                }}
              >
                {t.nav.cta}
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
