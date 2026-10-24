'use client';

import React, { useState, useEffect, useRef } from 'react';
import { TodayFocusVisual, CalendarVisual, WhatsAppVisual } from './PillarVisuals';

export default function PillarsSection() {
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
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [slideDist, setSlideDist] = useState<number>(800);

  useEffect(() => {
    const check = () => {
      setIsMobile(window.innerWidth < 640);
      setSlideDist(Math.max(700, window.innerHeight));
    };
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const step1 = isMobile ? 18 : 24;
  const step2 = isMobile ? 36 : 48;

  // Card 2 slides up over Card 1 (0.12 -> 0.48), resting at step1 (24px desktop, 18px mobile)
  const t2 = Math.max(0, Math.min(1, (p - 0.12) / 0.34));
  const ease2 = 1 - Math.pow(1 - t2, 3);
  const y2 = (1 - ease2) * slideDist + ease2 * step1;

  // Card 3 slides up over Card 2 (0.52 -> 0.88), resting at step2 (48px desktop, 36px mobile)
  const t3 = Math.max(0, Math.min(1, (p - 0.52) / 0.34));
  const ease3 = 1 - Math.pow(1 - t3, 3);
  const y3 = (1 - ease3) * slideDist + ease3 * step2;

  return (
    <section id="sistem-inti" className="relative w-full bg-[#FAFAFA] text-[#0F172A]">
      {/* Section Intro Header: Scrolls naturally past before card pinning */}
      <div className="w-full max-w-[1280px] mx-auto pt-20 sm:pt-24 lg:pt-28 pb-8 sm:pb-10 px-5 sm:px-9 lg:px-[72px] text-left">
        <div className="max-w-[1136px] mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[6px] bg-[#FFE4DE] text-[#F86D52] font-satoshi font-medium text-[13px] sm:text-[14px] leading-[18px] mb-3 select-none">
            Sistem Terpadu
          </div>
          <h2 className="font-satoshi font-bold text-3xl sm:text-4xl md:text-[44px] lg:text-[52px] leading-[1.12] text-[#0F172A] tracking-[-0.03em] mb-3">
            3 Sistem Terpadu Untuk Harimu.
          </h2>
          <p className="font-satoshi font-normal text-base sm:text-lg md:text-[20px] leading-[1.4] text-[#57534E] max-w-[840px]">
            Setiap awal semester selalu bikin to-do list baru. Tiga hari pertama rajin mencatat, setelah itu aplikasinya berdebu di folder HP.
          </p>
        </div>
      </div>

      {/* Pinned Card Deck Runway: Viewport-filling cards with clearance for floating navbar */}
      <div ref={containerRef} className="relative w-full" style={{ height: '280vh' }}>
        <div className="sticky top-0 w-full h-[100dvh] flex flex-col justify-center items-center overflow-hidden px-4 sm:px-8 lg:px-[72px] pt-[76px] pb-6 sm:pb-8 select-none">
          {/* 3 Overlapping Cards Deck Container: Fills viewport height */}
          <div className="relative w-full max-w-[1136px] h-[calc(100dvh-100px)] max-h-[660px] min-h-[460px]">
          
          {/* Card 1: Today's Focus (Red-Orange #F0441E) - Flat, No Shadow, Maximized Content */}
          <div
            className="absolute inset-x-0 top-0 w-full h-[calc(100%-36px)] sm:h-[calc(100%-48px)] rounded-[20px] sm:rounded-[28px] bg-[#F0441E] text-white overflow-hidden will-change-transform select-none shadow-none"
            style={{ zIndex: 10 }}
          >
            {/* Inner Dashed Border Frame */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-10 p-3 sm:p-4 lg:p-5" preserveAspectRatio="none">
              <rect x="1" y="1" width="calc(100% - 2px)" height="calc(100% - 2px)" rx="22" fill="none" stroke="#9BA2B8" strokeWidth="1.5" strokeDasharray="12 12" strokeOpacity="0.85" />
            </svg>

            <div className="relative z-20 grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 items-center h-full px-6 sm:px-9 lg:px-12 py-6 sm:py-8 lg:py-10">
              <div className="lg:col-span-6 flex flex-col justify-center pr-0 lg:pr-4">
                <h3 className="font-satoshi font-medium text-white text-[22px] sm:text-[40px] md:text-[48px] lg:text-[54px] xl:text-[60px] leading-[1.06] tracking-[-0.035em] mb-2 sm:mb-2.5">
                  Today's Focus
                </h3>
                <h4 className="font-satoshi font-normal text-[#FFF4F2] text-[13px] sm:text-[19px] md:text-[21px] xl:text-[23px] leading-[1.26] tracking-tight mb-2 sm:mb-2.5">
                  Maksimal 3 hal terpenting setiap hari.
                </h4>
                <p className="font-satoshi font-normal sm:font-medium text-[#FFF4F2]/90 text-[12px] sm:text-[15px] md:text-[17px] xl:text-[19px] leading-[1.38] max-w-[500px] ">
                  Layar utama Nataku memangkas kekacauan tugasmu dan hanya menampilkan hal yang paling wajib beres hari ini, sehingga energimu tidak habis karena overwhelmed.
                </p>
              </div>
              <div className="lg:col-span-6 flex items-center justify-center lg:justify-end h-full py-1">
                <TodayFocusVisual />
              </div>
            </div>
          </div>

          {/* Card 2: Calendar Integrated (Emerald Green #047857) - Flat, No Shadow, Maximized Content */}
          <div
            className="absolute inset-x-0 top-0 w-full h-[calc(100%-36px)] sm:h-[calc(100%-48px)] rounded-[20px] sm:rounded-[28px] bg-[#047857] text-white overflow-hidden will-change-transform select-none shadow-none"
            style={{
              zIndex: 20,
              transform: `translateY(${y2}px)`,
            }}
          >
            {/* Inner Dashed Border Frame */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-10 p-3 sm:p-4 lg:p-5" preserveAspectRatio="none">
              <rect x="1" y="1" width="calc(100% - 2px)" height="calc(100% - 2px)" rx="22" fill="none" stroke="#9BA2B8" strokeWidth="1.5" strokeDasharray="12 12" strokeOpacity="0.85" />
            </svg>

            <div className="relative z-20 grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 items-center h-full px-6 sm:px-9 lg:px-12 py-6 sm:py-8 lg:py-10">
              <div className="lg:col-span-6 flex flex-col justify-center pr-0 lg:pr-4">
                <h3 className="font-satoshi font-medium text-white text-[22px] sm:text-[40px] md:text-[48px] lg:text-[54px] xl:text-[60px] leading-[1.06] tracking-[-0.035em] mb-2 sm:mb-2.5">
                  Calendar Integrated
                </h3>
                <h4 className="font-satoshi font-normal text-[#FFF4F2] text-[13px] sm:text-[19px] md:text-[21px] xl:text-[23px] leading-[1.26] tracking-tight mb-2 sm:mb-2.5">
                  Bebas panik H-1 jam pengumpulan tugas.
                </h4>
                <p className="font-satoshi font-normal sm:font-medium text-[#FFF4F2]/90 text-[12px] sm:text-[15px] md:text-[17px] xl:text-[19px] leading-[1.38] max-w-[500px] ">
                  Indikator visual hitung mundur dengan warna jelas (kuning untuk hari ini, merah untuk mendesak). Kamu selalu tahu berapa sisa waktumu sebelum terlambat.
                </p>
              </div>
              <div className="lg:col-span-6 flex items-center justify-center lg:justify-end h-full py-1">
                <CalendarVisual />
              </div>
            </div>
          </div>

          {/* Card 3: WhatsApp Daily (Blue #0369A1) - Flat, No Shadow, Maximized Content */}
          <div
            className="absolute inset-x-0 top-0 w-full h-[calc(100%-36px)] sm:h-[calc(100%-48px)] rounded-[20px] sm:rounded-[28px] bg-[#0369A1] text-white overflow-hidden will-change-transform select-none shadow-none"
            style={{
              zIndex: 30,
              transform: `translateY(${y3}px)`,
            }}
          >
            {/* Inner Dashed Border Frame */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-10 p-3 sm:p-4 lg:p-5" preserveAspectRatio="none">
              <rect x="1" y="1" width="calc(100% - 2px)" height="calc(100% - 2px)" rx="22" fill="none" stroke="#9BA2B8" strokeWidth="1.5" strokeDasharray="12 12" strokeOpacity="0.85" />
            </svg>

            <div className="relative z-20 grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 items-center h-full px-6 sm:px-9 lg:px-12 py-6 sm:py-8 lg:py-10">
              <div className="lg:col-span-6 flex flex-col justify-center pr-0 lg:pr-4">
                <h3 className="font-satoshi font-medium text-white text-[22px] sm:text-[40px] md:text-[48px] lg:text-[54px] xl:text-[60px] leading-[1.06] tracking-[-0.035em] mb-2 sm:mb-2.5">
                  WhatsApp Daily &amp;<br className="hidden sm:inline" /> Quick Action
                </h3>
                <h4 className="font-satoshi font-normal text-[#FFF4F2] text-[13px] sm:text-[19px] md:text-[21px] xl:text-[23px] leading-[1.26] tracking-tight mb-2 sm:mb-2.5">
                  Asisten harian langsung di chat pribadimu.
                </h4>
                <p className="font-satoshi font-normal sm:font-medium text-[#FFF4F2]/90 text-[12px] sm:text-[15px] md:text-[17px] xl:text-[19px] leading-[1.38] max-w-[500px] ">
                  Terima rangkuman pagi setiap jam 7. Balas chat untuk mencoret tugas atau menambah agenda baru tanpa perlu menyentuh aplikasi.
                </p>
              </div>
              <div className="lg:col-span-6 flex items-center justify-center lg:justify-end h-full py-1">
                <WhatsAppVisual />
              </div>
            </div>
          </div>

        </div>
      </div>
      </div>
    </section>
  );
}
