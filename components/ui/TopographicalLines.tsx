"use client";

import { useEffect, useRef } from "react";
import { reducedMotion } from "@/lib/motion/gsap";
import {
  INDEX_EVERY,
  LEVELS,
  buildField,
  definition,
  findRoute,
  hillshade,
  placeLabels,
  pointAt,
  shapeContours,
  traceContours,
  type Field,
  type Label,
  type Route,
  type Shaped,
} from "@/lib/topography";

// Metafora "masalah yang belum punya bentuk": pusat peta sudah terdefinisi (kontur utuh,
// elevasi terukur); ke arah tepi kontur putus jadi serpihan lalu tinggal titik survei dengan
// elevasi "?", dan seluruhnya memudar ke transparan. Saat pertama terlihat, bentuk itu
// terbentuk dari pusat ke luar, lalu rute menyusuri dari tepi yang samar menuju puncak.
//
// Medan dihitung dan digambar SEKALI per resize. Selama animasi hanya lapisan tipis yang
// digambar ulang (rute, pejalan, denyut), jadi biaya per frame kecil.

const INTRO_REVEAL_MS = 2200; // bentuk terbentuk dari pusat
const ROUTE_DELAY_MS = 500;
const ROUTE_MS = 2600; // rute tergambar
const WALK_MS = 16000; // satu perjalanan pejalan dari awal sampai akhir rute
const PING_MS = 2400;
const FRAME_MS = 1000 / 30;
const FALLBACK_FONT = 'ui-monospace, "SF Mono", Menlo, monospace';

// Pusat 100% opasitas, tepi 0%.
const FADE =
  "radial-gradient(ellipse closest-side at 50% 50%, rgba(0,0,0,1) 0%, rgba(0,0,0,0.97) 30%, rgba(0,0,0,0.8) 55%, rgba(0,0,0,0.42) 78%, rgba(0,0,0,0.12) 92%, rgba(0,0,0,0) 100%)";

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

// Menggambar lapisan dasar ke kanvas statis (relief, grid, titik survei, label "?") dan
// mengembalikan lapisan "terbentuk" (kontur utuh + label elevasi) sebagai kanvas terpisah,
// supaya bisa diungkap bertahap saat intro lalu ditempel permanen.
function paintLayers(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  field: Field,
  def: Float32Array,
  shaped: Shaped,
  labels: Label[],
  dpr: number,
  font: string,
) {
  const { width, height } = field;
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  // Relief berbayang: gambar kecil (satu piksel per sampel), diperbesar dengan smoothing.
  const shade = document.createElement("canvas");
  shade.width = field.cols;
  shade.height = field.rows;
  shade.getContext("2d")?.putImageData(new ImageData(hillshade(field, def), field.cols, field.rows), 0, 0);
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(shade, 0, 0, field.cols * field.cell, field.rows * field.cell);

  // Tanda silang grid peta tiap 96px.
  ctx.strokeStyle = "rgba(255, 255, 255, 0.12)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  for (let y = 96; y < height; y += 96) {
    for (let x = 96; x < width; x += 96) {
      ctx.moveTo(x - 4, y);
      ctx.lineTo(x + 4, y);
      ctx.moveTo(x, y - 4);
      ctx.lineTo(x, y + 4);
    }
  }
  ctx.stroke();

  // Titik survei: sisa kontur yang belum berbentuk, dalam satu path agar murah.
  ctx.fillStyle = "rgba(240, 242, 245, 0.7)";
  ctx.beginPath();
  for (let i = 0; i < shaped.dots.length; i += 2) ctx.rect(shaped.dots[i] - 0.65, shaped.dots[i + 1] - 0.65, 1.3, 1.3);
  ctx.fill();

  // Label "?": elevasi di zona ini belum diketahui.
  ctx.font = `500 9px ${font}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  for (const l of labels) {
    if (!l.unknown) continue;
    ctx.save();
    ctx.translate(l.x, l.y);
    ctx.rotate(l.angle);
    ctx.fillStyle = "rgba(10, 10, 10, 0.9)"; // warna latar halaman: melubangi titik di bawahnya
    ctx.fillRect(-7, -7, 14, 14);
    ctx.fillStyle = "rgba(245, 245, 245, 0.7)";
    ctx.fillText(l.text, 0, 0.5);
    ctx.restore();
  }

  // Lapisan terbentuk: kontur utuh di kanvas transparan sendiri supaya label bisa melubangi
  // garisnya (destination-out) tanpa menghapus relief di bawahnya.
  const formed = document.createElement("canvas");
  formed.width = canvas.width;
  formed.height = canvas.height;
  const fctx = formed.getContext("2d");
  if (!fctx) return null;
  fctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  fctx.lineJoin = "round";
  fctx.lineCap = "round";

  // Satu stroke per level; semua ruas satu level berada dalam satu path.
  for (let k = 1; k <= LEVELS; k++) {
    const seg = shaped.solid[k];
    if (!seg.length) continue;
    const index = k % INDEX_EVERY === 0;
    const alpha = (index ? 0.5 : 0.2) * (0.4 + (k / LEVELS) * 0.6);
    fctx.beginPath();
    for (let i = 0; i < seg.length; i += 4) {
      fctx.moveTo(seg[i], seg[i + 1]);
      fctx.lineTo(seg[i + 2], seg[i + 3]);
    }
    fctx.strokeStyle = `rgba(240, 242, 245, ${alpha.toFixed(3)})`;
    fctx.lineWidth = index ? 1.1 : 0.6;
    fctx.stroke();
  }

  fctx.font = `500 9px ${font}`;
  fctx.textAlign = "center";
  fctx.textBaseline = "middle";
  for (const l of labels) {
    if (l.unknown) continue;
    const w = fctx.measureText(l.text).width + 8;
    fctx.save();
    fctx.translate(l.x, l.y);
    fctx.rotate(l.angle);
    fctx.globalCompositeOperation = "destination-out";
    fctx.fillStyle = "#000";
    fctx.fillRect(-w / 2, -6, w, 12);
    fctx.globalCompositeOperation = "source-over";
    fctx.fillStyle = "rgba(245, 245, 245, 0.7)";
    fctx.fillText(l.text, 0, 0.5);
    fctx.restore();
  }
  return formed;
}

// scale: zoom medan (1 = ukuran asli, sampai 2 = 200%). Medan yang diperbesar, bukan bitmap,
// jadi garis tetap tajam dan tidak ada kanvas raksasa di memori.
export default function TopographicalLines({ scale = 1.8 }: { scale?: number }) {
  const staticRef = useRef<HTMLCanvasElement>(null);
  const overlayRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const base = staticRef.current;
    const over = overlayRef.current;
    if (!base || !over) return;
    const bctx = base.getContext("2d");
    const octx = over.getContext("2d");
    if (!bctx || !octx) return;

    const zoom = Math.min(2, Math.max(1, scale));
    const still = reducedMotion();
    let width = 0;
    let height = 0;
    let dpr = 1;
    let font = FALLBACK_FONT;
    let route: Route | null = null;
    let routePath: Path2D | null = null;
    let formed: HTMLCanvasElement | null = null;
    let formedOnBase = false;
    let clock = 0; // ms animasi yang benar-benar terlihat; berhenti saat di luar layar
    let lastTick = 0;
    let rafId = 0;
    let resizeTimer = 0;
    let cancelled = false;

    const draw = (time: number) => {
      if (!route || !routePath || !formed) return;
      const ctx = octx;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, over.width, over.height);

      // Bentuk terbentuk dari pusat ke luar. Setelah selesai, lapisannya ditempel permanen ke
      // kanvas statis dan overlay tidak perlu menggambarnya lagi.
      const rp = still ? 1 : clamp01(time / INTRO_REVEAL_MS);
      if (!formedOnBase) {
        if (rp >= 1) {
          bctx.setTransform(1, 0, 0, 1, 0, 0);
          bctx.drawImage(formed, 0, 0);
          formedOnBase = true;
        } else if (rp > 0) {
          ctx.drawImage(formed, 0, 0);
          const R = Math.max(2, easeOutCubic(rp) * Math.hypot(width, height) * 0.6);
          const feather = Math.max(40, R * 0.35);
          const g = ctx.createRadialGradient(width / 2, height / 2, Math.max(0, R - feather), width / 2, height / 2, R);
          g.addColorStop(0, "rgba(0, 0, 0, 1)");
          g.addColorStop(1, "rgba(0, 0, 0, 0)");
          ctx.globalCompositeOperation = "destination-in";
          ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
          ctx.fillStyle = g;
          ctx.fillRect(0, 0, width, height);
          ctx.globalCompositeOperation = "source-over";
        }
      }

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const p = still ? 1 : easeOutCubic(clamp01((time - ROUTE_DELAY_MS) / ROUTE_MS));
      if (p <= 0) return;

      const L = route.length;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      // Rute tergambar bertahap lewat dash: pola [L, L] digeser sampai sepanjang p * L terlihat.
      if (p < 1) {
        ctx.setLineDash([L, L]);
        ctx.lineDashOffset = L * (1 - p);
      }
      // Glow tiga lapis jauh lebih ringan daripada shadowBlur.
      ctx.strokeStyle = "rgba(255, 90, 31, 0.16)";
      ctx.lineWidth = 12;
      ctx.stroke(routePath);
      ctx.strokeStyle = "rgba(255, 90, 31, 0.38)";
      ctx.lineWidth = 5.5;
      ctx.stroke(routePath);
      ctx.strokeStyle = "#ff5a1f";
      ctx.lineWidth = 2.2;
      ctx.stroke(routePath);
      ctx.setLineDash([]);

      ctx.fillStyle = "#ff5a1f";
      ctx.beginPath();
      ctx.arc(route.start.x, route.start.y, 3.5, 0, Math.PI * 2);
      ctx.fill();

      if (p * L >= route.summit.dist) {
        const { x, y, meters } = route.summit;
        ctx.beginPath();
        ctx.arc(x, y, 4.2, 0, Math.PI * 2);
        ctx.fillStyle = "#ffffff";
        ctx.fill();
        ctx.strokeStyle = "#ff5a1f";
        ctx.lineWidth = 2.2;
        ctx.stroke();

        const left = x > width - 90;
        ctx.font = `500 10px ${font}`;
        ctx.textAlign = left ? "right" : "left";
        ctx.textBaseline = "alphabetic";
        ctx.fillStyle = "rgba(245, 245, 245, 0.85)";
        ctx.fillText(`${meters.toLocaleString("en-US")} M`, x + (left ? -10 : 10), y - 10);
      }

      if (p >= 1) {
        ctx.fillStyle = "#ff5a1f";
        ctx.beginPath();
        ctx.arc(route.end.x, route.end.y, 3.5, 0, Math.PI * 2);
        ctx.fill();
      }

      if (still || p < 1) return;

      // Denyut di puncak.
      const phase = (time % PING_MS) / PING_MS;
      ctx.beginPath();
      ctx.arc(route.summit.x, route.summit.y, 6 + 22 * phase, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(255, 90, 31, ${(0.5 * (1 - phase)).toFixed(3)})`;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Pejalan menyusuri rute dengan ekor memudar; muncul dan lenyap dengan halus di ujung.
      const u = ((time - ROUTE_DELAY_MS - ROUTE_MS) % WALK_MS) / WALK_MS;
      const d = (u < 0 ? 0 : u) * L;
      const fade = Math.min(1, Math.sin(Math.PI * clamp01(u)) * 3);
      for (let i = 9; i >= 0; i--) {
        const pt = pointAt(route, Math.max(0, d - i * 7));
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, i === 0 ? 3 : 2.4 * (1 - i / 14), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${((i === 0 ? 1 : 0.5 * (1 - i / 10)) * fade).toFixed(3)})`;
        ctx.fill();
      }
    };

    const tick = (now: number) => {
      rafId = requestAnimationFrame(tick);
      const dt = now - lastTick;
      if (dt < FRAME_MS) return;
      lastTick = now;
      clock += Math.min(dt, 100);
      draw(clock);
    };

    const start = () => {
      if (still || rafId) return;
      lastTick = performance.now();
      rafId = requestAnimationFrame(tick);
    };

    const stop = () => {
      cancelAnimationFrame(rafId);
      rafId = 0;
    };

    const build = (force = false) => {
      const rect = base.getBoundingClientRect();
      const w = Math.round(rect.width);
      const h = Math.round(rect.height);
      if (w < 2 || h < 2) return;
      if (!force && w === width && h === height) return;
      width = w;
      height = h;

      // DPR boleh sampai 2: lapisan statis hanya digambar sekali, tidak membebani per frame.
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      for (const c of [base, over]) {
        c.width = Math.floor(w * dpr);
        c.height = Math.floor(h * dpr);
      }

      const cell = Math.min(6, Math.max(3, Math.round(Math.sqrt((w * h) / 45000))));
      // Di kontainer sempit, zoom penuh hanya menampilkan satu lereng; batasi agar puncak tetap terlihat.
      const field = buildField(w, h, cell, w < 600 ? Math.min(zoom, 1.3) : zoom);
      const def = definition(field);
      const contours = traceContours(field);
      const shaped = shapeContours(field, contours, def);
      const labels = placeLabels(field, contours, def);
      route = findRoute(field);

      routePath = new Path2D();
      routePath.moveTo(route.pts[0], route.pts[1]);
      for (let i = 2; i < route.pts.length; i += 2) routePath.lineTo(route.pts[i], route.pts[i + 1]);

      const mono = getComputedStyle(base).getPropertyValue("--font-mono").trim();
      font = mono ? `${mono}, ${FALLBACK_FONT}` : FALLBACK_FONT;
      formed = paintLayers(bctx, base, field, def, shaped, labels, dpr, font);
      formedOnBase = false;
      draw(clock);
    };

    build();
    // Label memakai font mono; gambar ulang sekali setelah font siap.
    document.fonts?.ready.then(() => {
      if (!cancelled) build(true);
    });

    const ro = new ResizeObserver(() => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => build(), 150);
    });
    ro.observe(base);

    // Hanya animasi saat terlihat; di luar layar tidak ada rAF sama sekali.
    const io = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting ? start() : stop()),
      { threshold: 0.05 },
    );
    io.observe(base);

    return () => {
      cancelled = true;
      stop();
      window.clearTimeout(resizeTimer);
      ro.disconnect();
      io.disconnect();
    };
  }, [scale]);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none relative h-full min-h-[600px] -top-40 w-full select-none md:min-h-[720px]"
      style={{ maskImage: FADE, WebkitMaskImage: FADE }}
    >
      <canvas ref={staticRef} className="absolute inset-0 h-full w-full" style={{ display: "block" }} />
      <canvas ref={overlayRef} className="absolute inset-0 h-full w-full" style={{ display: "block" }} />
    </div>
  );
}
