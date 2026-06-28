"use client";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Applies a fade-up ScrollTrigger reveal to all `.reveal-up` elements
 * within the given container ref.
 */
export function useRevealUp(containerRef: React.RefObject<HTMLElement | null>) {
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const els = gsap.utils.toArray<HTMLElement>(".reveal-up");
        els.forEach((el) => {
          gsap.fromTo(
            el,
            { y: 32, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.68,
              ease: "power3.out",
              scrollTrigger: {
                trigger: el,
                start: "top 82%",
                toggleActions: "play none none none",
              },
            }
          );
        });
      });
      return () => mm.revert();
    },
    { scope: containerRef as React.RefObject<HTMLElement> }
  );
}

import type React from "react";
