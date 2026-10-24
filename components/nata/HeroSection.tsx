'use client';

import React from 'react';
import Image from 'next/image';
import { NATA_CTA_URL } from '@/lib/nata/site';

export default function HeroSection() {
  return (
    <section id="hero" className="hero-bg relative min-h-[100dvh] w-full flex items-center justify-center overflow-hidden select-none">
      {/* Background radiant energetic orange & texture */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center pointer-events-none"
        style={{
          backgroundImage: "url('/nata/assets/hero-bg.webp')",
          backgroundPosition: 'center center',
          backgroundRepeat: 'no-repeat',
        }}
      />

      <div
        className="absolute inset-0 z-0 pointer-events-none opacity-30"
        style={{
          background: 'radial-gradient(circle at 75% 45%, #FF7A3D 0%, #FF5000 45%, #E63B00 80%, #C92B00 100%)',
        }}
      />

      {/* 2-Column Exact Figma Container: max-w-[1280px], 72px padding on desktop, locked 1136px grid */}
      <div className="w-full max-w-[1280px] mx-auto px-5 sm:px-9 lg:px-[72px] relative z-10 pt-24 sm:pt-28 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-center w-full">

          {/* Left Column (Figma Frame 1: wider column ~640px to ensure clean 2 lines) */}
          <div className="lg:col-span-7 flex flex-col justify-center text-left">
            {/* H1: Satoshi Medium (500), 2 lines exact, no orphan wrap */}
            <h1 className="font-satoshi font-medium text-white text-[42px] sm:text-[56px] md:text-[70px] lg:text-[80px] xl:text-[86px] leading-[0.95] tracking-[-0.035em] mb-5 sm:mb-6">
              Beres tugas<br />
              <span className="whitespace-nowrap">tanpa pusing!</span>
            </h1>

            {/* Subtitle (Figma 42:9090: Satoshi 400 18px / lh:28px, max-w 440px) */}
            <p className="text-[#FFF4F2] font-satoshi font-normal text-sm sm:text-base md:text-[18px] leading-[28px] max-w-[440px] mb-6 sm:mb-8 opacity-95">
              Nataku menyatukan jadwal kuliah dan tugas ke dalam satu alur rapi. Cukup lewat WhatsApp, bereskan tugas tanpa ribet buka-tutup aplikasi.
            </p>

            {/* CTA Button (Figma Frame 3 42:9091: 176x36px, rounded-[6px], bg-white/10, NO SHADOW) */}
            <div>
              <a
                href={NATA_CTA_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-4 py-2 rounded-[6px] bg-white/10 hover:bg-white/20 border border-white/20 text-white font-satoshi font-medium text-[16px] leading-[24px] tracking-[-0.01em] transition-colors select-none no-underline shadow-none"
              >
                Coba Nataku
              </a>
            </div>
          </div>

          {/* Right Column (Figma Frame 2 42:9093: 522px max width) */}
          <div className="lg:col-span-5 relative flex items-center justify-center lg:justify-end">
            <div className="relative w-full max-w-[500px] lg:max-w-[522px] flex items-center justify-center lg:justify-end">
              <Image
                src="/nata/assets/hero-right-phones.webp"
                alt="Tampilan Antarmuka Nataku di 3 Smartphone"
                width={712}
                height={541}
                priority
                className="w-full h-auto scale-175 object-contain select-none"
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
