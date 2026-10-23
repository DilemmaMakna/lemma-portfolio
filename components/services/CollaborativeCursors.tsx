"use client";

import { useRef, useState } from "react";
import { gsap, reducedMotion, useGSAP } from "@/lib/gsap";
import { scrollToId } from "@/lib/lenis";
import { useServicesCopy } from "./useServicesCopy";

interface Waypoint {
  x: number;
  y: number;
  duration: number;
  action: string;
  pause?: number;
}

interface CursorConfig {
  id: string;
  serviceIndex: string;
  codeHandle: string;
  color: string;
  accentBg: string;
  waypoints: Waypoint[];
  minScreen: "md" | "lg";
}

const CURSORS_CONFIG: CursorConfig[] = [
  {
    id: "brand",
    serviceIndex: "01",
    codeHandle: "01:brand.sys",
    color: "#ff5a1f",
    accentBg: "rgba(255, 90, 31, 0.2)",
    minScreen: "md",
    waypoints: [
      { x: 0.1, y: 0.16, duration: 4.2, action: "token.sync" },
      { x: 0.3, y: 0.52, duration: 3.8, action: "brand_audit", pause: 0.8 },
      { x: 0.18, y: 0.82, duration: 4.0, action: "design_system", pause: 0.9 },
      { x: 0.06, y: 0.5, duration: 3.9, action: "guideline.md" },
    ],
  },
  {
    id: "ux",
    serviceIndex: "02",
    codeHandle: "02:ux.hci",
    color: "#34d399",
    accentBg: "rgba(52, 211, 153, 0.2)",
    minScreen: "md",
    waypoints: [
      { x: 0.22, y: 0.7, duration: 4.3, action: "usability", pause: 0.8 },
      { x: 0.7, y: 0.14, duration: 5.2, action: "user_flows", pause: 1.0 },
      { x: 0.8, y: 0.5, duration: 4.0, action: "proto.click" },
      { x: 0.4, y: 0.88, duration: 4.6, action: "info_arch", pause: 0.8 },
    ],
  },
  {
    id: "engine",
    serviceIndex: "03",
    codeHandle: "03:core.engine",
    color: "#38bdf8",
    accentBg: "rgba(56, 189, 248, 0.2)",
    minScreen: "md",
    waypoints: [
      { x: 0.55, y: 0.86, duration: 4.4, action: "build.pass" },
      { x: 0.12, y: 0.62, duration: 5.0, action: "deploying", pause: 1.1 },
      { x: 0.4, y: 0.08, duration: 5.2, action: "latency.bench" },
      { x: 0.78, y: 0.72, duration: 5.0, action: "cluster.sync", pause: 0.7 },
    ],
  },
  {
    id: "ai",
    serviceIndex: "04",
    codeHandle: "04:ai.data",
    color: "#c084fc",
    accentBg: "rgba(192, 132, 252, 0.2)",
    minScreen: "md",
    waypoints: [
      { x: 0.86, y: 0.12, duration: 4.1, action: "model.audit" },
      { x: 0.84, y: 0.62, duration: 4.4, action: "rag.eval", pause: 1.1 },
      { x: 0.6, y: 0.9, duration: 4.0, action: "vector.search" },
      { x: 0.9, y: 0.34, duration: 4.8, action: "explainability", pause: 0.7 },
    ],
  },
  {
    id: "strategy",
    serviceIndex: "05",
    codeHandle: "05:systems.arch",
    color: "#fbbf24",
    accentBg: "rgba(251, 191, 36, 0.2)",
    minScreen: "lg",
    waypoints: [
      { x: 0.46, y: 0.07, duration: 4.6, action: "info_arch" },
      { x: 0.86, y: 0.4, duration: 5.2, action: "scoping", pause: 0.9 },
      { x: 0.3, y: 0.9, duration: 5.6, action: "system_map" },
      { x: 0.04, y: 0.28, duration: 5.0, action: "okr.align", pause: 0.9 },
    ],
  },
];

/* ---------- Geometri jalur: bezier kuadratik + penghindaran zona teks ---------- */

type Pt = { x: number; y: number };
type Rect = { l: number; t: number; r: number; b: number };
type Seg = { p0: Pt; c: Pt; p1: Pt };
type Step = { seg: Seg; duration: number; action: string; pause: number };

// Perkiraan jejak kursor + badge (px). Dipakai untuk memperbesar zona terlarang.
const FOOT_W = 260;
const FOOT_H = 44;
const PAD = 14;
const MAX_BLUR = 1.5;

const dist = (a: Pt, b: Pt) => Math.hypot(a.x - b.x, a.y - b.y);

// Titik kiri-atas kursor yang membuat jejaknya menabrak rect.
const inflate = (r: Rect): Rect => ({
  l: r.l - FOOT_W - PAD,
  t: r.t - FOOT_H - PAD,
  r: r.r + PAD,
  b: r.b + PAD,
});

const hits = (p: Pt, rs: Rect[]) =>
  rs.some((r) => p.x > r.l && p.x < r.r && p.y > r.t && p.y < r.b);

const quad = (s: Seg, t: number): Pt => {
  const u = 1 - t;
  return {
    x: u * u * s.p0.x + 2 * u * t * s.c.x + t * t * s.p1.x,
    y: u * u * s.p0.y + 2 * u * t * s.c.y + t * t * s.p1.y,
  };
};

const curveClear = (s: Seg, rs: Rect[]) => {
  for (let i = 0; i <= 28; i++) if (hits(quad(s, i / 28), rs)) return false;
  return true;
};

function makeCurve(p0: Pt, p1: Pt, bend: number): Seg {
  const dx = p1.x - p0.x;
  const dy = p1.y - p0.y;
  const len = Math.hypot(dx, dy) || 1;
  return {
    p0,
    p1,
    c: { x: (p0.x + p1.x) / 2 + (-dy / len) * bend, y: (p0.y + p1.y) / 2 + (dx / len) * bend },
  };
}

function clearCurve(p0: Pt, p1: Pt, flip: number, rs: Rect[]): Seg | null {
  const len = dist(p0, p1);
  const base = Math.max(40, len * 0.22);
  for (const k of [1, -1, 1.8, -1.8]) {
    const seg = makeCurve(p0, p1, base * k * flip);
    if (curveClear(seg, rs)) return seg;
  }
  return null;
}

function planPath(p0: Pt, p1: Pt, flip: number, rs: Rect[], inBounds: (p: Pt) => boolean): Seg[] {
  const direct = clearCurve(p0, p1, flip, rs);
  if (direct) return [direct];

  // Jalan memutar lewat sudut zona terlarang terdekat.
  let best: { cost: number; segs: Seg[] } | null = null;
  for (const r of rs) {
    const corners: Pt[] = [
      { x: r.l - 2, y: r.t - 2 },
      { x: r.r + 2, y: r.t - 2 },
      { x: r.l - 2, y: r.b + 2 },
      { x: r.r + 2, y: r.b + 2 },
    ];
    for (const d of corners) {
      if (!inBounds(d) || hits(d, rs)) continue;
      const a = clearCurve(p0, d, flip, rs);
      const b = a && clearCurve(d, p1, flip, rs);
      if (a && b) {
        const cost = dist(p0, d) + dist(d, p1);
        if (!best || cost < best.cost) best = { cost, segs: [a, b] };
      }
    }
  }
  return best ? best.segs : [makeCurve(p0, p1, Math.max(40, dist(p0, p1) * 0.22) * flip)];
}

// Geser titik keluar dari zona terlarang ke sisi terdekat yang masih di dalam layar.
function resolvePoint(p: Pt, rs: Rect[], inBounds: (p: Pt) => boolean, clamp: (p: Pt) => Pt): Pt {
  let cur = clamp(p);
  for (let i = 0; i < 4 && hits(cur, rs); i++) {
    const r = rs.find((q) => hits(cur, [q]))!;
    const cands: Pt[] = [
      { x: r.l - 1, y: cur.y },
      { x: r.r + 1, y: cur.y },
      { x: cur.x, y: r.t - 1 },
      { x: cur.x, y: r.b + 1 },
    ]
      .filter((c) => inBounds(c))
      .sort((a, b) => dist(a, cur) - dist(b, cur));
    const ok = cands.find((c) => !hits(c, rs));
    cur = ok ?? clamp(cands[0] ?? cur);
  }
  return cur;
}

function CursorPointer({ color }: { color: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-[22px] w-[22px] drop-shadow-[0_2px_8px_var(--shadow)]"
      style={{ overflow: "visible" }}
    >
      <path
        d="M3 2L10.5 20.5L13.8 13.2L21 9.9L3 2Z"
        fill={color}
        style={{ stroke: "var(--bg)" }}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function CollaborativeCursors() {
  const copy = useServicesCopy();
  const rootRef = useRef<HTMLDivElement>(null);
  const timelinesRef = useRef<Record<string, gsap.core.Timeline>>({});
  const blurRef = useRef<Record<string, number>>({});
  const [activeActions, setActiveActions] = useState<Record<string, string>>(() =>
    Object.fromEntries(CURSORS_CONFIG.map((c) => [c.id, c.waypoints[0].action])),
  );
  const [clickingId, setClickingId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;

      let waitTimer = 0;
      let resizeTimer = 0;
      let lastW = 0;
      let lastH = 0;
      const tweens: gsap.core.Animation[] = [];

      const killAll = () => {
        Object.values(timelinesRef.current).forEach((t) => t.kill());
        timelinesRef.current = {};
        tweens.splice(0).forEach((t) => t.kill());
      };

      const build = () => {
        killAll();
        const box = root.getBoundingClientRect();
        const w = box.width;
        const h = box.height;
        lastW = w;
        lastH = h;
        const still = reducedMotion();

        // Zona terlarang: heading, lead, dan CTA.
        const avoid: Rect[] = Array.from(
          root.parentElement?.querySelectorAll<HTMLElement>("[data-cursor-avoid]") ?? [],
        ).map((el) => {
          const r = el.getBoundingClientRect();
          return inflate({ l: r.left - box.left, t: r.top - box.top, r: r.right - box.left, b: r.bottom - box.top });
        });

        const minX = 8;
        const maxX = Math.max(minX, w - FOOT_W + 20);
        const minY = 8;
        const maxY = Math.max(minY, h - 50);
        const clamp = (p: Pt): Pt => ({
          x: Math.min(maxX, Math.max(minX, p.x)),
          y: Math.min(maxY, Math.max(minY, p.y)),
        });
        const inBounds = (p: Pt) => p.x >= minX && p.x <= maxX && p.y >= minY && p.y <= maxY;

        CURSORS_CONFIG.forEach((cfg, ci) => {
          const el = root.querySelector<HTMLElement>(`[data-cursor="${cfg.id}"]`);
          if (!el || el.offsetParent === null) return; // tersembunyi di breakpoint ini

          const pts = cfg.waypoints.map((wp) =>
            resolvePoint({ x: wp.x * w, y: wp.y * h }, avoid, inBounds, clamp),
          );

          // Susun langkah: tiap pasangan waypoint jadi satu atau dua bezier.
          const steps: Step[] = [];
          cfg.waypoints.forEach((wp, i) => {
            const j = (i + 1) % pts.length;
            const next = cfg.waypoints[j];
            const segs = planPath(pts[i], pts[j], (i + ci) % 2 ? -1 : 1, avoid, inBounds);
            const total = segs.reduce((n, s) => n + dist(s.p0, s.p1), 0) || 1;
            segs.forEach((seg, k) => {
              const last = k === segs.length - 1;
              steps.push({
                seg,
                duration: wp.duration * (dist(seg.p0, seg.p1) / total),
                action: next.action,
                pause: last ? (next.pause ?? 0) : 0,
              });
            });
          });

          const setX = gsap.quickSetter(el, "x", "px") as (v: number) => void;
          const setY = gsap.quickSetter(el, "y", "px") as (v: number) => void;
          const setR = gsap.quickSetter(el, "rotation", "deg") as (v: number) => void;

          const place = (s: Seg, t: number) => {
            const u = 1 - t;
            const x = u * u * s.p0.x + 2 * u * t * s.c.x + t * t * s.p1.x;
            const y = u * u * s.p0.y + 2 * u * t * s.c.y + t * t * s.p1.y;
            const tx = 2 * u * (s.c.x - s.p0.x) + 2 * t * (s.p1.x - s.c.x);
            const ty = 2 * u * (s.c.y - s.p0.y) + 2 * t * (s.p1.y - s.c.y);
            const mag = Math.hypot(tx, ty) || 1;
            const swing = Math.sin(Math.PI * t);
            setX(x);
            setY(y);
            setR((tx / mag) * 8 * swing);

            // Motion blur ringan: dikuantisasi 0.5px agar style hanya ditulis beberapa kali per segmen.
            const b = Math.round(MAX_BLUR * swing * swing * 2) / 2;
            if (b !== blurRef.current[cfg.id]) {
              blurRef.current[cfg.id] = b;
              el.style.filter = b > 0 ? `blur(${b}px)` : "none";
            }
          };

          place(steps[0].seg, 0);
          el.style.filter = "none";
          blurRef.current[cfg.id] = 0;

          // Masuk dengan blur sekali, lalu mulai bergerak.
          const intro = gsap.fromTo(
            el,
            { opacity: 0, filter: "blur(12px)" },
            {
              opacity: 1,
              filter: "blur(0px)",
              duration: 1.1,
              delay: ci * 0.18,
              ease: "power2.out",
              onComplete: () => {
                el.style.filter = "none";
                timelinesRef.current[cfg.id]?.play();
              },
            },
          );
          tweens.push(intro);

          if (still) return;

          const p = { t: 0 };
          const tl = gsap.timeline({ repeat: -1, paused: true });
          steps.forEach((st) => {
            tl.set(p, { t: 0 });
            tl.to(p, {
              t: 1,
              duration: st.duration,
              ease: "power2.inOut",
              onStart: () => setActiveActions((prev) => ({ ...prev, [cfg.id]: st.action })),
              onUpdate: () => place(st.seg, p.t),
            });
            if (st.pause > 0) {
              tl.to(el, {
                scale: 0.88,
                duration: 0.12,
                yoyo: true,
                repeat: 1,
                ease: "power1.inOut",
                onStart: () => {
                  setClickingId(cfg.id);
                  window.setTimeout(() => setClickingId((c) => (c === cfg.id ? null : c)), 500);
                },
              });
              tl.to({}, { duration: Math.max(0.1, st.pause - 0.24) });
            }
          });
          timelinesRef.current[cfg.id] = tl;
        });
      };

      // Tunggu intro selesai sebelum mengukur dan menjalankan kursor.
      const start = () => {
        if (document.documentElement.classList.contains("is-loading")) {
          waitTimer = window.setTimeout(start, 100);
        } else {
          waitTimer = window.setTimeout(build, 350);
        }
      };
      start();

      const onResize = () => {
        window.clearTimeout(resizeTimer);
        resizeTimer = window.setTimeout(() => {
          const r = root.getBoundingClientRect();
          if (Math.abs(r.width - lastW) > 4 || Math.abs(r.height - lastH) > 4) build();
        }, 250);
      };
      window.addEventListener("resize", onResize);

      // Hemat CPU: hentikan semua timeline saat hero keluar dari viewport.
      const io = new IntersectionObserver(([entry]) => {
        Object.values(timelinesRef.current).forEach((t) => {
          if (entry.isIntersecting) t.resume();
          else t.pause();
        });
      });
      io.observe(root);

      return () => {
        window.clearTimeout(waitTimer);
        window.clearTimeout(resizeTimer);
        window.removeEventListener("resize", onResize);
        io.disconnect();
        killAll();
      };
    },
    { scope: rootRef },
  );

  const getEl = (id: string) =>
    rootRef.current?.querySelector<HTMLElement>(`[data-cursor="${id}"]`) ?? null;

  const handleMouseEnter = (id: string) => {
    setHoveredId(id);
    timelinesRef.current[id]?.pause();
    const el = getEl(id);
    if (el) {
      el.style.filter = "none";
      blurRef.current[id] = 0;
      gsap.to(el, { scale: 1.08, duration: 0.2, ease: "power2.out" });
    }
  };

  const handleMouseLeave = (id: string) => {
    setHoveredId(null);
    timelinesRef.current[id]?.resume();
    const el = getEl(id);
    if (el) gsap.to(el, { scale: 1, duration: 0.2, ease: "power2.out" });
  };

  const handleClick = (serviceIndex: string, e: React.MouseEvent) => {
    e.preventDefault();
    scrollToId(`service-${serviceIndex}`);
  };

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-[5] overflow-hidden"
    >
      <style>{`
        @keyframes lm-ping {
          0% { transform: translate(-50%, -50%) scale(0.3); opacity: 0.95; }
          100% { transform: translate(-50%, -50%) scale(2.6); opacity: 0; }
        }
      `}</style>

      {CURSORS_CONFIG.map((cfg, i) => {
        const s = copy.services[i] || copy.services[0];
        const isHovered = hoveredId === cfg.id;
        const isClicking = clickingId === cfg.id;
        const activeAction = activeActions[cfg.id] || cfg.waypoints[0].action;
        const visibility = cfg.minScreen === "lg" ? "hidden lg:block" : "hidden md:block";

        return (
          <div
            key={cfg.id}
            data-cursor={cfg.id}
            className={`absolute left-0 top-0 will-change-transform ${visibility}`}
            style={{ opacity: 0 }}
          >
            <div className="relative">
              {isClicking && (
                <span
                  className="pointer-events-none absolute left-0 top-0 rounded-full"
                  style={{
                    width: "28px",
                    height: "28px",
                    border: `2px solid ${cfg.color}`,
                    animation: "lm-ping 0.5s cubic-bezier(0, 0, 0.2, 1) forwards",
                  }}
                />
              )}

              <div className="relative z-10 origin-top-left">
                <CursorPointer color={cfg.color} />
              </div>

              <button
                type="button"
                onClick={(e) => handleClick(cfg.serviceIndex, e)}
                onMouseEnter={() => handleMouseEnter(cfg.id)}
                onMouseLeave={() => handleMouseLeave(cfg.id)}
                title={`${s.name} (klik untuk melompat ke layanan)`}
                className="pointer-events-auto absolute left-3 top-3 z-20 flex cursor-pointer select-none items-center gap-2 whitespace-nowrap rounded-[5px] border px-2.5 py-1 text-left transition-colors duration-200"
                style={{
                  borderColor: isHovered ? cfg.color : "var(--hairline)",
                  backgroundColor: isHovered ? "var(--surface-2)" : "var(--surface)",
                  boxShadow: isHovered
                    ? `0 10px 25px -4px ${cfg.accentBg}`
                    : "0 8px 25px -5px var(--shadow)",
                }}
              >
                <span
                  className="h-1.5 w-1.5 shrink-0 rounded-full"
                  style={{ backgroundColor: cfg.color, boxShadow: `0 0 8px ${cfg.color}` }}
                />
                <span
                  className="mono mono-2xs !normal-case font-medium tracking-tight text-fg"
                  style={{ fontFamily: "var(--font-mono), ui-monospace, monospace" }}
                >
                  {cfg.codeHandle}
                </span>
                <span
                  className="mono mono-2xs !normal-case whitespace-nowrap rounded-[3px] px-1.5 py-0.5"
                  style={{
                    backgroundColor: cfg.accentBg,
                    color: isHovered ? cfg.color : "var(--fg-muted)",
                    fontFamily: "var(--font-mono), ui-monospace, monospace",
                  }}
                >
                  {isHovered ? "goto →" : `[${activeAction}]`}
                </span>
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
