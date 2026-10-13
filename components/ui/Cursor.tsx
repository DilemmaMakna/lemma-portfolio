"use client";

import { useEffect, useRef } from "react";
import { gsap, isTouch, reducedMotion } from "@/lib/gsap";

export default function Cursor() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || isTouch() || reducedMotion()) return;
    document.documentElement.classList.add("has-cursor");

    const xTo = gsap.quickTo(el, "x", { duration: 0.35, ease: "power3.out" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.35, ease: "power3.out" });
    gsap.set(el, { autoAlpha: 0 });

    const move = (e: MouseEvent) => {
      gsap.to(el, { autoAlpha: 1, duration: 0.2, overwrite: "auto" });
      xTo(e.clientX);
      yTo(e.clientY);
    };

    let mode: "dot" | "hover" | "view" = "dot";
    const setMode = (m: typeof mode, label = "") => {
      if (m === mode && el.textContent === label) return;
      mode = m;
      el.textContent = label;
      if (m === "dot") {
        gsap.to(el, { width: 8, height: 8, margin: "-4px 0 0 -4px", backgroundColor: "#ff5a1f", mixBlendMode: "normal", duration: 0.3, ease: "expo.out" });
      } else if (m === "hover") {
        gsap.to(el, { width: 28, height: 28, margin: "-14px 0 0 -14px", backgroundColor: "#ffffff", mixBlendMode: "difference", duration: 0.3, ease: "expo.out" });
      } else {
        gsap.to(el, { width: 72, height: 30, margin: "-15px 0 0 -36px", backgroundColor: "#ff5a1f", mixBlendMode: "normal", duration: 0.3, ease: "expo.out" });
      }
    };

    const over = (e: MouseEvent) => {
      const t = e.target as HTMLElement | null;
      if (!t) return;
      const view = t.closest<HTMLElement>("[data-cursor-label]");
      if (view) return setMode("view", view.dataset.cursorLabel);
      if (t.closest("a, button, summary, [role='button']")) return setMode("hover");
      setMode("dot");
    };
    const leave = () => gsap.to(el, { autoAlpha: 0, duration: 0.2 });

    window.addEventListener("mousemove", move, { passive: true });
    window.addEventListener("mouseover", over, { passive: true });
    document.documentElement.addEventListener("mouseleave", leave);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", over);
      document.documentElement.removeEventListener("mouseleave", leave);
      document.documentElement.classList.remove("has-cursor");
    };
  }, []);

  return <div ref={ref} className="cursor" aria-hidden="true" />;
}
