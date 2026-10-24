'use client';

import React, { useState } from 'react';

import { faqs } from '@/lib/nata/faq';

export default function FaqSection() {
  // Aturan interaktif: Awalnya tertutup semua (null)
  // Maksimal 1 aktif bergantian
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  const toggle = (idx: number) => {
    setOpenIdx((prev) => (prev === idx ? null : idx));
  };

  return (
    <section
      id="faq"
      className="w-full bg-[#FFFFFF] py-20 lg:py-24 relative overflow-hidden"
    >
      <div className="w-full max-w-[1136px] mx-auto px-4 sm:px-6 lg:px-0">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-start">
          
          {/* Sisi Kiri: Header (Figma Frame 1: 552px) */}
          <div className="lg:col-span-6 flex flex-col justify-start max-w-[552px]">
            <h2 className="font-satoshi font-bold text-3xl sm:text-4xl lg:text-[48px] leading-[1.16] tracking-tight text-[#F0441E] mb-3">
              Tanya Jawab
            </h2>
            <p className="font-satoshi font-normal text-base sm:text-lg lg:text-[20px] leading-[26px] text-[#23211F] tracking-[-0.02em]">
              Setiap awal semester selalu bikin to-do list baru. Tiga hari pertama rajin mencatat, setelah itu aplikasinya berdebu di folder HP.
            </p>
          </div>

          {/* Sisi Kanan: Accordion (Figma Frame 4: 552px, Single active item) */}
          <div className="lg:col-span-6 flex flex-col max-w-[552px] w-full">
            <div className="border border-[#E7E5E4] rounded-[12px] overflow-hidden divide-y divide-[#E7E5E4] bg-white shadow-sm">
              {faqs.map((faq, idx) => {
                const isOpen = openIdx === idx;
                return (
                  <div key={idx} className="group">
                    <button
                      type="button"
                      onClick={() => toggle(idx)}
                      className="w-full text-left py-3.5 sm:py-4 px-6 flex items-center justify-between gap-4 cursor-pointer hover:bg-stone-50/70 transition-colors select-none"
                      aria-expanded={isOpen}
                    >
                      <span className="font-satoshi font-medium text-base sm:text-lg md:text-[20px] leading-[26px] text-[#44403C] tracking-[-0.02em]">
                        {faq.question}
                      </span>
                      <span
                        className={`w-6 h-6 flex items-center justify-center flex-shrink-0 transition-transform duration-300 ${
                          isOpen ? 'rotate-180' : 'rotate-0'
                        }`}
                      >
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-5 h-5"
                        >
                          <path
                            d="M19.9201 8.9502L13.4001 15.4702C12.6301 16.2402 11.3701 16.2402 10.6001 15.4702L4.08008 8.9502"
                            stroke="#78716C"
                            strokeWidth="1.5"
                            strokeMiterlimit="10"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </span>
                    </button>
                    <div
                      className="grid transition-all duration-300 ease-in-out"
                      style={{
                        gridTemplateRows: isOpen ? '1fr' : '0fr'
                      }}
                    >
                      <div className="overflow-hidden">
                        <div className="px-6 pt-1 pb-4 text-[#000000] font-satoshi font-light text-xs sm:text-sm md:text-[14px] leading-[20px] border-t border-[#E7E5E4]/60">
                          {faq.answer}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
);
}
