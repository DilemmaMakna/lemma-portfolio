"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { useLocale } from "@/components/LocaleProvider";
import SectionLabel from "@/components/ui/SectionLabel";
import Button from "@/components/ui/Button";
import { gsap, ScrollTrigger, useGSAP, reducedMotion } from "@/lib/gsap";
import { workPhotos } from "@/lib/work-photos";

function Diagram() {
  const { t } = useLocale();
  const s = t.services;
  const svg = useRef<SVGSVGElement>(null);
  const xs = [100, 300, 500, 700];

  useGSAP(
    () => {
      if (reducedMotion()) return;
      const paths = gsap.utils.toArray<SVGPathElement>("[data-line]");
      gsap.set(paths, { strokeDasharray: 1, strokeDashoffset: 1 });
      gsap.set("[data-node]", { scale: 0, transformOrigin: "50% 50%" });
      gsap.set("[data-dlabel]", { opacity: 0 });
      const tl = gsap.timeline({
        scrollTrigger: { trigger: svg.current, start: "top 80%", toggleActions: "play none none none" },
      });
      tl.to("[data-dlabel]", { opacity: 1, duration: 0.6, stagger: 0.1, ease: "power2.out" })
        .to(paths, { strokeDashoffset: 0, duration: 1.4, stagger: 0.12, ease: "expo.out" }, 0.2)
        .to("[data-node]", { scale: 1, duration: 0.7, ease: "expo.out" }, 1.0);
    },
    { scope: svg },
  );

  return (
    <svg
      ref={svg}
      viewBox="0 0 800 340"
      className="w-full"
      role="img"
      aria-label={`${s.diagram.join(", ")} → ${s.meaning}`}
    >
      {xs.map((x, i) => (
        <g key={i} data-dlabel>
          <text x={x} y="24" textAnchor="middle" className="fill-fg" style={{ font: "500 13px var(--font-mono)", letterSpacing: "0.08em" }}>
            {s.diagram[i]}
          </text>
          <text x={x} y="44" textAnchor="middle" className="fill-fg-dim" style={{ font: "400 11px var(--font-mono)", letterSpacing: "0.04em" }}>
            ({s.diagramSub[i]})
          </text>
          <path
            data-line
            pathLength={1}
            d={`M ${x} 62 C ${x} 170, 400 150, 400 262`}
            fill="none"
            style={{ stroke: "var(--line-strong)" }}
            strokeWidth="1"
          />
        </g>
      ))}
      <circle data-node cx="400" cy="270" r="6" style={{ fill: "var(--accent)" }} />
      <circle data-node cx="400" cy="270" r="14" fill="none" strokeOpacity=".4" style={{ stroke: "var(--accent)" }} />
      <text data-dlabel x="400" y="312" textAnchor="middle" className="fill-accent" style={{ font: "500 13px var(--font-mono)", letterSpacing: "0.3em" }}>
        {s.meaning}
      </text>
    </svg>
  );
}

// Foto pratinjau per layanan diambil dari proyek di /work (urutan = urutan t.services.items).
const SERVICE_PREVIEWS = [
  { photo: workPhotos["bem-fahutan-langkah-bermakna"][4], client: "BEM FAHUTAN, JalanSiswa", role: "Identity & Design System" },
  { photo: workPhotos["nata"][1], client: "NATA, LPJ Ormawa IPB", role: "UX Research & Product Design" },
  { photo: workPhotos["nata"][2], client: "NATA, Lemma Website", role: "Platform & Web Engineering" },
  { photo: workPhotos["lpj-ormawa-ipb-2025"][4], client: "LPJ Ormawa IPB", role: "Data Storytelling" },
  { photo: workPhotos["nata-launch-campaign"][3], client: "Nataku Beta Launch", role: "Campaign & Launch Strategy" },
];

function Row({
  i,
  open,
  onToggle,
  onHoverStart,
  onHoverMove,
  onHoverEnd,
}: {
  i: number;
  open: boolean;
  onToggle: () => void;
  onHoverStart?: (i: number, e: React.MouseEvent) => void;
  onHoverMove?: (e: React.MouseEvent) => void;
  onHoverEnd?: () => void;
}) {
  const { t } = useLocale();
  const s = t.services;
  const item = s.items[i];
  const body = useRef<HTMLDivElement>(null);
  const first = useRef(true);

  useGSAP(
    () => {
      const el = body.current;
      if (!el) return;
      if (first.current) {
        first.current = false;
        gsap.set(el, { height: open ? "auto" : 0 });
        return;
      }
      if (reducedMotion()) {
        gsap.set(el, { height: open ? "auto" : 0 });
      } else {
        gsap.to(el, {
          height: open ? "auto" : 0,
          duration: 0.6,
          ease: "expo.out",
          onComplete: () => ScrollTrigger.refresh(),
        });
      }
    },
    { dependencies: [open] },
  );

  return (
    <div
      className="border-t border-line last:border-b"
      data-reveal
      onMouseEnter={(e) => onHoverStart?.(i, e)}
      onMouseMove={(e) => onHoverMove?.(e)}
      onMouseLeave={() => onHoverEnd?.()}
    >
      <button
        id={`service-${i + 1}`}
        type="button"
        aria-expanded={open}
        aria-controls={`service-panel-${i + 1}`}
        onClick={onToggle}
        className="group grid w-full grid-cols-[2.5rem_1fr_auto] items-start gap-4 py-7 text-left md:grid-cols-[5rem_1fr_auto] md:items-center md:py-9"
      >
        <span className={`mono transition-colors ${open ? "text-accent" : "text-fg-dim"}`}>
          0{i + 1}.
        </span>
        <span>
          <span className="block text-[clamp(1.5rem,3vw,2.5rem)] font-medium leading-[1.1] tracking-[-0.03em] transition-colors group-hover:text-accent">
            {item.name}
          </span>
          <span className="mt-2 block max-w-[52ch] text-fg-muted">{item.summary}</span>
        </span>
        <span
          aria-hidden="true"
          className={`mono mt-1 flex h-9 w-9 items-center justify-center rounded-full border text-base transition-all duration-500 ${open ? "rotate-45 border-accent text-accent" : "border-line-strong text-fg-muted group-hover:border-accent"
            }`}
        >
          +
        </span>
      </button>
      <div ref={body} id={`service-panel-${i + 1}`} role="region" aria-labelledby={`service-${i + 1}`} className="overflow-hidden">
        <div className="grid items-center gap-5 pb-9 md:grid-cols-[5rem_1fr_auto]">
          <span className="hidden md:block" />
          {item.proof ? (
            <p className="mono text-fg-muted">
              <span className="text-fg-dim">{s.proofLabel}: </span>
              {item.proof}
            </p>
          ) : (
            <span />
          )}
          <Button variant="ghost" href="/services">
            {s.all}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function Services() {
  const { t } = useLocale();
  const s = t.services;
  const [open, setOpen] = useState<number>(-1);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const cardRef = useRef<HTMLDivElement>(null);
  const posRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0, isInitialized: false });

  // Mouse tracking loop with smooth interpolation (lerp)
  useEffect(() => {
    let animId: number;
    const loop = () => {
      if (posRef.current.isInitialized && cardRef.current) {
        posRef.current.x += (posRef.current.targetX - posRef.current.x) * 0.16;
        posRef.current.y += (posRef.current.targetY - posRef.current.y) * 0.16;
        cardRef.current.style.transform = `translate3d(${posRef.current.x}px, ${posRef.current.y}px, 0)`;
      }
      animId = requestAnimationFrame(loop);
    };
    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, []);

  const updateCardPosition = (clientX: number, clientY: number, snap = false) => {
    const cardW = 320;
    const cardH = 340;
    let tx = clientX + 24;
    let ty = clientY - 30;

    if (tx + cardW > window.innerWidth - 20) {
      tx = clientX - cardW - 24;
    }
    if (ty + cardH > window.innerHeight - 20) {
      ty = window.innerHeight - cardH - 20;
    }
    if (ty < 20) ty = 20;

    posRef.current.targetX = tx;
    posRef.current.targetY = ty;

    if (snap || !posRef.current.isInitialized) {
      posRef.current.x = tx;
      posRef.current.y = ty;
      posRef.current.isInitialized = true;
    }
  };

  const handleHoverStart = (i: number, e: React.MouseEvent) => {
    // Only enable hover cards on fine pointer / desktop devices
    if (window.matchMedia("(hover: none)").matches) return;
    setHoveredIdx(i);
    updateCardPosition(e.clientX, e.clientY, hoveredIdx === null);
  };

  const handleHoverMove = (e: React.MouseEvent) => {
    if (window.matchMedia("(hover: none)").matches) return;
    updateCardPosition(e.clientX, e.clientY);
  };

  const handleHoverEnd = () => {
    setHoveredIdx(null);
  };

  // Kartu terakhir tetap dirender saat memudar keluar supaya isinya tidak hilang mendadak.
  const [shownIdx, setShownIdx] = useState(0);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- ingat kartu terakhir untuk animasi keluar
    if (hoveredIdx !== null) setShownIdx(hoveredIdx);
  }, [hoveredIdx]);
  const shownItem = s.items[shownIdx];
  const shownPreview = SERVICE_PREVIEWS[shownIdx];

  return (
    <section id="services" className="section bg-bg relative" aria-labelledby="services-title">
      <div className="wrap">
        <SectionLabel>{s.label}</SectionLabel>
        <div className="grid12 gap-y-8">
          <div className="flex flex-col gap-y-3 w-full col-span-full lg:col-span-6">
            <h2 id="services-title" data-reveal="title" className="h-section">
              {s.title}
            </h2>
            <h3
              data-reveal
              className="font-mono text-[clamp(1.5rem,3.5vw,2.5rem)] leading-tight tracking-tight text-fg-dim"
              style={{ fontWeight: 200 }}
            >
              {s.subtitle}
            </h3>
          </div>
          <div className="col-span-full lg:col-span-5 lg:col-start-8">
            <p data-reveal className="lead">{s.lead}</p>
            <p data-reveal className="mono mt-6 text-fg-dim !normal-case">{s.sub}</p>
          </div>
        </div>

        <div className="mx-auto mt-16 max-w-[900px] md:mt-24">
          <Diagram />
        </div>

        <div className="mt-16 md:mt-24" onMouseLeave={handleHoverEnd}>
          {s.items.map((_, i) => (
            <Row
              key={i}
              i={i}
              open={open === i}
              onToggle={() => setOpen(open === i ? -1 : i)}
              onHoverStart={handleHoverStart}
              onHoverMove={handleHoverMove}
              onHoverEnd={handleHoverEnd}
            />
          ))}
        </div>

        <div className="mt-10" data-reveal>
          <Button variant="ghost" href="/services">
            {s.all}
          </Button>
        </div>
      </div>

      {/* Floating Animated Box on Hover (Gambar 1 style) */}
      <div
        ref={cardRef}
        className={`pointer-events-none fixed left-0 top-0 z-50 w-[300px] sm:w-[320px] transition-all duration-300 ease-out ${
          hoveredIdx !== null ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
        style={{
          willChange: "transform, opacity",
        }}
      >
        {shownItem && shownPreview && (
          <div className="overflow-hidden rounded-[4px] border border-line-strong bg-surface p-4 text-fg shadow-[0_24px_60px_-10px_var(--shadow)]">
            {/* Top Image Preview */}
            {/* Semua foto dirender sekaligus lalu di-crossfade, jadi tidak ada jeda memuat saat hover. */}
            <div className="relative mb-3.5 aspect-[16/10] w-full overflow-hidden rounded-[4px] border border-line bg-surface-2">
              {SERVICE_PREVIEWS.map((pv, i) => (
                <Image
                  key={pv.photo.src}
                  src={pv.photo.src}
                  alt={i === shownIdx ? shownItem.name : ""}
                  fill
                  unoptimized
                  className={`object-cover transition-opacity duration-300 ${i === shownIdx ? "opacity-100" : "opacity-0"}`}
                  style={{ backgroundColor: pv.photo.color }}
                />
              ))}
              <div className="mono absolute top-2.5 left-2.5 z-10 rounded-full border border-line-strong bg-bg/70 px-2.5 py-1 text-[10px] text-fg backdrop-blur-md">
                0{shownIdx + 1} / SERVICE
              </div>
            </div>

            {/* Title & Client Subtitle */}
            <div>
              <h4 className="text-[15px] font-medium leading-tight tracking-tight text-fg">
                {shownItem.name}
              </h4>
              <p className="mono mt-1 text-[11px] text-fg-dim">
                {shownPreview.client} • {shownPreview.role}
              </p>
            </div>

            {/* Description */}
            <p className="mt-2 line-clamp-3 text-[13px] leading-relaxed text-fg-muted">
              {shownItem.summary}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
