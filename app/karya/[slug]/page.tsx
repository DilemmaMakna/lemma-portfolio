"use client";
import React, { useRef, use } from "react";
import { notFound } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Link from "next/link";
import { Navbar } from "@/components/navigation/Navbar";
import { PORTFOLIO_STORIES } from "@/app/data/portfolio";
import { Eyebrow } from "@/components/feedback/Eyebrow";

gsap.registerPlugin(ScrollTrigger);

export default function KaryaDetailSlug({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const story = PORTFOLIO_STORIES.find((s) => s.slug === resolvedParams.slug);
  
  if (!story) return notFound();

  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      
      // Hero Animation - Title scales down and fades in
      gsap.fromTo(".hero-title", 
        { y: 100, opacity: 0, scale: 1.1, transformOrigin: "left bottom" },
        { y: 0, opacity: 1, scale: 1, duration: 1.2, ease: "power4.out" }
      );
      
      gsap.from(".hero-meta > *", {
        y: 20, opacity: 0, stagger: 0.1, duration: 0.8, ease: "power3.out", delay: 0.4
      });

      // Metrics animation
      gsap.from(".metric-item", {
        y: 40, opacity: 0, stagger: 0.1, duration: 1, ease: "power4.out", delay: 0.6
      });

      // Pin the section titles on the left while content scrolls on the right
      gsap.utils.toArray<HTMLElement>(".content-section").forEach((section) => {
        const title = section.querySelector(".section-title-col");
        if (title) {
          ScrollTrigger.create({
            trigger: section,
            start: "top 20%",
            end: "bottom 80%",
            pin: title,
            pinSpacing: false,
          });
        }

        // Reveal content text
        const contents = section.querySelectorAll(".reveal-text");
        gsap.fromTo(contents, 
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: "power3.out", 
            scrollTrigger: {
              trigger: section,
              start: "top 70%",
            }
          }
        );
      });

      // Parallax images
      gsap.utils.toArray<HTMLElement>(".parallax-img").forEach((img, i) => {
        gsap.fromTo(img, 
          { y: -30, opacity: 0, scale: 0.9 },
          { y: 30, opacity: 1, scale: 1, ease: "none",
            scrollTrigger: {
              trigger: img,
              start: "top 95%",
              end: "bottom 0%",
              scrub: true,
            }
          }
        );
      });

    });
    return () => mm.revert();
  }, { scope: containerRef });

  return (
    <div ref={containerRef} style={{ background: "var(--surface-paper)", minHeight: "100vh" }}>


      {/* Back button */}
      <div style={{ position: "fixed", top: 100, left: "var(--gutter)", zIndex: 100 }}>
        <Link href="/karya" style={{ display: "inline-flex", alignItems: "center", gap: 8, textDecoration: "none", color: "var(--neutral-ink)", fontWeight: 500, fontSize: 14, padding: "8px 16px", borderRadius: 40, background: "rgba(255,255,255,0.8)", backdropFilter: "blur(8px)", border: "1px solid var(--border-hairline)", transition: "all 0.2s" }} className="hover:scale-105">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          Kembali
        </Link>
      </div>

      <div style={{ paddingInline: "var(--gutter)", paddingTop: 200, paddingBottom: 160 }}>
        <div style={{ maxWidth: "var(--container-inner)", marginInline: "auto" }}>
          
          {/* HERO */}
          <div style={{ marginBottom: 120 }}>
            <div className="hero-meta" style={{ display: "flex", gap: 16, marginBottom: 24, alignItems: "center" }}>
              <span style={{ fontSize: 16, fontWeight: 500, color: "var(--text-muted)" }}>{story.id}</span>
              <div style={{ width: 40, height: 1, background: "var(--text-muted)", opacity: 0.3 }} />
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                {story.tags.map(tag => (
                  <span key={tag} style={{ fontSize: 13, padding: "4px 12px", border: "1px solid var(--border-hairline)", borderRadius: 20 }}>{tag}</span>
                ))}
              </div>
            </div>
            
            <h1 className="hero-title" style={{ font: "var(--type-hero)", fontSize: "clamp(48px, 6vw, 90px)", lineHeight: 1.05, letterSpacing: "-0.02em", color: "var(--neutral-ink)", marginBottom: 32, maxWidth: 1000 }}>
              {story.client}
            </h1>
            
            <p className="hero-meta" style={{ fontSize: "clamp(18px, 2vw, 24px)", color: "var(--text-muted)", maxWidth: 640, lineHeight: 1.4 }}>
              {story.subtitle}
            </p>
          </div>

          {/* METRICS SECTION */}
          {story.metrics && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 32, marginBottom: 120, borderTop: "1px solid var(--border-hairline)", paddingTop: 48 }}>
              {story.metrics.map((metric, i) => (
                <div key={i} className="metric-item">
                  <div style={{ font: "var(--type-hero)", fontSize: "clamp(48px, 6vw, 64px)", color: "var(--neutral-ink)", lineHeight: 1, marginBottom: 8 }}>
                    {metric.value}
                  </div>
                  <div style={{ fontSize: 16, color: "var(--text-muted)", fontWeight: 500, letterSpacing: "0.02em" }}>
                    {metric.label}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* MAIN IMAGE SPREAD (Asymmetrical Parallax Grid) */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(24px, 4vw, 48px)", marginBottom: 160, alignItems: "start" }}>
            {Array.from({ length: story.imageCount }).map((_, idx) => (
              <div 
                key={idx} 
                className="parallax-img" 
                style={{ 
                  aspectRatio: idx % 3 === 0 ? "4/5" : "16/9", 
                  background: "var(--surface-cream)",
                  border: "1px dashed var(--border-strong)",
                  borderRadius: 16,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "var(--text-muted)",
                  marginTop: idx === 1 ? 120 : 0, // offset for asymmetrical look
                  gridColumn: story.imageCount === 1 ? "1 / -1" : (idx === 2 ? "1 / -1" : "auto")
                }}
              >
                [Placeholder {idx + 1}]
              </div>
            ))}
          </div>

          {/* CONTENT SECTIONS WITH PINNING */}
          <div style={{ display: "flex", flexDirection: "column", gap: 120 }}>
            {story.sections.map((sec, idx) => (
              <div key={idx} className="content-section" style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 64, position: "relative" }}>
                
                {/* Left Column - Pinned Title */}
                <div className="section-title-col" style={{ alignSelf: "start" }}>
                  <Eyebrow tone="accent" style={{ marginBottom: 16 }}>0{idx + 1}</Eyebrow>
                  <h2 style={{ font: "var(--type-section-title)", fontSize: "clamp(24px, 3vw, 40px)", margin: 0, color: "var(--neutral-ink)" }}>
                    {sec.title}
                  </h2>
                </div>

                {/* Right Column - Scrolling Content */}
                <div style={{ fontSize: "clamp(16px, 1.2vw, 20px)", lineHeight: 1.8, color: "var(--text-muted)", paddingTop: 8 }}>
                  {sec.content.split('\n').map((line, i) => {
                    if (line.startsWith('- ')) {
                      return <li key={i} className="reveal-text" style={{ marginBlock: 8, paddingLeft: 8 }}>{line.substring(2)}</li>;
                    }
                    if (line.trim() === '') return <br key={i} />;
                    return <p key={i} className="reveal-text" style={{ marginBlock: 16 }}>{line}</p>;
                  })}
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
      
      {/* NEXT PROJECT FOOTER */}
      {/* Assuming chronological flow for simple prev/next logic */}
      <div style={{ paddingBlock: 100, borderTop: "1px solid var(--border-hairline)", background: "var(--surface-cream)", textAlign: "center" }}>
        <Eyebrow tone="warm" style={{ marginBottom: 24, justifyContent: "center" }}>Jelajahi Lebih Lanjut</Eyebrow>
        <h2 style={{ font: "var(--type-hero)", fontSize: "clamp(32px, 4vw, 56px)", margin: "0 0 32px 0", color: "var(--neutral-ink)" }}>
          Lihat karya kami<br/>yang lain.
        </h2>
        <Link href="/karya" style={{ display: "inline-block", padding: "16px 32px", background: "var(--neutral-ink)", color: "var(--text-on-dark)", textDecoration: "none", borderRadius: 40, fontSize: 16, fontWeight: 500, transition: "transform 0.2s" }} className="hover:scale-105">
          Kembali ke Indeks
        </Link>
      </div>

    </div>
  );
}
