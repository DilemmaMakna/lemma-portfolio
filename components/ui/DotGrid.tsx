"use client";

import { useEffect, useRef } from "react";
import { isTouch, reducedMotion } from "@/lib/motion/gsap";
import { cssVar, onThemeChange } from "@/lib/ui/theme";

const STEP = 24;
const RADIUS = 180;
const BASE_SIZE = 2.5;
const MAX_SIZE = 14;

export default function DotGrid() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const interactive = !isTouch() && !reducedMotion();
    let w = 0;
    let h = 0;
    let dpr = 1;
    const mouse = { x: -9999, y: -9999, tx: -9999, ty: -9999 };
    let raf = 0;
    let visible = true;
    let last = 0;
    // Warna titik diambil dari token --dot dan dibaca ulang saat tema berganti.
    let dot = cssVar("--dot") || "#2a2a2a";
    const offTheme = onThemeChange(() => {
      dot = cssVar("--dot") || dot;
      draw();
    });

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = r.width;
      h = r.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw();
    };

    function draw() {
      ctx!.clearRect(0, 0, w, h);
      const cols = Math.ceil(w / STEP) + 1;
      const rows = Math.ceil(h / STEP) + 1;
      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const x = i * STEP + STEP / 2;
          const y = j * STEP + STEP / 2;
          const d = Math.hypot(x - mouse.x, y - mouse.y);
          const k = d < RADIUS ? Math.pow(1 - d / RADIUS, 1.4) : 0;
          const size = BASE_SIZE + k * (MAX_SIZE - BASE_SIZE);

          if (k > 0.02) {
            ctx!.fillStyle = `rgba(255, 90, 31, ${0.25 + k * 0.75})`;
          } else {
            ctx!.fillStyle = dot;
          }

          ctx!.fillRect(x - size / 2, y - size / 2, size, size);
        }
      }
    }

    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      if (!visible || document.hidden) return;
      if (now - last < 1000 / 60) return;
      last = now;
      mouse.x += (mouse.tx - mouse.x) * 0.2;
      mouse.y += (mouse.ty - mouse.y) * 0.2;
      draw();
    };

    const onMove = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect();
      mouse.tx = e.clientX - r.left;
      mouse.ty = e.clientY - r.top;
      if (mouse.x < -999) {
        mouse.x = mouse.tx;
        mouse.y = mouse.ty;
      }
    };
    const onLeave = () => {
      mouse.tx = -9999;
      mouse.ty = -9999;
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(canvas);

    if (interactive) {
      window.addEventListener("mousemove", onMove, { passive: true });
      document.documentElement.addEventListener("mouseleave", onLeave);
      raf = requestAnimationFrame(loop);
    }

    return () => {
      cancelAnimationFrame(raf);
      offTheme();
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("mousemove", onMove);
      document.documentElement.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full"
    />
  );
}
