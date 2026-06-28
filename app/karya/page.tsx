"use client";
import React, { useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Link from "next/link";
import { Eyebrow } from "@/components/feedback/Eyebrow";
import { PORTFOLIO_STORIES } from "@/app/data/portfolio";

gsap.registerPlugin(ScrollTrigger);

export default function KaryaIndex() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      // Intro sequence
      const tl = gsap.timeline();
      tl.from(".karya-hero-text", {
        y: 60,
        opacity: 0,
        duration: 1,
        stagger: 0.15,
        ease: "expo.out",
      });

      // Staggered list items
      tl.from(".karya-list-item", {
        y: 80,
        opacity: 0,
        duration: 1,
        stagger: 0.08,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".karya-list-container",
          start: "top 80%",
        },
      }, "-=0.4");
    });
    return () => mm.revert();
  }, { scope: containerRef });

  return (
    <div ref={containerRef} style={{ background: "var(--surface-cream)", minHeight: "100vh", paddingBottom: 120 }}>


      {/* Hero */}
      <div style={{ paddingTop: 200, paddingBottom: 100, paddingInline: "var(--gutter)" }}>
        <div style={{ maxWidth: "var(--container-inner)", marginInline: "auto" }}>
          <Eyebrow tone="accent" className="karya-hero-text" style={{ marginBottom: 24 }}>Archive & Works</Eyebrow>
          <h1 className="karya-hero-text" style={{ font: "var(--type-hero)", fontSize: "clamp(60px, 8vw, 120px)", lineHeight: 0.9, letterSpacing: "-0.03em", color: "var(--neutral-ink)", margin: 0 }}>
            Our <span style={{ fontStyle: "italic", fontWeight: 400, color: "var(--text-muted)" }}>Selected</span>
            <br />Portfolio
          </h1>
        </div>
      </div>

      {/* Index List */}
      <div className="karya-list-container" style={{ maxWidth: "var(--container-inner)", marginInline: "auto", paddingInline: "var(--gutter)" }}>
        <div style={{ borderTop: "1px solid var(--border-hairline)", display: "flex", flexDirection: "column" }}>
          {PORTFOLIO_STORIES.map((story, i) => (
            <Link 
              href={`/karya/${story.slug}`} 
              key={story.id}
              className="karya-list-item group md-karya-list"
              style={{ 
                textDecoration: "none", 
                color: "inherit",
                display: "grid",
                gridTemplateColumns: "80px 1fr auto",
                alignItems: "center",
                paddingBlock: "clamp(32px, 4vw, 48px)",
                borderBottom: "1px solid var(--border-hairline)",
                position: "relative",
              }}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* Background Hover Element */}
              <div 
                style={{
                  position: "absolute", inset: 0, background: "var(--surface-tile)", zIndex: 0,
                  transform: hoveredIndex === i ? "scaleY(1)" : "scaleY(0)",
                  transformOrigin: hoveredIndex === i ? "top" : "bottom",
                  transition: "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
                }}
              />
              
              <div style={{ position: "relative", zIndex: 1, fontSize: 18, color: "var(--text-muted)" }}>{story.id}</div>
              
              <div style={{ position: "relative", zIndex: 1 }}>
                <h2 style={{ 
                  margin: 0, 
                  fontSize: "clamp(24px, 3vw, 40px)", 
                  fontWeight: 500, 
                  color: "var(--neutral-ink)",
                  transition: "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), padding-left 0.4s",
                  paddingLeft: hoveredIndex === i ? 24 : 0,
                }}>
                  {story.client}
                </h2>
                <div style={{ 
                  marginTop: 8, 
                  fontSize: 15, 
                  color: "var(--text-muted)",
                  transition: "padding-left 0.4s",
                  paddingLeft: hoveredIndex === i ? 24 : 0,
                }}>
                  {story.subtitle}
                </div>
              </div>
              
              <div className="md-karya-arrow" style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{ 
                  width: 48, height: 48, borderRadius: "50%", background: "var(--neutral-ink)", color: "var(--text-on-dark)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  transform: hoveredIndex === i ? "scale(1) rotate(-45deg)" : "scale(0)",
                  transition: "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
                }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
