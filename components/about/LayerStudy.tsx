"use client";

import { useRef, type PointerEvent } from "react";
import { gsap, useGSAP, reducedMotion } from "@/lib/motion/gsap";
import { useLocale } from "@/components/providers/LocaleProvider";

// CSS glass planes; scroll, pointer tilt, and replay animate separate layers.
export default function LayerStudy() {
  const root = useRef<HTMLButtonElement>(null);
  const { locale } = useLocale();
  const { contextSafe } = useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add({ reduced: "(prefers-reduced-motion: reduce)", full: "(prefers-reduced-motion: no-preference)" }, (context) => {
      const reduced = context.conditions?.reduced;
      const planes = gsap.utils.toArray<HTMLElement>("[data-study-plane]");
      const timeline = gsap.timeline({
        scrollTrigger: { trigger: root.current, start: "top 95%", end: "bottom 10%", scrub: 0.8 },
      });
      timeline.fromTo(planes, {
        xPercent: (i) => reduced ? 0 : (2 - i) * 27,
        yPercent: reduced ? 0 : 14,
        rotationY: reduced ? 0 : -24,
        opacity: 0.55,
      }, {
        xPercent: 0, yPercent: 0, rotationY: 0, opacity: 1,
        stagger: 0.045, duration: 0.6, ease: "power2.out",
      }).to(planes, {
        yPercent: (i) => reduced ? 0 : (i - 2) * -4,
        duration: 0.4, ease: "none",
      });
      timeline.fromTo("[data-study-aura]", { opacity: 0.25, scale: 0.85 }, {
        opacity: 0.7, scale: reduced ? 0.85 : 1.08, duration: 1, ease: "none",
      }, 0);
    });
    return () => mm.revert();
  }, { scope: root });

  const move = (event: PointerEvent<HTMLButtonElement>) => {
    if (event.pointerType !== "mouse" || reducedMotion()) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    contextSafe(() => {
      gsap.to("[data-study-camera]", { rotationY: (x - 0.5) * 12, rotationX: (0.5 - y) * 8, duration: 0.9, ease: "power3.out", overwrite: "auto" });
      gsap.to(root.current, { "--study-x": `${x * 100}%`, "--study-y": `${y * 100}%`, duration: 0.7, overwrite: "auto" });
    })();
  };
  const reset = () => contextSafe(() => {
    gsap.to("[data-study-camera]", { rotationY: 0, rotationX: 0, duration: 1, overwrite: "auto" });
  })();
  const replay = () => contextSafe(() => {
    gsap.fromTo("[data-study-glint]", { xPercent: -180, opacity: 0 }, {
      xPercent: 180, opacity: 0.7, duration: 1.4, stagger: 0.09, ease: "power2.inOut", overwrite: "auto",
    });
  })();
  const label = locale === "id" ? "Putar pantulan kaca" : "Play the glass reflection";
  return (
    <button ref={root} type="button" onClick={replay} onPointerMove={move} onPointerLeave={reset}
      aria-label={label} title={label}
      className="group relative isolate my-4 block aspect-[3/2] w-full overflow-hidden bg-transparent outline-none [perspective:900px]">
      <span data-study-aura aria-hidden="true" className="pointer-events-none absolute inset-[9%]"
        style={{ background: "radial-gradient(ellipse at 55% 52%, var(--accent-soft), transparent 68%)" }} />
      <span data-study-camera aria-hidden="true" className="pointer-events-none absolute inset-0 [transform-style:preserve-3d]">
        {Array.from({ length: 5 }, (_, i) => (
          <span key={i} className="absolute w-[25%] [transform:rotateY(-24deg)_skewY(-9deg)]"
            style={{ left: `${10 + i * 12}%`, top: `${23 - i * 1.5}%`, height: `${53 + i * 3}%`, zIndex: i }}>
            <span data-study-plane className="relative block h-full w-full origin-center overflow-hidden rounded-[2px] group-focus-visible:!border-accent"
              style={{
                background: `linear-gradient(135deg, color-mix(in srgb, var(--fg) 7%, transparent), color-mix(in srgb, var(--accent) ${9 + i * 3}%, transparent) 55%, color-mix(in srgb, var(--fg) 3%, transparent))`,
                border: "1px solid color-mix(in srgb, var(--fg) 16%, transparent)",
                backdropFilter: "blur(5px) saturate(130%)",
                WebkitBackdropFilter: "blur(5px) saturate(130%)",
                boxShadow: "inset 1px 1px 0 color-mix(in srgb, var(--fg) 13%, transparent), -8px 12px 22px color-mix(in srgb, var(--shadow) 12%, transparent)",
              }}>
              <span className="absolute inset-0" style={{ background: "radial-gradient(circle at var(--study-x, 50%) var(--study-y, 35%), color-mix(in srgb, var(--fg) 16%, transparent), transparent 65%)" }} />
              <span data-study-glint className="absolute -inset-x-1/2 inset-y-0 opacity-0"
                style={{ background: "linear-gradient(110deg, transparent 35%, color-mix(in srgb, var(--fg) 20%, transparent) 50%, transparent 65%)" }} />
              <span className="absolute inset-y-0 left-0 w-px bg-accent/40" />
            </span>
          </span>
        ))}
      </span>
    </button>
  );
}
