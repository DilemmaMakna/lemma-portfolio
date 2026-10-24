'use client';

import React, { useEffect, useRef, useState } from 'react';

const STAGE_W = 500;
const STAGE_H = 400;

/**
 * Lays children out on a fixed 500x400 canvas and scales it to the parent's width,
 * so the HTML mockups keep the same proportions as the Figma frames at any viewport.
 */
function Stage({ children, label }: { children: React.ReactNode; label: string }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const update = () => setScale(Math.min(1, el.clientWidth / STAGE_W));
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div
      ref={wrapRef}
      role="img"
      aria-label={label}
      className="relative w-full max-w-[500px] select-none"
      style={{ height: STAGE_H * scale }}
    >
      <div
        className="absolute left-0 top-0 origin-top-left font-satoshi"
        style={{
          width: STAGE_W,
          height: STAGE_H,
          transform: `scale(${scale})`,
          WebkitMaskImage: 'linear-gradient(to bottom, #000 78%, transparent 100%)',
          maskImage: 'linear-gradient(to bottom, #000 78%, transparent 100%)',
        }}
        aria-hidden="true"
      >
        {children}
      </div>
    </div>
  );
}

/* ---------- Card 1: Today's Focus ---------- */

const TASKS = [
  { done: 3, avatars: ['Y', 'AR', 'AR'] },
  { done: 3, avatars: ['Y', 'AR'] },
  { done: 3, avatars: ['Y', 'AR'] },
];

export function TodayFocusVisual() {
  return (
    <Stage label="Pratinjau layar Today's Focus Nataku">
      {/* Weekly score card (behind) */}
      <div className="absolute left-[345px] top-[74px] w-[190px] overflow-hidden rounded-[14px] bg-white">
        <div className="bg-gradient-to-br from-[#FF7A45] to-[#FF6A33] px-4 pb-3 pt-3 text-white">
          <div className="font-source-serif text-[15px] leading-none">Skor Mingguan</div>
          <div className="mt-1 flex items-center gap-1.5">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M4 12 12 4M6 4h6v6" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="text-[26px] font-bold leading-none tracking-[-0.02em]">4 Point</span>
          </div>
          <div className="mt-1 text-center text-[8px] opacity-90">dibanding minggu lalu</div>
        </div>
        <div className="flex justify-around px-4 py-3 text-[9px] text-[#78716C]">
          <span>+5</span>
          <span>-10</span>
        </div>
      </div>

      {/* Task list card */}
      <div className="absolute left-[0px] top-[0px] w-[340px] overflow-hidden rounded-[14px] bg-white shadow-[0_6px_24px_rgba(0,0,0,0.08)]">
        {TASKS.map((t, i) => (
          <div key={i} className="border-b border-[#F1ECE8] px-4 py-3 last:border-b-0">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="truncate text-[15px] font-medium leading-tight text-[#1F1B16]">
                  Selesaikan Proposal...
                </div>
                <div className="mt-0.5 text-[11px] text-[#78716C]">Terlambat 3 jam</div>
              </div>
              <div className="shrink-0 rounded-[8px] bg-[#FF6A33] px-3 py-1.5 text-[11px] font-medium text-white">
                Mulai sekarang!
              </div>
            </div>
            <div className="mt-2 flex items-center justify-between gap-3">
              <div className="flex flex-1 items-center gap-2">
                <div className="h-[4px] flex-1 overflow-hidden rounded-full bg-[#FFE4DE]">
                  <div className="h-full rounded-full bg-[#FF6A33]" style={{ width: `${(t.done / 5) * 100}%` }} />
                </div>
                <span className="text-[9px] text-[#78716C]">{t.done} dari 5</span>
              </div>
              <div className="flex -space-x-1.5">
                {t.avatars.map((a, j) => (
                  <span
                    key={j}
                    className={`flex h-[18px] w-[18px] items-center justify-center rounded-full border border-white text-[7px] font-medium text-white ${
                      j === 0 ? 'bg-[#FF6A33]' : 'bg-[#8FA3BF]'
                    }`}
                  >
                    {a}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </Stage>
  );
}

/* ---------- Card 2: Calendar Integrated ---------- */

const DAYS = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];
const WEEKS = [
  [1, 2, 3, 4, 5, 6, 7],
  [8, 9, 10, 11, 12, 13, 14],
  [15, 16, 17, 18, 19, 20, 21],
];
const DOTS: Record<number, number> = { 2: 1, 7: 3, 12: 2, 10: 3 };

export function CalendarVisual() {
  return (
    <Stage label="Pratinjau kalender terintegrasi Nataku">
      {/* View switcher */}
      <div className="absolute left-0 top-0 flex w-[340px] items-center rounded-[10px] bg-white p-1 text-[12px] text-[#78716C]">
        <span className="flex-1 rounded-[7px] bg-[#FF6A33] py-1.5 text-center font-medium text-white">Bulan</span>
        <span className="flex-1 text-center">Minggu</span>
        <span className="flex-1 text-center">Gantt</span>
      </div>

      {/* Month grid */}
      <div className="absolute left-0 top-[60px] w-[340px] rounded-[12px] bg-white px-4 py-3">
        <div className="flex items-center justify-between border-b border-[#F1ECE8] pb-2">
          <span className="font-source-serif text-[16px] font-medium text-[#1F1B16]">Desember 2025</span>
          <span className="flex gap-3 text-[#78716C]">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M10 3 5 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="m6 3 5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </span>
        </div>
        <div className="mt-2 grid grid-cols-7 gap-1.5 text-center text-[10px] text-[#A8A29E]">
          {DAYS.map((d) => (
            <span key={d}>{d}</span>
          ))}
        </div>
        <div className="mt-1.5 grid grid-cols-7 gap-1.5">
          {WEEKS.flat().map((n) => {
            const active = n === 10;
            return (
              <div
                key={n}
                className={`flex h-[30px] flex-col items-center justify-center rounded-[6px] text-[12px] ${
                  active ? 'bg-[#FF6A33] font-medium text-white' : 'bg-[#F5F2EF] text-[#44403C]'
                }`}
              >
                <span className="leading-none">{n}</span>
                {DOTS[n] && (
                  <span className="mt-[2px] flex gap-[2px]">
                    {Array.from({ length: DOTS[n] }).map((_, k) => (
                      <i key={k} className={`h-[2px] w-[2px] rounded-full ${active ? 'bg-white' : 'bg-[#A8A29E]'}`} />
                    ))}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Week strip (behind, clipped) */}
      <div className="absolute left-[355px] top-[50px] w-[145px] overflow-hidden rounded-[12px] bg-white px-3 py-3">
        <div className="font-source-serif text-[14px] font-medium text-[#1F1B16]">Desember 20…</div>
        <div className="mt-2 flex gap-2 text-center text-[9px] text-[#A8A29E]">
          <div>
            <div>Sen</div>
            <div className="mt-1 flex h-[28px] w-[26px] items-center justify-center rounded-[6px] bg-[#F5F2EF] text-[11px] text-[#44403C]">26</div>
          </div>
          <div>
            <div className="font-medium text-[#FF6A33]">Sel</div>
            <div className="mt-1 flex h-[28px] w-[26px] items-center justify-center rounded-[6px] bg-[#FF6A33] text-[11px] font-medium text-white">26</div>
          </div>
          <div>
            <div>Rab</div>
            <div className="mt-1 flex h-[28px] w-[26px] items-center justify-center rounded-[6px] bg-[#F5F2EF] text-[11px] text-[#44403C]">26</div>
          </div>
        </div>
      </div>
      <div className="absolute left-[355px] top-[142px] flex w-[145px] items-center gap-2 overflow-hidden rounded-[10px] bg-[#FF6A33] px-3 py-3 text-[9px] text-white">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0"><path d="M8 2 1.5 13.5h13L8 2Zm0 4.5v3.5m0 1.7v.1" stroke="#fff" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
        <div className="min-w-0 flex-1">
          <div className="whitespace-nowrap">Luangkan Waktu</div>
          <div className="mt-1 h-[3px] rounded-full bg-white/40" />
        </div>
      </div>
    </Stage>
  );
}

/* ---------- Card 3: WhatsApp Daily & Quick Action ---------- */

export function WhatsAppVisual() {
  return (
    <Stage label="Pratinjau chat WhatsApp harian Nataku">
      {/* Reply thread (behind) */}
      <div className="absolute left-[240px] top-[60px] h-[300px] w-[260px] rounded-[10px] bg-[#EAE3DC]">
        <div className="ml-[24px] mt-[24px] w-[260px] rounded-[10px] rounded-tr-none bg-[#DCF8C6] px-3 py-2 text-[12px] leading-[1.35] text-[#1F1B16]">
          Tolong tambahkan tugas membuat proposal untuk acara fakultas
          <div className="mt-1 text-right text-[9px] text-[#78716C]">10:41 AM</div>
        </div>
        <div className="ml-[8px] mt-[14px] w-[200px] rounded-[10px] rounded-tl-none bg-white px-3 py-2 text-[12px] leading-[1.35] text-[#1F1B16]">
          Tugas sudah masuk di dalam daftar
          <div className="mt-1 text-right text-[9px] text-[#78716C]">10:42 AM</div>
        </div>
      </div>

      {/* Main chat window */}
      <div className="absolute left-0 top-0 w-[300px] overflow-hidden rounded-[10px] bg-[#EAE3DC] shadow-[0_8px_28px_rgba(0,0,0,0.18)]">
        <div className="flex items-center gap-2 bg-[#075E54] px-3 py-2.5 text-white">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M13 8H3m4.5-4.5L3 8l4.5 4.5" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
          <span className="flex h-7 w-7 items-center justify-center rounded-[8px] bg-[#FFF4F2]">
            <span className="h-3.5 w-3.5 rounded-[3px] bg-[#075E54]" />
          </span>
          <span className="font-source-serif text-[20px] font-medium leading-none">Nataku</span>
        </div>
        <div className="p-3">
          <div className="rounded-[10px] bg-white px-3 py-2.5 text-[11px] leading-[1.4] text-[#1F1B16]">
            <div className="font-bold">Kegiatan Hari Ini</div>
            <div className="mt-2">✅ Tugas:</div>
            <ul className="space-y-0.5">
              <li>• Selesaikan proposal untuk Q4</li>
              <li>• Tinjau desain mockup halaman landing</li>
              <li>• Tindak lanjuti catatan pertemuan klien</li>
              <li>• Perbarui kemajuan di spreadsheet</li>
            </ul>
            <div className="mt-1">🗓️ Agenda:</div>
            <ul>
              <li>09:00 - Daily Standup (Zoom)</li>
              <li>10:30 - Tinjau desain dengan tim UI</li>
              <li>13:00 - Istirahat makan siang 🍱</li>
              <li>14:00 - Panggilan klien: Proyek Alpha</li>
            </ul>
            <div className="mt-1 text-right text-[9px] text-[#78716C]">10:39 AM</div>
          </div>
        </div>
      </div>
    </Stage>
  );
}
