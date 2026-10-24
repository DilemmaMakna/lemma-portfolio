"use client";

import { Fragment, useRef, useState } from "react";
import SectionLabel from "@/components/ui/SectionLabel";
import { gsap, useGSAP } from "@/lib/gsap";
import { SplitText } from "gsap/SplitText";
import { useServicesCopy } from "./useServicesCopy";

type Measured = { mid: number; right: number; w: number; h: number } | null;
type Anno = { body: string; pw: number; items: Measured[] };

const SERIF = 'var(--font-serif), "Instrument Serif", Georgia, serif';
const MONO = "var(--font-mono), ui-monospace, monospace";

const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const pill =
  "mono mono-2xs !normal-case whitespace-nowrap rounded-[5px] border border-line-strong bg-surface-2 px-2.5 py-1 font-normal not-italic tracking-normal text-fg-muted";

export default function ServicesIntro() {
  const i = useServicesCopy().intro;
  const root = useRef<HTMLElement>(null);
  const wrap = useRef<HTMLDivElement>(null);
  const text = useRef<HTMLParagraphElement>(null);
  const [anno, setAnno] = useState<Anno | null>(null);

  // Pecah body menjadi segmen biasa, frasa mono, dan frasa aksen (serif italic).
  const monoList = i.mono || [];
  const allSpecial = [...monoList, ...i.accent];
  const parts = i.body.split(new RegExp(`(${allSpecial.map(escapeRe).join("|")})`));
  const currentAnno = anno?.body === i.body ? anno : null;

  useGSAP(
    () => {
      const el = text.current;
      const box = wrap.current;
      if (!el || !box) return;
      gsap.registerPlugin(SplitText);

      // Ukur posisi frasa (sebelum ada transform animasi) untuk menaruh anotasi di margin kanan.
      const measure = () => {
        const wb = box.getBoundingClientRect();
        const items = i.accent.map<Measured>((_, k) => {
          const p = el.querySelector<HTMLElement>(`[data-phrase="${k}"]`);
          if (!p) return null;
          const r = p.getBoundingClientRect();
          return {
            mid: r.top - wb.top + r.height / 2,
            right: r.right - wb.left,
            w: Math.round(r.width),
            h: Math.round(r.height),
          };
        });
        setAnno({ body: i.body, pw: el.offsetWidth, items });
      };

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // autoSplit memecah ulang saat font dimuat / ukuran berubah; animasi yang dikembalikan disusun ulang.
        const split = SplitText.create(el, {
          type: "lines",
          autoSplit: true,
          aria: "none",
          linesClass: "intro-line",
          ignore: "[data-anno]",
          onSplit: (self) => {
            measure();
            const annos = box.querySelectorAll("[data-anno]");
            // Redup lewat warna, bukan opacity: teks tetap 100% opak dan lolos 4.5:1 di kedua tema.
            for (const line of self.lines as HTMLElement[]) {
              line.style.color =
                "color-mix(in srgb, var(--fg-dim) calc((1 - var(--intro-c, 1)) * 100%), var(--fg-muted))";
            }
            return gsap
              .timeline({
                scrollTrigger: {
                  trigger: root.current,
                  start: "top 70%",
                  end: "top 8%",
                  scrub: 0.6,
                },
              })
              .fromTo(
                self.lines,
                { "--intro-c": 0, filter: "blur(12px)", y: 20 },
                { "--intro-c": 1, filter: "blur(0px)", y: 0, ease: "none", stagger: 1, duration: 1 },
              )
              .fromTo(
                annos,
                { opacity: 0, filter: "blur(6px)" },
                { opacity: 1, filter: "blur(0px)", ease: "none", stagger: 0.2, duration: 0.8 },
              )
              .set([...self.lines, ...Array.from(annos)], { clearProps: "filter" });
          },
        });

        return () => {
          split.revert();
        };
      });

      mm.add("(prefers-reduced-motion: reduce)", () => {
        document.fonts.ready.then(measure);
        window.addEventListener("resize", measure);
        return () => window.removeEventListener("resize", measure);
      });
    },
    { scope: root, dependencies: [i.body], revertOnUpdate: true },
  );

  return (
    <section
      ref={root}
      className="section flex min-h-[100svh] items-center overflow-x-clip bg-bg"
      // Kartu hero memudar sampai ~320px di bawah tepi hero; beri ruang supaya teks tidak tertimpa.
      // Inline karena `.section` (tanpa layer) mengalahkan utilitas padding Tailwind.
      style={{ paddingTop: "calc(clamp(4rem, 10vw, 8rem) + 15rem)" }}
      aria-labelledby="services-intro"
    >
      <div className="wrap w-full">
        <SectionLabel rule>{i.label}</SectionLabel>

        <div ref={wrap} key={i.body} className="relative mt-6">
          <p
            ref={text}
            key={i.body}
            id="services-intro"
            className="h-section max-w-[24ch] leading-[1.14] text-fg-muted md:max-w-[28ch]"
          >
            {parts.map((part, idx) => {
              // 1. Cek apakah frasa ini adalah Mono Token (misal: "UX, HCI, data,")
              if (monoList.includes(part)) {
                return (
                  <span
                    key={idx}
                    className="relative inline-block whitespace-nowrap"
                    style={{
                      fontFamily: MONO,
                      letterSpacing: "-0.025em",
                      color: "color-mix(in srgb, var(--fg-dim) calc((1 - var(--intro-c, 1)) * 100%), var(--fg))",
                    }}
                  >
                    {/* Top inspector pin: font-geist-mono */}
                    <span
                      data-anno
                      aria-hidden="true"
                      className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 hidden flex-col items-center xl:flex"
                    >
                      <span className="mono mono-2xs !normal-case whitespace-nowrap rounded-[4px] border border-line-strong bg-surface-2 px-1.5 py-0.5 text-fg-dim shadow-sm">
                        font-geist-mono
                      </span>
                      <span className="h-1.5 w-px border-l border-dashed border-line-strong" />
                    </span>

                    {/* Technical bounding box frame around the text (mirip 'Engineering' di referensi) */}
                    <i
                      data-anno
                      aria-hidden="true"
                      className="pointer-events-none absolute -inset-y-1 -left-2 -right-1 hidden rounded-[4px] border border-line-strong bg-surface-2/70 xl:block"
                    >
                      <span
                        className="absolute left-1.5 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-accent"
                        style={{ boxShadow: "0 0 6px var(--accent)" }}
                      />
                    </i>

                    {/* Teks mono yang murni duduk di baseline yang sama dengan kata selanjutnya */}
                    <span className="relative z-10 xl:pl-3">{part}</span>
                  </span>
                );
              }

              // 2. Cek apakah frasa ini adalah Serif Italic Accent (misal: "satu alur", "bermakna")
              const k = i.accent.indexOf(part);
              if (k !== -1) {
                return (
                  <span
                    key={idx}
                    data-phrase={k}
                    className="relative inline-block whitespace-nowrap"
                    style={{
                      fontFamily: SERIF,
                      fontStyle: "italic",
                      fontWeight: 400,
                      fontSize: "1.14em",
                      lineHeight: 1,
                      letterSpacing: "-0.015em",
                      color: "color-mix(in srgb, var(--fg-dim) calc((1 - var(--intro-c, 1)) * 100%), var(--fg))",
                    }}
                  >
                    {part}
                    {k === 0 && (
                      <>
                        {/* Garis panduan x-height / baseline */}
                        <i
                          data-anno
                          aria-hidden="true"
                          className="pointer-events-none absolute -left-2 -right-2 top-[0.2em] hidden h-px bg-accent xl:block"
                        />
                        <i
                          data-anno
                          aria-hidden="true"
                          className="pointer-events-none absolute -left-2 -right-2 bottom-[0.14em] hidden h-px bg-accent xl:block"
                        />
                      </>
                    )}
                    {k === 1 && (
                      <i
                        data-anno
                        aria-hidden="true"
                        className="pointer-events-none absolute -inset-x-2 -inset-y-0.5 hidden border border-accent bg-accent/[0.07] xl:block"
                      >
                        {[
                          "-left-[3px] -top-[3px]",
                          "-right-[3px] -top-[3px]",
                          "-left-[3px] -bottom-[3px]",
                          "-right-[3px] -bottom-[3px]",
                        ].map((pos) => (
                          <b key={pos} className={`absolute h-[6px] w-[6px] bg-fg ${pos}`} />
                        ))}
                      </i>
                    )}
                  </span>
                );
              }

              // 3. Teks biasa (General Sans)
              return <Fragment key={idx}>{part}</Fragment>;
            })}
          </p>

          {/* Anotasi ala inspector di margin kanan */}
          {i.accent.map((_, k) => {
            const m = currentAnno?.items[k];
            const left = m ? m.right + 10 : 0;
            const line = currentAnno && m ? Math.max(28, currentAnno.pw + 56 - left) : 28;
            return (
              <div
                key={k}
                data-anno
                aria-hidden="true"
                className="pointer-events-none absolute hidden items-center xl:flex"
                style={{
                  top: m?.mid ?? 0,
                  left,
                  transform: "translateY(-50%)",
                  visibility: m ? "visible" : "hidden",
                  fontFamily: MONO,
                }}
              >
                <span className="h-[7px] w-[7px] shrink-0 rounded-full border border-fg-dim bg-bg" />
                <span
                  className="block h-0 shrink-0 border-t border-dashed border-line-strong"
                  style={{ width: line }}
                />
                {k === 0 ? (
                  <span className={pill}>x-height</span>
                ) : (
                  <span className="flex items-center gap-2">
                    <span className={pill}>font-instrument-serif</span>
                    <span className={`${pill} text-accent`}>{m ? `${m.w} × ${m.h}` : ""}</span>
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
