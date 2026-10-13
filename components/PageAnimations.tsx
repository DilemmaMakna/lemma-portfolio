"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP, reducedMotion } from "@/lib/gsap";

// Scroll reveal global: [data-reveal], [data-reveal="title"], [data-rule].
export default function PageAnimations({ children }: { children: React.ReactNode }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const fades = gsap.utils.toArray<HTMLElement>('[data-reveal]:not([data-reveal="title"])');
        fades.forEach((el) => {
          gsap.from(el, {
            opacity: 0,
            y: 24,
            duration: 1,
            ease: "expo.out",
            scrollTrigger: { trigger: el, start: "top 85%", toggleActions: "play none none none" },
          });
        });

        gsap.utils.toArray<HTMLElement>('[data-reveal="title"]').forEach((el) => {
          gsap.fromTo(
            el,
            { clipPath: "inset(0 0 105% 0)", y: 36 },
            {
              clipPath: "inset(-10% 0 -10% 0)",
              y: 0,
              duration: 1.1,
              ease: "expo.out",
              scrollTrigger: { trigger: el, start: "top 88%", toggleActions: "play none none none" },
            },
          );
        });

        gsap.utils.toArray<HTMLElement>("[data-rule]").forEach((el) => {
          gsap.from(el, {
            scaleX: 0,
            transformOrigin: "left center",
            duration: 1.4,
            ease: "expo.out",
            scrollTrigger: { trigger: el, start: "top 90%", toggleActions: "play none none none" },
          });
        });
      });

      const refresh = () => ScrollTrigger.refresh();
      window.addEventListener("load", refresh);
      return () => window.removeEventListener("load", refresh);
    },
    { scope: root },
  );

  void reducedMotion;
  return <div ref={root}>{children}</div>;
}
