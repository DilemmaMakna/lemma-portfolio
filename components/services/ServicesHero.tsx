"use client";

import { useEffect, useMemo, useState } from "react";
import Button from "@/components/ui/Button";
import { useContactModal } from "@/components/ui/ContactModal";
import DotGrid from "@/components/ui/DotGrid";
import { reducedMotion } from "@/lib/motion/gsap";
import { scrollToId } from "@/lib/lenis";
import CollaborativeCursors from "./CollaborativeCursors";
import { useServicesCopy } from "./useServicesCopy";

type Tok = { t: string; c?: string };
type Line = { toks: Tok[]; target?: string };

const KW = "text-accent";
const STR = "text-fg";
const CMT = "text-fg-dim italic";
const DIM = "text-fg-muted";

const CHARS_PER_FRAME = 2;

function Headline({ rows }: { rows: { text: string; accent: boolean }[][] }) {
  return (
    <h1
      id="services-hero-title"
      className="h-hero text-center"
      style={{ fontSize: "clamp(2.75rem, 6.6vw, 6rem)" }}
    >
      {rows.map((row, i) => (
        <span key={i} className="block">
          {row.map((seg, s) =>
            seg.text.split(" ").map((word, j) => (
              <span
                key={`${s}-${j}`}
                data-intro="word"
                className={`inline-block pr-[0.22em] ${seg.accent ? "text-accent" : ""}`}
              >
                {word}
              </span>
            )),
          )}
        </span>
      ))}
    </h1>
  );
}

export default function ServicesHero() {
  const copy = useServicesCopy();
  const { open: openContact } = useContactModal();
  const h = copy.hero;

  // line2 + line3 berbagi satu baris supaya headline tetap dua baris di tengah.
  const headlineRows = [
    [{ text: h.line1, accent: h.accent === 0 }],
    [
      { text: h.line2, accent: h.accent === 1 },
      { text: h.line3, accent: h.accent === 2 },
    ],
  ];

  const totalDeliverables = copy.services.reduce((n, s) => n + s.deliverables.length, 0);
  const maxDeliverables = Math.max(...copy.services.map((s) => s.deliverables.length));

  const lines = useMemo<Line[]>(() => {
    const rows: Line[] = [
      { toks: [{ t: `// ${h.eyebrow}`, c: CMT }] },
      {
        toks: [
          { t: "import", c: KW },
          { t: " { makna } ", c: DIM },
          { t: "from", c: KW },
          { t: ' "@lemma/studio"', c: STR },
          { t: ";", c: DIM },
        ],
      },
      { toks: [] },
      {
        toks: [
          { t: "export const", c: KW },
          { t: " services ", c: DIM },
          { t: "= {", c: DIM },
        ],
      },
      ...copy.services.map<Line>((s) => ({
        target: `service-${s.index}`,
        toks: [
          { t: `  "${s.index}"`, c: DIM },
          { t: ": ", c: DIM },
          { t: `"${s.name}"`, c: STR },
          { t: ",", c: DIM },
          { t: `  // ${s.deliverables.length}`, c: CMT },
        ],
      })),
      { toks: [{ t: "} as const;", c: DIM }] },
      { toks: [] },
      {
        toks: [
          { t: "export default", c: KW },
          { t: " makna", c: "text-accent" },
          { t: "(services);", c: DIM },
        ],
      },
    ];
    return rows;
  }, [copy, h.eyebrow]);

  const total = useMemo(
    // +1 per baris untuk newline, supaya baris kosong juga "diketik".
    () => lines.reduce((n, l) => n + l.toks.reduce((m, k) => m + k.t.length, 0) + 1, 0),
    [lines],
  );

  const [shown, setShown] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let raf = 0;
    let wait = 0;
    let cancelled = false;

    const finish = () => {
      setDone(true);
    };
    const tick = () => {
      if (cancelled) return;
      if (reducedMotion()) return finish();
      setShown((s) => s + CHARS_PER_FRAME);
      raf = requestAnimationFrame(tick);
    };
    // Tunggu intro (preloader) selesai sebelum mulai mengetik.
    const begin = () => {
      if (document.documentElement.classList.contains("is-loading")) {
        wait = window.setTimeout(begin, 120);
      } else {
        wait = window.setTimeout(() => {
          raf = requestAnimationFrame(tick);
        }, 500);
      }
    };
    begin();

    return () => {
      cancelled = true;
      clearTimeout(wait);
      cancelAnimationFrame(raf);
    };
  }, []);

  useEffect(() => {
    if (!done && shown >= total) {
      const id = requestAnimationFrame(() => setDone(true));
      return () => cancelAnimationFrame(id);
    }
  }, [shown, total, done]);

  const budget = done ? Infinity : shown;

  // Potong token sesuai jumlah karakter yang sudah "diketik".
  let left = budget;
  let typedLines = 0;
  let lastCol = 1;
  const rendered = lines.map((line) => {
    if (left <= 0) return null;
    const out: Tok[] = [];
    for (const k of line.toks) {
      if (left <= 0) break;
      const part = k.t.slice(0, left);
      left -= part.length;
      out.push({ t: part, c: k.c });
      lastCol = part.length + 1;
    }
    const complete = left > 0;
    left -= 1; // newline
    if (complete) {
      typedLines += 1;
      lastCol = 1;
    }
    return { out, line };
  });
  const cursorLine = Math.min(typedLines, lines.length - 1);
  const typing = !done;

  const sideCard =
    "absolute top-14 hidden w-[300px] overflow-hidden rounded-[6px] border border-line-strong bg-surface shadow-[0_30px_80px_-20px_var(--shadow)] md:block";

  return (
    <section
      id="top"
      className="relative z-10 flex h-[100svh] min-h-[640px] flex-col overflow-x-clip bg-bg"
      aria-labelledby="services-hero-title"
    >
      <div className="absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,#000_40%,transparent_100%)]">
        <DotGrid />
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-[55%] h-[420px] w-[820px] max-w-full -translate-x-1/2 rounded-full bg-accent/10 blur-[140px]"
      />

      <CollaborativeCursors />

      <div className="wrap pointer-events-none relative z-10 flex flex-1 flex-col items-center pt-28 md:pt-32">
        {/* Copy */}
        <div className="relative flex w-full flex-col items-center text-center">
          <div className="mono inline-flex items-center gap-2 text-fg-dim" data-intro="fade">
            <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-accent" />
            {h.eyebrow}
          </div>
          <div className="mt-7">
            <Headline rows={headlineRows} />
          </div>
          <p className="lead mx-auto mt-7 max-w-[46ch]" data-intro="fade" data-cursor-avoid>
            {h.lead}
          </p>

          <div
            className="pointer-events-auto mt-8 flex flex-wrap items-center justify-center gap-3"
            data-intro="fade"
          >
            <Button id="services-hero-cta" onClick={() => openContact("services")}>
              {copy.cta.button}
            </Button>
            <button
              type="button"
              id="services-hero-browse"
              className="btn btn-ghost !normal-case"
              style={{
                background: "var(--hairline-soft)",
                borderColor: "var(--hairline)",
                backdropFilter: "blur(14px) saturate(1.2)",
                WebkitBackdropFilter: "blur(14px) saturate(1.2)",
              }}
              onClick={() => scrollToId("services")}
            >
              <span aria-hidden="true" className="text-accent">
                $
              </span>
              lemma ls --services
            </button>
          </div>
        </div>

        {/* Cards */}
        <div
          className="pointer-events-auto relative mt-12 w-full max-w-[1040px] flex-1 md:mt-14"
          data-intro="fade"
        >
          {/* Kiri: terminal build */}
          <div
            aria-hidden="true"
            className={`${sideCard} left-0 origin-bottom-right -rotate-[4deg]`}
          >
            <div className="flex items-center gap-2 border-b border-line bg-surface-2 px-4 py-2.5">
              <span className="mono mono-2xs text-fg-muted !normal-case">terminal</span>
            </div>
            <div
              className={`space-y-1.5 px-4 py-4 font-mono text-xs transition-opacity duration-700 ${done ? "opacity-100" : "opacity-30"}`}
              style={{ fontFamily: "var(--font-mono), ui-monospace, monospace" }}
            >
              <p className="text-fg-dim">$ lemma build</p>
              {copy.services.map((s) => (
                <p key={s.index} className="flex gap-2 text-fg-muted">
                  <span className="text-[var(--ok)]">✓</span>
                  <span className="truncate">{s.name}</span>
                </p>
              ))}
              <p className="pt-1 text-[var(--ok)]">→ {copy.services.length} services, makna</p>
            </div>
          </div>

          {/* Tengah: editor */}
          <div className="relative z-10 mx-auto w-full max-w-[540px]">
            <div
              role="img"
              aria-label={`lemma.config.ts: ${copy.services.map((s) => s.name).join(", ")}`}
              className="overflow-hidden rounded-[6px] border border-line-strong bg-surface shadow-[0_30px_80px_-20px_var(--shadow)]"
            >
              {/* Title bar */}
              <div className="flex items-center gap-3 border-b border-line bg-surface-2 px-4 py-2.5">
                <span aria-hidden="true" className="flex gap-1.5">
                  <i className="h-2.5 w-2.5 rounded-full bg-line-strong" />
                  <i className="h-2.5 w-2.5 rounded-full bg-line-strong" />
                  <i className="h-2.5 w-2.5 rounded-full bg-accent" />
                </span>
                <span className="mono mono-2xs text-fg-muted !normal-case">lemma.config.ts</span>
              </div>

              {/* Code */}
              <div
                aria-hidden="true"
                className="min-h-[19rem] overflow-x-auto px-0 py-4 font-mono text-xs leading-[1.75] sm:text-sm"
                style={{ fontFamily: "var(--font-mono), ui-monospace, monospace" }}
              >
                {lines.map((line, i) => {
                  const r = rendered[i];
                  const isCursor = typing && i === cursorLine;
                  const content = r?.out.map((k, j) => (
                    <span key={j} className={k.c}>
                      {k.t}
                    </span>
                  ));
                  const row = (
                    <>
                      <span className="inline-block w-10 shrink-0 select-none pr-4 text-right text-fg-dim/60">
                        {i + 1}
                      </span>
                      <span className="whitespace-pre">
                        {content}
                        {(isCursor || (!typing && i === lines.length - 1)) && (
                          <span className="ml-px inline-block h-[1.1em] w-[7px] translate-y-[0.2em] animate-pulse bg-accent" />
                        )}
                      </span>
                    </>
                  );
                  if (line.target && r) {
                    return (
                      <a
                        key={i}
                        href={`#${line.target}`}
                        onClick={(e) => {
                          e.preventDefault();
                          scrollToId(line.target!);
                        }}
                        className="flex min-h-[1.75em] bg-transparent transition-colors hover:bg-accent-soft"
                      >
                        {row}
                      </a>
                    );
                  }
                  return (
                    <div key={i} className="flex min-h-[1.75em]">
                      {row}
                    </div>
                  );
                })}
              </div>

              {/* Status bar */}
              <div
                aria-hidden="true"
                className="mono flex items-center justify-between border-t border-line bg-surface-2 px-4 py-1.5 !normal-case mono-2xs text-fg-dim"
              >
                <span>TypeScript</span>
                <span>
                  Ln {Math.min(cursorLine + 1, lines.length)}, Col {done ? 1 : lastCol}
                </span>
              </div>
            </div>
          </div>

          {/* Kanan: grid deliverables */}
          <div
            aria-hidden="true"
            className={`${sideCard} right-0 origin-bottom-left rotate-[4deg]`}
          >
            <div className="flex items-center justify-between border-b border-line bg-surface-2 px-4 py-2.5">
              <span className="mono mono-2xs text-fg-muted !normal-case">deliverables.ts</span>
              <span className="mono mono-2xs text-accent !normal-case">
                {copy.services.length} × {maxDeliverables}
              </span>
            </div>
            <div className="px-4 py-4">
              <p className="mono mono-2xs text-fg-dim">{copy.labels.deliverables}</p>
              <p className="mt-1 h-section">
                {totalDeliverables}
              </p>
              <div className="mt-4 space-y-2">
                {copy.services.map((s) => (
                  <div key={s.index} className="flex items-center gap-3">
                    <span className="mono mono-2xs w-5 text-fg-dim">{s.index}</span>
                    <span className="flex gap-1">
                      {Array.from({ length: maxDeliverables }).map((_, n) => (
                        <i
                          key={n}
                          className={`h-3.5 w-3.5 rounded-[2px] ${
                            n < s.deliverables.length ? "bg-accent" : "bg-line-strong/60"
                          }`}
                        />
                      ))}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pemudaran bawah: tinggi hero tetap 100svh, tetapi kartu dibiarkan terus ke bawah garis
          lipat (overflow-y terlihat) lalu larut ke warna latar. Gradien mulai 200px sebelum
          tepi bawah hero dan berakhir 320px sesudahnya, jadi kartu masih terlihat di layar
          pertama dan memudar pelan ke bagian berikutnya. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 z-20"
        style={{
          top: "calc(100% - 200px)",
          height: "520px",
          background:
            "linear-gradient(to bottom, transparent 0%, color-mix(in srgb, var(--bg) 8%, transparent) 25%, color-mix(in srgb, var(--bg) 28%, transparent) 45%, color-mix(in srgb, var(--bg) 58%, transparent) 65%, color-mix(in srgb, var(--bg) 88%, transparent) 83%, var(--bg) 100%)",
        }}
      />
    </section>
  );
}
