"use client";

import { useEffect, useRef } from "react";
import { reducedMotion } from "@/lib/gsap";

export default function TopographicalLines() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let animId: number;
    let width = 0;
    let height = 0;
    let dpr = 1;
    let t = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    // Multi-octave organic wobble function
    const wobble = (angle: number, time: number, seed: number) => {
      return (
        Math.sin(angle * 2.5 + time * 0.8 + seed) * 0.12 +
        Math.cos(angle * 4.2 - time * 0.6 + seed * 1.5) * 0.08 +
        Math.sin(angle * 6.0 + time * 1.1 + seed * 2.2) * 0.04
      );
    };

    // Main draw loop
    const render = () => {
      if (width === 0 || height === 0) {
        animId = requestAnimationFrame(render);
        return;
      }

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, width, height);

      // Centers for topographic features
      const p1 = { x: width * 0.38, y: height * 0.58 }; // Main focal peak (sharp)
      const p2 = { x: width * 0.72, y: height * 0.38 }; // Secondary north peak
      const p3 = { x: width * 0.82, y: height * 0.76 }; // Southeastern ridge
      const p4 = { x: width * 0.18, y: height * 0.28 }; // Distant northwestern shoulder

      // 1. Draw broad terrain contours linking the peaks
      const broadLevels = 7;
      for (let i = 1; i <= broadLevels; i++) {
        const radius = (Math.min(width, height) * 0.45 * i) / broadLevels;
        ctx.beginPath();
        const steps = 80;
        for (let j = 0; j <= steps; j++) {
          const theta = (j / steps) * Math.PI * 2;
          const w = wobble(theta, t * 0.5, i * 0.7);
          const r = radius * (1 + w * 1.5);
          // Elliptical stretch
          const x = width * 0.52 + Math.cos(theta) * r * 1.35;
          const y = height * 0.5 + Math.sin(theta) * r * 0.95;
          if (j === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.strokeStyle = "rgba(180, 180, 180, 0.14)";
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Helper to draw a concentric peak
      const drawPeak = (
        center: { x: number; y: number },
        numRings: number,
        maxR: number,
        aspectX: number,
        aspectY: number,
        rot: number,
        seedOffset: number,
        alphaBase: number
      ) => {
        for (let k = 1; k <= numRings; k++) {
          const norm = k / numRings;
          const rBase = maxR * norm;
          ctx.beginPath();
          const steps = 72;
          for (let s = 0; s <= steps; s++) {
            const theta = (s / steps) * Math.PI * 2;
            const w = wobble(theta, t * 0.7, seedOffset + k * 0.35);
            const r = rBase * (1 + w);

            // Rotate and scale
            const cosRot = Math.cos(rot);
            const sinRot = Math.sin(rot);
            const unrotX = Math.cos(theta) * r * aspectX;
            const unrotY = Math.sin(theta) * r * aspectY;

            const rx = center.x + (unrotX * cosRot - unrotY * sinRot);
            const ry = center.y + (unrotX * sinRot + unrotY * cosRot);

            if (s === 0) ctx.moveTo(rx, ry);
            else ctx.lineTo(rx, ry);
          }
          ctx.closePath();

          // Variable line intensity: summit crests are brighter
          const alpha = alphaBase * (0.35 + (1 - norm) * 0.55);
          ctx.strokeStyle = `rgba(220, 220, 220, ${alpha})`;
          ctx.lineWidth = k === 1 || k === 5 || k === 10 ? 1.25 : 0.85;
          ctx.stroke();
        }
      };

      // Draw secondary peaks
      drawPeak(p4, 8, Math.min(width, height) * 0.22, 1.3, 0.8, -0.4, 11, 0.3);
      drawPeak(p2, 14, Math.min(width, height) * 0.32, 1.2, 0.85, 0.3, 44, 0.45);
      drawPeak(p3, 9, Math.min(width, height) * 0.24, 1.1, 0.9, -0.2, 77, 0.35);

      // Draw main focal summit (sharpest, most detailed)
      drawPeak(p1, 16, Math.min(width, height) * 0.38, 1.15, 0.88, -0.15, 99, 0.65);

      // 2. Draw prominent glowing Orange Path / Ridge Line (as seen in Gambar 2)
      // The path traces from southern foothills, across main summit, and crests towards eastern pass
      const pathPoints = [
        { x: width * 0.12, y: height * 0.32 },
        { x: width * 0.16, y: height * 0.42 },
        { x: width * 0.18, y: height * 0.62 },
        { x: width * 0.24, y: height * 0.78 },
        { x: width * 0.28, y: height * 0.82 },
        { x: width * 0.34, y: height * 0.74 },
        { x: width * 0.42, y: height * 0.68 },
        { x: width * 0.54, y: height * 0.65 },
        { x: width * 0.68, y: height * 0.62 },
        { x: width * 0.84, y: height * 0.56 },
        { x: width * 0.94, y: height * 0.52 },
      ];

      // Add gentle live undulation to path points
      const dynamicPoints = pathPoints.map((pt, idx) => {
        const offset = Math.sin(t * 1.2 + idx * 0.8) * 3.5;
        return { x: pt.x, y: pt.y + offset };
      });

      // Orange path glow pass
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(dynamicPoints[0].x, dynamicPoints[0].y);
      for (let i = 1; i < dynamicPoints.length - 1; i++) {
        const xc = (dynamicPoints[i].x + dynamicPoints[i + 1].x) / 2;
        const yc = (dynamicPoints[i].y + dynamicPoints[i + 1].y) / 2;
        ctx.quadraticCurveTo(dynamicPoints[i].x, dynamicPoints[i].y, xc, yc);
      }
      ctx.lineTo(
        dynamicPoints[dynamicPoints.length - 1].x,
        dynamicPoints[dynamicPoints.length - 1].y
      );

      // Deep orange glow
      ctx.strokeStyle = "rgba(255, 90, 31, 0.45)";
      ctx.lineWidth = 5;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.shadowColor = "#ff5a1f";
      ctx.shadowBlur = 14;
      ctx.stroke();

      // Sharp core orange line
      ctx.strokeStyle = "#ff5a1f";
      ctx.lineWidth = 2.2;
      ctx.shadowBlur = 6;
      ctx.stroke();

      // Origin milestone node
      ctx.beginPath();
      ctx.arc(dynamicPoints[0].x, dynamicPoints[0].y, 3.5, 0, Math.PI * 2);
      ctx.fillStyle = "#ff5a1f";
      ctx.fill();

      // Peak waypoint node
      const summitIdx = 4;
      ctx.beginPath();
      ctx.arc(dynamicPoints[summitIdx].x, dynamicPoints[summitIdx].y, 4, 0, Math.PI * 2);
      ctx.fillStyle = "#ffffff";
      ctx.fill();
      ctx.strokeStyle = "#ff5a1f";
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.restore();

      ctx.restore();

      if (!reducedMotion()) {
        t += 0.006;
      }
      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      ro.disconnect();
    };
  }, []);

  return (
    <div className="relative w-full h-full min-h-[440px] md:min-h-[520px] pointer-events-none select-none overflow-visible">
      {/* Base Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ display: "block" }}
      />

      {/* Tilt-Shift Depth-of-Field Blur Layer */}
      {/* Blurs background mountains & edges while keeping the focal peak and glowing route sharp */}
      <div
        className="absolute inset-0 w-full h-full pointer-events-none backdrop-blur-[7px]"
        style={{
          WebkitMaskImage:
            "radial-gradient(ellipse 68% 54% at 38% 66%, transparent 30%, rgba(0, 0, 0, 0.75) 75%, black 100%)",
          maskImage:
            "radial-gradient(ellipse 68% 54% at 38% 66%, transparent 30%, rgba(0, 0, 0, 0.75) 75%, black 100%)",
        }}
      />
    </div>
  );
}
