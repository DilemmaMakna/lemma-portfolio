"use client";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

/**
 * Hero entrance timeline:
 * "Digital" → HaloCard → "Partner" → stats stagger
 */
export function useHeroAnimation() {
  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const tl = gsap.timeline({ defaults: { ease: "expo.out", duration: 0.9 } });
      tl.from(".hero-eyebrow", { y: 20, opacity: 0, duration: 0.5 })
        .from(".hero-digital", { y: 80, opacity: 0 }, "-=0.3")
        .from(".hero-halo", { scale: 0.82, opacity: 0, rotate: 6 }, "-=0.55")
        .from(".hero-partner", { y: 80, opacity: 0 }, "-=0.65")
        .from(".hero-stats > *", { y: 20, opacity: 0, stagger: 0.1 }, "-=0.5")
        .from(".hero-cta", { y: 16, opacity: 0, stagger: 0.08 }, "-=0.4");
    });
    return () => mm.revert();
  });
}
