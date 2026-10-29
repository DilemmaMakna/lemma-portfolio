"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocale } from "@/components/providers/LocaleProvider";
import Button from "@/components/ui/Button";
import { useContactModal } from "@/components/ui/ContactModal";
import SocialLinks from "@/components/ui/SocialLinks";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { getLenis, scrollToId } from "@/lib/motion/lenis";
import MegaMenu, { MENU_KEYS, type MenuKey } from "./MegaMenu";

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

function LangToggle({ className = "", prefix = "lang" }: { className?: string; prefix?: string }) {
  const { locale, setLocale } = useLocale();
  return (
    <div className={`mono flex items-center gap-1 ${className}`} role="group" aria-label="Language">
      {(["id", "en"] as const).map((l, i) => (
        <span key={l} className="flex items-center gap-1">
          {i > 0 && <span className="text-fg-dim">/</span>}
          <button
            id={`${prefix}-${l}`}
            type="button"
            aria-pressed={locale === l}
            onClick={() => setLocale(l)}
            className={`relative transition-colors after:absolute after:-inset-x-2 after:-inset-y-4 after:content-[''] ${locale === l ? "text-fg" : "text-fg-dim hover:text-fg-muted"}`}
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
  const [mega, setMega] = useState<MenuKey | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

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
    if (!open) return;
    const dialog = dialogRef.current;
    if (!dialog) return;
    const previousOverflow = document.body.style.overflow;
    const trigger = document.getElementById("nav-menu");
    const lenis = getLenis();
    lenis?.stop();
    document.body.style.overflow = "hidden";
    dialog.showModal();
    const animation = window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ? null
      : dialog.animate([{ opacity: 0, transform: "translateY(-8px)" }, { opacity: 1, transform: "translateY(0)" }], { duration: 180, easing: "ease-out" });
    const desktop = window.matchMedia("(min-width: 1200px)");
    const closeOnDesktop = () => { if (desktop.matches) setOpen(false); };
    desktop.addEventListener("change", closeOnDesktop);
    return () => {
      animation?.cancel();
      desktop.removeEventListener("change", closeOnDesktop);
      dialog.close();
      trigger?.focus({ preventScroll: true });
      document.body.style.overflow = previousOverflow;
      if (!document.documentElement.classList.contains("is-loading")) lenis?.start();
    };
  }, [open]);

  // On the home page, section links scroll in place; everywhere else the Link navigates.
  const go = (id?: string) => (e: React.MouseEvent) => {
    setOpen(false);
    if (!id || !onHome) return;
    e.preventDefault();
    requestAnimationFrame(() => scrollToId(id));
  };

  // Megamenu: terbuka saat hover/fokus pada tautan yang punya panel, tutup saat pointer keluar atau Escape.
  const megaOf = (key: string) => (MENU_KEYS.includes(key) ? (key as MenuKey) : null);
  useEffect(() => {
    if (!mega) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMega(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mega]);

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50">
      <div
        onMouseLeave={() => setMega(null)}
        className="relative mx-auto flex max-w-[1440px] items-center justify-between px-[var(--grid-margin)] pt-4 md:pt-5"
      >
        <Link
          href="/"
          onClick={go("top")}
          data-intro="fade"
          className="pointer-events-auto relative text-[15px] font-light uppercase tracking-[0.18em] after:absolute after:inset-x-0 after:-inset-y-2.5 after:content-['']"
          aria-label="LEMMA"
        >
          LEMMA
        </Link>

        <nav
          aria-label="Primary"
          data-intro="fade"
          className="pointer-events-auto hidden h-[54px] items-center gap-1 whitespace-nowrap rounded-full border border-line px-2 backdrop-blur-[12px] transition-shadow duration-200 motion-reduce:transition-none min-[1200px]:flex"
          style={{
            background: "var(--glass)",
            boxShadow: scrolled ? "0 4px 20px rgb(0 0 0 / 0.08)" : "none",
          }}
        >
          {LINKS.map((l) => (
            <Link
              key={l.key}
              id={`nav-${l.key}`}
              href={hrefOf(l)}
              aria-current={isCurrent(l, pathname, active) ? ("href" in l ? "page" : "location") : undefined}
              onClick={(e) => {
                setMega(null);
                go("id" in l ? l.id : undefined)(e);
              }}
              onMouseEnter={() => setMega(megaOf(l.key))}
              onFocus={() => setMega(megaOf(l.key))}
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

        {mega && (
          <div className="pointer-events-auto absolute left-1/2 top-full hidden w-[min(860px,calc(100vw-2*var(--grid-margin)))] -translate-x-1/2 pt-2 min-[1200px]:block">
            <div
              id="mega-menu"
              role="region"
              aria-label={t.nav[mega]}
              onBlur={(e) => {
                if (!e.currentTarget.parentElement?.contains(e.relatedTarget as Node)) setMega(null);
              }}
              className="lm-mega rounded-[8px] border border-line-strong backdrop-blur-[16px]"
              style={{ background: "var(--glass)" }}
            >
              <MegaMenu key={mega} menu={mega} onNavigate={() => setMega(null)} />
            </div>
          </div>
        )}

        {/* md+: latar kaca seperti pil tengah, supaya konten di belakangnya (mis. ASCII hero /about) tidak bertabrakan. */}
        <div
          data-intro="fade"
          className="pointer-events-auto flex items-center gap-3 sm:rounded-full sm:border sm:border-line sm:py-1.5 sm:pl-4 sm:pr-1.5 sm:backdrop-blur-[12px] sm:[background:var(--glass)]"
        >
          <LangToggle className="hidden sm:flex" />
          <ThemeToggle className="hidden sm:grid" />
          <Button id="nav-cta" onClick={() => openContact("nav")} className="!hidden !h-10 whitespace-nowrap min-[1200px]:!inline-flex">
            {t.nav.cta}
          </Button>
          <button
            id="nav-menu"
            type="button"
            aria-expanded={open}
            aria-haspopup="dialog"
            aria-controls="navigation-menu"
            onClick={() => setOpen(true)}
            className="btn btn-ghost relative !h-10 min-[1200px]:!hidden after:absolute after:-inset-0.5 after:content-['']"
          >
            {t.nav.menu}
          </button>
        </div>
      </div>

      {open && (
        <dialog
          ref={dialogRef}
          id="navigation-menu"
          aria-label={t.nav.menu}
          onCancel={() => setOpen(false)}
          onKeyDown={(event) => {
            if (event.key !== "Tab") return;
            const controls = event.currentTarget.querySelectorAll<HTMLElement>('a[href], button:not([disabled])');
            const first = controls[0];
            const last = controls[controls.length - 1];
            if (event.shiftKey && document.activeElement === first) {
              event.preventDefault();
              last?.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
              event.preventDefault();
              first?.focus();
            }
          }}
          className="pointer-events-auto fixed inset-0 m-0 h-dvh max-h-none w-full max-w-none flex-col overflow-y-auto border-0 bg-bg px-[var(--grid-margin)] pb-8 pt-5 text-fg open:flex backdrop:bg-black/30"
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
                    aria-current={current ? ("href" in l ? "page" : "location") : undefined}
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
                <LangToggle prefix="menu-lang" />
                <ThemeToggle id="menu-theme-toggle" />
              </div>
              <Button
                onClick={() => {
                  setOpen(false);
                  requestAnimationFrame(() => openContact("nav-mobile"));
                }}
              >
                {t.nav.cta}
              </Button>
            </div>
          </div>
        </dialog>
      )}
    </header>
  );
}
