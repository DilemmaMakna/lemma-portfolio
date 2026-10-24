"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import SectionLabel from "@/components/ui/SectionLabel";
import Button from "@/components/ui/Button";
import Redacted from "@/components/ui/Redacted";
import { useContactModal } from "@/components/ui/ContactModal";
import { CATEGORIES, isOpenable, projects, type Category } from "@/lib/work";
import ProjectModal from "./ProjectModal";
import WorkWall from "./WorkWall";
import { useWorkCopy } from "./useWorkCopy";

// Filter kategori -> dinding karya + indeks. Klik tile/baris membuka detail; slug disimpan di hash (#slug)
// supaya tautan detail bisa dibagikan.
export default function WorkExplorer() {
  const { w, locale } = useWorkCopy();
  const { open: openContact } = useContactModal();
  const [filter, setFilter] = useState<Category | null>(null);
  const [openSlug, setOpenSlug] = useState<string | null>(null);

  const list = useMemo(() => (filter ? projects.filter((p) => p.category === filter) : projects), [filter]);
  const openable = useMemo(() => list.filter(isOpenable), [list]);
  const chips = CATEGORIES.map((c) => ({ c, count: projects.filter((p) => p.category === c).length })).filter(
    (x) => x.count,
  );

  const open = useCallback((slug: string) => {
    setOpenSlug(slug);
    history.replaceState(null, "", `#${slug}`);
  }, []);
  const close = useCallback(() => {
    setOpenSlug(null);
    history.replaceState(null, "", window.location.pathname + window.location.search);
  }, []);

  // Tautan masuk: /work#slug, atau /work?p=slug (dipakai dari beranda, karena hash dibaca
  // PageTransition sebagai id section).
  useEffect(() => {
    const slug = new URLSearchParams(window.location.search).get("p") ?? window.location.hash.slice(1);
    if (!projects.some((p) => p.slug === slug && isOpenable(p))) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- URL hanya bisa dibaca di klien
    setOpenSlug(slug);
    history.replaceState(null, "", `${window.location.pathname}#${slug}`);
  }, []);

  // Detail yang dibuka lewat hash bisa berada di luar filter aktif; navigasinya tetap memakai semua proyek.
  const modalList = openSlug && !openable.some((p) => p.slug === openSlug) ? projects.filter(isOpenable) : openable;

  return (
    <>
      <section id="work" className="bg-bg" aria-label={w.hero.eyebrow}>
        <div className="wrap">
          <div
            className="relative z-10 mb-6 flex flex-col gap-4 border-t border-line pt-6 md:flex-row md:items-center md:justify-between"
            data-reveal
          >
            <div className="relative z-10 flex flex-wrap gap-2" role="group" aria-label={w.index.cols.category}>
              {[{ c: null, count: projects.length }, ...chips].map(({ c, count }) => {
                const on = filter === c;
                return (
                  <button
                    key={c ?? "all"}
                    type="button"
                    aria-pressed={on}
                    onClick={() => setFilter(c)}
                    className={`relative mono mono-2xs flex items-center gap-2 rounded-full border px-3.5 py-2 transition-colors after:absolute after:inset-x-0 after:-inset-y-[7px] after:content-[''] ${
                      on
                        ? "border-accent text-accent"
                        : "border-line-strong text-fg-muted hover:border-fg-dim hover:text-fg"
                    }`}
                  >
                    {c ?? w.filters.all}
                    <span className={on ? "text-accent/70" : "text-fg-dim"}>{count}</span>
                  </button>
                );
              })}
            </div>
            <p className="mono mono-2xs hidden text-fg-dim md:block">{w.hero.hint}</p>
          </div>

          <WorkWall key={filter ?? "all"} list={list} onOpen={open} paused={openSlug !== null} />
        </div>
      </section>

      <section className="section bg-bg" aria-labelledby="work-index-title">
        <div className="wrap">
          <SectionLabel rule>
            <span id="work-index-title">{w.index.label}</span>
          </SectionLabel>

          <div className="mono mono-2xs hidden grid-cols-12 gap-x-6 border-b border-line pb-3 text-fg-dim md:grid">
            <span className="col-span-1">{w.index.cols.n}</span>
            <span className="col-span-5">{w.index.cols.name}</span>
            <span className="col-span-3">{w.index.cols.category}</span>
            <span className="col-span-1">{w.index.cols.year}</span>
            <span className="col-span-2 text-right">{w.index.cols.status}</span>
          </div>
          <ul>
            {list.map((p) => {
              const can = isOpenable(p);
              const row = (
                <>
                  <span className="mono col-span-1 text-fg-dim">{p.n}</span>
                  <span className="col-span-3 md:col-span-5">
                    <span className={`h-card block transition-colors ${can ? "group-hover:text-accent" : ""}`}>
                      {can ? p.name : <Redacted />}
                    </span>
                    <span className="mt-1 block text-sm text-fg-muted">{p.hook[locale]}</span>
                  </span>
                  <span className="mono mono-2xs col-span-3 hidden text-fg-muted md:block">{p.category}</span>
                  <span className="mono col-span-1 hidden text-fg-muted md:block">{p.year}</span>
                  <span className="col-span-full flex items-center justify-between gap-3 md:col-span-2 md:justify-end">
                    <span className={`badge ${p.status === "active" ? "is-active" : ""}`}>
                      <i />
                      {w.status[p.status]}
                    </span>
                    {can && (
                      <span
                        aria-hidden="true"
                        className="text-fg-dim transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent"
                      >
                        ↗
                      </span>
                    )}
                  </span>
                </>
              );
              const cls =
                "grid w-full grid-cols-4 items-center gap-x-6 gap-y-3 border-b border-line py-5 text-left md:grid-cols-12 md:py-6";
              return (
                <li key={p.slug} data-reveal>
                  {can ? (
                    <button
                      type="button"
                      onClick={() => open(p.slug)}
                      className={`group ${cls} transition-colors hover:bg-bg-raised`}
                    >
                      {row}
                    </button>
                  ) : (
                    <div className={`${cls} opacity-70`}>{row}</div>
                  )}
                </li>
              );
            })}
          </ul>

          {/* Penutup halaman: variasi CTA dengan tanda akhir bukti. */}
          <div
            className="mt-24 flex flex-col items-start gap-8 md:mt-32 md:flex-row md:items-end md:justify-between"
            data-reveal
          >
            <div>
              <span className="mono text-accent">∎</span>
              <h2 className="h-section mt-4 max-w-[16ch]">{w.detail.cta}</h2>
            </div>
            <Button id="work-cta" onClick={() => openContact("work")}>
              {w.detail.ctaButton}
            </Button>
          </div>
        </div>
      </section>

      {openSlug && <ProjectModal list={modalList} slug={openSlug} onNavigate={open} onClose={close} />}
    </>
  );
}
