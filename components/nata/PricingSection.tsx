'use client';

import React, { useState } from 'react';
import { NATA_CTA_URL } from '@/lib/nata/site';

export default function PricingSection({ className = '' }: { className?: string } = {}) {
  const [selectedTier, setSelectedTier] = useState<'mulai-dulu' | 'on-track'>('mulai-dulu');

  const isMulaiActive = selectedTier === 'mulai-dulu';
  const isOnTrackActive = selectedTier === 'on-track';

  return (
    <section id="pricing" className={`w-full ${className} bg-[#FAFAFA] py-20 lg:py-24 relative overflow-hidden`}>
      <div className="w-full max-w-[1136px] mx-auto px-4 sm:px-6 lg:px-0">

        {/* Header (Figma Desktop - 13 Frame 1) */}
        <div className="mb-12 text-center flex flex-col items-center">
          {/* Frame 56 Badge */}
          <div className="inline-flex items-center gap-2.5 px-3 py-1 rounded-[6px] bg-[#FFE4DE] text-[#F86D52] font-satoshi font-medium text-[14px] leading-[20px] mb-3 select-none">
            Pilihan Akses
          </div>

          <h2 className="font-satoshi font-bold text-3xl sm:text-4xl lg:text-[48px] leading-[1.16] tracking-tight text-[#0F172A] mb-3 max-w-[800px] text-center">
            Mulai Gratis, Upgrade<br className="hidden sm:inline" /> Saat Kamu Butuh Asisten.
          </h2>

          <p className="font-satoshi font-normal text-base sm:text-lg lg:text-[20px] leading-[26px] text-[#23211F] tracking-[-0.01em] max-w-[760px] mx-auto text-center">
            Paket standar membantumu manajemen tugas, namun asisten WhatsApp yang memastikan seluruh deadline kamu tuntas.
          </p>
        </div>

        {/* Cards Container (Frame 4: 1136x688px) */}
        <div className="w-full rounded-[24px] bg-[#F5F5F4] border border-[#E7E5E4] p-4 sm:p-5 lg:px-5 lg:py-4 grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-[31px] items-stretch">

          {/* CARD 1: Paket Mulai Dulu (Frame 2) */}
          <div
            id="pricingCardMulai"
            onClick={() => setSelectedTier('mulai-dulu')}
            className={`rounded-[28px] p-6 sm:p-8 lg:p-[32px] flex flex-col justify-between transition-all duration-300 cursor-pointer ${isMulaiActive
              ? 'bg-[#F0441E] text-white shadow-xl scale-[1.01]'
              : 'bg-transparent text-[#57534E] hover:bg-stone-200/40'
              }`}
          >
            <div>
              {/* Header Info (Frame 60) */}
              <div className="mb-6">
                <div className="mb-4">
                  <img
                    id="flagMulaiIcon"
                    src={
                      isMulaiActive
                        ? '/nata/assets/figma_exports/icon-flag-active.svg'
                        : '/nata/assets/figma_exports/icon-flag-inactive.svg'
                    }
                    alt=""
                    className="w-10 h-10 select-none"
                  />
                </div>

                <h3
                  id="titleMulai"
                  className={`font-satoshi font-medium text-3xl sm:text-[40px] leading-[1.2] tracking-[-0.03em] mb-1 ${isMulaiActive ? 'text-white' : 'text-[#44403C]'
                    }`}
                >
                  Paket Mulai Dulu
                </h3>

                <p
                  id="taglineMulai"
                  className={`font-satoshi italic font-normal text-sm sm:text-[18px] leading-[24px] tracking-[-0.01em] mb-3 ${isMulaiActive ? 'text-[#FFF4F2]' : 'text-[#78716C]'
                    }`}
                >
                  Paling pas untuk Kenalan sama Nataku
                </p>

                <p
                  id="descMulai"
                  className={`font-satoshi font-medium text-sm sm:text-[18px] leading-[28px] ${isMulaiActive ? 'text-[#FFF4F2]' : 'text-[#57534E]'
                    }`}
                >
                  Untuk kamu yang ingin merapikan tugas dan memantau deadline secara mandiri di ponsel Android.
                </p>
              </div>

              {/* Price Display */}
              <div className="my-6">
                <div
                  id="priceMulai"
                  className={`font-satoshi font-bold text-3xl sm:text-4xl lg:text-[56px] leading-[1.14] tracking-[-0.03em] ${isMulaiActive ? 'text-[#FFF4F2]' : 'text-[#44403C]'
                    }`}
                >
                  <div className="flex items-center gap-3 mb-1">
                    <span
                      className={`font-satoshi font-medium text-base sm:text-[20px] leading-[26px] line-through decoration-2 ${isMulaiActive ? 'text-[#FFF4F2]/70' : 'text-[#A8A29E]'
                        }`}
                    >
                      Rp25.000
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-[6px] font-satoshi font-bold text-[13px] leading-[20px] tracking-normal ${isMulaiActive ? 'bg-[#FFE4DE] text-[#F0441E]' : 'bg-[#FFE4DE] text-[#F86D52]'
                        }`}
                    >
                      Diskon 40%
                    </span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span>Rp15.000</span>
                    <span className="font-medium text-base sm:text-[20px] tracking-normal opacity-80">/ bulan</span>
                  </div>
                </div>
                <div
                  id="dividerMulai"
                  className={`mt-6 border-t ${isMulaiActive ? 'border-[#FFF4F2]/30' : 'border-[#57534E]/20'
                    }`}
                />
              </div>

              {/* Feature List (Frame 61) */}
              <div className="mb-8">
                <h4
                  id="featureHeaderMulai"
                  className={`font-satoshi font-medium text-base sm:text-[18px] leading-[28px] mb-3 ${isMulaiActive ? 'text-[#FFF4F2]' : 'text-[#44403C]'
                    }`}
                >
                  Yang kamu dapatkan:
                </h4>
                <ul
                  id="featuresMulaiList"
                  className={`space-y-2 font-satoshi font-medium text-sm sm:text-[18px] leading-[28px] ${isMulaiActive ? 'text-[#FFF4F2]' : 'text-[#57534E]'
                    }`}
                >
                  <li className="flex items-start gap-2.5">
                    <span className="opacity-75">•</span>
                    <span>Akses aplikasi Android Nataku</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="opacity-75">•</span>
                    <span>Dashboard Today's Focus</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="opacity-75">•</span>
                    <span>Hitung mundur batas waktu tugas</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="opacity-75">•</span>
                    <span>Pelacakan Skor Produktivitas harian</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* CTA Button (Frame 62) */}
            <a
              id="btnCtaMulai"
              href={NATA_CTA_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={`w-full py-4 px-6 rounded-[8px] flex items-center justify-center font-inter font-semibold text-lg sm:text-[22px] lg:text-[24px] leading-[30px] tracking-[-0.02em] transition-all select-none ${isMulaiActive
                ? 'bg-[#FFE4DE] text-[#F0441E] hover:bg-white shadow-sm'
                : 'bg-[#E7E5E4] text-[#57534E] hover:bg-stone-300'
                }`}
            >
              Coba Paket Dasar
            </a>
          </div>

          {/* CARD 2: Paket On Track (Frame 5) */}
          <div
            id="pricingCardOnTrack"
            onClick={() => setSelectedTier('on-track')}
            className={`rounded-[28px] p-6 sm:p-8 lg:p-[32px] flex flex-col justify-between transition-all duration-300 cursor-pointer ${isOnTrackActive
              ? 'bg-[#F0441E] text-white shadow-xl scale-[1.01]'
              : 'bg-transparent text-[#57534E] hover:bg-stone-200/40'
              }`}
          >
            <div>
              {/* Header Info (Frame 60) */}
              <div className="mb-6">
                <div className="mb-4">
                  <img
                    id="flagOnTrackIcon"
                    src={
                      isOnTrackActive
                        ? '/nata/assets/figma_exports/icon-flag-active.svg'
                        : '/nata/assets/figma_exports/icon-flag-inactive.svg'
                    }
                    alt=""
                    className="w-10 h-10 select-none"
                  />
                </div>

                <h3
                  id="titleOnTrack"
                  className={`font-satoshi font-medium text-3xl sm:text-[40px] leading-[1.2] tracking-[-0.03em] mb-1 ${isOnTrackActive ? 'text-white' : 'text-[#44403C]'
                    }`}
                >
                  Paket On Track
                </h3>

                <p
                  id="taglineOnTrack"
                  className={`font-satoshi italic font-normal text-sm sm:text-[18px] leading-[24px] tracking-[-0.01em] mb-3 ${isOnTrackActive ? 'text-[#FFF4F2]' : 'text-[#78716C]'
                    }`}
                >
                  Paling Pas untuk Mahasiswa Aktif
                </p>

                <p
                  id="descOnTrack"
                  className={`font-satoshi font-medium text-sm sm:text-[18px] leading-[28px] ${isOnTrackActive ? 'text-[#FFF4F2]' : 'text-[#57534E]'
                    }`}
                >
                  Untuk kamu yang punya jadwal padat dan butuh asisten yang menyapa dan mencatat langsung dari WhatsApp.
                </p>
              </div>

              {/* Price Display */}
              <div className="my-6">
                <div
                  id="priceOnTrack"
                  className={`font-satoshi font-bold text-3xl sm:text-4xl lg:text-[56px] leading-[1.14] tracking-[-0.03em] ${isOnTrackActive ? 'text-[#FFF4F2]' : 'text-[#44403C]'
                    }`}
                >
                  SOON
                </div>
                <div
                  id="dividerOnTrack"
                  className={`mt-6 border-t ${isOnTrackActive ? 'border-[#FFF4F2]/30' : 'border-[#57534E]/20'
                    }`}
                />
              </div>

              {/* Feature List (Frame 61) */}
              <div className="mb-8">
                <h4
                  id="featureHeaderOnTrack"
                  className={`font-satoshi font-medium text-base sm:text-[18px] leading-[28px] mb-3 ${isOnTrackActive ? 'text-[#FFF4F2]' : 'text-[#44403C]'
                    }`}
                >
                  Yang kamu dapatkan:
                </h4>
                <ul
                  id="featuresOnTrackList"
                  className={`space-y-2 font-satoshi font-medium text-sm sm:text-[18px] leading-[28px] ${isOnTrackActive ? 'text-[#FFF4F2]' : 'text-[#57534E]'
                    }`}
                >
                  <li className="flex items-start gap-2.5">
                    <span className="opacity-75">•</span>
                    <span>Semua fitur Paket Mulai Dulu</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="opacity-75">•</span>
                    <span>Pengiriman pesan WhatsApp Daily Digest setiap pagi</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="opacity-75">•</span>
                    <span>Balas chat WhatsApp untuk coret dan tambah tugas</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="opacity-75">•</span>
                    <span>Pengingat batas waktu mendesak langsung ke nomor pribadimu</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* CTA Button (Frame 62) */}
            <a
              id="btnCtaOnTrack"
              href={NATA_CTA_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Tanya paket On Track via WhatsApp"
              className={`w-full py-4 px-6 rounded-[8px] flex items-center justify-center font-inter font-semibold text-lg sm:text-[22px] lg:text-[24px] leading-[30px] tracking-[-0.02em] transition-all select-none ${isOnTrackActive
                ? 'bg-[#FFE4DE] text-[#F0441E] hover:bg-white shadow-sm'
                : 'bg-[#E7E5E4] text-[#57534E] hover:bg-stone-300'
                }`}
            >
              Tanya On Track
            </a>
          </div>

        </div>
      </div>
    </section>
  );
}
