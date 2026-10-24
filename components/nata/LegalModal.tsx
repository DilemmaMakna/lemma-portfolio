'use client';

import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { LEGAL_DOCS, type LegalDocId } from '@/lib/nata/legal-content';

const TITLES: Record<LegalDocId, string> = {
  privacy: 'Kebijakan Privasi',
  terms: 'Syarat dan Ketentuan',
  security: 'Keamanan Data',
};

const LINK_TARGETS: Record<string, LegalDocId> = {
  'Kebijakan Privasi Nataku': 'privacy',
  'Kebijakan Keamanan Data Nataku': 'security',
};

/* ---------- Minimal markdown renderer (headings, lists, tables, bold, links) ---------- */

function renderInline(text: string, onNavigate: (id: LegalDocId) => void): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  const re = /\*\*(.+?)\*\*|\[([^\]]+)\]\(([^)]*)\)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = re.exec(text))) {
    if (m.index > last) nodes.push(text.slice(last, m.index));
    if (m[1] !== undefined) {
      nodes.push(<strong key={i++} className="font-bold text-[#1F1B16]">{m[1]}</strong>);
    } else {
      const target = LINK_TARGETS[m[2]];
      nodes.push(
        <button
          key={i++}
          type="button"
          onClick={() => target && onNavigate(target)}
          className="font-medium text-[#FF5000] underline underline-offset-2 hover:text-[#D93510]"
        >
          {m[2]}
        </button>,
      );
    }
    last = m.index + m[0].length;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}

function splitRow(line: string) {
  return line.replace(/^\||\|$/g, '').split('|').map((c) => c.trim());
}

function Markdown({ source, onNavigate }: { source: string; onNavigate: (id: LegalDocId) => void }) {
  const lines = source.split('\n');
  const blocks: React.ReactNode[] = [];
  let i = 0;
  let key = 0;
  const inline = (t: string) => renderInline(t, onNavigate);

  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) { i++; continue; }

    if (line.startsWith('# ')) { i++; continue; } // title is shown in the modal header

    if (line.startsWith('### ')) {
      blocks.push(<h4 key={key++} className="mt-5 mb-1.5 text-[15px] font-bold text-[#1F1B16]">{inline(line.slice(4))}</h4>);
      i++;
    } else if (line.startsWith('## ')) {
      blocks.push(<h3 key={key++} className="mt-7 mb-2 text-[18px] font-bold tracking-[-0.02em] text-[#1F1B16]">{inline(line.slice(3))}</h3>);
      i++;
    } else if (line.startsWith('|')) {
      const rows: string[][] = [];
      while (i < lines.length && lines[i].startsWith('|')) {
        if (!/^\|[\s|:-]+\|?$/.test(lines[i])) rows.push(splitRow(lines[i]));
        i++;
      }
      const [head, ...body] = rows;
      blocks.push(
        <div key={key++} className="my-3 overflow-x-auto rounded-[12px] border border-[#EDE6E0]">
          <table className="w-full min-w-[420px] text-left text-[13px]">
            <thead className="bg-[#FFF1EC] text-[#1F1B16]">
              <tr>{head.map((c, j) => <th key={j} className="px-3 py-2 font-bold">{inline(c)}</th>)}</tr>
            </thead>
            <tbody>
              {body.map((r, j) => (
                <tr key={j} className="border-t border-[#EDE6E0] align-top">
                  {r.map((c, k) => <td key={k} className="px-3 py-2">{inline(c)}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>,
      );
    } else if (/^- /.test(line) || /^\d+\. /.test(line)) {
      const ordered = /^\d+\. /.test(line);
      const items: string[] = [];
      while (i < lines.length && (ordered ? /^\d+\. /.test(lines[i]) : /^- /.test(lines[i]))) {
        items.push(lines[i].replace(/^(- |\d+\. )/, ''));
        i++;
      }
      const Tag = ordered ? 'ol' : 'ul';
      blocks.push(
        <Tag key={key++} className={`my-2 space-y-1.5 pl-5 ${ordered ? 'list-decimal' : 'list-disc'} marker:text-[#FF5000]`}>
          {items.map((t, j) => <li key={j} className="pl-1">{inline(t)}</li>)}
        </Tag>,
      );
    } else {
      // Paragraph; consecutive plain lines (e.g. the metadata block) keep their line breaks.
      const para: string[] = [];
      while (i < lines.length && lines[i].trim() && !/^(#|\||- |\d+\. )/.test(lines[i])) {
        para.push(lines[i]);
        i++;
      }
      blocks.push(
        <p key={key++} className="my-2">
          {para.map((t, j) => (
            <React.Fragment key={j}>
              {j > 0 && <br />}
              {inline(t)}
            </React.Fragment>
          ))}
        </p>,
      );
    }
  }
  return <>{blocks}</>;
}

/* ---------- Modal ---------- */

export default function LegalModal({
  docId,
  onChange,
  onClose,
}: {
  docId: LegalDocId | null;
  onChange: (id: LegalDocId) => void;
  onClose: () => void;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!docId) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [docId, onClose]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 });
  }, [docId]);

  if (!docId || typeof document === 'undefined') return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#1F1B16]/40 p-4 backdrop-blur-sm"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={TITLES[docId]}
        className="flex max-h-[80vh] w-full max-w-[600px] flex-col overflow-hidden rounded-[24px] bg-white font-satoshi shadow-[0_24px_80px_rgba(31,27,22,0.25)]"
      >
        <div className="flex shrink-0 items-start justify-between gap-4 px-6 pt-5 sm:px-7">
          <div>
            <span className="mb-1.5 inline-flex rounded-[6px] bg-[#FFE4DE] px-2.5 py-1 text-[12px] font-medium leading-[16px] text-[#F86D52]">
              Dokumen Legal
            </span>
            <h2 className="text-[24px] font-bold leading-[1.15] tracking-[-0.03em] text-[#1F1B16] sm:text-[28px]">
              {TITLES[docId]}
            </h2>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Tutup"
            className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#F5F2EF] text-[#44403C] transition-colors hover:bg-[#FF5000] hover:text-white"
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="m3 3 10 10M13 3 3 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="flex shrink-0 gap-1.5 overflow-x-auto px-6 pb-3 pt-4 sm:px-7 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {(Object.keys(TITLES) as LegalDocId[]).map((id) => (
            <button
              key={id}
              type="button"
              onClick={() => onChange(id)}
              className={`shrink-0 whitespace-nowrap rounded-full px-3.5 py-1.5 text-[13px] leading-[18px] font-medium transition-colors ${
                id === docId ? 'bg-[#FF5000] text-white' : 'bg-[#F5F2EF] text-[#57534E] hover:bg-[#FFE4DE]'
              }`}
            >
              {TITLES[id]}
            </button>
          ))}
        </div>

        <div
          ref={scrollRef}
          className="min-h-0 flex-1 overflow-y-auto border-t border-[#EDE6E0] px-6 pb-7 pt-2 text-[14px] leading-[1.6] text-[#57534E] sm:px-7"
        >
          <Markdown source={LEGAL_DOCS[docId]} onNavigate={onChange} />
        </div>
      </div>
    </div>,
    document.body,
  );
}
