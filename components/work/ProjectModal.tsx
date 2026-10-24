"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useLocale } from "@/components/LocaleProvider";
import { useContactModal } from "@/components/ui/ContactModal";
import Button from "@/components/ui/Button";
import { gsap, reducedMotion } from "@/lib/gsap";
import { getLenis } from "@/lib/lenis";
import type { Project } from "@/lib/content/work";
import type { WorkPhoto } from "@/lib/content/work-photos";
import AsciiCover from "./AsciiCover";
import { useWorkCopy } from "./useWorkCopy";

// Detail proyek sebagai lembar pembuktian: Diketahui -> Pendekatan -> Bukti -> Maka -> ∎.
// Lembar naik dari bawah; kolom kiri menempel (meta + kerangka bukti), kolom kanan berisi cerita dan foto.
const SECTIONS = ["given", "approach", "proof", "result"] as const;
type Section = (typeof SECTIONS)[number];

function Photos({ photos, cols = 2, eager = false }: { photos: WorkPhoto[]; cols?: 1 | 2; eager?: boolean }) {
  if (!photos.length) return null;
  return (
    <div className={`my-10 grid gap-3 ${cols === 2 ? "sm:grid-cols-2" : ""}`}>
      {photos.map((ph) => (
        <div key={ph.src} className="overflow-hidden rounded-[4px]" style={{ backgroundColor: ph.color }}>
          <Image
            src={ph.src}
            width={ph.w}
            height={ph.h}
            alt=""
            unoptimized
            loading={eager ? "eager" : "lazy"}
            className="h-auto w-full"
          />
        </div>
      ))}
    </div>
  );
}

function Heading({ n, id, children }: { n: number; id: string; children: React.ReactNode }) {
  return (
    <div id={id} data-section className="mb-6 flex scroll-mt-24 items-baseline gap-4 border-b border-line pb-4">
      <span className="mono text-accent">§{n}</span>
      <h3
        className="text-[clamp(1.5rem,3vw,2rem)] italic leading-none tracking-[-0.01em]"
        style={{ fontFamily: "var(--font-serif)" }}
      >
        {children}
      </h3>
    </div>
  );
}

export default function ProjectModal({
  list,
  slug,
  onNavigate,
  onClose,
}: {
  list: Project[];
  slug: string;
  onNavigate: (slug: string) => void;
  onClose: () => void;
}) {
  const { w, locale } = useWorkCopy();
  const { setLocale } = useLocale();
  const { open: openContact } = useContactModal();
  const d = w.detail;
  const index = list.findIndex((p) => p.slug === slug);
  const p = list[index];
  const prev = list[(index - 1 + list.length) % list.length];
  const next = list[(index + 1) % list.length];

  const panel = useRef<HTMLDivElement>(null);
  const scroller = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const pct = useRef<HTMLSpanElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const [active, setActive] = useState<Section>("given");

  // Kunci scroll halaman, fokus ke tombol tutup, kembalikan fokus saat ditutup.
  useEffect(() => {
    const lastFocus = document.activeElement as HTMLElement | null;
    const lenis = getLenis();
    const prevOverflow = document.body.style.overflow;
    lenis?.stop();
    if (!lenis) document.body.style.overflow = "hidden";
    closeBtn.current?.focus({ preventScroll: true });
    // fromTo (bukan from): di StrictMode efek jalan dua kali, dan from() kedua akan membaca opacity 0
    // sebagai nilai akhir sehingga panel tetap transparan.
    const intro =
      panel.current && !reducedMotion()
        ? gsap.fromTo(
            panel.current,
            { yPercent: 6, opacity: 0 },
            { yPercent: 0, opacity: 1, duration: 0.6, ease: "expo.out" },
          )
        : null;
    return () => {
      intro?.kill();
      lenis?.start();
      if (!lenis) document.body.style.overflow = prevOverflow;
      lastFocus?.focus({ preventScroll: true });
    };
  }, []);

  // Esc menutup, panah kiri/kanan berpindah proyek.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (document.querySelector('[aria-labelledby="contact-modal-title"]')) return;
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onNavigate(prev.slug);
      if (e.key === "ArrowRight") onNavigate(next.slug);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, onNavigate, prev.slug, next.slug]);

  // Ganti proyek: kembali ke atas, progres dihitung ulang, bagian aktif dipantau.
  useEffect(() => {
    const sc = scroller.current;
    if (!sc) return;
    sc.scrollTop = 0;
    setActive("given");
    if (!reducedMotion())
      gsap.fromTo(
        sc.querySelectorAll("[data-stagger]"),
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.05, ease: "expo.out" },
      );

    const onScroll = () => {
      const max = sc.scrollHeight - sc.clientHeight;
      const r = max > 0 ? Math.min(1, sc.scrollTop / max) : 0;
      if (bar.current) bar.current.style.transform = `scaleX(${r})`;
      if (pct.current) pct.current.textContent = `${Math.round(r * 100)}%`;
    };
    onScroll();
    sc.addEventListener("scroll", onScroll, { passive: true });

    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id.replace("sec-", "") as Section)),
      { root: sc, rootMargin: "-20% 0px -65% 0px" },
    );
    sc.querySelectorAll("[data-section]").forEach((el) => io.observe(el));
    return () => {
      sc.removeEventListener("scroll", onScroll);
      io.disconnect();
    };
  }, [slug]);

  if (!p) return null;
  const s = p.story;
  const [lead, mid, rest] = [p.photos.slice(0, 2), p.photos.slice(2, 6), p.photos.slice(6)];
  const go = (id: Section) =>
    document.getElementById(`sec-${id}`)?.scrollIntoView({ behavior: reducedMotion() ? "auto" : "smooth" });

  const meta: [string, React.ReactNode][] = [
    [d.client, p.client[locale]],
    [d.role, p.role[locale]],
    [
      d.year,
      <span key="y" className="font-mono text-sm">
        {p.year}
      </span>,
    ],
    [d.category, [p.category, ...(p.secondary ?? [])].join(" + ")],
    [
      d.status,
      <span key="s" className={`badge ${p.status === "active" ? "is-active" : ""}`}>
        <i />
        {w.status[p.status]}
      </span>,
    ],
  ];

  return (
    <div
      className="fixed inset-0 z-overlay bg-bg/80 backdrop-blur-sm sm:px-4 sm:pt-6"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby="project-title"
        className="mx-auto flex h-full max-w-[1440px] flex-col overflow-hidden border border-line-strong bg-bg sm:h-[calc(100%-1.5rem)] sm:rounded-t-[6px] sm:border-b-0"
      >
        {/* Bar atas: alamat, navigasi proyek, bahasa, tutup. Garis progres baca di bawahnya. */}
        <div className="relative flex h-14 shrink-0 items-center justify-between gap-3 border-b border-line px-4 md:px-6">
          <span className="mono mono-2xs hidden min-w-0 truncate text-fg-dim !normal-case md:block">
            lemma://{locale === "id" ? "karya" : "work"}/<span className="text-fg-muted">{p.slug}</span>
          </span>
          <div className="mono flex items-center gap-1 md:absolute md:left-1/2 md:-translate-x-1/2">
            <button
              type="button"
              onClick={() => onNavigate(prev.slug)}
              aria-label={`${d.prev}: ${prev.name}`}
              className="grid h-9 w-9 place-items-center rounded-full text-fg-muted transition-colors hover:bg-surface hover:text-accent"
            >
              ←
            </button>
            <span className="tabular-nums text-fg-muted">
              <span className="text-fg">{String(index + 1).padStart(2, "0")}</span> {d.of}{" "}
              {String(list.length).padStart(2, "0")}
            </span>
            <button
              type="button"
              onClick={() => onNavigate(next.slug)}
              aria-label={`${d.next}: ${next.name}`}
              className="grid h-9 w-9 place-items-center rounded-full text-fg-muted transition-colors hover:bg-surface hover:text-accent"
            >
              →
            </button>
          </div>
          <div className="flex items-center gap-3">
            <div className="mono hidden items-center gap-1 sm:flex" role="group" aria-label="Language">
              {(["id", "en"] as const).map((l) => (
                <button
                  key={l}
                  type="button"
                  aria-pressed={locale === l}
                  onClick={() => setLocale(l)}
                  className={`px-1 transition-colors ${locale === l ? "text-fg" : "text-fg-dim hover:text-fg-muted"}`}
                >
                  [{l.toUpperCase()}]
                </button>
              ))}
            </div>
            <button ref={closeBtn} type="button" onClick={onClose} className="btn btn-ghost !h-9 !px-4">
              {d.close} <span aria-hidden="true">×</span>
            </button>
          </div>
          <div aria-hidden="true" className="absolute inset-x-0 -bottom-px h-px bg-line">
            <div ref={bar} className="h-full origin-left bg-accent" style={{ transform: "scaleX(0)" }} />
          </div>
        </div>

        <div ref={scroller} data-lenis-prevent className="flex-1 overflow-y-auto overscroll-contain">
          <div className="grid12 gap-y-10 px-5 pb-24 pt-10 md:px-10 md:pt-14 lg:px-14">
            {/* Kolom kiri (desktop menempel): nomor, meta, kerangka bukti. */}
            <aside className="col-span-full lg:col-span-3">
              <div className="flex flex-col gap-8 lg:sticky lg:top-6">
                <div data-stagger className="flex items-end justify-between gap-4 border-b border-line pb-6">
                  <span
                    className="text-[clamp(4rem,8vw,6.5rem)] italic leading-[0.8] text-fg-dim"
                    style={{ fontFamily: "var(--font-serif)" }}
                  >
                    {p.n}
                  </span>
                  <span className="mono mono-2xs pb-1 text-right text-fg-dim">{p.type}</span>
                </div>

                <dl data-stagger className="grid grid-cols-2 gap-x-4 gap-y-5 lg:grid-cols-1">
                  {meta.map(([k, v]) => (
                    <div key={k}>
                      <dt className="mono mono-2xs text-fg-dim">{k}</dt>
                      <dd className="mt-1.5 text-sm text-fg">{v}</dd>
                    </div>
                  ))}
                  <div className="col-span-2 lg:col-span-1">
                    <dt className="mono mono-2xs text-fg-dim">{d.tags}</dt>
                    <dd className="mt-2 flex flex-wrap gap-1.5">
                      {p.tags.map((t) => (
                        <span key={t} className="tag">
                          {t}
                        </span>
                      ))}
                    </dd>
                  </div>
                </dl>

                {s && (
                  <nav data-stagger aria-label={d.outline} className="hidden lg:block">
                    <div className="mono mono-2xs mb-3 flex justify-between text-fg-dim">
                      <span>{d.outline}</span>
                      <span>
                        {d.progress}{" "}
                        <span ref={pct} className="tabular-nums text-fg-muted">
                          0%
                        </span>
                      </span>
                    </div>
                    <ol className="border-l border-line">
                      {SECTIONS.map((id, i) => (
                        <li key={id}>
                          <button
                            type="button"
                            onClick={() => go(id)}
                            className={`-ml-px flex w-full items-baseline gap-3 border-l py-2 pl-4 text-left text-sm transition-colors ${
                              active === id
                                ? "border-accent text-fg"
                                : "border-transparent text-fg-dim hover:text-fg-muted"
                            }`}
                          >
                            <span className="mono mono-2xs">§{i + 1}</span>
                            {d.sections[id]}
                          </button>
                        </li>
                      ))}
                    </ol>
                  </nav>
                )}
              </div>
            </aside>

            {/* Kolom kanan: judul, cerita, foto. */}
            <article className="col-span-full lg:col-span-8 lg:col-start-5">
              <h2
                id="project-title"
                data-stagger
                className="text-[clamp(2.25rem,5vw,4.25rem)] font-medium leading-[1] tracking-[-0.04em]"
              >
                {p.name}
              </h2>
              <p
                data-stagger
                className="mt-5 text-[clamp(1.375rem,2.4vw,1.875rem)] italic leading-snug text-accent"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                {p.hook[locale]}
              </p>
              <p data-stagger className="lead mt-6 max-w-[58ch]">
                {p.summary[locale]}
              </p>

              <div data-stagger>
                {p.photos.length ? (
                  <Photos photos={lead} eager />
                ) : (
                  <div className="relative my-10 aspect-[16/9] overflow-hidden rounded-[4px] border border-line bg-surface">
                    <AsciiCover seed={Number(p.n)} className="absolute inset-0" />
                    <span className="mono mono-2xs absolute bottom-4 left-4 text-fg-dim">{w.tile.noPhoto}</span>
                  </div>
                )}
              </div>

              {s && (
                <>
                  <section className="mt-16">
                    <Heading n={1} id="sec-given">
                      {d.sections.given}
                    </Heading>
                    <p className="lead max-w-[58ch] !text-fg">{s.given[locale]}</p>
                  </section>

                  <section className="mt-16">
                    <Heading n={2} id="sec-approach">
                      {d.sections.approach}
                    </Heading>
                    <div className="flex max-w-[62ch] flex-col gap-4 text-fg-muted">
                      {s.approach.map((a, i) => (
                        <p key={i}>{a[locale]}</p>
                      ))}
                    </div>
                    <Photos photos={mid} />
                  </section>

                  <section className="mt-16">
                    <Heading n={3} id="sec-proof">
                      {d.sections.proof}
                    </Heading>
                    <ol className="grid gap-px overflow-hidden rounded-[4px] border border-line bg-line sm:grid-cols-2">
                      {s.proof.map((item, i) => (
                        <li key={i} className="flex flex-col gap-2 bg-bg p-5">
                          <span className="mono mono-2xs text-fg-dim">
                            L{p.n}.{i + 1}
                          </span>
                          <span className="h-card">{item.title[locale]}</span>
                          <span className="text-sm text-fg-muted">{item.body[locale]}</span>
                        </li>
                      ))}
                    </ol>
                    <Photos photos={rest} />
                  </section>

                  <section className="mt-16">
                    <Heading n={4} id="sec-result">
                      {d.sections.result}
                    </Heading>
                    <p className="text-[clamp(1.375rem,2.6vw,2rem)] font-medium leading-snug tracking-[-0.02em]">
                      <span className="mr-2 text-accent">∴</span>
                      {s.result[locale]}
                    </p>
                    <p className="mono mt-6 flex items-center gap-2 text-fg-dim">
                      <span className="text-accent">∎</span> {d.qed}
                    </p>
                  </section>
                </>
              )}

              {/* Penutup: proyek berikutnya + ajakan kontak. */}
              <div className="mt-20 grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => onNavigate(next.slug)}
                  className="group flex flex-col gap-3 rounded-[4px] border border-line p-6 text-left transition-colors hover:border-accent"
                >
                  <span className="mono mono-2xs text-fg-dim">{d.next} →</span>
                  <span className="h-card transition-colors group-hover:text-accent">{next.name}</span>
                  <span className="text-sm text-fg-muted">{next.hook[locale]}</span>
                </button>
                <div className="flex flex-col items-start justify-between gap-6 rounded-[4px] border border-line bg-surface p-6">
                  <span className="h-card">{d.cta}</span>
                  <Button
                    onClick={() => {
                      onClose();
                      openContact(`work-${p.slug}`);
                    }}
                  >
                    {d.ctaButton}
                  </Button>
                </div>
              </div>
            </article>
          </div>
        </div>
      </div>
    </div>
  );
}
