"use client";
import * as React from "react";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/buttons/Button";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useRef } from "react";

export const GLOBAL_NAV_LINKS = [
  { id: "beranda", label: "Beranda", href: "/" },
  { id: "karya", label: "Karya", href: "/karya" },
  { id: "tentang", label: "Tentang", href: "/tentang" },
];

export interface NavbarProps {
  className?: string;
  style?: React.CSSProperties;
}

export function Navbar({ className, style }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const navRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    gsap.from(navRef.current, {
      y: -100,
      opacity: 0,
      duration: 1,
      ease: "power3.out",
      delay: 0.2
    });
  }, { scope: navRef });

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Theme mapping based on route
  const routeToThemeMap: Record<string, { bg: string; bgScrolled: string; border: string; fg: string; fgMuted: string }> = {
    "/": {
      bg: "transparent",
      bgScrolled: "rgba(255,248,243,0.85)", // Light cream
      border: "rgba(14,13,12,0.12)",
      fg: "var(--neutral-ink)",
      fgMuted: "var(--neutral-600)",
    },
    "/karya": {
      bg: "transparent",
      bgScrolled: "rgba(255,248,243,0.85)", // Cream
      border: "rgba(14,13,12,0.12)",
      fg: "var(--neutral-ink)",
      fgMuted: "var(--neutral-600)",
    },
    "/tentang": {
      bg: "transparent",
      bgScrolled: "rgba(247,245,241,0.9)", // Paper
      border: "rgba(14,13,12,0.12)",
      fg: "var(--neutral-ink)",
      fgMuted: "var(--neutral-600)",
    }
  };

  // Find exact or partial match for dynamic routes like /karya/[slug]
  return (
    <nav
      ref={navRef}
      className={`transition-all duration-300 ease-in-out mobile-bottom-nav ${className || ""}`}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
        padding: isScrolled ? "16px 24px" : "24px",
        pointerEvents: "none",
        zIndex: 99999, // Extra high z-index
        ...style,
      }}
    >
      <div
        className="mobile-nav-inner"
        style={{
          width: "100%",
          maxWidth: 900,
          height: 56,
          borderRadius: 100,
          background: "linear-gradient(rgba(45, 22, 10, 0.65), rgba(45, 22, 10, 0.65)) padding-box, radial-gradient(circle at 50% 0%, rgba(255, 130, 40, 0.6), rgba(255, 130, 40, 0.05)) border-box",
          border: "1px solid transparent",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 24px",
          color: "#F4F0EB",
          transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
          boxShadow: "0 20px 40px rgba(0,0,0,0.4), 0 1px 3px rgba(0,0,0,0.2)",
          pointerEvents: "auto",
        }}
      >
        {/* Logo Text (Left) */}
        <Link href="/" className="mobile-logo" style={{ display: "flex", alignItems: "center", textDecoration: "none", gap: 4 }}>
          <img src="/icons/lemma-logo.svg" alt="Logo" style={{ width: 28, height: 28, filter: "brightness(0) invert(1)" }} />
          <span className="mobile-logo-text hover:opacity-70" style={{
            fontFamily: "var('General Sans', sans-serif)",
            fontSize: 24,
            fontWeight: 500,
            color: "#F4F0EB",
            letterSpacing: 0.3,
            lineHeight: 1,
            transition: "opacity 0.3s ease",
          }}>
            Lemma
          </span>
        </Link>

        {/* Links, Lang & CTA (Right) */}
        <div className="mobile-right-panel" style={{ display: "flex", alignItems: "center", gap: 24 }}>
          {/* Navigation Links */}
          <ul className="nav-links" style={{ margin: 0, padding: 0, listStyle: "none" }}>
            {GLOBAL_NAV_LINKS.map((l) => {
              const isActive = pathname === l.href || (l.href !== "/" && pathname.startsWith(l.href));
              return (
                <li key={l.id} style={{ display: "flex", justifyContent: "center", alignItems: "center", position: "relative" }}>
                  <Link
                    href={l.href}
                    style={{
                      fontFamily: "var(--font-sans, 'General Sans', sans-serif)",
                      fontSize: 16,
                      fontWeight: 400,
                      color: isActive ? "#F4F0EB" : "rgba(244, 240, 235, 0.65)",
                      textDecoration: "none",
                      transition: "color 0.2s ease",
                    }}
                    className="hover:text-white"
                  >
                    {l.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="hidden md:block" style={{ width: 1, height: 16, background: "rgba(255,255,255,0.2)" }} />

          {/* Language Switcher */}
          <div className="hidden md:flex" style={{ display: "flex", gap: 8, alignItems: "center", fontSize: 20, fontFamily: "var(--font-sans, 'General Sans', sans-serif)", fontWeight: 500 }}>
            <button style={{ background: "none", border: "none", color: "#F4F0EB", cursor: "pointer", padding: 0, transition: "opacity 0.2s ease" }} className="hover:opacity-70">ID</button>
            <span style={{ color: "rgba(255,255,255,0.3)" }}>/</span>
            <button style={{ background: "none", border: "none", color: "rgba(255,255,255,0.4)", cursor: "pointer", padding: 0, transition: "opacity 0.2s ease" }} className="hover:opacity-70">EN</button>
          </div>

          {/* WhatsApp Button */}
          <a
            href="https://wa.me/6281234567890"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:bg-white/20 group mobile-wa-btn"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "8px 16px",
              borderRadius: 16,
              background: "rgba(255, 255, 255, 1)",
              border: "1px solid rgba(255,255,255,0.15)",
              color: "#F4F0EB",
              textDecoration: "none",
              fontSize: 12,
              fontWeight: 500,
              fontFamily: "var(--font-sans, 'General Sans', sans-serif)",
              transition: "all 0.3s ease"
            }}
          >
            <span style={{ color: "var(--neutral-ink)" }} className="mobile-wa-text">WhatsApp</span>
            <div
              className="mobile-wa-icon flex items-center justify-center overflow-hidden transition-all duration-300 ease-out w-0 opacity-0 group-hover:w-4 group-hover:opacity-100 group-hover:ml-1.5"
            >
              <svg
                className="transform -rotate-45 group-hover:rotate-0 transition-transform duration-300 ease-out"
                width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--neutral-ink)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
              >
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </div>
          </a>
        </div>
      </div>

      {/* Basic Media Queries */}
      <style dangerouslySetInnerHTML={{
        __html: `
        .nav-links {
          display: flex;
          gap: 28px;
        }
        @media (max-width: 767px) {
          .mobile-bottom-nav {
            top: auto !important;
            bottom: 0 !important;
            padding: 12px !important;
            padding-bottom: 24px !important;
          }
          .mobile-nav-inner {
            padding: 0 12px !important;
            gap: 12px !important;
          }
          .mobile-logo-text { display: none !important; }
          .mobile-right-panel {
            gap: 12px !important;
            flex: 1 !important;
            justify-content: space-between !important;
          }
          .nav-links {
            gap: 16px !important;
            flex: 1 !important;
            justify-content: center !important;
          }
          .nav-links a {
            font-size: 14px !important;
          }
          .mobile-wa-text { display: none !important; }
          .mobile-wa-btn {
            padding: 0 !important;
            width: 36px !important;
            height: 36px !important;
            border-radius: 50% !important;
            min-width: 36px !important;
          }
          .mobile-wa-icon {
            width: auto !important;
            opacity: 1 !important;
            margin: 0 !important;
          }
          .mobile-wa-icon svg {
            transform: rotate(0) !important;
            width: 18px !important;
            height: 18px !important;
          }
        }
        @media (min-width: 768px) {
          .md\\:flex { display: flex !important; }
          .md\\:hidden { display: none !important; }
          .md\\:block { display: block !important; }
        }
      `}} />
    </nav>
  );
}
