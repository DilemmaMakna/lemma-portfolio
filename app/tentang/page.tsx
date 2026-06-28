"use client";
import React, { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Link from "next/link";
import { Eyebrow } from "@/components/feedback/Eyebrow";

gsap.registerPlugin(ScrollTrigger);

const AXIOMS = [
  {
    title: "Struktur adalah kebebasan.",
    desc: "Sistem yang baik bukan penjara — ia adalah landasan yang membuat eksperimen berani jadi mungkin."
  },
  {
    title: "Makna sebelum metode.",
    desc: "Sebelum bertanya bagaimana, kami bertanya mengapa — dan kami tidak berhenti di jawaban pertama."
  },
  {
    title: "Bagian kecil menopang keseluruhan.",
    desc: "Seperti lemma dalam matematika, setiap detail dalam sebuah proyek punya peran struktural. Tidak ada yang dekoratif semata."
  }
];

export default function TentangPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const horizontalRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      
      // Hero entrance
      gsap.from(".hero-split-text", {
        y: 120,
        opacity: 0,
        rotation: 4,
        duration: 1.2,
        stagger: 0.1,
        ease: "power4.out",
      });

      gsap.from(".hero-subtext", {
        opacity: 0,
        duration: 1.5,
        delay: 0.8,
        ease: "power2.out",
      });

      // Pin the giant quote
      ScrollTrigger.create({
        trigger: ".quote-section",
        start: "top top",
        end: "+=150%",
        pin: true,
        scrub: 1,
      });

      // Fade up quote words on scroll
      const quoteWords = gsap.utils.toArray<HTMLElement>(".quote-word");
      gsap.set(quoteWords, { opacity: 0.1, y: 20 });
      gsap.to(quoteWords, {
        opacity: 1,
        y: 0,
        stagger: 0.5,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".quote-section",
          start: "top top",
          end: "+=100%",
          scrub: 1,
        }
      });

      // Horizontal scroll for Axioms
      const horizontalEl = horizontalRef.current;
      if (horizontalEl) {
        gsap.to(".horizontal-item", {
          xPercent: -100 * (AXIOMS.length - 1),
          ease: "none",
          scrollTrigger: {
            trigger: horizontalEl,
            start: "top top",
            end: "+=200%", // 2 viewport heights to scrub through
            pin: true,
            scrub: 1,
            snap: 1 / (AXIOMS.length - 1),
          }
        });
      }

      // Parallax for Venture Studio split
      gsap.fromTo(".vs-col-right", 
        { y: 150 },
        { y: -150, ease: "none",
          scrollTrigger: {
            trigger: ".vs-section",
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          }
        }
      );

      // Stagger reveal for capabilities
      gsap.from(".cap-item", {
        scale: 0.8,
        opacity: 0,
        stagger: 0.1,
        duration: 0.8,
        ease: "back.out(1.7)",
        scrollTrigger: {
          trigger: ".cap-grid",
          start: "top 80%",
        }
      });

    });
    return () => mm.revert();
  }, { scope: containerRef });

  return (
    <div ref={containerRef} style={{ background: "var(--surface-paper)", minHeight: "100vh", overflowX: "hidden" }}>


      {/* Back to Home Button */}
      <div style={{ position: "fixed", top: 100, left: "var(--gutter)", zIndex: 100 }}>
        <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 8, textDecoration: "none", color: "var(--neutral-ink)", fontWeight: 500, fontSize: 14, padding: "8px 16px", borderRadius: 40, background: "rgba(255,255,255,0.8)", backdropFilter: "blur(8px)", border: "1px solid var(--border-hairline)", transition: "all 0.2s" }} className="hover:scale-105">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          Beranda
        </Link>
      </div>

      {/* HERO SECTION */}
      <section style={{ height: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", paddingInline: "var(--gutter)" }}>
        <div style={{ maxWidth: "var(--container-inner)", marginInline: "auto", width: "100%" }}>
          <Eyebrow tone="accent" style={{ marginBottom: 32 }} className="hero-subtext">PT Masih Dilemma Makna</Eyebrow>
          <h1 style={{ font: "var(--type-hero)", fontSize: "clamp(60px, 10vw, 160px)", lineHeight: 0.9, letterSpacing: "-0.04em", color: "var(--neutral-ink)", margin: 0, display: "flex", flexDirection: "column" }}>
            <div style={{ overflow: "hidden" }}><span className="hero-split-text" style={{ display: "block" }}>Creative-</span></div>
            <div style={{ overflow: "hidden" }}><span className="hero-split-text" style={{ display: "block", fontStyle: "italic", fontWeight: 400, color: "var(--text-muted)" }}>first,</span></div>
            <div style={{ overflow: "hidden" }}><span className="hero-split-text" style={{ display: "block" }}>System-</span></div>
            <div style={{ overflow: "hidden" }}><span className="hero-split-text" style={{ display: "block" }}>Oriented.</span></div>
          </h1>
          <p className="hero-subtext" style={{ font: "var(--type-lead)", color: "var(--text-muted)", maxWidth: 540, marginTop: 48 }}>
            Venture studio berbasis di Jakarta yang bergerak di persimpangan desain, teknologi, dan sistem. Kami bukan agensi biasa.
          </p>
        </div>
      </section>

      {/* BIG QUOTE PINNED SECTION */}
      <section className="quote-section" style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--surface-cream)", paddingInline: "var(--gutter)" }}>
        <h2 style={{ font: "var(--type-section-title)", fontSize: "clamp(32px, 5vw, 72px)", maxWidth: 1200, textAlign: "center", lineHeight: 1.2, margin: 0, color: "var(--neutral-ink)" }}>
          {/* We break the text into words for stagger reveal */}
          {["Lemma", "adalah", "fondasi", "yang", "tidak", "terlihat", "dari", "teorema", "yang", "bersinar."].map((word, i) => (
            <span key={i} className="quote-word" style={{ display: "inline-block", marginRight: "0.3em" }}>
              {word === "Lemma" ? <span style={{ fontStyle: "italic", color: "var(--text-muted)", fontWeight: 400 }}>Lemma</span> : word}
            </span>
          ))}
        </h2>
      </section>

      {/* HORIZONTAL SCROLL: AXIOMS */}
      <section ref={horizontalRef} style={{ height: "100vh", overflow: "hidden", display: "flex", alignItems: "center", background: "var(--neutral-ink)", color: "var(--text-on-dark)" }}>
        <div style={{ paddingInline: "var(--gutter)", position: "absolute", top: 60, left: 0 }}>
          <Eyebrow tone="warm" style={{ opacity: 0.7 }}>Tiga Aksioma Operasional</Eyebrow>
        </div>
        <div style={{ display: "flex", width: `${AXIOMS.length * 100}vw` }}>
          {AXIOMS.map((axiom, i) => (
            <div key={i} className="horizontal-item" style={{ width: "100vw", display: "flex", flexDirection: "column", justifyContent: "center", paddingInline: "clamp(24px, 10vw, 120px)" }}>
              <div style={{ fontSize: "clamp(100px, 15vw, 240px)", font: "var(--type-hero)", lineHeight: 1, opacity: 0.1, color: "var(--text-on-dark)", position: "absolute", zIndex: 0, top: "50%", transform: "translateY(-50%)" }}>
                0{i + 1}
              </div>
              <div style={{ position: "relative", zIndex: 1, maxWidth: 800 }}>
                <h3 style={{ font: "var(--type-section-title)", fontSize: "clamp(40px, 6vw, 80px)", marginBottom: 32, lineHeight: 1.1 }}>{axiom.title}</h3>
                <p style={{ font: "var(--type-lead)", color: "var(--text-on-dark)", opacity: 0.7, fontSize: "clamp(20px, 2vw, 28px)" }}>{axiom.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* VENTURE STUDIO MODEL: ASYMMETRICAL PARALLAX */}
      <section className="vs-section" style={{ paddingBlock: 200, paddingInline: "var(--gutter)", background: "var(--surface-paper)" }}>
        <div style={{ maxWidth: "var(--container-inner)", marginInline: "auto" }}>
          <div style={{ marginBottom: 120, textAlign: "center" }}>
            <Eyebrow tone="accent" style={{ marginBottom: 24, justifyContent: "center" }}>Model Bisnis</Eyebrow>
            <h2 style={{ font: "var(--type-hero)", fontSize: "clamp(40px, 5vw, 72px)", color: "var(--neutral-ink)", margin: 0 }}>Venture Studio</h2>
            <p style={{ font: "var(--type-body)", color: "var(--text-muted)", maxWidth: 600, marginInline: "auto", marginTop: 24, fontSize: 18 }}>
              Kami beroperasi dengan dua jalur yang saling memperkuat. Proyek klien menjadi sumber stabil dan lab uji, sementara produk internal membangun nilai mandiri.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))", gap: 40 }}>
            {/* Left Col - Client Work */}
            <div style={{ background: "var(--surface-cream)", padding: "clamp(40px, 5vw, 64px)", borderRadius: 24, border: "1px solid var(--border-hairline)" }}>
              <div style={{ fontSize: 14, textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 600, color: "var(--text-muted)", marginBottom: 48 }}>Jalur 1 — Revenue Engine</div>
              <h3 style={{ font: "var(--type-section-title)", fontSize: 32, marginBottom: 24, color: "var(--neutral-ink)" }}>Client Work</h3>
              <p style={{ color: "var(--text-muted)", lineHeight: 1.7, fontSize: 16 }}>
                Lemma mengerjakan proyek untuk klien eksternal: brand, organisasi, institusi, dan bisnis yang membutuhkan sistem digital, identitas visual, dan solusi teknologi yang tidak sekadar indah — tapi berfungsi secara struktural. 
              </p>
            </div>

            {/* Right Col - Internal Products (Parallax applied) */}
            <div className="vs-col-right" style={{ background: "var(--neutral-ink)", color: "var(--text-on-dark)", padding: "clamp(40px, 5vw, 64px)", borderRadius: 24 }}>
              <div style={{ fontSize: 14, textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 600, color: "rgba(255,255,255,0.5)", marginBottom: 48 }}>Jalur 2 — Value Builder</div>
              <h3 style={{ font: "var(--type-section-title)", fontSize: 32, marginBottom: 24 }}>Internal Products</h3>
              <p style={{ color: "var(--text-on-dark)", opacity: 0.8, lineHeight: 1.7, fontSize: 16 }}>
                Paralel dengan project work, Lemma membangun produk digital internal dari riset, bukan asumsi. Kami menginkubasinya di dalam studio lalu meluncurkannya sebagai entitas mandiri (contoh: NATA, ARAH AI).
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CAPABILITIES STAGGERED GRID */}
      <section style={{ paddingBlock: 120, paddingInline: "var(--gutter)", background: "var(--surface-cream)" }}>
        <div style={{ maxWidth: "var(--container-inner)", marginInline: "auto" }}>
          <Eyebrow tone="accent" style={{ marginBottom: 40 }}>Kapabilitas</Eyebrow>
          <div className="cap-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 24 }}>
            {[
              { domain: "Brand & Visual Identity", desc: "Sistem logo, filosofi visual, panduan identitas" },
              { domain: "Digital Product Design", desc: "UI/UX, design system, prototipe interaktif" },
              { domain: "Engineering & Tech", desc: "Web app, SaaS platform, ERP, sistem data" },
              { domain: "AI & Data", desc: "Recommender system, RAG pipeline, analitik" },
              { domain: "Strategy & Systems", desc: "Arsitektur informasi, OKR, dokumentasi" }
            ].map((cap, i) => (
              <div key={i} className="cap-item" style={{ background: "var(--surface-card)", padding: 32, borderRadius: 16, border: "1px solid var(--border-hairline)", boxShadow: "0 10px 30px rgba(0,0,0,0.02)" }}>
                <h4 style={{ fontSize: 20, fontWeight: 500, color: "var(--neutral-ink)", marginBottom: 12 }}>{cap.domain}</h4>
                <p style={{ fontSize: 15, color: "var(--text-muted)", lineHeight: 1.6, margin: 0 }}>{cap.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CLOSING STATEMENT */}
      <section style={{ paddingBlock: 200, paddingInline: "var(--gutter)", textAlign: "center", background: "var(--grad-orange-radial)", color: "var(--text-on-orange)", position: "relative", overflow: "hidden" }}>
        
        {/* Abstract shapes in background */}
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "150%", height: "150%", background: "radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)", zIndex: 0 }} />

        <div style={{ position: "relative", zIndex: 1, maxWidth: 800, marginInline: "auto" }}>
          <h2 style={{ font: "var(--type-hero)", fontSize: "clamp(48px, 6vw, 80px)", lineHeight: 1.1, marginBottom: 48 }}>
            Apa yang sedang kamu<br/>coba buktikan?
          </h2>
          <p style={{ font: "var(--type-lead)", fontSize: 20, opacity: 0.8, marginBottom: 56 }}>
            Klien tidak datang ke Lemma untuk membeli output. Mereka datang untuk membangun sesuatu yang belum ada bentuknya.
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: 16 }}>
            <Link href="https://wa.me/6282297477878" style={{ padding: "16px 32px", background: "var(--surface-page)", color: "var(--text-accent)", fontWeight: 600, borderRadius: 40, textDecoration: "none" }} className="hover:scale-105 transition-transform">
              Mulai Kolaborasi
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
