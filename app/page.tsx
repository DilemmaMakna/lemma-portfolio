"use client";
import React, { useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

import { Button } from "@/components/buttons/Button";
import { IconButton } from "@/components/buttons/IconButton";
import { Eyebrow } from "@/components/feedback/Eyebrow";
import { StatPill } from "@/components/feedback/StatPill";
import { HaloCard } from "@/components/cards/HaloCard";
import { ProjectCard } from "@/components/cards/ProjectCard";
import { BarrelBackdrop } from "@/components/sections/BarrelBackdrop";
import { ServiceTile } from "@/components/sections/ServiceTile";
import Link from "next/link";
import { PORTFOLIO_STORIES } from "@/app/data/portfolio";

gsap.registerPlugin(ScrollTrigger);

// ── Icons ──────────────────────────────────────────────────────
function ChartIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  );
}
function ProjectsIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3" width="6" height="6" rx="1" /><rect x="16" y="3" width="6" height="6" rx="1" />
      <rect x="2" y="15" width="6" height="6" rx="1" /><rect x="16" y="15" width="6" height="6" rx="1" />
    </svg>
  );
}
function ShieldIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

// ── Nav links ──────────────────────────────────────────────────
const NAV_LINKS = [
  { id: "tentang", label: "Tentang", href: "#tentang" },
  { id: "layanan", label: "Layanan", href: "#layanan" },
  { id: "karya", label: "Karya", href: "#karya" },
  { id: "kontak", label: "Kontak", href: "#kontak" },
];

// ── Service tile decorations ───────────────────────────────────
function KreatifDecor() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice" style={{ opacity: 0.5 }}>
      <circle cx="600" cy="150" r="220" fill="none" stroke="#d700d4" strokeWidth="1.5" />
      <circle cx="600" cy="150" r="160" fill="none" stroke="#d700d4" strokeWidth="1" />
      <ellipse cx="200" cy="450" rx="120" ry="80" fill="none" stroke="#a900d7" strokeWidth="1" />
      <rect x="480" y="320" width="140" height="40" rx="20" fill="rgba(215,0,212,0.15)" />
    </svg>
  );
}
function AnalitikDecor() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice" style={{ opacity: 0.45 }}>
      <circle cx="650" cy="200" r="200" fill="none" stroke="#01d5dd" strokeWidth="1.5" />
      <circle cx="650" cy="200" r="140" fill="none" stroke="#017988" strokeWidth="1" />
      <line x1="0" y1="400" x2="800" y2="400" stroke="#01d5dd" strokeWidth="0.8" />
      <line x1="0" y1="450" x2="800" y2="450" stroke="#01d5dd" strokeWidth="0.5" />
      <rect x="100" y="350" width="60" height="60" rx="8" fill="rgba(1,213,221,0.1)" />
    </svg>
  );
}
function DigitalDecor() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice" style={{ opacity: 0.45 }}>
      <rect x="500" y="80" width="200" height="280" rx="16" fill="none" stroke="#d7ac00" strokeWidth="1.5" />
      <rect x="540" y="120" width="120" height="80" rx="8" fill="rgba(215,172,0,0.12)" />
      <circle cx="180" cy="420" r="100" fill="none" stroke="#d0d700" strokeWidth="1" />
      <circle cx="180" cy="420" r="60" fill="rgba(208,215,0,0.08)" />
    </svg>
  );
}

// ── Prinsip data ───────────────────────────────────────────────
const PRINSIP = [
  { num: "01", title: "Struktur adalah kebebasan.", body: "Sistem yang baik bukan penjara — ia adalah landasan yang membuat eksperimen berani jadi mungkin." },
  { num: "02", title: "Makna sebelum metode.", body: "Sebelum bertanya bagaimana, kami bertanya mengapa — dan kami tidak berhenti di jawaban pertama." },
  { num: "03", title: "Bagian kecil menopang keseluruhan.", body: "Seperti lemma dalam matematika, setiap detail dalam sebuah proyek punya peran struktural. Tidak ada yang dekoratif semata." },
];

// ── Service tile right-panel data ─────────────────────────────
const SERVICE_DETAILS = [
  {
    tags: ["Visual Systems", "Brand Architecture", "Creative Direction"],
    bullets: [
      "Menerjemahkan abstraksi menjadi sistem identitas yang terukur.",
      "Membangun arsitektur visual untuk skalabilitas jangka panjang.",
      "Arahan kreatif yang berfokus pada makna, bukan sekadar estetika.",
    ],
    tagline: "Bentuk selalu mengikuti fungsi; fungsi selalu mengikuti makna.",
  },
  {
    tags: ["Data Modeling", "Behavioral Insights", "Interactive Dashboards"],
    bullets: [
      "Ekstraksi pola dari kekacauan data operasional.",
      "Pemodelan wawasan perilaku untuk keputusan strategis.",
      "Visualisasi interaktif yang berbicara langsung pada masalah.",
    ],
    tagline: "Opini dikalahkan oleh data; data dikalahkan oleh wawasan.",
  },
  {
    tags: ["Web Ecosystems", "Digital Products", "System Maintenance"],
    bullets: [
      "Arsitektur ekosistem digital yang adaptif dan berkelanjutan.",
      "Pengembangan produk berbasis logika tanpa kompromi.",
      "Pemeliharaan sistem yang menolak keusangan teknologi.",
    ],
    tagline: "Kode adalah puisi logika; sistem adalah bentuk nyatanya.",
  },
];

// ── Main page ──────────────────────────────────────────────────
export default function Page() {
  const mainRef = useRef<HTMLDivElement>(null);

  // State for Service section
  const [activeService, setActiveService] = useState(1);

  // State for Karya section hover
  const [hoveredProject, setHoveredProject] = useState<number | null>(null);

  // Hero entrance timeline
  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const tl = gsap.timeline({ defaults: { ease: "expo.out", duration: 1.2 } });
      tl.from(".hero-eyebrow", { y: 40, opacity: 0, duration: 0.8 })
        .from(".hero-char", { y: 150, opacity: 0, rotation: 15, stagger: 0.05, ease: "back.out(1.5)" }, "-=0.5")
        .from(".hero-halo", { scale: 0.5, opacity: 0, rotation: -20, x: 100, ease: "power4.out" }, "-=0.8")
        .from(".hero-stats > *", { y: 30, opacity: 0, stagger: 0.1, rotationX: -90, transformOrigin: "bottom center" }, "-=0.8")
        .from(".hero-cta > *", { scale: 0.8, opacity: 0, stagger: 0.1, ease: "back.out(2)" }, "-=0.6");
    });
    return () => mm.revert();
  });

  // Global reveal-up + prinsip scrub + service pins + footer curtain
  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      // Fade-up reveals
      gsap.utils.toArray<HTMLElement>(".reveal-up").forEach((el) => {
        gsap.fromTo(
          el,
          { y: 32, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 0.68, ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 82%", toggleActions: "play none none none" },
          }
        );
      });

      // Prinsip — sticky section, master timeline scrubs all reveals
      const prinsipTl = gsap.timeline({
        scrollTrigger: {
          trigger: "#tentang",
          start: "top top",
          end: "+=400%", // Increased scroll distance for more dwell time
          pin: true,
          pinSpacing: true,
          scrub: 1,
          snap: {
            snapTo: "labels", // Snap to timeline labels
            duration: { min: 0.2, max: 1.5 },
            delay: 0.1,
            ease: "power1.inOut"
          }
        },
      });
      prinsipTl
        .fromTo(".prinsip-big-white", { opacity: 0.15 }, { opacity: 1, ease: "none", duration: 2 })
        .fromTo(".prinsip-big-dim", { opacity: 0.1 }, { opacity: 0.55, ease: "none", duration: 2 }, "<0.5")
        .addLabel("rows", "+=0.5");

      // Queue each row sequentially
      gsap.utils.toArray<HTMLElement>(".prinsip-row").forEach((row, i) => {
        const title = row.querySelector(".prinsip-title");
        const body = row.querySelector(".prinsip-body");
        const offset = i === 0 ? "rows" : "+=1";

        prinsipTl.addLabel(`row-${i}`, offset); // Add label for snapping
        if (title) prinsipTl.fromTo(title, { opacity: 0.18 }, { opacity: 1, ease: "none", duration: 1.2 }, offset);
        if (body) prinsipTl.fromTo(body, { opacity: 0.12 }, { opacity: 0.88, ease: "none", duration: 1.2 }, "<0.3");
      });

      // Add a dummy tween to extend the scroll distance at the very end
      // This creates a "dwell time" where the user scrolls but nothing moves before unpinning
      prinsipTl.addLabel("end", "+=0.5");
      prinsipTl.to({}, { duration: 3 });

      // Layered-pin service tiles
      const pinnedTiles = gsap.utils.toArray<HTMLElement>(".service-tile");
      gsap.set(pinnedTiles[0], { autoAlpha: 1 });
      pinnedTiles.forEach((tile, i) => {
        ScrollTrigger.create({
          trigger: tile,
          start: "top top",
          endTrigger: ".layered-pin-end",
          end: "top top",
          pin: true,
          pinSpacing: false,
          onEnter: () => {
            const tl = gsap.timeline();
            tl.to(tile, { autoAlpha: 1, duration: 0.3, ease: "power2.out" });
            if (i > 0) {
              const titleEl = tile.querySelector(".tile-title");
              const descEl = tile.querySelector(".tile-desc");
              const detailEl = tile.querySelector(".tile-detail");
              tl.fromTo(titleEl, { y: 70, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: "expo.out" }, "-=0.05")
                .fromTo(descEl, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: "expo.out" }, "-=0.55")
                .fromTo(detailEl, { x: 50, opacity: 0 }, { x: 0, opacity: 1, duration: 0.55, ease: "expo.out" }, "-=0.5");
            }
            setActiveService(i + 1);
          },
          onLeaveBack: () => {
            if (i) gsap.to(tile, { autoAlpha: 0, duration: 0.25 });
            if (i > 0) setActiveService(i);
          },
        });
      });

      // Footer wordmark eccentric scrub
      gsap.fromTo(".footer-wordmark",
        { scale: 0.5, opacity: 0, y: 100, rotationX: 45 },
        {
          scale: 1, opacity: 1, y: 0, rotationX: 0,
          ease: "none",
          scrollTrigger: {
            trigger: ".footer-section",
            start: "top bottom",
            end: "bottom bottom",
            scrub: true,
          }
        }
      );

      // Project list stagger (Elegant + Eccentric)
      gsap.fromTo(".karya-list-item",
        { y: 60, opacity: 0, rotationX: -15 },
        {
          y: 0, opacity: 1, rotationX: 0,
          duration: 1.2, ease: "power3.out", stagger: 0.15,
          scrollTrigger: { trigger: ".karya-list-container", start: "top 80%" },
        }
      );

      // Elegant minimalist text scrub
      gsap.utils.toArray<HTMLElement>(".scrub-text-word").forEach((word, i) => {
        gsap.fromTo(word,
          { opacity: 0.2 },
          {
            opacity: 1,
            ease: "none",
            scrollTrigger: {
              trigger: ".scrub-text-container",
              start: "top 85%",
              end: "bottom 50%",
              scrub: true,
            }
          }
        );
      });

      // Giant subtle watermark parallax
      gsap.to(".karya-watermark", {
        yPercent: -30,
        ease: "none",
        scrollTrigger: {
          trigger: "#karya",
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        }
      });
    });
    return () => mm.revert();
  }, { scope: mainRef });

  return (
    <div ref={mainRef}>


      {/* ═══════════════════════════════════════
          HERO
      ════════════════════════════════════════ */}
      <section id="beranda" className="hero-section" style={{ background: "var(--surface-paper)", paddingInline: "var(--gutter)", overflow: "hidden" }}>
        <BarrelBackdrop opacity={0.7} />

        {/* HaloCard — absolute right */}
        <div
          className="hero-halo"
          style={{
            position: "absolute",
            right: "clamp(24px, 5vw, 80px)",
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 1,
            pointerEvents: "none",
          }}
        >
          <HaloCard width={480} height={320} rotate={-6}>
            <div style={{
              position: "absolute", inset: 0, display: "flex", flexDirection: "column",
              justifyContent: "flex-end", padding: "28px 32px", gap: 6,
            }}>
              <div style={{ color: "rgba(255,255,255,0.65)", fontSize: 13, fontWeight: 400, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                Empower your value
              </div>
              <div style={{ color: "#fff", fontSize: 26, fontWeight: 500, lineHeight: 1.15 }}>
                Bring it to the world
              </div>
            </div>
          </HaloCard>
        </div>

        <div style={{ position: "relative", maxWidth: "var(--container-inner)", marginInline: "auto", width: "100%", zIndex: 2 }}>

          {/* Eyebrow */}
          <div className="hero-eyebrow" style={{ marginBottom: 32 }}>
            <Eyebrow tone="accent">Venture Studio — Bogor / IPB</Eyebrow>
          </div>

          {/* Headline — stacked, no card in between */}
          <div style={{ display: "flex", flexDirection: "column", gap: 0, perspective: 1000 }}>
            <div style={{ font: "var(--type-hero)", color: "var(--neutral-ink)", letterSpacing: "-0.04em", lineHeight: 0.9, fontSize: "clamp(60px, 12vw, 160px)" }}>
              {"Digital".split("").map((c, i) => <span key={i} className="hero-char" style={{ display: "inline-block", transformOrigin: "bottom left" }}>{c}</span>)}
            </div>
            <div style={{ font: "var(--type-hero)", color: "var(--neutral-ink)", letterSpacing: "-0.04em", lineHeight: 0.9, fontSize: "clamp(60px, 12vw, 160px)" }}>
              {"Partner".split("").map((c, i) => <span key={i} className="hero-char" style={{ display: "inline-block", transformOrigin: "bottom left" }}>{c}</span>)}
            </div>
          </div>

          {/* Stats + CTA row */}
          <div style={{ marginTop: 48, display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 32 }}>
            <div className="hero-stats" style={{ display: "flex", alignItems: "center" }}>
              <StatPill icon={<ProjectsIcon />} value="4+" label="Proyek selesai" />
              <StatPill icon={<ChartIcon />} value="701K+" label="Jangkauan" dividerBefore />
              <StatPill icon={<ShieldIcon />} value="IPB" label="Berbasis di" dividerBefore />
            </div>
            <div className="hero-cta" style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <Button variant="primary" size="lg" href="#layanan">Lihat layanan</Button>
              <IconButton variant="accent" size="lg" href="#karya" ariaLabel="Lihat karya" />
            </div>
          </div>

          {/* Lead text */}
          <div style={{ marginTop: 40, maxWidth: 520 }}>
            <p className="reveal-up" style={{ font: "var(--type-lead)", color: "var(--text-muted)" }}>
              Lemma membantu organisasi, bisnis, dan komunitas mahasiswa menyusun sistem yang utuh — dari identitas visual hingga platform digital.
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          TENTANG / PRINSIP (orange radial)
      ════════════════════════════════════════ */}
      <section id="tentang" className="section" style={{
        position: "relative",
        background: "radial-gradient(ellipse 70.71% 53.85% at 50% 50%, #D76300 0%, #D72F00 100%)",
        overflow: "hidden",
        minHeight: "100vh",
        paddingInline: "var(--gutter)",
        paddingBlock: "clamp(60px, 15vw, 160px)", // Increased padding
        boxSizing: "border-box",
      }}>
        {/* Barrel columns — top AND bottom */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: "url('/barrel-pattern.svg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0.3,
            mixBlendMode: "screen",
          }}
        />

        {/* Content */}
        <div style={{ position: "relative", zIndex: 1, maxWidth: "var(--container-inner)", marginInline: "auto", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div className="mb-section md-flex-col" style={{ display: "flex", flexDirection: "row", gap: "clamp(24px, 12vw, 100px)", alignItems: "flex-start" }}>
            {/* Heading */}
            <h2 style={{
              margin: "0 0 clamp(16px, 2vw, 24px)",
              fontSize: "clamp(28px, 4vw, 56px)", // Scaled down
              lineHeight: 1.0,
              letterSpacing: "-0.02em",
              color: "#fff",
            }}>
              <span style={{ fontWeight: 500 }}>V</span>enture
              <br />
              <span style={{ fontWeight: 500 }}>S</span>tudio
            </h2>

            <div style={{ flex: 1, marginBottom: "clamp(32px, 4vw, 48px)" }}>
              <p style={{ margin: 0, fontSize: "clamp(16px, 1.5vw, 26px)", lineHeight: 1.45, fontWeight: 400, textAlign: "right", width: "100%", flex: 1, justifyItems: "end" }}>
                <span className="prinsip-big-white" style={{ color: "#fff", opacity: 0.15, flex: 1 }}>
                  Lebih dari sekadar agensi, kami adalah venture studio yang bergerak di perpaduan desain, teknologi, dan sistem. Visi kami adalah membangun ekosistem digital yang memberdayakan pelajar dan mahasiswa, dengan misi menghadirkan solusi esensial yang memecahkan masalah pengguna secara implisit dan tepat guna.
                </span>
              </p>
            </div>
          </div>
          {/* Numbered prinsip rows — each scrubs in via master timeline */}
          <div style={{ display: "flex", flexDirection: "column", borderTop: "1px solid rgba(255,255,255,0.15)" }}>
            {PRINSIP.map((p, i) => (
              <div
                key={p.num}
                className="prinsip-row group"
                style={{
                  paddingBlock: "clamp(24px, 3vw, 40px)",
                  borderBottom: "1px solid rgba(255,255,255,0.15)",
                  display: "grid",
                  gridTemplateColumns: "48px 1fr",
                  gap: "clamp(16px, 2vw, 32px)",
                  alignItems: "flex-start",
                }}
              >
                <span style={{
                  fontSize: 12,
                  color: "rgba(255,255,255,0.4)",
                  fontFamily: "var(--font-mono, monospace)",
                  letterSpacing: "0.04em",
                  paddingTop: 6
                }}>
                  {p.num}
                </span>
                <div className="md-grid-1" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(24px, 4vw, 48px)" }}>
                  <div className="prinsip-title" style={{
                    fontSize: "clamp(20px, 2vw, 32px)", // Scaled down
                    fontWeight: 400,
                    color: "#fff",
                    lineHeight: 1.25,
                    letterSpacing: "-0.01em",
                    fontFamily: "var(--font-serif, Georgia, serif)",
                    fontStyle: "italic",
                    opacity: 0.18
                  }}>
                    &ldquo;{p.title}&rdquo;
                  </div>
                  <div className="prinsip-body" style={{
                    fontSize: "clamp(14px, 1.1vw, 16px)", // Scaled down
                    color: "rgba(255,255,255,0.75)",
                    lineHeight: 1.6,
                    fontWeight: 400,
                    opacity: 0.12
                  }}>
                    {p.body}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          LAYANAN — layered fade-in pin
      ════════════════════════════════════════ */}
      <section id="layanan">
        {/* Section header */}
        <div className="section" style={{ paddingInline: "var(--gutter)", background: "var(--surface-paper)" }}>
          <div style={{ maxWidth: "var(--container-inner)", marginInline: "auto" }}>
            <Eyebrow tone="accent" className="reveal-up" style={{ marginBottom: 16 }}>Layanan — Studio Services</Eyebrow>
            <h2 className="scrub-text-container" style={{ font: "var(--type-section-title)", color: "var(--neutral-ink)", maxWidth: 560, fontSize: "clamp(32px, 4vw, 56px)", lineHeight: 1.1, letterSpacing: "-0.02em" }}>
              {["Tiga", "bidang", "layanan,", "satu", "pendekatan", "sistem."].map((word, i) => (
                <span key={i} className="scrub-text-word" style={{ display: "inline-block", marginRight: "0.3em" }}>{word}</span>
              ))}
            </h2>
          </div>
        </div>

        {/* All 3 tiles — invisible by default except first (set via GSAP) */}
        <ServiceTile
          index={1} count={3} active={activeService} variant="magenta"
          title="Kreatif"
          imageSrc="/services/service 1.jpg"
          onSelect={setActiveService}
          description="Identitas visual, desain grafis, konten kreatif, dan strategi brand untuk organisasi dan komunitas yang ingin tampil berbeda."
          detail={SERVICE_DETAILS[0]}
          style={{ visibility: "hidden", opacity: 0 }}
        />
        <ServiceTile
          index={2} count={3} active={activeService} variant="teal"
          title="Analitik"
          imageSrc="/services/service 2.jpg"
          onSelect={setActiveService}
          description="Analisis data, riset pengguna, dan dashboard insight yang membantu organisasimu mengambil keputusan berdasarkan fakta."
          detail={SERVICE_DETAILS[1]}
          style={{ visibility: "hidden", opacity: 0 }}
        />
        <ServiceTile
          index={3} count={3} active={activeService} variant="olive"
          title="Digital"
          imageSrc="/services/service 3.jpg"
          onSelect={setActiveService}
          description="Pengembangan web, aplikasi, dan sistem digital yang mudah dipakai, berkelanjutan, dan sesuai kebutuhan nyata penggunanya."
          detail={SERVICE_DETAILS[2]}
          style={{ visibility: "hidden", opacity: 0 }}
        />

        {/* Spacer — gives the last tile scroll dwell time equal to the others */}
        <div style={{ height: "100vh" }} />

        {/* End sentinel — tiles pin UP TO here */}
        <div className="layered-pin-end" style={{ height: 1 }} />
      </section>

      {/* ═══════════════════════════════════════
          KARYA (project showcase) - MINIMALIST
      ════════════════════════════════════════ */}
      <section id="karya" className="section" style={{
        position: "relative",
        background: "var(--surface-cream)",
        paddingInline: "var(--gutter)",
        paddingBottom: "clamp(100px, 15vw, 160px)"
      }}>

        <div style={{ maxWidth: "var(--container-inner)", marginInline: "auto" }}>
          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "clamp(64px, 8vw, 100px)", flexWrap: "wrap", gap: 24 }}>
            <div>
              <Eyebrow tone="accent" className="reveal-up" style={{ marginBottom: 20 }}>Karya Pilihan — Selected Work</Eyebrow>
              <h2 className="reveal-up" style={{ font: "var(--type-section-title)", color: "var(--neutral-ink)", fontSize: "clamp(40px, 5.5vw, 72px)", lineHeight: 1.0, letterSpacing: "-0.02em" }}>
                Beberapa yang sudah<br />kami kerjakan.
              </h2>
            </div>
            <div className="reveal-up" style={{ display: "flex", gap: 10 }}>
              <Button variant="ghost" size="md" href="/karya">Lihat semua</Button>
              <IconButton variant="accent" size="md" href="/karya" ariaLabel="Lihat semua karya" />
            </div>
          </div>

          {/* Minimalist Interactive List */}
          <div className="karya-list-container" style={{ display: "flex", flexDirection: "column", borderTop: "1px solid rgba(0,0,0,0.12)" }}>
            {PORTFOLIO_STORIES.slice(0, 4).map((story, i) => (
              <Link
                href={`/karya/${story.slug}`}
                key={story.id}
                className="karya-list-item group md-karya-list"
                style={{
                  display: "grid",
                  gridTemplateColumns: "80px 1fr auto",
                  paddingBlock: "clamp(32px, 4vw, 56px)",
                  borderBottom: "1px solid rgba(0,0,0,0.12)",
                  textDecoration: "none",
                  alignItems: "center",
                  gap: 24,
                  position: "relative",
                }}
                onMouseEnter={() => setHoveredProject(i)}
                onMouseLeave={() => setHoveredProject(null)}
              >
                {/* Hover Background Reveal */}
                <div
                  style={{
                    position: "absolute", inset: 0, background: "rgba(0,0,0,0.02)", zIndex: 0,
                    transform: hoveredProject === i ? "scaleY(1)" : "scaleY(0)",
                    transformOrigin: hoveredProject === i ? "top" : "bottom",
                    transition: "transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
                  }}
                />

                <span style={{ position: "relative", zIndex: 1, fontSize: 16, color: "var(--text-muted)", fontFamily: "var(--font-mono, monospace)" }}>
                  {story.id}
                </span>

                <div style={{ position: "relative", zIndex: 1 }}>
                  <h3 style={{
                    margin: "0 0 12px 0",
                    fontSize: "clamp(28px, 3.5vw, 56px)",
                    fontWeight: 400,
                    color: "var(--neutral-ink)",
                    letterSpacing: "-0.03em",
                    transition: "transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), padding-left 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
                    paddingLeft: hoveredProject === i ? 24 : 0,
                  }}>
                    {story.client}
                  </h3>
                  <p style={{
                    margin: 0,
                    fontSize: "clamp(15px, 1.3vw, 18px)",
                    color: "var(--text-muted)",
                    transition: "padding-left 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
                    paddingLeft: hoveredProject === i ? 24 : 0,
                  }}>
                    {story.subtitle}
                  </p>
                </div>

                <div className="md-karya-arrow" style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", gap: 16 }}>
                  {/* Subtle Tags (only visible on desktop) */}
                  <div className="hidden md:flex" style={{ flexWrap: "wrap", gap: 8, justifyContent: "flex-end", maxWidth: 280, marginRight: 24 }}>
                    {story.tags.slice(0, 2).map(tag => (
                      <span key={tag} style={{ fontSize: 12, padding: "4px 12px", borderRadius: "100px", border: "1px solid rgba(0,0,0,0.15)", color: "var(--neutral-ink)", whiteSpace: "nowrap" }}>
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Animated Circular Arrow */}
                  <div style={{
                    width: 56, height: 56, borderRadius: "50%", background: "var(--neutral-ink)", color: "#fff",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    transform: hoveredProject === i ? "scale(1) rotate(-45deg)" : "scale(0) rotate(0deg)",
                    opacity: hoveredProject === i ? 1 : 0,
                    transition: "all 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
                  }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                      <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>


    </div>
  );
}
