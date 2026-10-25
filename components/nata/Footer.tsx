'use client';
import ProtectedContact from '@/components/ui/ProtectedContact';

import React, { useCallback, useEffect, useRef, useState } from 'react';

import LegalModal from './LegalModal';
import type { LegalDocId } from '@/lib/nata/legal-content';

const GLOW_RADIUS = 320;

// Stepped falloff (roughly gaussian): no solid core, no hard edge.
const GLOW_MASK = `radial-gradient(circle ${GLOW_RADIUS}px at var(--glow-x, 50%) var(--glow-y, 50%), rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.75) 14%, rgba(0,0,0,0.52) 30%, rgba(0,0,0,0.3) 48%, rgba(0,0,0,0.14) 66%, rgba(0,0,0,0.05) 84%, transparent 100%)`;

const SERIF = { fontFamily: "'Source Serif 4', serif" } as const;

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const markRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [legalDoc, setLegalDoc] = useState<LegalDocId | null>(null);
  const closeLegal = useCallback(() => setLegalDoc(null), []);
  const glow = useRef({ x: 0, y: 0, tx: 0, ty: 0, init: false });

  // Centerpiece rises and fades in as the footer scrolls into view.
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const update = () => {
      const footer = footerRef.current;
      const mark = markRef.current;
      if (!footer || !mark) return;
      const rect = footer.getBoundingClientRect();
      const vh = window.innerHeight;
      const t = Math.min(Math.max((vh - rect.top) / rect.height, 0), 1);
      mark.style.setProperty('--mark-y', `${reduced ? 0 : (1 - t) * 80 - 10}px`);
      mark.style.setProperty('--mark-o', `${reduced ? 1 : 0.2 + t * 0.8}`);
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  // Glow chases the cursor with a lerp so it eases in and drifts instead of jumping.
  useEffect(() => {
    if (!isHovered || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let id = 0;
    const loop = () => {
      const g = glow.current;
      g.x += (g.tx - g.x) * 0.1;
      g.y += (g.ty - g.y) * 0.1;
      markRef.current?.style.setProperty('--glow-x', `${g.x.toFixed(1)}px`);
      markRef.current?.style.setProperty('--glow-y', `${g.y.toFixed(1)}px`);
      id = requestAnimationFrame(loop);
    };
    id = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(id);
  }, [isHovered]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const mark = markRef.current;
    if (!mark) return;
    const rect = mark.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const g = glow.current;
    g.tx = x;
    g.ty = y;
    if (!g.init) {
      g.x = x;
      g.y = y;
      g.init = true;
      mark.style.setProperty('--glow-x', `${x}px`);
      mark.style.setProperty('--glow-y', `${y}px`);
    }
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    glow.current.init = false;
    setIsHovered(false);
  }, []);

  const linkCls =
    'relative w-fit transition-colors duration-200 hover:text-[#FF5000] after:absolute after:-bottom-0.5 after:left-0 after:h-px after:w-full after:origin-right after:scale-x-0 after:bg-current after:transition-transform after:duration-300 hover:after:origin-left hover:after:scale-x-100';

  const labelCls = 'mb-4 block font-satoshi text-xs font-medium uppercase tracking-[0.16em] text-[#A8A29E]';

  return (
    <>
      <footer
        ref={footerRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        className="relative flex min-h-[82vh] w-full flex-col justify-between overflow-hidden border-t border-[#EDE6E0] bg-[#FFFAF7] pb-10 pt-20 text-[#1F1B16] sm:pt-28 md:min-h-[88vh] md:pb-14"
      >
        {/* Ambient orange wash */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-0 left-1/2 h-[380px] w-[640px] -translate-x-1/2 -translate-y-6 rounded-full bg-[#FF5000]/10 opacity-70 blur-[120px]"
        />

        <div className="relative z-10 mx-auto flex w-full max-w-[1136px] flex-1 flex-col justify-between px-5 sm:px-6 lg:px-0">
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8">
            {/* Brand */}
            <div className="flex max-w-[440px] flex-col sm:col-span-2 lg:col-span-5">
              <a href="#top" className="mb-3 flex w-fit items-center gap-3 transition-opacity hover:opacity-80">
                <img
                  src="/nata/assets/figma_exports/logo-footer-subtract.svg"
                  alt=""
                  className="h-10 w-10 object-contain [filter:brightness(0)_saturate(100%)_invert(34%)_sepia(98%)_saturate(3300%)_hue-rotate(2deg)]"
                />
                <span className="text-3xl font-bold leading-[56px] tracking-[-0.04em] sm:text-4xl lg:text-[48px]" style={SERIF}>
                  Nataku
                </span>
              </a>
              <p className="font-satoshi text-base leading-[26px] tracking-[-0.02em] text-[#57534E] sm:text-[18px]">
                Nataku adalah produk digital mandiri yang dikembangkan dengan penuh perhatian oleh Lemma Studio (PT Masih Dilemma Makna).
              </p>
            </div>

            {/* Lemma */}
            <div className="flex flex-col lg:col-span-4 lg:pt-2">
              <span className={labelCls}>Dibuat oleh</span>
              <a
                href="https://dilemma-makna.com"
                target="_blank"
                rel="noopener noreferrer"
                className="mb-3 w-fit text-lg font-light uppercase tracking-[0.2em] text-[#1F1B16] transition-opacity hover:opacity-70"
              >
                LEMMA
              </a>
              <p className="max-w-[300px] font-satoshi text-[14px] leading-[22px] text-[#57534E]">
                Lemma merancang dan membangun produk digital yang bermakna.
              </p>
              <div className="mt-4 flex flex-col gap-2 font-satoshi text-[14px] text-[#44403C]">
                <ProtectedContact channel="business" className={linkCls} />
                <ProtectedContact channel="nataku" className={linkCls} />
              </div>
            </div>

            {/* Links */}
            <div className="flex flex-col lg:col-span-3 lg:pt-2">
              <span className={labelCls}>Tautan Pendukung</span>
              <div className="flex flex-col gap-3 font-satoshi text-[15px] leading-[20px] text-[#44403C]">
                <button type="button" onClick={() => setLegalDoc('privacy')} className={`${linkCls} text-left`}>
                  Kebijakan Privasi
                </button>
                <button type="button" onClick={() => setLegalDoc('terms')} className={`${linkCls} text-left`}>
                  Syarat dan Ketentuan
                </button>
                <button type="button" onClick={() => setLegalDoc('security')} className={`${linkCls} text-left`}>
                  Keamanan Data
                </button>
                <ProtectedContact channel="nataku" className={linkCls} />
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-16 flex flex-col gap-4 pt-8 font-satoshi text-xs text-[#78716C] sm:flex-row sm:items-center sm:justify-between md:mt-24">
            <span>© 2026 PT Masih Dilemma Makna. Hak Cipta Dilindungi.</span>
            <a href="#top" className="group inline-flex w-fit items-center gap-2 text-[#1F1B16] transition-colors hover:text-[#FF5000]">
              <span className="relative">
                Kembali ke atas
                <span className="absolute -bottom-0.5 left-0 h-px w-full origin-right scale-x-0 bg-current transition-transform duration-300 group-hover:origin-left group-hover:scale-x-100" />
              </span>
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="transition-transform duration-300 group-hover:-translate-y-1">
                <path d="M8 13V3M3.5 7.5 8 3l4.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </div>
        </div>

        {/* Giant "Nataku" centerpiece: glassy outline in light mode, orange glow follows the cursor */}
        <div
          ref={markRef}
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-[0.22em] left-1/2 z-0 w-[120vw] select-none overflow-hidden text-center text-[26vw] font-bold leading-none tracking-[-0.03em]"
          style={{
            ...SERIF,
            transform: 'translate(-50%, var(--mark-y, 40px))',
            opacity: 'var(--mark-o, 0.4)' as unknown as number,
          }}
        >
          <span
            className="inline-block bg-gradient-to-b from-[#1F1B16]/[0.10] via-[#1F1B16]/[0.03] to-transparent bg-clip-text text-transparent"
            style={{ WebkitTextStroke: '1px rgba(31, 27, 22, 0.14)' }}
          >
            Nataku
          </span>

          <span
            className="pointer-events-none absolute inset-0 select-none text-center transition-opacity duration-700 ease-out"
            style={{
              opacity: isHovered ? 1 : 0,
              color: 'rgba(255, 80, 0, 0.78)',
              WebkitTextStroke: '1.25px rgba(255, 80, 0, 0.75)',
              WebkitMaskImage: GLOW_MASK,
              maskImage: GLOW_MASK,
            }}
          >
            Nataku
          </span>
        </div>
      </footer>
      <LegalModal docId={legalDoc} onChange={setLegalDoc} onClose={closeLegal} />
    </>
  );
}
