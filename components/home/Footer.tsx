"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useLocale } from "@/components/LocaleProvider";
import { scrollToId } from "@/lib/lenis";
import { gsap, useGSAP, reducedMotion } from "@/lib/gsap";

const NAV_LINKS = [
  { key: "work", id: "work" },
  { key: "about", id: "about" },
  { key: "services", id: "services" },
  { key: "products", id: "products" },
  { key: "contact", id: "contact" },
] as const;

const GLOW_RADIUS = 160; // Radius lebih kecil & padat, fokus di dalam bentuk teks

export default function Footer() {
  const { t, locale, setLocale } = useLocale();
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

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    if (!markRef.current) return;
    const rect = markRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    markRef.current.style.setProperty("--glow-x", `${x}px`);
    markRef.current.style.setProperty("--glow-y", `${y}px`);
    if (!isHovered) setIsHovered(true);
  }, [isHovered]);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
  }, []);

  const go = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    scrollToId(id);
  };

  return (
    <footer
      ref={footerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      className="relative flex min-h-[82vh] flex-col justify-between overflow-hidden border-t border-line bg-bg-raised pb-10 pt-28 md:min-h-[88vh] md:pb-14 md:pt-36"
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
              <a
                href="#top"
                onClick={go("top")}
                className="inline-block text-lg font-light uppercase tracking-[0.2em] transition-opacity hover:opacity-80"
              >
                LEMMA
              </a>
              <p className="mt-4 text-[clamp(1.5rem,3.2vw,2.5rem)] font-medium leading-[1.08] tracking-[-0.03em] max-w-[18ch]">
                {f.brand}
              </p>
            </div>

            <div className="mt-8">
              <a
                href="mailto:hello@dilemma-makna.com"
                className="mono inline-flex items-center gap-2 text-fg hover:text-accent transition-colors !normal-case text-sm tracking-[-0.01em]"
              >
                hello@dilemma-makna.com
                <span className="arrow font-mono" aria-hidden="true">↗</span>
              </a>
              <div className="mono mt-2 text-xs text-fg-dim">
                JAKARTA, ID &middot; GMT+7
              </div>
            </div>
          </div>

          {/* Navigation Links Column */}
          <div>
            <h4 className="mono text-fg-dim text-xs tracking-[0.16em]">
              {f.columns.nav}
            </h4>
            <ul className="mt-6 flex flex-col gap-3">
              {NAV_LINKS.map((l) => (
                <li key={l.key}>
                  <a
                    href={`#${l.id}`}
                    onClick={go(l.id)}
                    className="text-sm text-fg-muted transition-colors hover:text-accent"
                  >
                    {t.nav[l.key]}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Core Services Column */}
          <div>
            <h4 className="mono text-fg-dim text-xs tracking-[0.16em]">
              {f.columns.services}
            </h4>
            <ul className="mt-6 flex flex-col gap-3">
              {t.services.items.map((svc, idx) => (
                <li key={idx}>
                  <a
                    href="#services"
                    onClick={go("services")}
                    className="text-sm text-fg-muted transition-colors hover:text-fg"
                  >
                    {svc.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Products & Legal Column */}
          <div>
            <h4 className="mono text-fg-dim text-xs tracking-[0.16em]">
              {f.columns.products}
            </h4>
            <ul className="mt-6 flex flex-col gap-3">
              <li>
                <a
                  href="#products"
                  onClick={go("products")}
                  className="group flex items-center justify-between text-sm text-fg-muted hover:text-fg"
                >
                  <span>NATA</span>
                  <span className="mono text-[10px] text-ok border border-ok/30 rounded-full px-2 py-0.5">
                    ACTIVE
                  </span>
                </a>
              </li>
              <li>
                <a
                  href="#products"
                  onClick={go("products")}
                  className="group flex items-center justify-between text-sm text-fg-muted hover:text-fg"
                >
                  <span>ARAH AI</span>
                  <span className="mono text-[10px] text-fg-dim border border-line-strong rounded-full px-2 py-0.5">
                    STEALTH
                  </span>
                </a>
              </li>
              <li className="pt-2 border-t border-line/60">
                <a
                  href="#terms"
                  className="text-xs text-fg-dim transition-colors hover:text-fg"
                >
                  {f.terms}
                </a>
              </li>
              <li>
                <a
                  href="#privacy"
                  className="text-xs text-fg-dim transition-colors hover:text-fg"
                >
                  {f.privacy}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mono mt-32 flex flex-col gap-5 pt-8 text-xs text-fg-dim sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-3">
            <span>
              &copy; <span ref={yearRef} suppressHydrationWarning>2026</span> PT MASIH DILEMMA MAKNA. {f.rights}
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
                  className={`transition-colors ${locale === l ? "text-fg font-medium" : "text-fg-dim hover:text-fg-muted"
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
            onClick={go("top")}
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
          className="inline-block bg-gradient-to-b from-white/[0.18] via-white/[0.04] to-transparent bg-clip-text text-transparent [filter:drop-shadow(0_12px_40px_rgba(0,0,0,0.9))]"
          style={{
            WebkitTextStroke: "1px rgba(255, 255, 255, 0.12)",
          }}
        >
          LEMMA
        </span>

        {/* Dynamic Glowing Text Layer: both stroke & fill are masked strictly to the hover gradient */}
        <span
          className="pointer-events-none absolute inset-0 select-none text-center text-[23vw] font-semibold uppercase leading-none tracking-[0.01em] transition-opacity duration-300"
          style={{
            opacity: isHovered ? 1 : 0,
            color: "#ff5a1f",
            WebkitTextStroke: "1.5px #ff7440",
            WebkitMaskImage: `radial-gradient(circle ${GLOW_RADIUS}px at var(--glow-x, 50%) var(--glow-y, 50%), black 0%, black 25%, rgba(0, 0, 0, 0.4) 60%, transparent 10%)`,
            maskImage: `radial-gradient(circle ${GLOW_RADIUS}px at var(--glow-x, 50%) var(--glow-y, 50%), black 0%, black 25%, rgba(0, 0, 0, 0.4) 60%, transparent 100%)`,
          }}
        >
          LEMMA
        </span>
      </div>
    </footer>
  );
}
