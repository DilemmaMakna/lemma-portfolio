"use client";
import React from "react";
import { Eyebrow } from "@/components/feedback/Eyebrow";
import { Button } from "@/components/buttons/Button";
import { IconButton } from "@/components/buttons/IconButton";
import { BarrelBackdrop } from "@/components/sections/BarrelBackdrop";
import { GLOBAL_NAV_LINKS } from "@/components/navigation/Navbar";

export function Footer() {
  return (
    <footer id="kontak" className="footer-section" style={{
      position: "relative",
      background: "radial-gradient(53.85% 70.71% at 50% 50%, #D76300 43.81%, #D72F00 100%)",
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column"
    }}>
      {/* Background */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: "url('/barrel-pattern.svg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          mixBlendMode: "screen",
          opacity: 0.05
        }}
      />

      {/* CTA block */}
      <div style={{ paddingInline: "var(--gutter)", paddingTop: 100, paddingBottom: 60 }}>
        <div style={{ maxWidth: "var(--container-inner)", marginInline: "auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center" }}>
            <div>
              <Eyebrow tone="warm" style={{ marginBottom: 20 }}>Mulai Kolaborasi</Eyebrow>
              <h2 style={{ font: "var(--type-section-title)", color: "#fff", fontSize: "clamp(28px, 3vw, 48px)", marginBottom: 20 }}>
                Ada proyek yang<br />ingin kamu wujudkan?
              </h2>
              <p style={{ color: "rgba(255,255,255,0.75)", font: "var(--type-body)", marginBottom: 36, maxWidth: 440 }}>
                Ceritakan proyekmu — kami akan balas dalam 1×24 jam. Tidak ada komitmen di tahap awal, hanya percakapan yang jujur.
              </p>
              <div style={{ display: "flex", gap: 12 }}>
                <Button variant="deep" size="lg" href="https://wa.me/6282297477878" style={{ textDecoration: "none" }}>
                  Hubungi via WhatsApp
                </Button>
                <IconButton variant="deep" size="lg" href="https://www.instagram.com/lemma.bercerita" ariaLabel="Instagram Lemma" />
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {[
                { label: "WhatsApp", value: "+62 822-9747-7878", href: "https://wa.me/6282297477878" },
                { label: "Instagram", value: "@lemma.bercerita", href: "https://www.instagram.com/lemma.bercerita" },
                { label: "Berbasis di", value: "Bogor — IPB University", href: "#" },
              ].map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  style={{
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    paddingBlock: 18, borderBottom: "1px solid rgba(255,255,255,0.12)",
                    textDecoration: "none", color: "inherit",
                    transition: "opacity var(--duration-fast) var(--ease-out)",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.7")}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                >
                  <span style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", letterSpacing: "0.08em", textTransform: "uppercase" }}>{item.label}</span>
                  <span style={{ fontSize: 16, fontWeight: 400, color: "#fff" }}>{item.value}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      <BarrelBackdrop opacity={0.22} style={{ mixBlendMode: "screen" }} />

      {/* Spacer to push wordmark and bottom bar down */}
      <div style={{ flexGrow: 1 }} />

      {/* Oversized wordmark with Spotlight Glow */}
      <div style={{ position: "relative", overflow: "hidden", height: 200, display: "flex", justifyContent: "center" }}>
        {/* Base text (dim) */}
        <div
          style={{
            fontSize: "clamp(100px, 18vw, 240px)",
            fontWeight: 500,
            color: "rgba(255, 255, 255, 0.35)",
            lineHeight: 1,
            paddingInline: "var(--gutter)",
            whiteSpace: "nowrap",
            userSelect: "none",
            cursor: "default"
          }}
        >
          Lemma
        </div>

        {/* Highlight text (bright + glow) masked by mouse position */}
        <div
          onMouseMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            e.currentTarget.style.setProperty('--x', `${x}px`);
            e.currentTarget.style.setProperty('--y', `${y}px`);
          }}
          onMouseEnter={(e) => e.currentTarget.style.setProperty('--opacity', '1')}
          onMouseLeave={(e) => e.currentTarget.style.setProperty('--opacity', '0')}
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            justifyContent: "center",
            fontSize: "clamp(100px, 18vw, 240px)",
            fontWeight: 500,
            color: "rgba(255, 255, 255, 0.9)",
            lineHeight: 1,
            paddingInline: "var(--gutter)",
            whiteSpace: "nowrap",
            userSelect: "none",
            cursor: "default",
            textShadow: "0 0 40px rgba(255, 255, 255, 0.5), 0 0 80px rgba(255, 255, 255, 0.3)",
            WebkitMaskImage: "radial-gradient(circle 250px at var(--x, 50%) var(--y, 50%), black 0%, transparent 100%)",
            maskImage: "radial-gradient(circle 250px at var(--x, 50%) var(--y, 50%), black 0%, transparent 100%)",
            opacity: "var(--opacity, 0)",
            transition: "opacity 0.4s ease",
          }}
        >
          Lemma
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{
        paddingInline: "var(--gutter)", paddingBlock: 24,
        borderTop: "1px solid rgba(255,255,255,0.1)",
        display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16,
      }}>
        <span style={{ fontSize: 14, color: "rgba(255,255,255,0.45)" }}>© 2025 Lemma. Masih di sini. Masih bermakna..</span>
        <div style={{ display: "flex", gap: 24 }}>
          {GLOBAL_NAV_LINKS.map((l) => (
            <a key={l.id} href={l.href} style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", textDecoration: "none", transition: "color var(--duration-fast)" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.5)")}
            >
              {l.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
