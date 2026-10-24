'use client';

import React, { useState, useEffect, useRef } from 'react';

const QUOTE_WORDS = [
  "Setiap", "pagi,", "Nataku", "ingatkan", "tugas", "prioritasmu",
  "lewat", "WhatsApp.", "Cukup", "balas", "chat,", "tugas",
  "langsung", "tercatat."
];

export default function ProblemFeatureSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState<number>(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const totalScroll = containerRef.current.offsetHeight - window.innerHeight;
      if (totalScroll <= 0) return;
      const p = Math.min(Math.max(-rect.top / totalScroll, 0), 1);
      setProgress(p);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const p = progress;

  // Viewport dimensions for corner calculations
  const [viewportDims, setViewportDims] = useState({ w: 1280, h: 800 });

  useEffect(() => {
    const updateDims = () => {
      setViewportDims({
        w: Math.min(1280, window.innerWidth),
        h: window.innerHeight,
      });
    };
    updateDims();
    window.addEventListener('resize', updateDims);
    return () => window.removeEventListener('resize', updateDims);
  }, []);

  // ponytail: desktop uses exact original Figma formula; mobile adapts to avoid off-screen overflow
  const isMobile = viewportDims.w < 640;
  const offsetX = isMobile ? Math.round((viewportDims.w / 2) - 62.5 + 22) : Math.max(240, (viewportDims.w / 2) - 55);
  const offsetY = isMobile ? Math.round((viewportDims.h / 2) - 55 + 20) : Math.max(180, (viewportDims.h / 2) - 48);

  const corners = [
    { x: -offsetX, y: -offsetY, rot: 0 },
    { x: offsetX,  y: -offsetY, rot: 0 },
    { x: -offsetX, y: offsetY,  rot: 0 },
    { x: offsetX,  y: offsetY,  rot: 0 },
  ];

  // =========================================================================
  // PART 1: "Tata Semua Jadwalmu!" (0.00 -> 0.26)
  // =========================================================================
  let part1Opacity = 1.0;
  let headlineScale = 1.0;
  let headlineOpacity = 1.0;
  let cardsInterp = corners;

  if (p < 0.26) {
    part1Opacity = 1.0;

    const tHead = Math.min(1, p / 0.18);
    headlineScale = Math.max(0, 1.0 - 0.45 * tHead);
    headlineOpacity = Math.max(0, 1.0 - tHead * 1.3);

    if (p < 0.20) {
      const tCard = p / 0.20;
      const easeCard = tCard * tCard * (3 - 2 * tCard);
      cardsInterp = corners.map((c) => ({
        x: c.x * (1 - easeCard),
        y: c.y * (1 - easeCard),
        rot: 0,
      }));
    } else if (p < 0.23) {
      cardsInterp = [
        { x: 0, y: 0, rot: 0 },
        { x: 0, y: 0, rot: 0 },
        { x: 0, y: 0, rot: 0 },
        { x: 0, y: 0, rot: 0 },
      ];
    } else {
      const tDissolve = (p - 0.23) / 0.03;
      part1Opacity = Math.max(0, 1.0 - tDissolve);
      cardsInterp = [
        { x: 0, y: 0, rot: 0 },
        { x: 0, y: 0, rot: 0 },
        { x: 0, y: 0, rot: 0 },
        { x: 0, y: 0, rot: 0 },
      ];
    }
  } else {
    part1Opacity = 0.0;
    headlineOpacity = 0.0;
  }

  // =========================================================================
  // PART 2: Feature Dynamic Group Re-Centering (0.26 -> 0.60)
  // Step distance S = 118px (~86px height + ~32px clear gap)
  // =========================================================================
  const S = isMobile ? 70 : 118; // ponytail: mobile pill spacing
  let y1 = 150, op1 = 0;
  let y2 = 190, op2 = 0;
  let y3 = 230, op3 = 0;
  let part2Opacity = 1.0;
  let part2Scale = 1.0;

  if (p < 0.26) {
    op1 = 0; op2 = 0; op3 = 0;
  } else if (p < 0.36) {
    const t1 = Math.max(0, Math.min(1, (p - 0.26) / 0.10));
    const ease1 = 1 - Math.pow(1 - t1, 3);
    y1 = (1 - ease1) * 150;
    op1 = ease1;
  } else if (p < 0.46) {
    const t2 = Math.max(0, Math.min(1, (p - 0.36) / 0.10));
    const ease2 = 1 - Math.pow(1 - t2, 3);
    y1 = -ease2 * (S / 2);
    op1 = 1;
    y2 = (1 - ease2) * 180 + ease2 * (S / 2);
    op2 = ease2;
  } else if (p < 0.55) {
    const t3 = Math.max(0, Math.min(1, (p - 0.46) / 0.09));
    const ease3 = 1 - Math.pow(1 - t3, 3);
    y1 = -(S / 2) - ease3 * (S / 2);
    op1 = 1;
    y2 = (S / 2) - ease3 * (S / 2);
    op2 = 1;
    y3 = (1 - ease3) * 210 + ease3 * S;
    op3 = ease3;
  } else if (p < 0.60) {
    y1 = -S; op1 = 1;
    y2 = 0;  op2 = 1;
    y3 = S;  op3 = 1;
  } else {
    // Fade out during Iris expansion (0.60 -> 0.70)
    const tPillFade = Math.min(1, (p - 0.60) / 0.08);
    part2Opacity = Math.max(0, 1 - tPillFade * 1.4);
    part2Scale = 1 - tPillFade * 0.06;
    y1 = -S; op1 = 1;
    y2 = 0;  op2 = 1;
    y3 = S;  op3 = 1;
  }

  // =========================================================================
  // PART 3: Orange Iris Expansion (0.60 -> 0.70)
  // =========================================================================
  let irisRadius = 0;
  let irisOpacity = 0;

  if (p >= 0.60 && p < 0.70) {
    const tIris = (p - 0.60) / 0.10;
    const easeIris = tIris * tIris * (3 - 2 * tIris);
    irisRadius = easeIris * 150;
    irisOpacity = 1;
  } else if (p >= 0.70) {
    irisRadius = 150;
    irisOpacity = 1;
  }


  // =========================================================================
  // PART 4: Scroll-Driven Word-by-Word Reading Highlight ("Typescript")
  // Entrance: 0.68 -> 0.73, Scrub: 0.73 -> 0.92, Hold: 0.92 -> 1.00
  // =========================================================================
  let xBracketLeft = 36;
  let xBracketRight = -36;
  let yQuoteText = 24;
  let quoteContainerOpacity = 0;

  if (p >= 0.68 && p < 0.73) {
    const tIn = (p - 0.68) / 0.05;
    const easeIn = 1 - Math.pow(1 - tIn, 3);
    xBracketLeft = (1 - easeIn) * 36;
    xBracketRight = -(1 - easeIn) * 36;
    yQuoteText = (1 - easeIn) * 24;
    quoteContainerOpacity = easeIn;
  } else if (p >= 0.73) {
    xBracketLeft = 0;
    xBracketRight = 0;
    yQuoteText = 0;
    quoteContainerOpacity = 1;
  }

  return (
    <section
      ref={containerRef}
      id="protoSection"
      className="relative bg-[#FFFFFF]"
      style={{ height: '400vh' }}
    >
      {/* Smooth scroll anchor for navbar "Tentang" (#quote) */}
      <div id="quote" className="absolute pointer-events-none" style={{ top: '75%', width: 1, height: 1 }} />

      {/* Sticky Pinned Viewport */}
      <div className="sticky top-0 w-full h-[100dvh] flex flex-col justify-center items-center overflow-hidden select-none">
        
        {/* Full Viewport Orange Iris Expansion Layer */}
        <div
          className="absolute inset-0 pointer-events-none z-[35] bg-[#F0441E]"
          style={{
            clipPath: `circle(${irisRadius}% at 50% 50%)`,
            opacity: irisOpacity,
            willChange: 'clip-path, opacity',
          }}
        />

        {/* Staging Area (Full Viewport Height: h-[100dvh]) */}
        <div className="relative w-full max-w-[1280px] h-[100dvh] flex items-center justify-center">
          
          {/* ============================================================== */}
          {/* PART 1: "Tata Semua Jadwalmu!" (Orange Text) + 4 Bleeding Cards */}
          {/* ============================================================== */}
          <div
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            style={{ opacity: part1Opacity }}
          >
            {/* Center Orange Headline */}
            <div
              className="text-center z-10 will-change-transform px-4"
              style={{
                transform: `scale(${headlineScale})`,
                opacity: headlineOpacity,
              }}
            >
              <h2 className="font-satoshi font-medium text-[#F0441E] text-[38px] sm:text-[96px] md:text-[135px] lg:text-[165px] xl:text-[191px] leading-[0.91] tracking-[-0.04em] text-center select-none">
                Tata Semua<br />
                Jadwalmu!
              </h2>
            </div>

            {/* 4 Cards Gliding to Dead Center */}
            <div
              className="absolute left-1/2 top-1/2 shadow-lg rounded-[12px] overflow-hidden pointer-events-none w-[125px] sm:w-[200px] md:w-[219px]"
              style={{
                transform: `translate(-50%, -50%) translate3d(${cardsInterp[0].x}px, ${cardsInterp[0].y}px, 0)`,
                zIndex: 25,
              }}
            >
              <img
                src="/nata/assets/proto/card-kuburan-catatan.webp"
                alt="Kuburan Catatan"
                className="w-full h-auto block"
              />
            </div>

            <div
              className="absolute left-1/2 top-1/2 shadow-lg rounded-[12px] overflow-hidden pointer-events-none w-[115px] sm:w-[180px] md:w-[193px]"
              style={{
                transform: `translate(-50%, -50%) translate3d(${cardsInterp[1].x}px, ${cardsInterp[1].y}px, 0)`,
                zIndex: 24,
              }}
            >
              <img
                src="/nata/assets/proto/card-overwhelmed.webp"
                alt="Overwhelmed"
                className="w-full h-auto block"
              />
            </div>

            <div
              className="absolute left-1/2 top-1/2 shadow-lg rounded-[12px] overflow-hidden pointer-events-none w-[120px] sm:w-[185px] md:w-[200px]"
              style={{
                transform: `translate(-50%, -50%) translate3d(${cardsInterp[2].x}px, ${cardsInterp[2].y}px, 0)`,
                zIndex: 23,
              }}
            >
              <img
                src="/nata/assets/proto/card-puluhan-grup.webp"
                alt="Puluhan Grup"
                className="w-full h-auto block"
              />
            </div>

            <div
              className="absolute left-1/2 top-1/2 shadow-lg rounded-[12px] overflow-hidden pointer-events-none w-[130px] sm:w-[205px] md:w-[224px]"
              style={{
                transform: `translate(-50%, -50%) translate3d(${cardsInterp[3].x}px, ${cardsInterp[3].y}px, 0)`,
                zIndex: 22,
              }}
            >
              <img
                src="/nata/assets/proto/card-distraksi-medsos.webp"
                alt="Distraksi Medsos"
                className="w-full h-auto block"
              />
            </div>
          </div>


          {/* ============================================================== */}
          {/* PART 2: Feature Dynamic Group Re-Centering (Figma 59:26229)    */}
          {/* Fitted padding (px-7 py-4.5), rounded-[16px], and 32px gap    */}
          {/* ============================================================== */}
          <div
            className="absolute inset-0 pointer-events-none z-30 transition-transform will-change-[transform,opacity]"
            style={{
              opacity: part2Opacity,
              transform: `scale(${part2Scale})`,
            }}
          >
            {/* Feature 1: Manajemen Tugas */}
            <div
              className="absolute left-1/2 top-1/2 inline-flex items-center gap-3 sm:gap-5 px-4 sm:px-7 md:px-8 py-2.5 sm:py-4 rounded-[14px] sm:rounded-[16px] max-w-[calc(100vw-32px)] bg-[#F0441E] shadow-xl select-none will-change-transform"
              style={{
                opacity: op1,
                transform: `translate(-50%, -50%) translate3d(0, ${y1}px, 0)`,
              }}
            >
              <img src="/nata/assets/proto/icon-note.svg" alt="" className="w-6 h-6 sm:w-10 sm:h-10 md:w-11 md:h-11 object-contain brightness-0 invert flex-shrink-0" />
              <div className="font-satoshi text-lg sm:text-[32px] md:text-[38px] lg:text-[42px] tracking-tight leading-none whitespace-nowrap">
                <span className="text-[#FFC4B8] font-normal sm:font-medium">Manajemen</span> <span className="text-white font-medium sm:font-semibold">Tugas</span>
              </div>
            </div>

            {/* Feature 2: Integrasi Kalender */}
            <div
              className="absolute left-1/2 top-1/2 inline-flex items-center gap-3 sm:gap-5 px-4 sm:px-7 md:px-8 py-2.5 sm:py-4 rounded-[14px] sm:rounded-[16px] max-w-[calc(100vw-32px)] bg-[#F59E0B] shadow-xl select-none will-change-transform"
              style={{
                opacity: op2,
                transform: `translate(-50%, -50%) translate3d(0, ${y2}px, 0)`,
              }}
            >
              <img src="/nata/assets/proto/icon-calendar.svg" alt="" className="w-6 h-6 sm:w-10 sm:h-10 md:w-11 md:h-11 object-contain brightness-0 invert flex-shrink-0" />
              <div className="font-satoshi text-lg sm:text-[32px] md:text-[38px] lg:text-[42px] tracking-tight leading-none whitespace-nowrap">
                <span className="text-[#FDE68A] font-normal sm:font-medium">Integrasi</span> <span className="text-white font-medium sm:font-semibold">Kalender</span>
              </div>
            </div>

            {/* Feature 3: Terhubung WhatsApp */}
            <div
              className="absolute left-1/2 top-1/2 inline-flex items-center gap-3 sm:gap-5 px-4 sm:px-7 md:px-8 py-2.5 sm:py-4 rounded-[14px] sm:rounded-[16px] max-w-[calc(100vw-32px)] bg-[#019669] shadow-xl select-none will-change-transform"
              style={{
                opacity: op3,
                transform: `translate(-50%, -50%) translate3d(0, ${y3}px, 0)`,
              }}
            >
              <img src="/nata/assets/proto/icon-whatsapp.svg" alt="" className="w-6 h-6 sm:w-10 sm:h-10 md:w-11 md:h-11 object-contain brightness-0 invert flex-shrink-0" />
              <div className="font-satoshi text-lg sm:text-[32px] md:text-[38px] lg:text-[42px] tracking-tight leading-none whitespace-nowrap">
                <span className="text-[#A7F3D0] font-normal sm:font-medium">Terhubung</span> <span className="text-white font-medium sm:font-semibold">WhatsApp</span>
              </div>
            </div>
          </div>

          {/* ============================================================== */}
          {/* PART 4: QUOTE BANNER CONTINUUM (Figma Desktop - 4 73:32098)   */}
          {/* Scroll-Driven Word-by-Word Reading Highlight ("Typescript")   */}
          {/* Refined Regular/Medium font weight (Satoshi 400/500)          */}
          {/* ============================================================== */}
          <div
            className="absolute inset-0 flex items-center justify-center pointer-events-none z-40 px-4 sm:px-8"
          >
            <div className="w-full max-w-[1100px] mx-auto flex items-center justify-between gap-4 sm:gap-8 md:gap-12 will-change-transform">
              
              {/* Left Bracket */}
              <div
                className="flex-shrink-0 flex items-center justify-center select-none pointer-events-none will-change-transform"
                style={{
                  opacity: quoteContainerOpacity,
                  transform: `translateX(${xBracketLeft}px)`,
                }}
              >
                <img
                  src="/nata/assets/figma_exports/quote-bracket-left.svg"
                  alt="“"
                  className="h-16 sm:h-44 md:h-60 lg:h-72 w-auto object-contain"
                />
              </div>

              {/* Statement Typography: Word-by-Word Scroll Highlight */}
              <h2
                className="flex-1 font-satoshi font-normal sm:font-medium text-white text-[18px] sm:text-[34px] md:text-[44px] lg:text-[52px] xl:text-[58px] leading-[1.18] tracking-[-0.025em] text-left max-w-[800px] select-text pointer-events-auto cursor-text will-change-transform"
                style={{
                  opacity: quoteContainerOpacity,
                  transform: `translateY(${yQuoteText}px)`,
                }}
              >
                {QUOTE_WORDS.map((w, idx) => {
                  const scrubRange = 0.92 - 0.73; // 0.19
                  const wStart = 0.73 + (idx / QUOTE_WORDS.length) * scrubRange;
                  const wEnd = wStart + 0.025;
                  let wordOp = 0.28;
                  if (p >= wEnd) {
                    wordOp = 1.0;
                  } else if (p >= wStart) {
                    const tw = (p - wStart) / (wEnd - wStart);
                    wordOp = 0.28 + tw * 0.72;
                  }

                  return (
                    <span
                      key={idx}
                      className="inline-block transition-opacity duration-75"
                      style={{
                        opacity: quoteContainerOpacity > 0 ? wordOp : 0,
                        marginRight: '0.28em',
                      }}
                    >
                      {w}
                    </span>
                  );
                })}
              </h2>

              {/* Right Bracket */}
              <div
                className="flex-shrink-0 flex items-center justify-center select-none pointer-events-none will-change-transform"
                style={{
                  opacity: quoteContainerOpacity,
                  transform: `translateX(${xBracketRight}px)`,
                }}
              >
                <img
                  src="/nata/assets/figma_exports/quote-bracket-right.svg"
                  alt="”"
                  className="h-16 sm:h-44 md:h-60 lg:h-72 w-auto object-contain"
                />
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
