"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocale } from "@/components/LocaleProvider";
import Button from "@/components/ui/Button";
import { useContactModal } from "@/components/ui/ContactModal";
import { getLenis, scrollToId } from "@/lib/lenis";
import { gsap, useGSAP, reducedMotion } from "@/lib/gsap";
import SocialLinks from "@/components/ui/SocialLinks";

// Tautan nyata ke halaman masing-masing (bukan anchor beranda), supaya berfungsi di semua halaman.
const NAV_LINKS = [
  { key: "work", href: "/work" },
  { key: "about", href: "/about" },
  { key: "services", href: "/services" },
  { key: "products", href: "/#products" },
  { key: "contact", href: "/contact" },
] as const;

const GLOW_RADIUS = 320; // Radius lebar agar sorotan menyebar halus, bukan lingkaran tegas

// Falloff bertahap (mirip kurva gaussian): tanpa inti solid, tanpa tepi tajam.
// Satu string dipakai untuk mask standar dan -webkit- supaya hasilnya sama di semua browser.
const GLOW_MASK = `radial-gradient(circle ${GLOW_RADIUS}px at var(--glow-x, 50%) var(--glow-y, 50%), rgba(0, 0, 0, 0.85) 0%, rgba(0, 0, 0, 0.72) 14%, rgba(0, 0, 0, 0.5) 30%, rgba(0, 0, 0, 0.3) 48%, rgba(0, 0, 0, 0.14) 66%, rgba(0, 0, 0, 0.05) 84%, transparent 100%)`;

export default function Footer() {
  const { t, locale, setLocale } = useLocale();
  const { open: openContact } = useContactModal();
  const pathname = usePathname();
  const f = t.footer;
  const footerRef = useRef<HTMLElement>(null);
  const markRef = useRef<HTMLDivElement>(null);
  const yearRef = useRef<HTMLSpanElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (yearRef.current) {
      yearRef.current.textContent = String(new Date().getFullYear());
    }
  }, []);

  useGSAP(
    () => {
      if (reducedMotion() || !markRef.current || !footerRef.current) return;

      gsap.fromTo(
        markRef.current,
        { y: 80, opacity: 0.2 },
        {
          y: -10,
          opacity: 0.85,
          ease: "none",
          scrollTrigger: {
            trigger: footerRef.current,
            start: "top bottom",
            end: "bottom bottom",
            scrub: true,
          },
        },
      );
    },
    { scope: footerRef },
  );

  // Posisi glow mengejar kursor dengan lerp, bukan loncat: lebih lembut saat masuk dan bergerak.
  const glow = useRef({ x: 0, y: 0, tx: 0, ty: 0, init: false });

  useEffect(() => {
    if (!isHovered || reducedMotion()) return;
    let id = 0;
    const loop = () => {
      const g = glow.current;
      g.x += (g.tx - g.x) * 0.1;
      g.y += (g.ty - g.y) * 0.1;
      markRef.current?.style.setProperty("--glow-x", `${g.x.toFixed(1)}px`);
      markRef.current?.style.setProperty("--glow-y", `${g.y.toFixed(1)}px`);
      id = requestAnimationFrame(loop);
    };
    id = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(id);
  }, [isHovered]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    if (!markRef.current) return;
    const rect = markRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const g = glow.current;
    g.tx = x;
    g.ty = y;
    // Hover pertama (atau reduced motion): langsung di kursor, jangan meluncur dari posisi lama.
    if (!g.init || reducedMotion()) {
      g.x = x;
      g.y = y;
      g.init = true;
      markRef.current.style.setProperty("--glow-x", `${x}px`);
      markRef.current.style.setProperty("--glow-y", `${y}px`);
    }
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    glow.current.init = false;
    setIsHovered(false);
  }, []);

  // Di beranda, tautan "/#id" menggulir di tempat; di halaman lain Link berpindah halaman seperti biasa.
  const goHome = (href: string) => (e: React.MouseEvent) => {
    if (pathname !== "/" || !href.startsWith("/#")) return;
    e.preventDefault();
    scrollToId(href.slice(2));
  };

  const toTop = (e: React.MouseEvent) => {
    e.preventDefault();
    const lenis = getLenis();
    if (lenis) lenis.scrollTo(0);
    else window.scrollTo({ top: 0 });
  };

  return (
    <footer
      ref={footerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      className="relative flex min-h-[82svh] flex-col justify-between overflow-hidden border-t border-line bg-bg-raised pb-10 pt-28 md:min-h-[88svh] md:pb-14 md:pt-36"
    >
      {/* Ambient background glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 h-[380px] w-[640px] -translate-y-6 rounded-full bg-accent/10 blur-[120px] opacity-70"
      />

      {/* Main Grid Content (Width dijaga 80%, max-w 1200px) */}
      <div className="relative z-10 w-[80%] max-w-[1200px] mx-auto flex-1 flex flex-col justify-between">
        <div className="grid gap-12 md:grid-cols-[1.5fr_1fr_1fr_1fr] lg:gap-16">
          {/* Brand & Entity Column */}
          <div className="flex flex-col justify-between">
            <div>
              <Link
                href="/"
                className="inline-block text-lg font-light uppercase tracking-[0.2em] transition-opacity hover:opacity-80"
              >
                LEMMA
              </Link>
              <p className="mt-4 text-[clamp(1.5rem,3.2vw,2.5rem)] font-medium leading-[1.08] tracking-[-0.03em] max-w-[18ch]">
                {f.brand}
              </p>
            </div>

            <div className="mt-8">
              <Button id="footer-cta" onClick={() => openContact("footer")} className="mb-8">
                {t.nav.cta}
              </Button>
              <a
                href="mailto:marketing@dilemma-makna.com"
                className="mono inline-flex items-center gap-2 text-fg hover:text-accent transition-colors !normal-case text-sm tracking-[-0.01em]"
              >
                marketing@dilemma-makna.com
                <span className="arrow font-mono" aria-hidden="true">
                  ↗
                </span>
              </a>
              <div className="mono mt-2 text-xs text-fg-dim">
                <a href="https://wa.me/6285144922167">+62 (851) 4492 2167</a>
              </div>
              <SocialLinks size="sm" className="mt-6" />
            </div>
          </div>

          {/* Navigation Links Column */}
          <div>
            <h3 className="mono text-fg-dim text-xs tracking-[0.16em]">{f.columns.nav}</h3>
            <ul className="mt-6 flex flex-col gap-3">
              {NAV_LINKS.map((l) => (
                <li key={l.key}>
                  <Link
                    href={l.href}
                    onClick={goHome(l.href)}
                    className="text-sm text-fg-muted transition-colors hover:text-accent"
                  >
                    {t.nav[l.key]}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Core Services Column */}
          <div>
            <h3 className="mono text-fg-dim text-xs tracking-[0.16em]">{f.columns.services}</h3>
            <ul className="mt-6 flex flex-col gap-3">
              {t.services.items.map((svc, idx) => (
                <li key={idx}>
                  <Link
                    href={`/services#service-0${idx + 1}`}
                    className="text-sm text-fg-muted transition-colors hover:text-fg"
                  >
                    {svc.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Products & Legal Column */}
          <div>
            <h3 className="mono text-fg-dim text-xs tracking-[0.16em]">{f.columns.products}</h3>
            <ul className="mt-6 flex flex-col gap-3">
              <li>
                <Link
                  href="/#products"
                  onClick={goHome("/#products")}
                  className="group flex items-center justify-between text-sm text-fg-muted hover:text-fg"
                >
                  <span>NATA</span>
                  <span className="mono text-[10px] text-ok border border-ok/30 rounded-full px-2 py-0.5">ACTIVE</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/#products"
                  onClick={goHome("/#products")}
                  className="group flex items-center justify-between text-sm text-fg-muted hover:text-fg"
                >
                  <span>██████</span>
                  <span className="mono text-[10px] text-fg-dim border border-line-strong rounded-full px-2 py-0.5">
                    STEALTH
                  </span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mono mt-32 flex flex-col gap-5 pt-8 text-xs text-fg-dim sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-3">
            <span>
              &copy;{" "}
              <span ref={yearRef} suppressHydrationWarning>
                2026
              </span>{" "}
              PT MASIH DILEMMA MAKNA. {f.rights}
            </span>
          </div>

          {/* Language Toggle in Footer */}
          <div className="flex items-center gap-1">
            {(["id", "en"] as const).map((l, i) => (
              <span key={l} className="flex items-center gap-1">
                {i > 0 && <span className="text-fg-dim">/</span>}
                <button
                  type="button"
                  id={`footer-lang-${l}`}
                  onClick={() => setLocale(l)}
                  className={`transition-colors ${
                    locale === l ? "text-fg font-medium" : "text-fg-dim hover:text-fg-muted"
                  }`}
                >
                  [{l.toUpperCase()}]
                </button>
              </span>
            ))}
          </div>

          {/* Back to top Link */}
          <a
            href="#top"
            onClick={toTop}
            className="group inline-flex items-center gap-2 text-fg hover:text-accent transition-colors"
          >
            <span className="relative">
              {f.backToTop}
              <span className="absolute -bottom-0.5 left-0 h-px w-full origin-right scale-x-0 bg-current transition-transform duration-300 group-hover:origin-left group-hover:scale-x-100" />
            </span>
            <svg
              width="14"
              height="14"
              viewBox="0 0 16 16"
              fill="none"
              aria-hidden="true"
              className="transition-transform duration-300 group-hover:-translate-y-1"
            >
              <path
                d="M8 13V3M3.5 7.5 8 3l4.5 4.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        </div>
      </div>

      {/* Massive Glassy "LEMMA" Centerpiece with Interactive Orange Glow */}
      <div
        ref={markRef}
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-[0.26em] left-1/2 w-[120vw] -translate-x-1/2 select-none text-center text-[23vw] font-semibold uppercase leading-none tracking-[0.01em] z-0 overflow-hidden"
      >
        {/* Base Glassy Translucent Text */}
        <span
          className="inline-block bg-gradient-to-b from-fg/[0.18] via-fg/[0.04] to-transparent bg-clip-text text-transparent [filter:drop-shadow(0_12px_40px_var(--shadow))]"
          style={{
            WebkitTextStroke: "1px var(--hairline)",
          }}
        >
          LEMMA
        </span>

        {/* Dynamic Glowing Text Layer: both stroke & fill are masked strictly to the hover gradient */}
        <span
          className="pointer-events-none absolute inset-0 select-none text-center text-[23vw] font-semibold uppercase leading-none tracking-[0.01em] transition-opacity duration-700 ease-out"
          style={{
            opacity: isHovered ? 1 : 0,
            // Fill dan garis tepi sedikit tembus pandang supaya oranye tidak menyala keras.
            color: "rgba(255, 90, 31, 0.8)",
            WebkitTextStroke: "1.25px rgba(255, 116, 64, 0.7)",
            WebkitMaskImage: GLOW_MASK,
            maskImage: GLOW_MASK,
          }}
        >
          LEMMA
        </span>
      </div>
    </footer>
  );
}
