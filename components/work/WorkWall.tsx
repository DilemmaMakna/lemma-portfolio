"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { reducedMotion } from "@/lib/motion/gsap";
import { isOpenable, type Project } from "@/lib/content/work";
import type { WorkPhoto } from "@/lib/content/work-photos";
import Redacted from "@/components/ui/Redacted";
import AsciiCover from "./AsciiCover";
import { useWorkCopy } from "./useWorkCopy";

// Dinding karya ala Pinterest: kolom masonry yang bergulir vertikal tanpa henti.
// Setiap kolom punya kecepatan sendiri; kolom yang di-hover berhenti; scroll halaman ikut mendorong kolom.
const SPEED = 26; // px per detik, kecepatan dasar
const SPEED_STEP = [1, 1.35, 0.85, 1.2, 0.95]; // pengali per kolom agar ritmenya tidak seragam
const SCROLL_PUSH = 0.35; // seberapa kuat scroll halaman ikut menggeser kolom
const EASE = 0.08; // kehalusan saat kolom berhenti/jalan lagi (0..1)
const MIN_TILES_PER_COL = 7; // tile diulang sampai tiap kolom cukup tinggi untuk loop yang mulus

type Tile =
  | { kind: "photo"; key: string; p: Project; photo: WorkPhoto }
  | { kind: "info" | "cover" | "stealth"; key: string; p: Project };

// Perkiraan tinggi tile relatif terhadap lebar kolom, untuk membagi tile ke kolom terpendek.
const weight = (t: Tile) =>
  t.kind === "photo" ? t.photo.h / t.photo.w : t.kind === "info" ? 0.8 : t.kind === "cover" ? 1.1 : 0.8;

function buildTiles(list: Project[]) {
  const queues = list.map((p) => {
    if (!isOpenable(p)) return [{ kind: "stealth", key: p.slug, p }] as Tile[];
    if (!p.photos.length) return [{ kind: "cover", key: p.slug, p }] as Tile[];
    const photos: Tile[] = p.photos.map((photo, i) => ({ kind: "photo", key: `${p.slug}-${i}`, p, photo }));
    return [photos[0], { kind: "info", key: `${p.slug}-info`, p } as Tile, ...photos.slice(1)];
  });
  // Round-robin antarproyek supaya foto dari proyek yang sama tidak menumpuk.
  const out: Tile[] = [];
  for (let i = 0; queues.some((q) => i < q.length); i++) queues.forEach((q) => q[i] && out.push(q[i]));
  return out;
}

function distribute(tiles: Tile[], cols: number, loop: boolean) {
  if (!tiles.length) return [];
  let pool = tiles;
  for (let r = 1; loop && pool.length < cols * MIN_TILES_PER_COL; r++)
    pool = pool.concat(tiles.map((t) => ({ ...t, key: `${t.key}~${r}` })));
  const columns: Tile[][] = Array.from({ length: cols }, () => []);
  const heights = new Array(cols).fill(0);
  pool.forEach((t) => {
    const i = heights.indexOf(Math.min(...heights));
    columns[i].push(t);
    heights[i] += weight(t) + 0.06;
  });
  return columns;
}

function useColumnCount() {
  const [n, setN] = useState(4);
  useEffect(() => {
    const qs = ["(min-width: 1280px)", "(min-width: 1024px)", "(min-width: 640px)"].map((q) => window.matchMedia(q));
    const update = () => setN(qs[0].matches ? 5 : qs[1].matches ? 4 : qs[2].matches ? 3 : 2);
    update();
    qs.forEach((q) => q.addEventListener("change", update));
    return () => qs.forEach((q) => q.removeEventListener("change", update));
  }, []);
  return n;
}

const SIZES = "(min-width: 1280px) 20vw, (min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw";

function TileView({ t, onOpen }: { t: Tile; onOpen: (slug: string) => void }) {
  const { w, locale } = useWorkCopy();
  const { p } = t;
  const open = () => onOpen(p.slug);

  if (t.kind === "photo")
    return (
      <button
        type="button"
        onClick={open}
        data-cursor-label={w.tile.open.toUpperCase()}
        className="group relative block w-full overflow-hidden rounded-[4px]"
        style={{ backgroundColor: t.photo.color }}
      >
        <Image
          src={t.photo.src}
          width={t.photo.w}
          height={t.photo.h}
          sizes={SIZES}
          alt=""
          className="h-auto w-full transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
        />
        <span className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col gap-1 bg-gradient-to-t from-bg/90 via-bg/50 to-transparent p-3 pt-12 text-left opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
          <span className="mono mono-2xs text-fg-muted">
            {p.n} · {p.year}
          </span>
          <span className="text-sm font-medium leading-tight text-fg">{p.name}</span>
        </span>
      </button>
    );

  if (t.kind === "info")
    return (
      <button
        type="button"
        onClick={open}
        className="group flex w-full flex-col gap-4 rounded-[4px] border border-line bg-bg-raised p-4 text-left sm:gap-5 sm:p-5 transition-colors hover:border-accent focus-visible:border-accent"
      >
        <span className="mono mono-2xs flex justify-between text-fg-dim">
          <span>№ {p.n}</span>
          <span>{p.year}</span>
        </span>
        <span className="h-card">{p.name}</span>
        <span
          className="text-base italic leading-snug text-fg-muted sm:text-lg"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          {p.hook[locale]}
        </span>
        <span className="mono mono-2xs flex items-center justify-between gap-3 text-fg-dim">
          <span className="truncate">{p.category}</span>
          <span className="text-accent transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
            ↗
          </span>
        </span>
      </button>
    );

  if (t.kind === "cover")
    return (
      <button
        type="button"
        onClick={open}
        data-cursor-label={w.tile.open.toUpperCase()}
        className="group relative flex min-h-[16rem] w-full flex-col justify-end overflow-hidden rounded-[4px] border border-line bg-surface pt-24 text-left sm:min-h-[20rem]"
      >
        <AsciiCover
          seed={Number(p.n)}
          className="absolute inset-0 transition-colors duration-500 group-hover:text-accent/60"
        />
        <span className="absolute inset-0 bg-gradient-to-t from-surface via-surface/60 to-transparent" />
        <span className="relative flex flex-col gap-2 p-4 sm:p-5">
          <span className="mono mono-2xs text-fg-dim">№ {p.n}</span>
          <span className="h-card">{p.name}</span>
          <span className="text-sm text-fg-muted">{p.hook[locale]}</span>
          <span className="mono mono-2xs mt-2 text-accent">{w.tile.noPhoto}</span>
        </span>
      </button>
    );

  // Proyek stealth: tampil tersensor dan tidak bisa dibuka.
  return (
    <div className="flex min-h-[12rem] w-full flex-col justify-between gap-6 rounded-[4px] border border-dashed border-line-strong p-4 sm:p-5">
      <span className="mono mono-2xs flex justify-between text-fg-dim">
        <span>№ {p.n}</span>
        <span>{w.status.stealth}</span>
      </span>
      <div>
        <span className="h-card">
          <Redacted />
        </span>
        <p className="mt-2 text-sm text-fg-muted">{p.hook[locale]}</p>
      </div>
      <span className="mono mono-2xs text-fg-dim">{w.tile.stealth}</span>
    </div>
  );
}

export default function WorkWall({
  list,
  onOpen,
  paused,
}: {
  list: Project[];
  onOpen: (slug: string) => void;
  paused: boolean;
}) {
  const cols = useColumnCount();
  const [motion, setMotion] = useState(true);
  const columns = useMemo(() => distribute(buildTiles(list), cols, motion), [list, cols, motion]);
  const root = useRef<HTMLDivElement>(null);
  const tracks = useRef<(HTMLDivElement | null)[]>([]);
  const hovered = useRef<number>(-1);
  const pausedRef = useRef(paused);

  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- preferensi gerak hanya diketahui di klien
    if (reducedMotion()) setMotion(false);
  }, []);

  useEffect(() => {
    const el = root.current;
    if (!motion || !el) return;
    const offsets = columns.map((_, i) => 140 + i * 233);
    const factors = columns.map(() => 1);
    let visible = false;
    let raf = 0;
    let last = performance.now();
    let lastY = window.scrollY;

    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(el);

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      const dt = Math.min(0.05, Math.max(0, (now - last) / 1000));
      last = now;
      const dy = window.scrollY - lastY;
      lastY = window.scrollY;
      if (!visible || pausedRef.current || document.hidden) return;

      tracks.current.forEach((track, i) => {
        if (!track) return;
        const loop = (track.firstElementChild as HTMLElement | null)?.offsetHeight ?? 0;
        if (!loop) return;
        const target = hovered.current === i ? 0 : 1;
        factors[i] += (target - factors[i]) * EASE;
        offsets[i] += SPEED * SPEED_STEP[i % SPEED_STEP.length] * factors[i] * dt + dy * SCROLL_PUSH;
        offsets[i] = ((offsets[i] % loop) + loop) % loop;
        track.style.transform = `translate3d(0, ${-offsets[i]}px, 0)`;
      });
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, [columns, motion]);

  return (
    <div
      ref={root}
      className={`relative flex gap-3 ${motion ? "h-[100svh] min-h-[560px] overflow-hidden" : ""}`}
      style={
        motion
          ? {
              maskImage: "linear-gradient(to bottom, transparent, #000 14%, #000 86%, transparent)",
              WebkitMaskImage: "linear-gradient(to bottom, transparent, #000 14%, #000 86%, transparent)",
            }
          : undefined
      }
    >
      {columns.map((col, i) => (
        <div
          key={i}
          className="min-w-0 flex-1"
          onPointerEnter={(e) => e.pointerType === "mouse" && (hovered.current = i)}
          onPointerLeave={() => (hovered.current = -1)}
        >
          <div
            ref={(n) => {
              tracks.current[i] = n;
            }}
            className="will-change-transform"
          >
            {/* Salinan kedua membuat loop tanpa sambungan; disembunyikan dari pembaca layar dan tab. */}
            {(motion ? [0, 1] : [0]).map((copy) => (
              <div
                key={copy}
                className="flex flex-col gap-3 pb-3"
                inert={copy === 1}
                aria-hidden={copy === 1 || undefined}
              >
                {col.map((t) => (
                  <TileView key={t.key} t={t} onOpen={onOpen} />
                ))}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
