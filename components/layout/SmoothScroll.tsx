"use client";

import { useEffect } from "react";
import { gsap, ScrollTrigger, reducedMotion } from "@/lib/motion/gsap";
import { setLenis } from "@/lib/motion/lenis";

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (reducedMotion()) return;

    let cancelled = false;
    let teardown = () => {};
    import("lenis").then(({ default: Lenis }) => {
      if (cancelled) return;

      const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      });
      setLenis(lenis);

      lenis.on("scroll", ScrollTrigger.update);
      const raf = (time: number) => lenis.raf(time * 1000);
      gsap.ticker.add(raf);
      gsap.ticker.lagSmoothing(0);

      // Scroll terkunci selama intro berlangsung.
      if (document.documentElement.classList.contains("is-loading")) lenis.stop();

      teardown = () => {
        gsap.ticker.remove(raf);
        lenis.destroy();
        setLenis(null);
      };
    });

    return () => {
      cancelled = true;
      teardown();
    };
  }, []);

  return <>{children}</>;
}
